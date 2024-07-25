<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";

const customers = ref([]);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 9;

const fetchCategories = async (page = 1) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/customers/index`);
    customers.value = response.data.customers;
   /*  currentPage.value = response.data.current_page;
    totalPages.value = response.data.last_page; */
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
    error.value = 'Une erreur est survenue lors du chargement des clients.';
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page);
  }
};

const paginationArray = computed(() => {
  const delta = 2;
  const range = [];
  for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
    range.push(i);
  }
  if (currentPage.value - delta > 2) range.unshift("...");
  if (currentPage.value + delta < totalPages.value - 1) range.push("...");
  range.unshift(1);
  if (totalPages.value !== 1) range.push(totalPages.value);
  return range;
});
onMounted(() => fetchCategories());
</script>

<template>
  <Layouts />
  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Clients</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Accueil</router-link></li>
          <li class="breadcrumb-item active">Liste des Clients</li>
        </ol>
      </nav>
    </div>

    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Liste des Clients</h5>
              
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div v-else class="row">
                <div v-for="customer in customers" :key="customer.id" class="col-md-4 mb-4">
                 
                         <div class="card-body">
                         <h5 class="card-text">{{ customer.name }}</h5>
                         <p class="card-text">{{ customer.firstname }}</p>
                      <p class="card-text"><strong>Téléphone:</strong> {{ customer.phone_number }} </p>
                      <p class="card-text"><strong>Adresse:</strong> {{ customer.address }}</p>
                      <p class="card-text"><strong>Ville:</strong> {{ customer.city}}</p>
                   
                        </div>
                </div>
              </div>

              <div v-if="customers.length === 0" class="alert alert-info" role="alert">
                Aucun Client trouvé.
              </div>

              <!-- Pagination -->
              <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-4">
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Précédent</a>
                  </li>
                  <li v-for="page in paginationArray" :key="page" class="page-item" :class="{ active: page === currentPage, disabled: page === '...' }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Suivant</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>