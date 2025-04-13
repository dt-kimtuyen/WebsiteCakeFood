<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-rose-600 mb-6">Quản lý Phản hồi</h1>
  
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr class="bg-rose-100 text-left">
            <th class="py-3 px-4 border-b">Tên</th>
            <th class="py-3 px-4 border-b">Nội dung</th>
            <th class="py-3 px-4 border-b">Đánh giá</th>
            <th class="py-3 px-4 border-b">Thời gian</th>
            <th class="py-3 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feedback in feedbacks" :key="feedback._id" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b">{{ feedback.name }}</td>
            <td class="py-2 px-4 border-b">{{ feedback.message }}</td>
            <td class="py-2 px-4 border-b">{{ feedback.rating }} ⭐</td>
            <td class="py-2 px-4 border-b">{{ formatDate(feedback.createdAt) }}</td>
            <td class="py-2 px-4 border-b text-center">
              <button
                @click="deleteFeedback(feedback._id)"
                class="text-red-600 hover:underline text-sm"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="feedbacks.length === 0" class="text-center py-12 text-gray-500">
        Hiện chưa có phản hồi nào.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const feedbacks = ref([])
  
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/feedbacks')
      feedbacks.value = res.data.reverse()
    } catch (err) {
      console.error('Lỗi khi lấy danh sách feedback:', err)
    }
  }
  
  const deleteFeedback = async (id) => {
    const token = localStorage.getItem('token')
    if (confirm('Bạn có chắc muốn xoá phản hồi này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/feedbacks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchFeedbacks()
      } catch (err) {
        console.error('Lỗi khi xoá feedback:', err)
      }
    }
  }
  
  const formatDate = (date) => new Date(date).toLocaleString()
  
  onMounted(fetchFeedbacks)
  </script>
  
  <style scoped>
  th, td {
    font-size: 14px;
  }
  </style>
  