<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button
          @click="showForm = true"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Products
      </button>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Product</h2>
        <form @submit.prevent="saveProduct">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
                v-model="form.name"
                type="text"
                required
                class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Price</label>
            <input
                v-model="form.price"
                type="number"
                step="0.01"
                required
                class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Stock</label>
            <input
                v-model="form.stock"
                type="number"
                step="1"
                required
                value="0"
                class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
                type="button"
                @click="closeForm"
                class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Search Bar -->
    <div class="mb-4">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products by name or price..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white shadow-md rounded">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="px-6 py-4">{{ product.id }}</td>
            <td class="px-6 py-4">{{ product.name }}</td>
            <td class="px-6 py-4">Rp {{ product.price }}</td>
            <td class="px-6 py-4">{{ product.stock }}</td>
            <td class="px-6 py-4">
              <button
                  @click="editProduct(product)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Edit
              </button>
              <button
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../axios';
import { showSuccess, showError, confirmDelete } from "../utils/sweetalert.js";

const products = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const showForm = ref(false);
const editing = ref(false);
const form = ref({
  id: null,
  name: '',
  phone: '',
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }

  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
  );
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    showError('Failed to fetch products. Error: ' + error.response.data.message);
  } finally {
    loading.value = false;
  }
};

const saveProduct = async () => {
  try {
    if (editing.value) {
      await api.put(`/products/${form.value.id}`, form.value);
    } else {
      await api.post('/products', form.value);
    }
    closeForm();
    await fetchProducts();
    showSuccess('Product saved successfully!');
  } catch (error) {
    console.error('Error saving product:', error);
    showError('Failed to save products. Error: ' + error.response.data.message);
  }
};

const editProduct = (product) => {
  form.value = { ...product };
  editing.value = true;
  showForm.value = true;
};

const deleteProduct = async (id) => {
  const result = await confirmDelete('Are you sure you want to delete this product?');
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/products/${id}`);
    await fetchProducts();
    showSuccess('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    showError('Failed to delete product. Error: ' + error.response.data.message);
  }
};

const closeForm = () => {
  showForm.value = false;
  editing.value = false;
  form.value = { id: null, name: '', phone: '' };
};

onMounted(() => {
  fetchProducts();
});
</script>