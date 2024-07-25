<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement);

const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  totalProducts: 0
});

const recentOrders = ref([]);
const topProducts = ref([]);
const monthlySales = ref([]);

const fetchDashboardData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/dashboard');
    stats.value = response.data.stats;
    recentOrders.value = response.data.recentOrders;
    topProducts.value = response.data.topProducts;
    monthlySales.value = response.data.monthlySales;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

const monthlySalesChartRef = ref(null);
const topProductsChartRef = ref(null);

const renderCharts = () => {
  if (monthlySalesChartRef.value) {
    monthlySalesChartRef.value.destroy();
  }
  if (topProductsChartRef.value) {
    topProductsChartRef.value.destroy();
  }

  const monthlySalesCtx = document.getElementById('monthlySalesChart');
  const topProductsCtx = document.getElementById('topProductsChart');

  if (monthlySalesCtx && topProductsCtx) {
    monthlySalesChartRef.value = new Chart(monthlySalesCtx, {
      type: 'line',
      data: {
        labels: monthlySales.value.map(item => item.month),
        datasets: [{
          label: 'Ventes mensuelles',
          data: monthlySales.value.map(item => item.total),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });

    if (topProductsCtx && topProducts.value.length > 0) {
      topProductsChartRef.value = new Chart(topProductsCtx, {
        type: 'bar',
        data: {
          labels: topProducts.value.map(product => product.name),
          datasets: [{
            label: 'Ventes',
            data: topProducts.value.map(product => product.total_sales),
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
          }]
        }
      });
    }
  }
};

onMounted(async () => {
  await fetchDashboardData();
  await nextTick();
  renderCharts();
});
</script>

<template>
  <Layouts />
  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Dashboard</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Accueil</router-link></li>
          <li class="breadcrumb-item active">Dashboard</li>
        </ol>
      </nav>
    </div>

    <section class="section dashboard">
      <div class="row">
        <!-- Statistiques générales -->
        <div class="col-lg-3 col-md-6">
          <div class="card info-card sales-card">
            <div class="card-body">
              <h5 class="card-title">Commandes</h5>
              <div class="d-flex align-items-center">
                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i class="bi bi-cart"></i>
                </div>
                <div class="ps-3">
                  <h6>{{ stats.totalOrders }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="card info-card revenue-card">
            <div class="card-body">
              <h5 class="card-title">Revenus</h5>
              <div class="d-flex align-items-center">
                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i class="bi bi-currency-euro"></i>
                </div>
                <div class="ps-3">
                  <h6>{{ stats.totalRevenue }}FCFA</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card info-card customers-card">
            <div class="card-body">
              <h5 class="card-title">Clients</h5>
              <div class="d-flex align-items-center">
                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i class="bi bi-people"></i>
                </div>
                <div class="ps-3">
                  <h6>{{ stats.totalCustomers }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card info-card products-card">
            <div class="card-body">
              <h5 class="card-title">Produits</h5>
              <div class="d-flex align-items-center">
                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i class="bi bi-box"></i>
                </div>
                <div class="ps-3">
                  <h6>{{ stats.totalProducts }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Graphique des ventes mensuelles -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Ventes mensuelles</h5>
              <canvas id="monthlySalesChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Top produits -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Top produits</h5>
              <canvas id="topProductsChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Commandes récentes -->
      <div class="row">
        <div class="col-12">
          <div class="card recent-sales">
            <div class="card-body">
              <h5 class="card-title">Commandes récentes</h5>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Client</th>
                    <th scope="col">Total</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <th scope="row">{{ order.id }}</th>
                    <td>{{ order.customer_name }}</td>
                    <td>{{ order.total_amount }}FCFA</td>
                    <td><span :class="'badge bg-' + (order.status === 'completed' ? 'success' : 'warning')">{{ order.status }}</span></td>
                    <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Ajoutez ici vos styles personnalisés si nécessaire */
</style>