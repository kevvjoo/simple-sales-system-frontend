<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Customers</h1>
      <button
          @click="showForm = true"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Customer
      </button>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Customer</h2>
        <form @submit.prevent="saveCustomer">
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
            <label class="block text-sm font-medium mb-2">Phone</label>
            <input
                v-model="form.phone"
                type="text"
                required
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="customer in customers" :key="customer.id">
            <td class="px-6 py-4">{{ customer.id }}</td>
            <td class="px-6 py-4">{{ customer.name }}</td>
            <td class="px-6 py-4">{{ customer.phone }}</td>
            <td class="px-6 py-4">
              <button
                  @click="editCustomer(customer)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Edit
              </button>
              <button
                  @click="deleteCustomer(customer.id)"
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
import { ref, onMounted } from 'vue';
import api from '../axios';
import { showSuccess, showError, confirmDelete } from "../utils/sweetalert.js";

const customers = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editing = ref(false);
const form = ref({
  id: null,
  name: '',
  phone: '',
});

const fetchCustomers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/customers');
    customers.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    showError('Failed to fetch customers. Error: ' + error.response.data.message);
  } finally {
    loading.value = false;
  }
};

const saveCustomer = async () => {
  try {
    if (editing.value) {
      await api.put(`/customers/${form.value.id}`, form.value);
    } else {
      await api.post('/customers', form.value);
    }
    closeForm();
    await fetchCustomers();
    showSuccess('Customer saved successfully!');
  } catch (error) {
    console.error('Error saving customer:', error);
    showError('Failed to save customer. Error: ' + error.response.data.message);
  }
};

const editCustomer = (customer) => {
  form.value = { ...customer };
  editing.value = true;
  showForm.value = true;
};

const deleteCustomer = async (id) => {
  const result = await confirmDelete('Are you sure you want to delete this customer?');
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/customers/${id}`);
    await fetchCustomers();
    showSuccess('Customer deleted successfully!');
  } catch (error) {
    console.error('Error deleting customer:', error);
    showError('Failed to delete customer. Error: ' + error.response.data.message);
  }
};

const closeForm = () => {
  showForm.value = false;
  editing.value = false;
  form.value = { id: null, name: '', phone: '' };
};

onMounted(() => {
  fetchCustomers();
});
</script>