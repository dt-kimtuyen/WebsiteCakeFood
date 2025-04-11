
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý sản phẩm</h1>
      <button @click="showAddProductModal = true"
        class="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 flex items-center">
        <!-- <Plus class="h-5 w-5 mr-1" /> -->
        Add Product
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input type="text" id="search" v-model="searchQuery" placeholder="Search products..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
            <Search class="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
          </div>
        </div>

        <div class="w-full md:w-48">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" v-model="selectedCategory"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="w-full md:w-48">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select id="sort" v-model="sortBy"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="`http://localhost:3000${product.image}`" :alt="product.name" class="w-10 h-10 object-cover rounded-md mr-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                  {{ getCategoryName(product.categoryId) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.price.toFixed(2) }}</td>
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <Edit class="h-5 w-5" />Sửa
                </button>
                <button @click="deleteProduct(product._id)" class="text-red-600 hover:text-red-900">
                  <Trash2 class="h-5 w-5" />Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <Package class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddProductModal || showEditProductModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">{{ showEditProductModal ? 'Edit Product' : 'Add New Product' }}</h2>
        </div>

        <form @submit.prevent="submitProduct" class="p-4">
          <div class="mb-4">
            <label for="productName" class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" id="productName" v-model="currentProduct.name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required>
          </div>

          <div class="mb-4">
            <label for="productDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="productDescription" v-model="currentProduct.description" rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required></textarea>
          </div>

          <div class="mb-4">
            <label for="productPrice" class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" id="productPrice" v-model="currentProduct.price" step="0.01" min="0"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required>
          </div>

          <div class="mb-4">
            <label for="productCategory" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="productCategory" v-model="currentProduct.categoryId"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="productImage" class="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

          </div>


          <div class="mb-4">
            <div class="flex items-center">
              <input type="checkbox" id="productInStock" v-model="currentProduct.inStock"
                class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="productInStock" class="ml-2 block text-sm text-gray-700">
                In Stock
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeProductModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">
              {{ showEditProductModal ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Confirm Delete</h2>
        </div>

        <div class="p-4">
          <p class="text-gray-700 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>

          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Edit,Trash2 } from 'lucide-vue-next'


export default {
  components: {
    Edit,
    Trash2,
 
  },
  setup() {
    
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('name')

    const categories = ref([])
    const products = ref([])

    const showAddProductModal = ref(false)
    const showEditProductModal = ref(false)
    const showDeleteModal = ref(false)
    const productToDeleteId = ref(null)

    const selectedFile = ref(null)

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0]
      console.log(selectedFile)
    }

    const submitProduct = async () => {
      const formData = new FormData()

      // Thêm các trường sản phẩm vào formData
      formData.append('name', currentProduct.value.name)
      formData.append('description', currentProduct.value.description)
      formData.append('price', currentProduct.value.price)
      formData.append('categoryId', currentProduct.value.categoryId)
      console.log(selectedFile.value)
      formData.append('image', selectedFile.value)
    
      const token = localStorage.getItem('token')

      try {
        const url = showEditProductModal.value
          ? `http://localhost:3000/api/products/${currentProduct.value._id}`
          : 'http://localhost:3000/api/products'

        const method = showEditProductModal.value ? 'put' : 'post'

        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        console.log('Thành công:', response.data)
        closeProductModal()
        fetchProducts() // reload danh sách
      } catch (err) {
        console.error('Lỗi gửi form:', err)
      }
    }


    // Fetch data from API
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categories')
        categories.value = res.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/products')
        products.value = res.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    onMounted(() => {
      fetchCategories()
      fetchProducts()
    })

    // Rest of your code: computed, methods...


    // Current product for add/edit
    const currentProduct = ref({
      name: '',
      description: '',
      price: 0,
      image: '/placeholder.svg?height=300&width=400',
      categoryId: 1,
      inStock: true
    })

    // Computed
    const filteredProducts = computed(() => {
      let result = [...products.value]

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      }

      // Filter by category
      if (selectedCategory.value) {
        result = result.filter(product => product.categoryId === selectedCategory.value)
      }

      // Sort
      result.sort((a, b) => {
        if (sortBy.value === 'name') {
          return a.name.localeCompare(b.name)
        } else if (sortBy.value === 'price') {
          return a.price - b.price
        } else if (sortBy.value === 'category') {
          return a.categoryId - b.categoryId
        }
        return 0
      })

      return result
    })

    // Methods
    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c._id === categoryId)
      return category ? category.name : ''
    }

    const resetCurrentProduct = () => {
      currentProduct.value = {
        name: '',
        description: '',
        price: 0,
        image: '/placeholder.svg?height=300&width=400',
        categoryId: 1,
        inStock: true
      }
    }

    const closeProductModal = () => {
      showAddProductModal.value = false
      showEditProductModal.value = false
      resetCurrentProduct()
    }

    const addProduct = async () => {
      // Generate a new ID (trong thực tế ID thường được backend tạo)
      const newId = Math.max(...products.value.map(p => p.id)) + 1

      // Thêm sản phẩm mới vào danh sách tạm thời (có thể không cần nếu dùng dữ liệu từ response)
      products.value.push({
        ...currentProduct.value,
        id: newId
      })

      try {
        const token = localStorage.getItem('token') 

        const res = await axios.post(
          'http://localhost:3000/api/products',
          currentProduct.value,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        products.value.push(res.data) // Thêm sản phẩm trả về từ server (có id thật)
        closeProductModal()
      } catch (error) {
        console.error('Failed to add product:', error)
      }
    }


    const editProduct = (product) => {
      // Clone the product to avoid direct mutation
      currentProduct.value = { ...product }
      showEditProductModal.value = true
    }

    const token = localStorage.getItem('token') // hoặc lấy từ nơi lưu token

const updateProduct = async () => {
  try {
    await axios.put(
      `http://localhost:3000/api/products/${currentProduct.value._id}`, // nhớ dùng _id
      {
        name: currentProduct.value.name,
        price: currentProduct.value.price,
        description: currentProduct.value.description,
        // thêm các field khác nếu có
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Cập nhật lại trong danh sách
    const index = products.value.findIndex(p => p._id === currentProduct.value._id)
    if (index !== -1) {
      products.value[index] = { ...currentProduct.value }
    }

    // Đóng modal
    closeProductModal()
  } catch (error) {
    console.error('Cập nhật thất bại:', error)
    alert('Cập nhật sản phẩm thất bại!')
  }
}

    const deleteProduct = (id) => {
  productToDeleteId.value = id
  showDeleteModal.value = true
}


const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/products/${productToDeleteId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    products.value = products.value.filter(p => p._id !== productToDeleteId.value)

    showDeleteModal.value = false
    productToDeleteId.value = null
  } catch (error) {
    console.error('Xóa sản phẩm thất bại:', error)
    alert('Xóa sản phẩm thất bại!')
  }

}
    return {
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      filteredProducts,
      showAddProductModal,
      showEditProductModal,
      showDeleteModal,
      currentProduct,
      getCategoryName,
      addProduct,
      editProduct,
      updateProduct,
      deleteProduct,
      confirmDelete,
      closeProductModal,
      handleFileChange,
      submitProduct
    }
  }
}
</script>