<template>
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
      
      <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
          </div>
          
          <div class="md:w-1/2 p-6 md:p-8">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
                <span class="inline-block bg-rose-100 text-rose-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {{ getCategoryName(product.categoryId) }}
                </span>
              </div>
              <span class="text-2xl font-bold text-rose-600">${{ product.price.toFixed(2) }}</span>
            </div>
            
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>
            
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Quantity</h2>
              <div class="flex items-center">
                <button 
                  @click="quantity > 1 ? quantity-- : null" 
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
                >
                  <Minus class="h-5 w-5" />
                </button>
                
                <input 
                  type="number" 
                  v-model="quantity" 
                  min="1" 
                  class="w-16 text-center border-t border-b border-gray-200 py-1"
                  readonly
                >
                
                <button 
                  @click="quantity++" 
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
                >
                  <Plus class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="addToCart" 
                class="flex-1 bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 flex items-center justify-center gap-2"
              >
                <ShoppingCart class="h-5 w-5" />
                Add to Cart
              </button>
              
              <button 
                class="flex-1 border border-rose-600 text-rose-600 py-3 px-6 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-2"
              >
                <Heart class="h-5 w-5" />
                Add to Favorites
              </button>
            </div>
            
            <div class="mt-8 border-t border-gray-200 pt-6">
              <h2 class="text-lg font-semibold text-gray-700 mb-4">Customer Reviews</h2>
              
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <Star class="h-5 w-5 fill-current" />
                  <Star class="h-5 w-5 fill-current" />
                  <Star class="h-5 w-5 fill-current" />
                  <Star class="h-5 w-5 fill-current" />
                  <Star class="h-5 w-5" />
                </div>
                <span class="ml-2 text-gray-600">4.0 out of 5</span>
              </div>
              
              <p class="text-gray-600 text-sm">Based on 24 reviews</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <AlertCircle class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Product not found</h3>
        <p class="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <router-link to="/" class="bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700">
          Back to Home
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { ShoppingCart, Heart, Star, Minus, Plus, AlertCircle } from 'lucide-vue-next'
  
  export default {
    name: 'ProductDetail',
    components: {
      ShoppingCart,
      Heart,
      Star,
      Minus,
      Plus,
      AlertCircle
    },
    setup() {
      const route = useRoute()
      const productId = parseInt(route.params.id)
      
      const product = ref(null)
      const loading = ref(true)
      const quantity = ref(1)
      
      // Mock categories - in a real app, this would come from an API
      const categories = ref([
        { id: 1, name: 'Burgers' },
        { id: 2, name: 'Pizza' },
        { id: 3, name: 'Sushi' },
        { id: 4, name: 'Desserts' },
        { id: 5, name: 'Drinks' }
      ])
      
      onMounted(async () => {
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock product data
          const mockProducts = [
            {
              id: 1,
              name: 'Classic Burger',
              description: 'Juicy beef patty with lettuce, tomato, cheese, and our special sauce on a toasted bun. Made with 100% grass-fed beef and locally sourced vegetables for the freshest taste.',
              price: 8.99,
              image: '/placeholder.svg?height=600&width=800',
              categoryId: 1
            },
            {
              id: 2,
              name: 'Margherita Pizza',
              description: 'Traditional pizza with tomato sauce, mozzarella cheese, and fresh basil. Our dough is made fresh daily and baked in a wood-fired oven for authentic Italian flavor.',
              price: 12.99,
              image: '/placeholder.svg?height=600&width=800',
              categoryId: 2
            },
            {
              id: 3,
              name: 'California Roll',
              description: 'Crab, avocado, and cucumber wrapped in seaweed and rice. Made with premium ingredients and served with wasabi, ginger, and soy sauce.',
              price: 9.99,
              image: '/placeholder.svg?height=600&width=800',
              categoryId: 3
            }
          ]
          
          product.value = mockProducts.find(p => p.id === productId) || null
        } catch (error) {
          console.error('Error fetching product:', error)
        } finally {
          loading.value = false
        }
      })
      
      const getCategoryName = (categoryId) => {
        const category = categories.value.find(c => c.id === categoryId)
        return category ? category.name : ''
      }
      
      const addToCart = () => {
        if (!product.value) return
        
        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.value.id)
        
        if (existingItem) {
          // Update quantity if already in cart
          existingItem.quantity += quantity.value
        } else {
          // Add new item to cart
          cart.push({
            id: product.value.id,
            name: product.value.name,
            price: product.value.price,
            image: product.value.image,
            quantity: quantity.value
          })
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart))
        
        // Show success message (in a real app, you might use a toast notification)
        alert(`${quantity.value} ${product.value.name}${quantity.value > 1 ? 's' : ''} added to cart!`)
        
        // Reset quantity
        quantity.value = 1
      }
      
      return {
        product,
        loading,
        quantity,
        getCategoryName,
        addToCart
      }
    }
  }
  </script>