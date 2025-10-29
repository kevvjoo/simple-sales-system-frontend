<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex space-x-8">
            <router-link
                to="/customers"
                class="inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/customers' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Customers
            </router-link>
            <router-link
                to="/products"
                class="inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium"
                :class="$route.path === '/products' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              Products
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No script needed for basic layout
</script>