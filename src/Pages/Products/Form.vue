<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";

const categories = ref([]);
const name = ref('');
const price = ref(null);
const description = ref('');
const quantity = ref(null);
const selectedCategory = ref('');
const photo = ref(null);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/categories');
    categories.value = response.data.categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des categories:', error);
    errorMessage.value = 'Erreur lors du chargement des catégories. Veuillez rafraîchir la page.';
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && !file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image valide (jpeg, png, jpg, gif).';
    e.target.value = ''; // Réinitialiser l'input file
  } else {
    photo.value = file;
    errorMessage.value = ''; // Effacer le message d'erreur précédent
  }
};

const resetForm = () => {
  name.value = '';
  price.value = null;
  description.value = '';
  quantity.value = null;
  selectedCategory.value = '';
  photo.value = null;
  errorMessage.value = '';
  successMessage.value = '';
};

const submitForm = async () => {
  console.log('Début de la soumission du formulaire');
  errorMessage.value = '';
  successMessage.value = '';
  
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('price', price.value);
  formData.append('quantity', quantity.value);
  formData.append('category_id', selectedCategory.value);
  formData.append('description', description.value);
  if (photo.value) {
    formData.append('photo', photo.value);
  }

  console.log('FormData créé:', Object.fromEntries(formData));

  try {
    console.log('Envoi de la requête à l\'API');
    const response = await axios.post('http://127.0.0.1:8000/api/products/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Réponse de l\'API:', response.data);
    if (response.data.success) {
      successMessage.value = 'Produit créé avec succès !';
      console.log('Produit créé avec succès');
      resetForm();
    } else {
      console.log('La création du produit a échoué:', response.data);
      errorMessage.value = 'La création du produit a échoué. Veuillez vérifier les données et réessayer.';
    }
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    if (error.response) {
      console.error('Réponse d\'erreur:', error.response.data);
      if (error.response.data && error.response.data.errors) {
        errorMessage.value = Object.values(error.response.data.errors).flat().join(', ');
      } else {
        errorMessage.value = 'Une erreur est survenue lors de la création du produit. Veuillez réessayer plus tard.';
      }
    } else if (error.request) {
      console.error('Pas de réponse reçue:', error.request);
      errorMessage.value = 'Aucune réponse reçue du serveur. Veuillez vérifier votre connexion.';
    } else {
      console.error('Erreur de configuration de la requête:', error.message);
      errorMessage.value = 'Erreur lors de la configuration de la requête. Veuillez réessayer.';
    }
  }
};
</script>

<template>
  <Layouts />
  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Produits</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/products">Liste des produits</router-link></li>
          <li class="breadcrumb-item active">Nouveau produit</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Nouveau Produit</h5>
            <form @submit.prevent="submitForm">
              <div class="row mb-3">
                <label for="inputName" class="col-sm-2 col-form-label">Libellé</label>
                <div class="col-sm-10">
                  <input type="text" id="inputName" class="form-control" v-model="name" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputDescription" class="col-sm-2 col-form-label">Description</label>
                <div class="col-sm-10">
                  <textarea id="inputDescription" v-model="description" class="form-control" rows="3" required></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputPrice" class="col-sm-2 col-form-label">Prix</label>
                <div class="col-sm-10">
                  <input type="number" id="inputPrice" class="form-control" v-model="price" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputQuantity" class="col-sm-2 col-form-label">Quantité</label>
                <div class="col-sm-10">
                  <input type="number" id="inputQuantity" class="form-control" v-model="quantity" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputCategory" class="col-sm-2 col-form-label">Catégorie</label>
                <div class="col-sm-10">
                  <select id="inputCategory" v-model="selectedCategory" class="form-control" required>
                    <option value="">Choisir catégorie</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputFile" class="col-sm-2 col-form-label">Photo</label>
                <div class="col-sm-10">
                  <input class="form-control" type="file" id="inputFile" @change="handleFileChange" accept="image/*">
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-10 offset-sm-2">
                  <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                  <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-sm-10 offset-sm-2">
                  <button type="submit" class="btn btn-primary">Ajouter</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>