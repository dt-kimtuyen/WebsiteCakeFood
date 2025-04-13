<template>
    <div class="container mx-auto px-4 py-10">
      <h1 class="text-4xl font-bold text-center text-rose-600 mb-10">📰 Bài viết & Tin tức</h1>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="blog in blogs" 
          :key="blog._id" 
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300"
        >
          <img 
            v-if="blog.image" 
            :src="`http://localhost:3000/uploads/${blog.image}`" 
            alt="Ảnh blog" 
            class="w-full h-52 object-cover rounded-t-xl"
          />
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ blog.title }}</h2>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">{{ blog.content }}</p>
            <div class="flex justify-between items-center text-sm text-gray-400">
              <span>{{ formatDate(blog.createdAt) }}</span>
              <router-link 
                :to="`/blogs/${blog._id}`" 
                class="text-rose-600 hover:underline font-medium"
              >
                Đọc tiếp →
              </router-link>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="blogs.length === 0" class="text-center mt-10 text-gray-500">
        Không có bài viết nào.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const blogs = ref([])
  
  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/blogs')
      blogs.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (err) {
      console.error('Lỗi khi lấy danh sách blog:', err)
    }
  }
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  onMounted(fetchBlogs)
  </script>
  
  <style scoped>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>
  