<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Layouts from "@/components/Layouts.vue";

const orders = ref([]);
const error = ref(null);

const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/orders/index`);
    orders.value = response.data.orders;
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes:', err);
    error.value = 'Une erreur est survenue lors du chargement des commandes.';
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/update-status`, { status: newStatus });
    // Rafraîchir la liste des commandes après la mise à jour
    await fetchOrders();
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', err);
    error.value = 'Une erreur est survenue lors de la mise à jour du statut de la commande.';
  }
};

onMounted(() => fetchOrders());
</script>

<template>
  <Layouts />
  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Commandes</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Accueil</router-link></li>
          <li class="breadcrumb-item active">Liste des Commandes</li>
        </ol>
      </nav>
    </div>

    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Liste des Commandes</h5>
              
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div v-else>
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Produits</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders" :key="order.id">
                      <td>{{ order.id }}</td>
                      <td>{{ order.customer.name }} {{ order.customer.firstname }}</td>
                      <td>{{ order.total_amount }}FCFA</td>
                      <td>{{ order.status }}</td>
                      <td>
                        <ul>
                          <li v-for="product in order.products" :key="product.id">
                            {{ product.name }} (x{{ product.pivot.quantity }})
                          </li>
                        </ul>
                      </td>
                      <td>
                        <button @click="updateOrderStatus(order.id, 'processing')" 
                                class="btn btn-sm btn-primary me-2"
                                :disabled="order.status === 'processing' || order.status === 'completed'">
                          Traiter
                        </button>
                        <button @click="updateOrderStatus(order.id, 'completed')" 
                                class="btn btn-sm btn-success"
                                :disabled="order.status === 'completed'">
                          Compléter
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="orders.length === 0" class="alert alert-info" role="alert">
                Aucune commande trouvée.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>