import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Order from '../views/Order.vue'
import Contact from '../views/Contact.vue'
import Profile from '../views/Profile.vue'
import Checkout from '../views/Checkout.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminProducts from '../views/admin/Products.vue'
import AdminCategories from '../views/admin/AdminCategories.vue'
import AdminOrders from '../views/admin/Orders.vue'
import AdminUsers from '../views/admin/Users.vue'
import Blog from '@/views/Blog.vue'
import BlogList from '../views/BlogList.vue'
import BlogDetail from '../views/BlogDetail.vue'
import AdminBlog from '../views/admin/AdminBlog.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Order',
    component: Order,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/adminCategories',
    name: 'AdminCategories',
    component: AdminCategories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  {
    path: '/blogs',
    name: 'BlogList',
    component: BlogList
  },
  {
    path: '/blogs/:id',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/admin/blogs',
    name: 'AdminBlog',
    component: AdminBlog,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
  
  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const role = localStorage.getItem('role')

  
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next('/login')
  } else if (to.matched.some(record => record.meta.requiresAdmin) && (!user || role !== 'admin')) {
    next('/')
  } else {
    next()
  }
})

export default router