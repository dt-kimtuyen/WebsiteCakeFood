<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-extrabold text-center text-[#e11d48] mb-12 tracking-tight">
       Admin Dashboard
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
     
      <router-link to="/admin/adminCategories" class="card-dashboard group">
        <div class="icon-wrapper bg-rose-100 text-rose-500">
          <img src="https://img.icons8.com/fluency/48/folder-invoices.png" alt="Categories" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-rose-600">Categories</h2>
          <p class="text-sm text-gray-500">{{ counts.categories }} categories</p>
        </div>
      </router-link>

      
      <router-link to="/admin/products" class="card-dashboard group">
        <div class="icon-wrapper bg-yellow-100 text-yellow-600">
          <img src="https://img.icons8.com/fluency/48/shopping-cart.png" alt="Products" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-yellow-600">Products</h2>
          <p class="text-sm text-gray-500">{{ counts.products }} products</p>
        </div>
      </router-link>

   
      <router-link to="/admin/orders" class="card-dashboard group">
        <div class="icon-wrapper bg-blue-100 text-blue-600">
          <img src="https://png.pngtree.com/png-clipart/20230317/original/pngtree-colorful-order-now-label-png-image_8990854.png" alt="Orders" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Orders</h2>
          <p class="text-sm text-gray-500">{{ counts.orders }} orders</p>
        </div>
      </router-link>

   
      <router-link to="/admin/users" class="card-dashboard group">
        <div class="icon-wrapper bg-purple-100 text-purple-600">
          <img src="https://img.icons8.com/fluency/48/user-group-man-man.png" alt="Users" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-purple-600">Users</h2>
          <p class="text-sm text-gray-500">{{ counts.users }} users</p>
        </div>
      </router-link>

  
      <router-link to="/admin/blogs" class="card-dashboard group">
        <div class="icon-wrapper bg-pink-100 text-pink-600">
          <img src="https://img.icons8.com/fluency/48/blog.png" alt="Blogs" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-pink-600">Blogs</h2>
          <p class="text-sm text-gray-500">{{ counts.blogs }} blogs</p>
        </div>
      </router-link>

   
      <router-link to="/admin/feedbacks" class="card-dashboard group">
        <div class="icon-wrapper bg-green-100 text-green-600">
          <img src="https://static.vecteezy.com/system/resources/thumbnails/005/566/622/small/feedback-icon-style-free-vector.jpg" alt="Feedback" class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-green-600">Feedback</h2>
          <p class="text-sm text-gray-500">{{ counts.feedbacks }} phản hồi</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const counts = ref({
  categories: 0,
  products: 0,
  orders: 0,
  users: 0,
  blogs: 0,
  feedbacks: 0
})

const fetchCounts = async () => {
  const token = localStorage.getItem('token')
  try {
    const [catRes, prodRes, orderRes, userRes, blogRes, feedbackRes] = await Promise.all([
      axios.get('http://localhost:3000/api/categories'),
      axios.get('http://localhost:3000/api/products'),
      axios.get('http://localhost:3000/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:3000/api/users/users', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:3000/api/blogs'),
      axios.get('http://localhost:3000/api/feedbacks') // Feedback
    ])

    counts.value = {
      categories: catRes.data.length,
      products: prodRes.data.length,
      orders: orderRes.data.length,
      users: userRes.data.users.length,
      blogs: blogRes.data.length,
      feedbacks: feedbackRes.data.length
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
  }
}

onMounted(fetchCounts)
</script>

<style scoped>
.card-dashboard {
  @apply bg-white rounded-xl p-5 flex items-center gap-4 shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform border hover:border-gray-200;
}

.icon-wrapper {
  @apply w-14 h-14 flex items-center justify-center rounded-full;
}
</style>
