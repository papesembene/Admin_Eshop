<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";


const name = ref('');
const errorMessage = ref('');
const successMessage = ref('');



const resetForm = () => {
  name.value = '';
  errorMessage.value = '';
  successMessage.value = '';
};

const submitForm = async () => {
  console.log('Début de la soumission du formulaire');
  errorMessage.value = '';
  successMessage.value = '';
  
  const formData = new FormData();
  formData.append('name', name.value);

  console.log('FormData créé:', Object.fromEntries(formData));

  try {
    console.log('Envoi de la requête à l\'API');
    const response = await axios.post('http://127.0.0.1:8000/api/categories/store',formData);
    console.log('Réponse de l\'API:', response.data);
    if (response.data.success) {
      successMessage.value = 'Categorie créé avec succès !';
      console.log('Categorie créé avec succès');
      resetForm();
      router.push('/categories/index')
    } else {
      console.log('La création de la categorie a échoué:', response.data);
      errorMessage.value = 'La création de la categorie a échoué. Veuillez vérifier les données et réessayer.';
    }
  } catch (error) {
    if (error.response) {
      console.error('Réponse d\'erreur:', error.response.data);
      if (error.response.data && error.response.data.errors) {
        errorMessage.value = Object.values(error.response.data.errors).flat().join(', ');
      } else {
        errorMessage.value = 'Une erreur est survenue lors de la création de la categorie. Veuillez réessayer plus tard.';
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
      <h1>Categorie</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/products">Liste des Categorie</router-link></li>
          <li class="breadcrumb-item active">Nouvelle Categorie</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Nouvelle Categorie</h5>
            <form @submit.prevent="submitForm">
              <div class="row mb-3">
                <label for="inputName" class="col-sm-2 col-form-label">Libellé</label>
                <div class="col-sm-10">
                  <input type="text" id="inputName" class="form-control" v-model="name" required>
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