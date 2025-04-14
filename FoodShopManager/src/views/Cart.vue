<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div v-if="cartItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
              <h2 class="text-lg font-semibold">Cart Items ({{ totalItems }})</h2>
            </div>
            
            <ul class="divide-y divide-gray-200">
              <li v-for="item in cartItems" :key="item.id" class="p-4 flex flex-col sm:flex-row sm:items-center">
                <div class="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                  <img :src="`http://localhost:3000${item.image}`" :alt="item.name" class="w-20 h-20 object-cover rounded">
                </div>
                
                <div class="flex-grow">
                  <h3 class="font-medium text-gray-800">{{ item.name }}</h3>
                  <p class="text-gray-600 text-sm">${{ item.price.toFixed(3) }} each</p>
                </div>
                
                <div class="flex items-center mt-4 sm:mt-0">
                  <button 
                    @click="updateQuantity(item.id, item.quantity - 1)" 
                    class="bg-gray-200 text-gray-700 px-2 py-1 rounded-l-md hover:bg-gray-300"
                    :disabled="item.quantity <= 1"
                  >
                    <Minus class="h-4 w-4" />
                  </button>
                  
                  <input 
                    type="number" 
                    v-model="item.quantity" 
                    min="1" 
                    class="w-12 text-center border-t border-b border-gray-200 py-1"
                    @change="updateQuantity(item.id, parseInt(item.quantity))"
                  >
                  
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    class="bg-gray-200 text-gray-700 px-2 py-1 rounded-r-md hover:bg-gray-300"
                  >
                    <Plus class="h-4 w-4" />
                  </button>
                  
                  <span class="mx-4 font-medium">${{ (item.price * item.quantity).toFixed(3) }}</span>
                  
                  <button 
                    @click="removeItem(item.id)" 
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </li>
            </ul>
            
            <div class="p-4 border-t flex justify-between">
              <button 
                @click="clearCart" 
                class="text-red-500 hover:text-red-700 flex items-center"
              >
                <Trash2 class="h-5 w-5 mr-1" />
                Clear Cart
              </button>
              
              <router-link to="/" class="text-rose-600 hover:text-rose-800 flex items-center">
                <ArrowLeft class="h-5 w-5 mr-1" />
                Continue Shopping
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div class="p-4 border-b">
              <h2 class="text-lg font-semibold">Order Summary</h2>
            </div>
            
            <div class="p-4 space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ subtotal.toFixed(3) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">${{ shipping.toFixed(3) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">${{ tax.toFixed(3) }}</span>
              </div>
              
              <div class="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${{ total.toFixed(3) }}</span>
              </div>
              
              <router-link 
                to="/checkout" 
                class="block w-full bg-rose-600 text-white text-center py-3 px-4 rounded-lg hover:bg-rose-700"
              >
                Proceed to Checkout
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12 bg-white rounded-lg shadow-md">
        <ShoppingCart class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
        <p class="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <router-link to="/" class="bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700">
          Start Shopping
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-vue-next'
  
  export default {
    name: 'Cart',
    components: {
      Minus,
      Plus,
      Trash2,
      ArrowLeft,
      ShoppingCart
    },
    setup() {
      const cartItems = ref([])
      
      // Load cart items from localStorage
      onMounted(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
          cartItems.value = JSON.parse(storedCart)
        }
      })
      
      // Calculate totals
      const subtotal = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
      })
      
      const shipping = computed(() => {
        return subtotal.value > 50 ? 0 : 5.99
      })
      
      const tax = computed(() => {
        return subtotal.value * 0.08 // 8% tax rate
      })
      
      const total = computed(() => {
        return subtotal.value + shipping.value + tax.value
      })
      
      const totalItems = computed(() => {
        return cartItems.value.reduce((count, item) => count + item.quantity, 0)
      })
      
      // Cart operations
      const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return
        
        const item = cartItems.value.find(item => item.id === id)
        if (item) {
          item.quantity = newQuantity
          saveCart()
        }
      }
      
      const removeItem = (id) => {
        cartItems.value = cartItems.value.filter(item => item.id !== id)
        saveCart()
      }
      
      const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
          cartItems.value = []
          saveCart()
        }
      }
      
      const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cartItems.value))
      }
      
      return {
        cartItems,
        subtotal,
        shipping,
        tax,
        total,
        totalItems,
        updateQuantity,
        removeItem,
        clearCart
      }
    }
  }
  </script>