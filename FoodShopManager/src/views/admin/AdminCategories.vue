<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Categories</h1>
      <button @click="showAddCategoryModal = true"
        class="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 flex items-center">
        <Plus class="h-5 w-5 mr-1" />
        Add Category
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input type="text" id="search" v-model="searchQuery" placeholder="Search categories..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
            <Search class="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
          </div>
        </div>

        <div class="w-full md:w-48">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" v-model="selectedStatus"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in filteredCategories" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img v-if="category.image" :src="category.image" :alt="category.name"
                      class="h-full w-full object-cover">
                    <Utensils v-else class="h-5 w-5 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                    <div class="text-xs text-gray-500">ID: {{ category._id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate">{{ category.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ category.productCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ category.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editCategory(category)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                  <Edit class="h-5 w-5" />
                </button>
          
                <button @click="deleteCategory(category._id)" class="text-red-600 hover:text-red-900"
                  :disabled="category.productCount > 0"
                  :class="{ 'opacity-50 cursor-not-allowed': category.productCount > 0 }"
                  :title="category.productCount > 0 ? 'Cannot delete category with products' : 'Delete Category'">
                  <Trash2 class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredCategories.length === 0" class="text-center py-12">
        <Utensils class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
        <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>

    <div v-if="showAddCategoryModal || showEditCategoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">{{ showEditCategoryModal ? 'Edit Category' : 'Add New Category' }}</h2>
        </div>

        <form @submit.prevent="showEditCategoryModal ? updateCategory() : addCategory()" class="p-4">
          <div class="mb-4">
            <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input type="text" id="categoryName" v-model="currentCategory.name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" required>
          </div>

          <div class="mb-4">
            <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="categoryDescription" v-model="currentCategory.description" rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"></textarea>
          </div>

          
          <div class="mb-4">
            <div class="flex items-center">
              <input type="checkbox" id="categoryStatus" v-model="currentCategory.isActive"
                class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded">
              <label for="categoryStatus" class="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeCategoryModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">
              {{ showEditCategoryModal ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Confirm Delete</h2>
        </div>

        <div class="p-4">
          <p class="text-gray-700 mb-4">Are you sure you want to delete this category? This action cannot be undone.</p>

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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Utensils,
} from 'lucide-vue-next';

export default {
  name: 'AdminCategories',
  components: {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Utensils,
  },
  setup() {

    const searchQuery = ref('');
    const selectedStatus = ref('');
    const showAddCategoryModal = ref(false);
    const showEditCategoryModal = ref(false);
    const showDeleteModal = ref(false);
    const categoryToDeleteId = ref(null);
    const categories = ref([]);

    
    const currentCategory = ref({
      name: '',
      description: '',
      image: '',
      isActive: true,
    });


    const filteredCategories = computed(() => {
      let result = [...categories.value];

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(category =>
          category.name.toLowerCase().includes(query) ||
          (category.description && category.description.toLowerCase().includes(query))
        );
      }

      if (selectedStatus.value) {
        result = result.filter(category => category.status === selectedStatus.value);
      }

      result.sort((a, b) => a.name.localeCompare(b.name));

      return result;
    });

   
    const resetCurrentCategory = () => {
      currentCategory.value = {
        name: '',
        description: '',
        isActive: true,
      };
    };

    const closeCategoryModal = () => {
      showAddCategoryModal.value = false;
      showEditCategoryModal.value = false;

      resetCurrentCategory();
    };

    const addCategory = async () => {
      try {
        const token = localStorage.getItem('token');

        await axios.post('http://localhost:3000/api/categories', {
          name: currentCategory.value.name,
          description: currentCategory.value.description,
          status: currentCategory.value.isActive ? 'active' : 'inactive'
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await fetchCategories();
        closeCategoryModal();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    };


    const editCategory = (category) => {
        currentCategory.value=category
        currentCategory.value.isActive = currentCategory.value.status === 'active'?true:false
        showEditCategoryModal.value = true;

    };

    const updateCategory = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3000/api/categories/${currentCategory.value._id}`, {
          name: currentCategory.value.name,
          description: currentCategory.value.description,
          status: currentCategory.value.isActive ? 'active' : 'inactive'
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await fetchCategories();
        closeCategoryModal();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    };

    const toggleCategoryStatus = async (category) => {
      try {
        const newStatus = category.status === 'active' ? 'inactive' : 'active';
        await axios.put(`http://localhost:5000/api/categories/update/${category.id}`, {
          name: category.name,
          description: category.description,
          status: newStatus,
        });
        await fetchCategories();
      } catch (error) {
        console.error('Error toggling category status:', error);
      }
    };

    const deleteCategory = (id) => {
      categoryToDeleteId.value = id;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        await axios.delete(`http://localhost:3000/api/categories/${categoryToDeleteId.value}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await fetchCategories();
        showDeleteModal.value = false;
        categoryToDeleteId.value = null;
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    };


    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    onMounted(async () => {
      await fetchCategories();
    });

    return {
      searchQuery,
      selectedStatus,
      categories,
      filteredCategories,
      showAddCategoryModal,
      showEditCategoryModal,
      showDeleteModal,
      currentCategory,
      addCategory,
      editCategory,
      updateCategory,
      toggleCategoryStatus,
      deleteCategory,
      confirmDelete,
      closeCategoryModal,
      
    };
  },
};
</script>