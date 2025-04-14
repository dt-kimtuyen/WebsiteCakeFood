<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
      <button @click="toggleEditMode" class="edit-btn">
        {{ isEditing ? 'Cancel' : 'Edit Profile' }}
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your profile...</p>
    </div>

    <div v-else class="profile-content">
      <!-- Thông tin người dùng -->
      <div class="profile-card">
        <div class="profile-summary">
          <div class="avatar-container">
            <img :src="user.avatar || 'https://via.placeholder.com/150'" alt="Avatar" class="avatar" />
            <div class="avatar-overlay" v-if="isEditing">
              <label for="avatarInput" class="avatar-upload-label">
                <span class="camera-icon">📷</span>
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                class="avatar-upload"
              />
            </div>
          </div>
          <div class="profile-info">
            <h2>{{ user.fullname || (user.firstName + ' ' + user.lastName) }}</h2>
            <p class="member-since">Member since {{ formatDate(user.createdAt) }}</p>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Thông tin cá nhân -->
      <div class="profile-card">
        <h3 class="section-title">Personal Information</h3>
        <div v-if="!isEditing" class="info-display">
          <div class="info-row">
            <span class="info-label">Full Name:</span>
            <span class="info-value">{{ user.fullname || (user.firstName + ' ' + user.lastName) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ user.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ user.phone || 'Not provided' }}</span>
          </div>
        </div>

        <form v-else class="edit-form" @submit.prevent="savePersonalInfo">
          <div class="form-row">
            <div class="form-group">
              <label for="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                v-model="editForm.fullname"
                class="form-input"
                required
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="editForm.email"
                class="form-input"
                required
              >
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                v-model="editForm.phone"
                class="form-input"
              >
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'ProfilePage',
  setup() {
    const user = ref({})
    const loading = ref(true)
    const isEditing = ref(false)

    const editForm = reactive({
      fullname: '',
      email: '',
      phone: '',
      avatar: ''
    })

    const fetchUserProfile = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (!storedUser) {
          alert('Bạn chưa đăng nhập!')
          return
        }

        user.value = storedUser

        Object.assign(editForm, {
          fullname: user.value.fullname || '',
          email: user.value.email || '',
          phone: user.value.phone || '',
          avatar: user.value.avatar || ''
        })

        loading.value = false
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error)
        loading.value = false
      }
    }

    const handleAvatarChange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        user.value.avatar = event.target.result
        editForm.avatar = event.target.result
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      reader.readAsDataURL(file)
    }

    const toggleEditMode = () => {
      if (isEditing.value) {
        Object.assign(editForm, {
          fullname: user.value.fullname || '',
          email: user.value.email || '',
          phone: user.value.phone || '',
          avatar: user.value.avatar || ''
        })
      }
      isEditing.value = !isEditing.value
    }

    const savePersonalInfo = () => {
      try {
        Object.assign(user.value, {
          fullname: editForm.fullname,
          email: editForm.email,
          phone: editForm.phone,
          avatar: editForm.avatar
        })

        localStorage.setItem('user', JSON.stringify(user.value))
        isEditing.value = false
        alert('Cập nhật thành công!')
      } catch (err) {
        console.error(err)
        alert('Lỗi khi lưu thông tin!')
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      user,
      loading,
      isEditing,
      editForm,
      toggleEditMode,
      savePersonalInfo,
      formatDate,
      handleAvatarChange
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-btn {
  padding: 0.5rem 1rem;
  background: #e5e7eb;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}
.loading-container {
  text-align: center;
  margin-top: 2rem;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.profile-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}
.profile-summary {
  display: flex;
  gap: 1rem;
}
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-upload-label {
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
}
.avatar-upload {
  display: none;
}
.profile-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.info-display .info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.save-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.save-btn:hover {
  background-color: #2563eb;
}
</style>
