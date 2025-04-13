<template>
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div class="bg-rose-600 text-white py-4 px-6">
        <h2 class="text-xl font-bold">Gửi Phản Hồi</h2>
      </div>
  
      <div class="p-6">
        <form @submit.prevent="submitFeedback">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-medium mb-2">Họ tên</label>
            <input v-model="form.name" type="text" id="name" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required>
          </div>
  
          <div class="mb-4">
            <label for="message" class="block text-gray-700 font-medium mb-2">Nội dung</label>
            <textarea v-model="form.message" id="message" rows="4" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required></textarea>
          </div>
  
          <div class="mb-4">
            <label for="rating" class="block text-gray-700 font-medium mb-2">Đánh giá</label>
            <select v-model="form.rating" id="rating" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="">Chọn số sao</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
            </select>
          </div>
  
          <button type="submit" class="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700" :disabled="loading">
            <span v-if="loading">Đang gửi...</span>
            <span v-else>Gửi phản hồi</span>
          </button>
        </form>
  
        <!-- Danh sách phản hồi -->
        <div v-if="feedbacks.length" class="mt-10">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Phản hồi đã gửi</h3>
          <div v-for="fb in feedbacks" :key="fb._id" class="bg-gray-50 border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center">
              <h4 class="font-semibold text-gray-800">{{ fb.name }}</h4>
              <span class="text-sm text-yellow-500 font-medium">{{ fb.rating }} sao</span>
            </div>
            <p class="text-gray-600 mt-1 whitespace-pre-line">{{ fb.message }}</p>
            <p class="text-xs text-gray-400 italic mt-2">{{ formatDate(fb.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    name: '',
    message: '',
    rating: ''
  })
  
  const feedbacks = ref([])
  const loading = ref(false)
  
  const submitFeedback = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/api/feedbacks', form.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert('Gửi phản hồi thành công!')
      form.value = { name: '', message: '', rating: '' }
      await fetchFeedbacks()
    } catch (err) {
      console.error('Lỗi khi gửi:', err)
      alert('Lỗi khi gửi phản hồi. Vui lòng thử lại.')
    } finally {
      loading.value = false
    }
  }
  
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/feedbacks')
      feedbacks.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Lỗi khi tải danh sách phản hồi:', error)
    }
  }
  
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString()
  
  onMounted(fetchFeedbacks)
  </script>