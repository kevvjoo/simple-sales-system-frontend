<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Sales Orders</h1>
      <button
          @click="showForm = true"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        New Sales Order
      </button>
    </div>

    <!-- Transaction Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div class="bg-white p-6 rounded-lg w-2xl max-w-4xl my-8">
        <h2 class="text-xl font-bold mb-4">New Sales Order</h2>
        <form @submit.prevent="saveSalesOrder">
          <!-- Customer Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Customer</label>
            <select
                v-model="form.customer_id"
                required
                class="w-full border rounded px-3 py-2"
            >
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.phone }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Date</label>
            <input
                v-model="form.date"
                type="date"
                required
                class="w-full border rounded px-3 py-2"
            />
          </div>

          <!-- Products Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Products</label>
            <div class="border rounded p-4 max-h-64 overflow-y-auto">
              <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 mb-3 items-end">
                <div class="flex-1">
                  <label class="block text-xs mb-1">Product</label>
                  <select
                      v-model="item.product_id"
                      @change="updateSubtotal(index)"
                      required
                      class="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select Product</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }} (Stock: {{ product.stock }}) - Rp {{ formatPrice(product.price) }}
                    </option>
                  </select>
                </div>
                <div class="w-24">
                  <label class="block text-xs mb-1">Qty</label>
                  <input
                      v-model.number="item.qty"
                      @input="updateSubtotal(index)"
                      type="number"
                      min="1"
                      required
                      class="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div class="w-32">
                  <label class="block text-xs mb-1">Subtotal</label>
                  <input
                      :value="formatPrice(item.subtotal || 0)"
                      disabled
                      class="w-full border rounded px-2 py-1 text-sm bg-gray-50"
                  />
                </div>
                <button
                    type="button"
                    @click="removeItem(index)"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
                type="button"
                @click="addItem"
                class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              + Add Product
            </button>
          </div>

          <!-- Total -->
          <div class="mb-4 bg-gray-50 p-4 rounded">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">Total:</span>
              <span class="text-2xl font-bold text-blue-600">Rp {{ formatPrice(calculateTotal()) }}</span>
            </div>
          </div>

          <!-- Buttons -->
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
                :disabled="saving"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : 'Save Transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Sales List -->
    <div v-else class="bg-white shadow-md rounded">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="salesOrder in salesOrders" :key="salesOrder.id">
            <td class="px-6 py-4">{{ salesOrder.id }}</td>
            <td class="px-6 py-4">{{ salesOrder.date }}</td>
            <td class="px-6 py-4">{{ salesOrder.customer_name }}</td>
            <td class="px-6 py-4">
              <div class="text-sm">
                <div v-for="(product, idx) in salesOrder.products" :key="idx">
                  {{ product.name }} ({{ product.quantity }}x{{ formatPrice(product.price)}}) - Rp {{ formatPrice(product.subtotal) }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 font-semibold">Rp {{ formatPrice(salesOrder.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../axios';

const salesOrders = ref([]);
const customers = ref([]);
const products = ref([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const form = ref({
  customer_id: '',
  date: new Date().toISOString().split('T')[0],
  items: [{ product_id: '', qty: 1, subtotal: 0 }],
});

const fetchSalesOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/salesOrders');
    salesOrders.value = response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    alert('Failed to fetch sales');
  } finally {
    loading.value = false;
  }
};

const fetchCustomers = async () => {
  try {
    const response = await api.get('/customers');
    customers.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const addItem = () => {
  form.value.items.push({ product_id: '', qty: 1, subtotal: 0 });
};

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1);
  }
};

const updateSubtotal = (index) => {
  const item = form.value.items[index];
  if (item.product_id && item.qty) {
    const product = products.value.find(p => p.id === item.product_id);
    if (product) {
      item.subtotal = product.price * item.qty;
    }
  }
};

const calculateTotal = () => {
  return form.value.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
};

const saveSalesOrder = async () => {
  // Validate stock before submitting
  for (const item of form.value.items) {
    const product = products.value.find(p => p.id === item.product_id);
    if (product && product.stock < item.qty) {
      alert(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      return;
    }
  }

  saving.value = true;
  try {
    await api.post('/salesOrders', form.value);
    closeForm();
    await fetchSalesOrders();
    await fetchProducts(); // Refresh products to show updated stock
    alert('Sale transaction saved successfully!');
  } catch (error) {
    console.error('Error saving sale:', error);
    alert(error.response?.data?.message || 'Failed to save sale transaction');
  } finally {
    saving.value = false;
  }
};

const closeForm = () => {
  showForm.value = false;
  form.value = {
    customer_id: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ product_id: '', qty: 1, subtotal: 0 }],
  };
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

onMounted(() => {
  fetchSalesOrders();
  fetchCustomers();
  fetchProducts();
});
</script>