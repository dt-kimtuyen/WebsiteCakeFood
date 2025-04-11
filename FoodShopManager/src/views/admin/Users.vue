<template>
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Manage Users</h1>
        <button 
          @click="showAddUserModal = true" 
          class="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 flex items-center"
        >
          <Plus class="h-5 w-5 mr-1" />
          Add User
        </button>
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
                placeholder="Search users..." 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
              <Search class="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
            </div>
          </div>
          
          <div class="w-full md:w-48">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              id="role" 
              v-model="selectedRole" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div class="w-full md:w-48">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              id="status" 
              v-model="selectedStatus" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                     #
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                      <div class="text-sm text-gray-500">ID: {{ user._id }}</div>
                    </div>
                  </div>
                </td>
            
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role.name === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                  >
                    {{ user.role.name === 'admin' ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.joinedDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editUser(user)" 
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit class="h-5 w-5" />
                  </button>
                  <button 
                    @click="toggleUserStatus(user)" 
                    class="text-gray-600 hover:text-gray-900 mr-3"
                    :title="user.status === 'active' ? 'Deactivate User' : 'Activate User'"
                  >
                    <template v-if="user.status === 'active'">
                      <UserX class="h-5 w-5" />
                    </template>
                    <template v-else>
                      <UserCheck class="h-5 w-5" />
                    </template>
                  </button>
                  <button 
                    @click="deleteUser(user._id)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <Users class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
          <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>
      
      <!-- Add/Edit User Modal -->
      <div v-if="showAddUserModal || showEditUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-4 border-b">
            <h2 class="text-lg font-semibold">{{ showEditUserModal ? 'Edit User' : 'Add New User' }}</h2>
          </div>
          
          <form @submit.prevent="showEditUserModal ? updateUser() : addUser()" class="p-4">
            <div class="mb-4">
              <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">User name</label>
              <input 
                type="text" 
                id="userName" 
                v-model="currentUser.name" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
            </div>
            

            
            <div class="mb-4">
              <label for="userPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ showEditUserModal ? 'New Password (leave blank to keep current)' : 'Password' }}
              </label>
              <input 
                type="password" 
                id="userPassword" 
                v-model="currentUser.password" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                :required="!showEditUserModal"
              >
            </div>
            
            <div class="mb-4">
              <label for="userRole" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                id="userRole" 
                v-model="currentUser.role" 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div class="mb-4">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="userStatus" 
                  v-model="currentUser.isActive"
                  class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                >
                <label for="userStatus" class="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                @click="closeUserModal" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
              >
                {{ showEditUserModal ? 'Update' : 'Add' }}
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
            <p class="text-gray-700 mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
            
            <div class="flex justify-end gap-3">
              <button 
                @click="showDeleteModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                @click="confirmDelete" 
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
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
  import {
    Search,
    Plus,
    Edit,
    Trash2,
    UserX,
    UserCheck,
    Users
  } from 'lucide-vue-next'
  
  export default {
    name: 'AdminUsers',
    components: {
      Search,
      Plus,
      Edit,
      Trash2,
      UserX,
      UserCheck,
      Users
    },
    setup() {
      const searchQuery = ref('')
      const selectedRole = ref('')
      const selectedStatus = ref('')
      const showAddUserModal = ref(false)
      const showEditUserModal = ref(false)
      const showDeleteModal = ref(false)
      const userToDeleteId = ref(null)
      const users = ref([])
      const isLoading = ref(false)
  
      const currentUser = ref({
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
      })
  
      const fetchUsers = async () => {
        try {
          isLoading.value = true
          const token = localStorage.getItem('token')
          const response = await axios.get('http://localhost:3000/api/users/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          users.value = response.data.users
        } catch (error) {
          console.error('Error fetching users:', error)
        } finally {
          isLoading.value = false
        }
      }
  
      onMounted(() => {
        fetchUsers()
      })
  
      const filteredUsers = computed(() => {
        let result = [...users.value]
        const query = searchQuery.value.toLowerCase()
        if (query) {
          result = result.filter(
            user =>
              user.username.toLowerCase().includes(query) ||
              user._id.toLowerCase().includes(query)
          )
        }
        if (selectedRole.value) {
          result = result.filter(user => user.role.name === selectedRole.value)
        }
        if (selectedStatus.value) {
          result = result.filter(user => user.status === selectedStatus.value)
        }
        return result
      })
  
      const resetCurrentUser = () => {
        currentUser.value = {
          name: '',
          email: '',
          password: '',
          role: 'user',
          isActive: true
        }
      }
  
      const closeUserModal = () => {
        showAddUserModal.value = false
        showEditUserModal.value = false
        resetCurrentUser()
      }
  
      const addUser = async () => {
      
        try {
          const token = localStorage.getItem('token')
          await axios.post(
            'http://localhost:3000/api/users/register',
            {
              username: currentUser.value.name,
              password: currentUser.value.password,
              role: currentUser.value.role,
              status: currentUser.value.isActive ? 'active' : 'inactive'
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          await fetchUsers()
          closeUserModal()
        } catch (error) {
          console.error('Error adding user:', error)
        }
      }
  
      const editUser = user => {
        currentUser.value = {
          id: user._id,
          name: user.username,
          password: '',
          role: user.role.name,
          isActive: user.status === 'active'
        }
        showEditUserModal.value = true
      }
      
      const updateUser = async () => {
        console.log(currentUser.value.id)
        try {
          const token = localStorage.getItem('token')
          await axios.put(
            `http://localhost:3000/api/users/${currentUser.value.id}`,
            {
              username: currentUser.value.name,
              rolee: currentUser.value.role,
              password: currentUser.value.password,
              status: currentUser.value.isActive ? 'active' : 'inactive'
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          await fetchUsers()
          closeUserModal()
        } catch (error) {
          console.error('Error updating user:', error)
        }
      }
  
      const toggleUserStatus = async user => {
        try {
          const token = localStorage.getItem('token')
          const newStatus = user.status === 'active' ? 'inactive' : 'active'
          await axios.patch(
            `http://localhost:3000/api/users/${user.id}/status`,
            { status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          await fetchUsers()
        } catch (error) {
          console.error('Error toggling user status:', error)
        }
      }
  
      const deleteUser = id => {
        userToDeleteId.value = id
        showDeleteModal.value = true
      }
  
      const confirmDelete = async () => {
        try {
          const token = localStorage.getItem('token')
          await axios.delete(`http://localhost:3000/api/users/${userToDeleteId.value}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          await fetchUsers()
          showDeleteModal.value = false
          userToDeleteId.value = null
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
  
      return {
        searchQuery,
        selectedRole,
        selectedStatus,
        users,
        filteredUsers,
        showAddUserModal,
        showEditUserModal,
        showDeleteModal,
        currentUser,
        isLoading,
        addUser,
        editUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        confirmDelete,
        closeUserModal
      }
    }
  }
  </script>
  