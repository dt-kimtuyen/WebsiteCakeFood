<template>
    <nav class="bg-rose-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">FoodShop</router-link>
        
        <div class="flex items-center space-x-4">

          
          <template v-if="user">
            <template v-if="user.role !== 'admin'">
              <router-link to="/" class="hover:text-rose-200">Home</router-link>
              <router-link to="/contact" class="hover:text-rose-200">Liên hệ</router-link>
              <router-link to="/cart" class="hover:text-rose-200 relative">
                <ShoppingCart class="h-6 w-6" />
                <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-yellow-400 text-rose-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {{ cartCount }}
                </span>
              </router-link>
            </template>

            
            <div class="relative group">
              <button class="flex items-center hover:text-rose-200">
                <User class="h-5 w-5 mr-1" />
                {{ user.name }}
                <ChevronDown class="h-4 w-4 ml-1" />
              </button>
              
              <div class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <template v-if="user.role !== 'admin'">
                  <router-link to="/orders" class="block px-4 py-2 hover:bg-rose-100">My Orders</router-link>
                  <router-link to="/profile" class="block px-4 py-2 hover:bg-rose-100">Profile</router-link>
                </template>
                <template v-if="user.role === 'admin'">
                  <router-link to="/admin/dashboard" class="block px-4 py-2 hover:bg-rose-100">Dashboard</router-link>
                  <router-link to="/admin/products" class="block px-4 py-2 hover:bg-rose-100">Manage Products</router-link>
                  <router-link to="/admin/orders" class="block px-4 py-2 hover:bg-rose-100">Manage Orders</router-link>
                  <router-link to="/admin/users" class="block px-4 py-2 hover:bg-rose-100">Manage Users</router-link>
                  <router-link to="/admin/adminCategories" class="block px-4 py-2 hover:bg-rose-100">Manage Categories</router-link>
                  <div class="border-t border-gray-200 my-1"></div>
                </template>
                <button @click="$emit('logout')" class="block w-full text-left px-4 py-2 hover:bg-rose-100">Logout</button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="hover:text-rose-200">Login</router-link>
            <router-link to="/register" class="hover:text-rose-200">Register</router-link>
          </template>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue'
  import { ShoppingCart, User, ChevronDown } from 'lucide-vue-next'
  
  export default {
    name: 'Navbar',
    components: {
      ShoppingCart,
      User,
      ChevronDown
    },
    props: {
      user: Object
    },
    setup() {
      const cartCount = ref(0)
      
      // In a real app, this would come from a store or API
      const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        cartCount.value = cart.reduce((total, item) => total + item.quantity, 0)
      }
      
      // Watch for cart changes
      watch(() => localStorage.getItem('cart'), updateCartCount, { immediate: true })
      
      return {
        cartCount
      }
    }
  }
  </script>