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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer }}
                  <div class="text-xs text-gray-400">{{ order.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.date }}
                  <div class="text-xs text-gray-400">{{ order.time }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ order.total.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select 
                    v-model="order.status" 
                    @change="updateOrderStatus(order.id, order.status)"
                    class="text-xs font-semibold rounded-full px-2 py-1 border"
                    :class="{
                      'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === 'Pending',
                      'bg-blue-100 text-blue-800 border-blue-200': order.status === 'Processing',
                      'bg-indigo-100 text-indigo-800 border-indigo-200': order.status === 'Shipped',
                      'bg-green-100 text-green-800 border-green-200': order.status === 'Delivered',
                      'bg-red-100 text-red-800 border-red-200': order.status === 'Cancelled'
                    }"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
            <h2 class="text-lg font-semibold">Order Details - #{{ selectedOrder.id }}</h2>
            <button @click="showOrderDetailsModal = false" class="text-gray-500 hover:text-gray-700">
              <X class="h-5 w-5" />
            </button>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="font-medium">{{ selectedOrder.customer }}</p>
                  <p class="text-gray-600">{{ selectedOrder.email }}</p>
                  <p class="text-gray-600">{{ selectedOrder.phone }}</p>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-600">{{ selectedOrder.address }}</p>
                  <p class="text-gray-600">{{ selectedOrder.city }}, {{ selectedOrder.zipCode }}</p>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Date:</span>
                    <span>{{ selectedOrder.date }}</span>
                  </div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Time:</span>
                    <span>{{ selectedOrder.time }}</span>
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
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Payment Method:</span>
                    <span>{{ selectedOrder.paymentMethod }}</span>
                  </div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Payment Status:</span>
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ selectedOrder.paymentStatus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 class="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div v-for="(item, index) in selectedOrder.items" :key="index" class="flex items-center py-3" :class="{ 'border-b': index < selectedOrder.items.length - 1 }">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 object-cover rounded-md mr-4">
                
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
                <div class="flex justify-between mb-1">
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
                </div>
              </div>
            </div>
            
            <div class="flex justify-between">
              <div>
                <button 
                  @click="updateOrderStatus(selectedOrder.id, 'Cancelled')" 
                  class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 mr-2"
                  v-if="selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled'"
                >
                  Cancel Order
                </button>
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
  import { ref, computed } from 'vue'
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
      
      // Mock data for orders
      const orders = ref([
        {
          id: '1001',
          customer: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(123) 456-7890',
          address: '123 Main St, Apt 4B',
          city: 'New York',
          zipCode: '10001',
          date: '2023-04-01',
          time: '14:30',
          total: 89.99,
          subtotal: 79.99,
          tax: 6.40,
          shipping: 3.60,
          status: 'Delivered',
          paymentMethod: 'Credit Card',
          paymentStatus: 'Paid',
          items: [
            {
              name: 'Classic Burger',
              price: 8.99,
              quantity: 2,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Strawberry Milkshake',
              price: 4.99,
              quantity: 2,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Chocolate Brownie',
              price: 6.99,
              quantity: 1,
              image: '/placeholder.svg?height=100&width=100'
            }
          ]
        },
        {
          id: '1002',
          customer: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(234) 567-8901',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          zipCode: '90001',
          date: '2023-04-02',
          time: '12:15',
          total: 124.50,
          subtotal: 110.00,
          tax: 8.80,
          shipping: 5.70,
          status: 'Processing',
          paymentMethod: 'PayPal',
          paymentStatus: 'Paid',
          items: [
            {
              name: 'Margherita Pizza',
              price: 12.99,
              quantity: 2,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'California Roll',
              price: 9.99,
              quantity: 3,
              image: '/placeholder.svg?height=100&width=100'
            }
          ]
        },
        {
          id: '1003',
          customer: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          phone: '(345) 678-9012',
          address: '789 Pine St',
          city: 'Chicago',
          zipCode: '60007',
          date: '2023-04-02',
          time: '18:45',
          total: 45.75,
          subtotal: 39.99,
          tax: 3.20,
          shipping: 2.56,
          status: 'Shipped',
          paymentMethod: 'Credit Card',
          paymentStatus: 'Paid',
          items: [
            {
              name: 'Veggie Burger',
              price: 9.99,
              quantity: 4,
              image: '/placeholder.svg?height=100&width=100'
            }
          ]
        },
        {
          id: '1004',
          customer: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '(456) 789-0123',
          address: '101 Maple Dr',
          city: 'Houston',
          zipCode: '77001',
          date: '2023-04-03',
          time: '10:20',
          total: 65.25,
          subtotal: 57.99,
          tax: 4.64,
          shipping: 2.62,
          status: 'Pending',
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
          items: [
            {
              name: 'Pepperoni Pizza',
              price: 13.99,
              quantity: 1,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Dragon Roll',
              price: 14.99,
              quantity: 2,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Strawberry Milkshake',
              price: 4.99,
              quantity: 3,
              image: '/placeholder.svg?height=100&width=100'
            }
          ]
        },
        {
          id: '1005',
          customer: 'Michael Brown',
          email: 'michael.brown@example.com',
          phone: '(567) 890-1234',
          address: '202 Cedar Ln',
          city: 'Miami',
          zipCode: '33101',
          date: '2023-04-03',
          time: '20:10',
          total: 32.99,
          subtotal: 28.99,
          tax: 2.32,
          shipping: 1.68,
          status: 'Cancelled',
          paymentMethod: 'Credit Card',
          paymentStatus: 'Refunded',
          items: [
            {
              name: 'Classic Burger',
              price: 8.99,
              quantity: 2,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Chocolate Brownie',
              price: 6.99,
              quantity: 1,
              image: '/placeholder.svg?height=100&width=100'
            },
            {
              name: 'Strawberry Milkshake',
              price: 4.99,
              quantity: 1,
              image: '/placeholder.svg?height=100&width=100'
            }
          ]
        }
      ])
      
      // Computed
      const filteredOrders = computed(() => {
        let result = [...orders.value]
        
        // Filter by search query
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          result = result.filter(order => 
            order.id.toLowerCase().includes(query) || 
            order.customer.toLowerCase().includes(query) ||
            order.email.toLowerCase().includes(query)
          )
        }
        
        // Filter by status
        if (selectedStatus.value) {
          result = result.filter(order => order.status === selectedStatus.value)
        }
        
        // Filter by date range
        if (dateRange.value !== 'all') {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          const thisWeekStart = new Date(today)
          thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
          
          const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          
          result = result.filter(order => {
            const orderDate = new Date(order.date)
            
            if (dateRange.value === 'today') {
              return orderDate.getTime() === today.getTime()
            } else if (dateRange.value === 'yesterday') {
              return orderDate.getTime() === yesterday.getTime()
            } else if (dateRange.value === 'week') {
              return orderDate >= thisWeekStart
            } else if (dateRange.value === 'month') {
              return orderDate >= thisMonthStart
            }
            
            return true
          })
        }
        
        // Sort by date (newest first)
        result.sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.time)
          const dateB = new Date(b.date + ' ' + b.time)
          return dateB - dateA
        })
        
        return result
      })
      
      // Methods
      const viewOrderDetails = (order) => {
        selectedOrder.value = { ...order }
        showOrderDetailsModal.value = true
      }
      
      const updateOrderStatus = (orderId, status) => {
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
          order.status = status
          
          // If viewing in modal, update the selected order too
          if (selectedOrder.value.id === orderId) {
            selectedOrder.value.status = status
          }
          
          // In a real app, this would make an API call to update the status
          console.log(`Order ${orderId} status updated to ${status}`)
        }
      }
      
      const printOrder = (orderId) => {
        // In a real app, this would generate a printable version of the order
        console.log(`Printing order ${orderId}`)
        alert(`Printing order #${orderId}`)
      }
      
      const exportOrders = () => {
        // In a real app, this would generate a CSV or PDF export
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
        exportOrders
      }
    }
  }
  </script>