<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-rose-600 text-white py-16">
      <div class="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Delicious Food Delivered to Your Door</h1>
        <p class="text-xl mb-8 max-w-2xl">Explore our menu of fresh, tasty dishes prepared by expert chefs and delivered right to your doorstep.</p>
        <button class="bg-white text-rose-600 font-bold py-3 px-8 rounded-full hover:bg-rose-100 transition duration-300">
          Order Now
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id" 
          class="px-4 py-2 rounded-full"
          :class="selectedCategory === category.id ? 'bg-rose-600 text-white' : 'bg-gray-200 hover:bg-gray-300'"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Search Bar -->
      <div class="max-w-md mx-auto mb-8">
        <div class="relative flex items-center">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search for food..." 
            class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
          <Search class="absolute right-3 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <!-- Food Listings -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img :src="`http://localhost:3000${product.image}`" :alt="product.name" class="w-full h-48 object-cover">
          
          
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold">{{ product.name }}</h3>
              <span class="bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-1 rounded-full">{{ getCategoryName(product.categoryId) }}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-rose-600 font-bold">${{ product.price.toFixed(2) }}</span>
              
              <div class="flex space-x-2">
                <button 
                  @click="addToCart(product)"
                  class="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700"
                >
                  <ShoppingCart class="h-5 w-5" />
                </button>
                
                <router-link 
                  :to="`/product/${product._id}`"
                  class="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300"
                >
                  <Eye class="h-5 w-5" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <ShoppingBag class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Search, ShoppingCart, Eye, ShoppingBag } from 'lucide-vue-next'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Search,
    ShoppingCart,
    Eye,
    ShoppingBag
  },
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const categories = ref([])
    const products = ref([])

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_DOMAIN_SERVER}/api/categories/`)
        categories.value = res.data.map(cat => ({
          ...cat,
          id: cat._id
        }))
      } catch (error) {
        console.error('Lỗi khi load categories:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_DOMAIN_SERVER}/api/products/`)
        products.value = res.data.map(prod => ({
          ...prod,
          id: prod._id
        }))
      } catch (error) {
        console.error('Lỗi khi load products:', error)
      }
    }

    onMounted(() => {
      fetchCategories()
      fetchProducts()
    })

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        if (selectedCategory.value && product.categoryId !== selectedCategory.value) {
          return false
        }
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          return (
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
          )
        }
        return true
      })
    })

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.name : ''
    }

    const addToCart = (product) => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      alert(`${product.name} đã được thêm vào giỏ hàng!`)
    }

    return {
      searchQuery,
      selectedCategory,
      categories,
      filteredProducts,
      getCategoryName,
      addToCart
    }
  }
}
</script>
