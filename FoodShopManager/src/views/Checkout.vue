<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6">
    <div class="bg-rose-600 text-white py-4 px-6">
      <h2 class="text-xl font-bold">Checkout</h2>
    </div>
    
    <div class="p-6">
      <!-- Order Summary -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 pb-2 border-b">Order Summary</h3>
        
        <div v-if="cartItems.length > 0">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center py-3 border-b">
            <img :src="`http://localhost:3000${item.image}`" :alt="item.name" class="w-16 h-16 object-cover rounded-md mr-4">
            
            <div class="flex-grow">
              <h4 class="font-medium">{{ item.name }}</h4>
              <p class="text-gray-500 text-sm">Quantity: {{ item.quantity }}</p>
            </div>
            
            <div class="text-right">
              <p class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Tax (8%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Delivery Fee</span>
              <span>${{ deliveryFee.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <ShoppingCart class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p class="text-gray-500 mb-4">Add some items to your cart to proceed with checkout.</p>
          <router-link to="/" class="inline-block bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700">
            Browse Menu
          </router-link>
        </div>
      </div>
      
      <!-- Checkout Form -->
      <div v-if="cartItems.length > 0">
        <h3 class="text-lg font-semibold mb-4 pb-2 border-b">Delivery Information</h3>
        
        <form @submit.prevent="placeOrder">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="firstName" class="block text-gray-700 font-medium mb-2">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="form.firstName" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div>
              <label for="lastName" class="block text-gray-700 font-medium mb-2">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="form.lastName" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div>
              <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div>
              <label for="phone" class="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div class="md:col-span-2">
              <label for="address" class="block text-gray-700 font-medium mb-2">Address</label>
              <input 
                type="text" 
                id="address" 
                v-model="form.address" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div>
              <label for="city" class="block text-gray-700 font-medium mb-2">City</label>
              <input 
                type="text" 
                id="city" 
                v-model="form.city" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
            
            <div>
              <label for="zipCode" class="block text-gray-700 font-medium mb-2">ZIP Code</label>
              <input 
                type="text" 
                id="zipCode" 
                v-model="form.zipCode" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                
              >
            </div>
          </div>
          
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b">Payment Method</h3>
          
          <div class="space-y-4 mb-6">
            <div class="flex items-center">
              <input 
                type="radio" 
                id="creditCard" 
                value="creditCard" 
                v-model="form.paymentMethod"
                class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                checked
              >
              <label for="creditCard" class="ml-2 block text-gray-700">
                Credit Card
              </label>
            </div>
            
            <div v-if="form.paymentMethod === 'creditCard'" class="pl-6 space-y-4">
              <div>
                <label for="cardNumber" class="block text-gray-700 font-medium mb-2">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  v-model="form.cardNumber" 
                  placeholder="XXXX XXXX XXXX XXXX" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  
                >
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="expiryDate" class="block text-gray-700 font-medium mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    id="expiryDate" 
                    v-model="form.expiryDate" 
                    placeholder="MM/YY" 
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    
                  >
                </div>
                
                <div>
                  <label for="cvv" class="block text-gray-700 font-medium mb-2">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    v-model="form.cvv" 
                    placeholder="XXX" 
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    
                  >
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <input 
                type="radio" 
                id="paypal" 
                value="paypal" 
                v-model="form.paymentMethod"
                class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
              >
              <label for="paypal" class="ml-2 block text-gray-700">
                PayPal
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                type="radio" 
                id="cashOnDelivery" 
                value="cashOnDelivery" 
                v-model="form.paymentMethod"
                class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
              >
              <label for="cashOnDelivery" class="ml-2 block text-gray-700">
                Cash on Delivery
              </label>
            </div>
          </div>
          
          <div class="flex items-center mb-6">
            <input 
              type="checkbox" 
              id="terms" 
              v-model="form.termsAccepted"
              class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              
            >
            <label for="terms" class="ml-2 block text-gray-700">
              I agree to the <a href="#" class="text-rose-600 hover:text-rose-800">Terms and Conditions</a>
            </label>
          </div>
          
          <div class="flex justify-between">
            <router-link to="/cart" class="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft class="h-5 w-5 mr-1" />
              Back to Cart
            </router-link>
            
            <button 
              type="submit" 
              class="bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              :disabled="loading"
            >
              <span v-if="loading">Processing...</span>
              <span v-else>Place Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Order Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check class="h-8 w-8 text-green-600" />
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p class="text-gray-600 mb-6">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-gray-700 font-medium">Order Number</p>
          <p class="text-xl font-bold text-rose-600">{{ orderNumber }}</p>
        </div>
        
        <button 
          @click="goToHome" 
          class="bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700 w-full"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, ArrowLeft, Check } from 'lucide-vue-next'
import axios from 'axios'

export default {
  name: 'Checkout',
  components: {
    ShoppingCart,
    ArrowLeft,
    Check
  },
  setup() {
    const router = useRouter()
    const cartItems = ref([])
    const loading = ref(false)
    const showSuccessModal = ref(false)
    const orderNumber = ref('')
    
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      paymentMethod: 'creditCard',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      termsAccepted: false
    })
    
    // Load cart items from localStorage
    onMounted(() => {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        cartItems.value = JSON.parse(storedCart)
      }
      
      // Pre-fill form with user data if available
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.email) {
        form.value.email = user.email
        form.value.firstName = user.name?.split(' ')[0] || ''
        form.value.lastName = user.name?.split(' ').slice(1).join(' ') || ''
      }
    })
    
    // Calculate totals
    const subtotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })
    
    const tax = computed(() => {
      return subtotal.value * 0.08 // 8% tax
    })
    
    const deliveryFee = computed(() => {
      return subtotal.value > 50 ? 0 : 5.99 // Free delivery for orders over $50
    })
    
    const total = computed(() => {
      return subtotal.value + tax.value + deliveryFee.value
    })
    
    // Place order
    const placeOrder = async () => {
      loading.value = true

      try {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || []
        const token = localStorage.getItem('token')
        
        const response = await axios.post(
          'http://localhost:3000/api/orders',
          { products: cartItems },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        

        orderNumber.value = response.data.orderId || 
          'ORD-' + Math.floor(100000 + Math.random() * 900000) // fallback nếu backend không trả

        localStorage.removeItem('cart')
        showSuccessModal.value = true
      } catch (error) {
        console.error('Error placing order:', error)
        alert('Có lỗi khi đặt hàng. Vui lòng thử lại.')
      } finally {
        loading.value = false
      }
    }

    
    const goToHome = () => {
      showSuccessModal.value = false
      router.push('/')
    }
    
    return {
      cartItems,
      form,
      loading,
      subtotal,
      tax,
      deliveryFee,
      total,
      showSuccessModal,
      orderNumber,
      placeOrder,
      goToHome
    }
  }
}
</script>