<template>
  <div>
    <!-- HERO SECTION -->
    <div class="bg-gradient-to-r from-rose-300 via-rose-400 to-rose-600 text-white h-[320px] flex items-center">
      <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div class="flex justify-center gap-4 items-center">
          <img src="https://img.lovepik.com/png/20231031/Chef-logo-image-white-hat-drawing-picture-cook_427358_wh1200.png"
               alt="Chef Logo"
               class="w-[200px] md:w-[260px] object-contain drop-shadow-lg" />
          <img src="https://png.pngtree.com/png-clipart/20240710/original/pngtree-order-foods-online-from-app-by-smart-phone-fast-food-delivery-png-image_15527448.png"
               alt="Fast Food Poster"
               class="w-[260px] md:w-[400px] object-contain drop-shadow-lg" />
        </div>

        <div class="text-center md:text-left">
          <h1 class="text-3xl md:text-4xl font-extrabold leading-snug drop-shadow-lg mb-3">
            Giao Món Ngon Tận Nhà
          </h1>
          <p class="text-sm md:text-base max-w-xl mb-5 drop-shadow-md mx-auto md:mx-0">
            Khám phá thực đơn phong phú với món ăn tươi ngon, giao tận nơi nhanh chóng.
          </p>
          <button class="bg-white text-rose-600 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-rose-100 hover:scale-105 transition duration-300">
            Đặt Món Ngay
          </button>
          <p class="mt-4 text-xs text-white/80 italic">
            Nhóm thực hiện: <strong>NICEA</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- CATEGORY FILTER -->
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

      <!-- SEARCH BAR -->
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

      <!-- PRODUCT LIST -->
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
              <span class="text-rose-600 font-bold">${{ product.price.toFixed(3) }}</span>
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

      <!-- EMPTY PRODUCT STATE -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <ShoppingBag class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>

      <!-- BLOG SECTION -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-2xl font-bold text-rose-600 mb-6 text-center">📰 Tin tức & Blog</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="blog in blogs" 
            :key="blog._id" 
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img 
              v-if="blog.image" 
              :src="`http://localhost:3000/uploads/${blog.image}`" 
              alt="Blog Image" 
              class="w-full h-44 object-cover"
            >
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800 mb-2">{{ blog.title }}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-3">{{ blog.content }}</p>
              <p class="text-xs text-gray-400 italic">{{ formatDate(blog.createdAt) }}</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
  <router-link 
    to="/blogs"
    class="text-rose-600 font-semibold underline hover:text-rose-800 transition"
  >
    Xem tất cả bài viết →
  </router-link>

  <!-- Nút Gửi phản hồi -->
  <router-link 
    to="/feedbacks"
    class="mt-4 ml-4 inline-block bg-rose-600 text-white py-2 px-6 rounded-full hover:bg-rose-700 transition"
  >
    Gửi phản hồi ✉️
  </router-link>
</div>

        
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
    const blogs = ref([])

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

    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/blogs')
        blogs.value = res.data
      } catch (err) {
        console.error('Lỗi khi load blog:', err)
      }
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString()
    }

    onMounted(() => {
      fetchCategories()
      fetchProducts()
      fetchBlogs()
    })

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        if (selectedCategory.value && product.categoryId !== selectedCategory.value) return false
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
      addToCart,
      blogs,
      formatDate
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
