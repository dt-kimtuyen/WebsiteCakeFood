<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Nút quay lại -->
        <router-link
          to="/blogs"
          class="inline-block mb-6 text-rose-600 hover:underline font-semibold"
        >
          ← Quay lại danh sách blog
        </router-link>
  
        <div v-if="blog">
          <h1 class="text-3xl font-bold text-rose-600 mb-4">{{ blog.title }}</h1>
          <p class="text-sm text-gray-500 italic mb-4">{{ formatDate(blog.createdAt) }}</p>
          <img 
            v-if="blog.image" 
            :src="`http://localhost:3000/uploads/${blog.image}`" 
            class="w-full h-auto rounded mb-6"
          />
          <p class="text-base text-gray-800 whitespace-pre-line">{{ blog.content }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  
  const blog = ref(null)
  const route = useRoute()
  
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/blogs`)
      blog.value = res.data.find(b => b._id === route.params.id)
    } catch (err) {
      console.error('Lỗi khi load chi tiết blog:', err)
    }
  }
  
  const formatDate = (date) => new Date(date).toLocaleDateString()
  
  onMounted(fetchBlog)
  </script>
  