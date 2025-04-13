<template>
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-rose-600">Quản lý Blog</h1>
        <button @click="openAddModal" class="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700">
          Thêm Blog
        </button>
      </div>
  
      <!-- Danh sách Blog -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="blog in blogs" :key="blog._id" class="bg-white rounded-lg shadow-md hover:shadow-lg">
          <img
            v-if="blog.image"
            :src="`http://localhost:3000/uploads/${blog.image}`"
            alt="Blog Image"
            class="w-full h-40 object-cover"
          />
          <div class="p-4">
            <h2 class="text-lg font-semibold">{{ blog.title }}</h2>
            <p class="text-sm text-gray-600 line-clamp-2">{{ blog.content }}</p>
            <div class="flex justify-end gap-2 mt-3">
              <button @click="editBlog(blog)" class="text-indigo-600 hover:underline text-sm">Sửa</button>
              <button @click="deleteBlog(blog._id)" class="text-red-600 hover:underline text-sm">Xoá</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Thêm / Sửa -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Sửa Blog' : 'Thêm Blog' }}</h2>
  
          <form @submit.prevent="submitBlog">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Tiêu đề</label>
              <input v-model="form.title" required class="w-full border px-3 py-2 rounded" />
            </div>
  
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Nội dung</label>
              <textarea v-model="form.content" rows="5" required class="w-full border px-3 py-2 rounded"></textarea>
            </div>
  
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Hình ảnh</label>
              <input type="file" @change="handleFileChange" class="w-full" />
            </div>
  
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="closeModal" class="px-4 py-2 border rounded">Huỷ</button>
              <button type="submit" class="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700">
                {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const blogs = ref([])
  const showModal = ref(false)
  const isEdit = ref(false)
  const editingId = ref(null)
  const form = ref({ title: '', content: '' })
  const imageFile = ref(null)
  
  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/blogs')
      blogs.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Lỗi khi lấy blog:', error)
    }
  }
  
  const openAddModal = () => {
    isEdit.value = false
    form.value = { title: '', content: '' }
    imageFile.value = null
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    form.value = { title: '', content: '' }
    imageFile.value = null
    editingId.value = null
  }
  
  const editBlog = (blog) => {
    isEdit.value = true
    editingId.value = blog._id
    form.value = { title: blog.title, content: blog.content }
    showModal.value = true
  }
  
  const handleFileChange = (event) => {
    imageFile.value = event.target.files[0]
  }
  
  const submitBlog = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Bạn chưa đăng nhập hoặc không có quyền!')
      return
    }
  
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    if (imageFile.value) formData.append('image', imageFile.value)
  
    try {
      if (isEdit.value) {
        await axios.put(`http://localhost:3000/api/blogs/${editingId.value}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        await axios.post('http://localhost:3000/api/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
      }
  
      await fetchBlogs()
      closeModal()
    } catch (err) {
      console.error('Lỗi khi gửi blog:', err)
      if (err.response?.status === 401) {
        alert('Bạn không có quyền thực hiện. Vui lòng đăng nhập với tài khoản admin!')
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại.')
      }
    }
  }
  
  const deleteBlog = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Bạn chưa đăng nhập!')
  
    if (confirm('Bạn có chắc muốn xoá blog này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await fetchBlogs()
      } catch (err) {
        console.error('Lỗi khi xoá:', err)
        alert('Không thể xoá blog!')
      }
    }
  }
  
  onMounted(fetchBlogs)
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>
  