<template>
    <div class="orders-container">
      <div class="orders-header">
        <h1>My Orders</h1>
        <div class="filters">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select v-model="sortBy" class="filter-select">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Highest Amount</option>
            <option value="total-asc">Lowest Amount</option>
          </select>
        </div>
      </div>
  
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
  
      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <ShoppingBag class="icon" />
        </div>
        <h2>No orders found</h2>
        <p v-if="statusFilter !== 'all'">Try changing your filter or check back later.</p>
        <p v-else>You haven't placed any orders yet.</p>
        <router-link to="/" class="shop-now-btn">Shop Now</router-link>
      </div>
  
      <div v-else class="orders-list">
        <div v-for="order in paginatedOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div>
              <span class="order-number">Order #{{ order.orderNumber }}</span>
              <span class="order-date">{{ formatDate(order.orderDate) }}</span>
            </div>
            <div class="order-status" :class="'status-' + order.status.toLowerCase()">
              {{ capitalizeFirstLetter(order.status) }}
            </div>
          </div>
  
          <div class="order-items">
            <div v-for="(item, index) in order.items" :key="index" class="order-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-variant">{{ item.variant }}</p>
                <div class="item-quantity-price">
                  <span>Qty: {{ item.quantity }}</span>
                  <span>${{ item.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="order-footer">
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ calculateSubtotal(order).toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>${{ order.shipping.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>${{ order.tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="order-actions">
              <button class="action-btn details-btn" @click="viewOrderDetails(order.id)">
                View Details
              </button>
              <button 
                v-if="order.status.toLowerCase() === 'delivered'" 
                class="action-btn review-btn"
                @click="leaveReview(order.id)"
              >
                Leave Review
              </button>
              <button 
                v-if="canCancelOrder(order)" 
                class="action-btn cancel-btn"
                @click="cancelOrder(order.id)"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
  
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            :disabled="currentPage === 1" 
            @click="currentPage--" 
            class="pagination-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            :disabled="currentPage === totalPages" 
            @click="currentPage++" 
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { ShoppingBag } from 'lucide-vue-next';
  
  export default {
    name: 'OrderPage',
    components: {
      ShoppingBag
    },
    setup() {
      const orders = ref([]);
      const loading = ref(true);
      const statusFilter = ref('all');
      const sortBy = ref('date-desc');
      const currentPage = ref(1);
      const ordersPerPage = 3;
  
      // Fetch orders from API
      const fetchOrders = async () => {
        try {
          // In a real app, you would fetch from your API
          // const response = await fetch('/api/orders');
          // orders.value = await response.json();
          
          // Mock data for demonstration
          setTimeout(() => {
            orders.value = [
              {
                id: 1,
                orderNumber: '10045',
                orderDate: '2023-11-15T14:30:00',
                status: 'delivered',
                items: [
                  {
                    name: 'Wireless Headphones',
                    variant: 'Black',
                    quantity: 1,
                    price: 129.99,
                    image: 'https://via.placeholder.com/80'
                  },
                  {
                    name: 'Smartphone Case',
                    variant: 'Clear',
                    quantity: 2,
                    price: 19.99,
                    image: 'https://via.placeholder.com/80'
                  }
                ],
                shipping: 5.99,
                tax: 15.60,
                total: 191.56
              },
              {
                id: 2,
                orderNumber: '10046',
                orderDate: '2023-12-02T09:15:00',
                status: 'shipped',
                items: [
                  {
                    name: 'Smart Watch',
                    variant: 'Silver',
                    quantity: 1,
                    price: 249.99,
                    image: 'https://via.placeholder.com/80'
                  }
                ],
                shipping: 0,
                tax: 25.00,
                total: 274.99
              },
              {
                id: 3,
                orderNumber: '10047',
                orderDate: '2023-12-10T16:45:00',
                status: 'processing',
                items: [
                  {
                    name: 'Bluetooth Speaker',
                    variant: 'Red',
                    quantity: 1,
                    price: 79.99,
                    image: 'https://via.placeholder.com/80'
                  },
                  {
                    name: 'USB-C Cable',
                    variant: '6ft',
                    quantity: 3,
                    price: 12.99,
                    image: 'https://via.placeholder.com/80'
                  },
                  {
                    name: 'Wireless Charger',
                    variant: 'White',
                    quantity: 1,
                    price: 34.99,
                    image: 'https://via.placeholder.com/80'
                  }
                ],
                shipping: 7.99,
                tax: 17.60,
                total: 193.55
              },
              {
                id: 4,
                orderNumber: '10048',
                orderDate: '2023-12-15T11:30:00',
                status: 'pending',
                items: [
                  {
                    name: 'Laptop Sleeve',
                    variant: '15-inch',
                    quantity: 1,
                    price: 29.99,
                    image: 'https://via.placeholder.com/80'
                  }
                ],
                shipping: 4.99,
                tax: 3.50,
                total: 38.48
              }
            ];
            loading.value = false;
          }, 1000);
        } catch (error) {
          console.error('Error fetching orders:', error);
          loading.value = false;
        }
      };
  
      // Filter and sort orders
      const filteredOrders = computed(() => {
        let result = [...orders.value];
        
        // Apply status filter
        if (statusFilter.value !== 'all') {
          result = result.filter(order => order.status.toLowerCase() === statusFilter.value);
        }
        
        // Apply sorting
        switch (sortBy.value) {
          case 'date-desc':
            result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            break;
          case 'date-asc':
            result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            break;
          case 'total-desc':
            result.sort((a, b) => b.total - a.total);
            break;
          case 'total-asc':
            result.sort((a, b) => a.total - b.total);
            break;
        }
        
        return result;
      });
  
      // Pagination
      const totalPages = computed(() => {
        return Math.ceil(filteredOrders.value.length / ordersPerPage);
      });
  
      const paginatedOrders = computed(() => {
        const startIndex = (currentPage.value - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        return filteredOrders.value.slice(startIndex, endIndex);
      });
  
      // Reset to page 1 when filters change
      const resetPagination = () => {
        currentPage.value = 1;
      };
  
      // Watch for filter changes
      watch([statusFilter, sortBy], () => {
        resetPagination();
      });
  
      // Helper functions
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  
      const calculateSubtotal = (order) => {
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      };
  
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
  
      const canCancelOrder = (order) => {
        return ['pending', 'processing'].includes(order.status.toLowerCase());
      };
  
      // Action handlers
      const viewOrderDetails = (orderId) => {
        // In a real app, navigate to order details page
        console.log('View details for order:', orderId);
        // router.push(`/order/${orderId}`);
      };
  
      const leaveReview = (orderId) => {
        console.log('Leave review for order:', orderId);
        // Implement review functionality
      };
  
      const cancelOrder = (orderId) => {
        console.log('Cancel order:', orderId);
        // Implement cancel functionality
        // After API call, refresh orders
      };
  
      onMounted(() => {
        fetchOrders();
      });
  
      return {
        orders,
        loading,
        statusFilter,
        sortBy,
        currentPage,
        filteredOrders,
        paginatedOrders,
        totalPages,
        formatDate,
        calculateSubtotal,
        capitalizeFirstLetter,
        canCancelOrder,
        viewOrderDetails,
        leaveReview,
        cancelOrder
      };
    }
  }
  </script>
  
  <style scoped>
  .orders-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .orders-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .orders-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .filters {
    display: flex;
    gap: 0.75rem;
  }
  
  .filter-select {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3b82f6;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 0;
    color: #6b7280;
  }
  
  .empty-icon {
    margin-bottom: 1rem;
  }
  
  .empty-icon .icon {
    width: 64px;
    height: 64px;
    color: #9ca3af;
  }
  
  .empty-state h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #4b5563;
  }
  
  .shop-now-btn {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .shop-now-btn:hover {
    background-color: #2563eb;
  }
  
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .order-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .order-number {
    font-weight: 600;
    color: #111827;
    margin-right: 1rem;
  }
  
  .order-date {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .order-status {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-processing {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .status-shipped {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .status-delivered {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-cancelled {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .order-items {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .order-item {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .order-item:last-child {
    border-bottom: none;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-details h3 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    color: #111827;
  }
  
  .item-variant {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .item-quantity-price {
    display: flex;
    justify-content: space-between;
    color: #4b5563;
    font-size: 0.875rem;
  }
  
  .order-footer {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
  }
  
  .order-summary {
    flex: 1;
    min-width: 200px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .summary-row.total {
    font-weight: 600;
    color: #111827;
    font-size: 1rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .order-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: flex-end;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
  }
  
  .details-btn {
    background-color: #f3f4f6;
    color: #4b5563;
  }
  
  .details-btn:hover {
    background-color: #e5e7eb;
  }
  
  .review-btn {
    background-color: #eff6ff;
    color: #1d4ed8;
  }
  
  .review-btn:hover {
    background-color: #dbeafe;
  }
  
  .cancel-btn {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .cancel-btn:hover {
    background-color: #fecaca;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .pagination-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    background-color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .orders-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .order-footer {
      flex-direction: column;
    }
    
    .order-actions {
      width: 100%;
    }
    
    .action-btn {
      flex: 1;
      text-align: center;
    }
  }
  
  @media (max-width: 640px) {
    .filters {
      width: 100%;
      flex-direction: column;
    }
    
    .filter-select {
      width: 100%;
    }
    
    .order-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .order-status {
      align-self: flex-start;
    }
  }
  </style>