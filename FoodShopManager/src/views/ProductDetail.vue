<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <span class="text-rose-500 font-semibold">Đang tải dữ liệu...</span>
    </div>

    <div v-else-if="product" class="bg-white rounded-xl shadow-lg p-6 md:flex gap-6">
      <img :src="`http://localhost:3000${product.image}`" :alt="product.name" class="w-full md:w-1/2 rounded-lg object-cover">

      <div class="md:w-1/2 space-y-4">
        <h1 class="text-3xl font-bold text-rose-600">{{ product.name }}</h1>
        <span class="inline-block bg-gray-100 text-rose-600 px-3 py-1 text-sm rounded-full">
          {{ getCategoryName(product.categoryId) }}
        </span>

        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

        <div class="text-2xl font-bold text-rose-500">
          ${{ product.price.toFixed(2) }}
        </div>

        <div class="flex items-center space-x-4">
          <button @click="addToCart" class="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700">
            Thêm vào giỏ hàng
          </button>

          <router-link to="/" class="text-gray-500 hover:underline">
            ← Quay về Trang chủ
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600">Không tìm thấy sản phẩm.</p>
      <router-link to="/" class="text-rose-600 underline">Quay lại Trang chủ</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const categories = ref([])

const fetchProduct = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/products/${route.params.id}`)
    product.value = res.data
  } catch (err) {
    console.error('Không tìm thấy sản phẩm:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/categories')
    categories.value = res.data
  } catch (error) {
    console.error('Lỗi khi load danh mục:', error)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c._id === categoryId)
  return category ? category.name : 'Không rõ'
}

const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(item => item.id === product.value._id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      id: product.value._id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      quantity: 1
    })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  alert('Đã thêm vào giỏ hàng!')
}

onMounted(() => {
  fetchProduct()
  fetchCategories()
})
</script>

<style scoped>
</style>
