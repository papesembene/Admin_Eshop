<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const products = ref([]);
const currentPage = ref(1);
const perPage = ref(6);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products/index');
    products.value = response.data.products;
    console.log('produits :', products.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};

const formatDescription = (description) => {
  const lines = description.split('\n').filter(line => line.trim() !== '');
  const formattedLines = lines.map(line => `<i class="icofont-check"></i> ${line}`);
  return formattedLines.join('<br>');
}



const getImageUrl = (imagePath) => {
  return `http://127.0.0.1:8000/storage/${imagePath}`;
};

const totalRows = computed(() => {
  return products.value.length;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return products.value.slice(start, end);
});

onMounted(fetchProducts);
</script>

<template>
  <Layouts />
  <main id="main" class="main">
    <section id="product-area" data-scroll-index="3">
    <div class="container">
     
      <div class="row">
        <!--start product single-->
        <div v-for="product in paginatedProducts" :key="product.id" class="col-md-6">
          <div class="product-single row">
            <div class="product-img text-center col-lg-6">
              <a :href="getImageUrl(product.photo)" data-vue-easy-lightbox>
                <img :src="getImageUrl(product.photo)" class="img-fluid" :alt="product.name">
              </a>
            </div>
            <div class="product-cont col-lg-6">
              <h4>{{ product.name }}</h4>
              <p v-html="formatDescription(product.description)"></p>
              <ul>
                <li><i class="icofont-check"></i> {{ product.category ? product.category.name : 'N/A' }}</li>
                <li v-if="product.quantity > 0"><i class="icofont-check"></i> En Stock</li>
                <li v-else><i class="icofont-close" style="color:red;"></i> En Rupture de Stock</li>
              </ul>
              <h3>{{ product.price }} FCFA</h3>
            </div>
          </div>
        </div>
        <!--end product single-->
      </div>
      <div class="more-prod-btn text-center">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          @input="fetchProducts"></b-pagination>
      </div>
    </div>
  </section>
  </main>
</template>