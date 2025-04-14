<template>
  <nav class="bg-rose-600 text-white shadow-md">
    <div class="container mx-auto flex justify-between items-center px-4 py-3">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-bold tracking-wide">
        FoodShop
      </router-link>

      <!-- Right section -->
      <div class="flex items-center gap-6">
        <!-- Nếu đã đăng nhập -->
        <template v-if="user">
          <template v-if="user.role !== 'admin'">
            <router-link to="/" class="hover:text-rose-200">Home</router-link>
            <router-link to="/contact" class="hover:text-rose-200">Liên hệ</router-link>
            <router-link to="/cart" class="hover:text-rose-200 relative">
              <ShoppingCart class="w-6 h-6" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-yellow-400 text-rose-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </template>

          <!-- Dropdown người dùng -->
          <div class="relative" ref="dropdownRef">
            <button @click="toggleDropdown" class="flex items-center hover:text-rose-200 focus:outline-none">
              <User class="w-5 h-5 mr-1" />
              {{ user.name }}
              <ChevronDown class="w-4 h-4 ml-1" />
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg z-50 py-2"
            >
              <template v-if="user.role !== 'admin'">
                <router-link to="/orders" class="block px-4 py-2 hover:bg-rose-100">My Orders</router-link>
                <router-link to="/profile" class="block px-4 py-2 hover:bg-rose-100">Profile</router-link>
              </template>
              <template v-else>
                <router-link to="/admin/dashboard" class="block px-4 py-2 hover:bg-rose-100">Dashboard</router-link>
                <router-link to="/admin/products" class="block px-4 py-2 hover:bg-rose-100">Manage Products</router-link>
                <router-link to="/admin/orders" class="block px-4 py-2 hover:bg-rose-100">Manage Orders</router-link>
                <router-link to="/admin/users" class="block px-4 py-2 hover:bg-rose-100">Manage Users</router-link>
                <router-link to="/admin/adminCategories" class="block px-4 py-2 hover:bg-rose-100">Manage Categories</router-link>
                <hr class="my-2 border-t" />
              </template>
              <button @click="$emit('logout')" class="block w-full text-left px-4 py-2 hover:bg-rose-100">Logout</button>
            </div>
          </div>
        </template>

        <!-- Nếu chưa đăng nhập -->
        <template v-else>
          <router-link to="/login" class="hover:text-rose-200">Login</router-link>
          <router-link to="/register" class="hover:text-rose-200">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ShoppingCart, User, ChevronDown } from 'lucide-vue-next'

export default {
  name: 'Navbar',
  components: {
    ShoppingCart,
    User,
    ChevronDown
  },
  props: {
    user: Object
  },
  setup() {
    const cartCount = ref(0)
    const dropdownOpen = ref(false)
    const dropdownRef = ref(null)

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cartCount.value = cart.reduce((total, item) => total + item.quantity, 0)
    }

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
    }

    const closeDropdown = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
      }
    }

    onMounted(() => {
      updateCartCount()
      window.addEventListener('click', closeDropdown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('click', closeDropdown)
    })

    return {
      cartCount,
      dropdownOpen,
      toggleDropdown,
      dropdownRef
    }
  }
}
</script>
