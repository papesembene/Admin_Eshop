<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";

const customers = ref([]);
const name = ref('');
const firstname = ref('');
const email = ref('');
const city = ref('');
const gender = ref('');
const address = ref('');
const phone_number = ref('');
const errorMessage = ref('');
const successMessage = ref('');




const resetForm = () => {
  name.value = '';
  firstname.value = '';
  email.value = '';
  city.value = '';
  gender.value = '';
  address.value = '';
  phone_number.value = '';
  errorMessage.value = '';
  successMessage.value = '';
};

const submitForm = async () => {
  console.log('Début de la soumission du formulaire');
  errorMessage.value = '';
  successMessage.value = '';
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('firstname', firstname.value);
  formData.append('email', email.value);
  formData.append('city', city.value);
  formData.append('gender', gender.value);
  formData.append('address', address.value);
  formData.append('phone_number', phone_number.value);
  console.log('FormData créé:', Object.fromEntries(formData));

  try {
    console.log('Envoi de la requête à l\'API');
    const response = await axios.post('http://127.0.0.1:8000/api/customers/store', formData)
    console.log('Réponse de l\'API:', response.data);
    if (response.data.success) {
      successMessage.value = 'Client créé avec succès !';
      console.log('client créé avec succès');
      resetForm();
    } else {
      console.log('La création du client a échoué:', response.data);
      errorMessage.value = 'La création du client a échoué. Veuillez vérifier les données et réessayer.';
    }
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    if (error.response) {
      console.error('Réponse d\'erreur:', error.response.data);
      if (error.response.data && error.response.data.errors) {
        errorMessage.value = Object.values(error.response.data.errors).flat().join(', ');
      } else {
        errorMessage.value = 'Une erreur est survenue lors de la création du client. Veuillez réessayer plus tard.';
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
      <h1>Clients</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/customers/index">Liste des clients</router-link></li>
          <li class="breadcrumb-item active">Nouveau client</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Nouveau Client</h5>
            <form @submit.prevent="submitForm">
              <div class="row mb-3">
                <label for="inputName" class="col-sm-2 col-form-label"> Nom </label>
                <div class="col-sm-10">
                  <input type="text" id="inputName" class="form-control" v-model="name" required>
                </div>
            </div>
                <div class="row mb-3">
                <label for="inputfName" class="col-sm-2 col-form-label"> Prenom </label>
                <div class="col-sm-10">
                  <input type="text" id="inputfName" class="form-control" v-model="firstname" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="email" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                  <input type="email" id="email" class="form-control" v-model="email" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputadress" class="col-sm-2 col-form-label">Adresse</label>
                <div class="col-sm-10">
                  <input type="text" id="inputadress" class="form-control" v-model="address" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="inputadress" class="col-sm-2 col-form-label">Sexe</label>
                <div class="col-sm-10">
                  <select v-model="gender" id="" class="form-control">
                    <option value="M">Masculin</option>
                    <option value="F">Feminin</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <label for="city" class="col-sm-2 col-form-label">Ville</label>
                <div class="col-sm-10">
                  <input type="text" id="city" class="form-control" v-model="city" required>
                </div>
              </div>
              <div class="row mb-3">
                <label for="phone_number" class="col-sm-2 col-form-label">Telephone</label>
                <div class="col-sm-10">
                  <input type="number" id="phone_number" class="form-control" v-model="phone_number" required>
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