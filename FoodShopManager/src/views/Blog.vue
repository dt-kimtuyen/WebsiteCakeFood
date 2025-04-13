<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-rose-600">📝 Blog Posts</h1>
  
      <!-- Form thêm blog (chỉ admin) -->
      <div v-if="isAdmin" class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-lg font-semibold mb-4">Tạo Blog mới</h2>
        <form @submit.prevent="createBlog">
          <div class="mb-4">
            <input type="text" v-model="newBlog.title" placeholder="Tiêu đề" class="input" required />
          </div>
          <div class="mb-4">
            <textarea v-model="newBlog.content" placeholder="Nội dung blog..." class="input" rows="4" required></textarea>
          </div>
          <div class="mb-4">
            <input type="file" @change="onFileChange" />
          </div>
          <button type="submit" class="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700">
            Tạo blog
          </button>
        </form>
      </div>
  
      <!-- Danh sách blog -->
      <div v-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="blog in blogs" :key="blog._id" class="bg-white rounded-lg shadow-md p-4">
          <img
            v-if="blog.image"
            :src="`http://localhost:3000/uploads/${blog.image}`"
            alt="Blog image"
            class="w-full h-48 object-cover rounded mb-4"
          />
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ blog.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ formatDate(blog.createdAt) }}</p>
          <p class="text-gray-700 text-base">{{ blog.content }}</p>
        </div>
      </div>
  
      <p v-else class="text-gray-500">Không có blog nào.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const blogs = ref([])
  const newBlog = ref({
    title: '',
    content: ''
  })
  const imageFile = ref(null)
  const isAdmin = localStorage.getItem('role') === 'admin'
  
  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/blogs')
      blogs.value = res.data
    } catch (err) {
      console.error('Lỗi lấy danh sách blog:', err)
    }
  }
  
  const onFileChange = (e) => {
    imageFile.value = e.target.files[0]
  }
  
  const createBlog = async () => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('title', newBlog.value.title)
    formData.append('content', newBlog.value.content)
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }
  
    try {
      await axios.post('http://localhost:3000/api/blogs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      newBlog.value = { title: '', content: '' }
      imageFile.value = null
      await fetchBlogs()
    } catch (err) {
      console.error('Lỗi tạo blog:', err)
    }
  }
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString()
  }
  
  onMounted(fetchBlogs)
  </script>
  
  <style scoped>
  .input {
    @apply w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-rose-300;
  }
  </style>
  