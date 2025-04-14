<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Orders</h1>
      
      <div class="flex space-x-2">
        <button 
          @click="exportOrders" 
          class="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center"
        >
          <Download class="h-5 w-5 mr-1" />
          Export
        </button>
      </div>
    </div>
    
    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input 
              type="text" 
              id="search" 
              v-model="searchQuery" 
              placeholder="Search by order ID or customer..." 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
            <Search class="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
          </div>
        </div>
        
        <div class="w-full md:w-48">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            id="status" 
            v-model="selectedStatus" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div class="w-full md:w-48">
          <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select 
            id="dateRange" 
            v-model="dateRange" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ order._id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.user.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.date }}
                <div class="text-xs text-gray-400">{{ formatDate(order.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${{ order.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  v-model="order.status" 
                  @change="updateOrderStatus(order._id, order.status)"
                  class="text-xs font-semibold rounded-full px-2 py-1 border"
                  :class="{
                    'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === 'pending',
                    'bg-blue-100 text-blue-800 border-blue-200': order.status === 'processing',
                    'bg-indigo-100 text-indigo-800 border-indigo-200': order.status === 'shipped',
                    'bg-green-100 text-green-800 border-green-200': order.status === 'delivered',
                    'bg-red-100 text-red-800 border-red-200': order.status === 'cancelled'
                  }"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="viewOrderDetails(order)" 
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Eye class="h-5 w-5" />
                </button>
                <button 
                  @click="printOrder(order.id)" 
                  class="text-gray-600 hover:text-gray-900"
                >
                  <Printer class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <ShoppingBag class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
        <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>
    
    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-lg font-semibold">Order Details - {{ selectedOrder._id }}</h2>
          <button @click="showOrderDetailsModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium">{{ selectedOrder.user.username }}</p>

              </div>
            </div>
            
           
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between mb-1">
                  <span class="text-gray-600">Date:</span>
                  <span>{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
               
                <div class="flex justify-between mb-1">
                  <span class="text-gray-600">Status:</span>
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': selectedOrder.status === 'Pending',
                      'bg-blue-100 text-blue-800': selectedOrder.status === 'Processing',
                      'bg-indigo-100 text-indigo-800': selectedOrder.status === 'Shipped',
                      'bg-green-100 text-green-800': selectedOrder.status === 'Delivered',
                      'bg-red-100 text-red-800': selectedOrder.status === 'Cancelled'
                    }"
                  >
                    {{ selectedOrder.status }}
                  </span>
                </div>
              </div>
            </div>

          </div>
          
          <h3 class="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div v-for="(item, index) in selectedOrder.items" :key="index" class="flex items-center py-3" :class="{ 'border-b': index < selectedOrder.items.length - 1 }">
              <img :src="`http://localhost:3000${item.product.image}`" :alt="item.name" class="w-24 h-24 object-cover rounded-md mr-4">
              
              <div class="flex-grow">
                <h4 class="font-medium">{{ item.name }}</h4>
                <p class="text-gray-500 text-sm">Quantity: {{ item.quantity }}</p>
              </div>
              
              <div class="text-right">
                <p class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
                <p class="text-gray-500 text-sm">${{ item.price.toFixed(2) }} each</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <!-- <div class="flex justify-between mb-1">
                <span class="text-gray-600">Subtotal:</span>
                <span>${{ selectedOrder.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-600">Tax:</span>
                <span>${{ selectedOrder.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-600">Shipping:</span>
                <span>${{ selectedOrder.shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${{ selectedOrder.total.toFixed(2) }}</span>
              </div> -->
            </div>
          </div>
          
          <div class="flex justify-between">
            <div>
             
            </div>
            
            <div>
              <button 
                @click="printOrder(selectedOrder.id)" 
                class="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
              >
                Print Order
              </button>
              <button 
                @click="showOrderDetailsModal = false" 
                class="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { 
  Search, 
  Eye, 
  Printer, 
  Download, 
  X, 
  ShoppingBag 
} from 'lucide-vue-next'

export default {
  name: 'AdminOrders',
  components: {
    Search,
    Eye,
    Printer,
    Download,
    X,
    ShoppingBag
  },
  setup() {
    // State
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const dateRange = ref('all')
    const showOrderDetailsModal = ref(false)
    const selectedOrder = ref({})
    const orders = ref([])  
    const loading = ref(false)
    
    const fetchOrders = async () => {
    const token = localStorage.getItem('token')
    loading.value = true
    try {
      const res = await axios.get('http://localhost:3000/api/orders/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      orders.value = res.data 
    } catch (err) {
      console.error('Lỗi lấy danh sách đơn hàng:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchOrders()
  })
    
   
    const filteredOrders = computed(() => {
let result = [...orders.value]


if (searchQuery.value) {
  const query = searchQuery.value.toLowerCase()
  result = result.filter(order =>
    order._id.toLowerCase().includes(query) ||
    order.user.username.toLowerCase().includes(query)
  )
}


if (selectedStatus.value) {
  result = result.filter(order => order.status === selectedStatus.value)
}

if (dateRange.value !== 'all') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orderDateInRange = (orderDate) => {
    const date = new Date(orderDate)
    date.setHours(0, 0, 0, 0) 

    if (dateRange.value === 'today') {
      return date.getTime() === today.getTime()
    }

    if (dateRange.value === 'yesterday') {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return date.getTime() === yesterday.getTime()
    }

    if (dateRange.value === 'week') {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return date >= weekStart
    }

    if (dateRange.value === 'month') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return date >= monthStart
    }

    return true
  }

  result = result.filter(order => orderDateInRange(order.createdAt))
}

result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

return result
})

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const viewOrderDetails = (order) => {
      selectedOrder.value = { ...order }
      showOrderDetailsModal.value = true
    }
    
    const updateOrderStatus = async (orderId, status) => {
      const token = localStorage.getItem('token')

      try {
        const response = await axios.put(`http://localhost:3000/api/orders/${orderId}`, 
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )


        console.log('Cập nhật thành công', response.data)

        
        await fetchOrders()
      } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error)
        alert('Không thể hủy đơn hàng. Vui lòng thử lại.')
      }
    }
    
    const printOrder = (orderId) => {
     
      console.log(`Printing order ${orderId}`)
      alert(`Printing order #${orderId}`)
    }
    
    const exportOrders = () => {
     
      console.log('Exporting orders')
      alert('Orders exported successfully')
    }
    
    return {
      searchQuery,
      selectedStatus,
      dateRange,
      filteredOrders,
      showOrderDetailsModal,
      selectedOrder,
      viewOrderDetails,
      updateOrderStatus,
      printOrder,
      exportOrders,
      fetchOrders,
      formatDate
    }
  }
}
</script>