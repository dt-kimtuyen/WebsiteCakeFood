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
        <!-- Profile Summary -->
        <div class="profile-card">
          <div class="profile-summary">
            <div class="avatar-container">
              <img :src="user.avatar || 'https://via.placeholder.com/150'" alt="Profile picture" class="avatar">
              <div v-if="isEditing" class="avatar-overlay">
                <label for="avatar-upload" class="avatar-upload-label">
                  <Camera class="camera-icon" />
                  <span class="sr-only">Upload new photo</span>
                </label>
                <input id="avatar-upload" type="file" class="avatar-upload" @change="handleAvatarChange">
              </div>
            </div>
            <div class="profile-info">
              <h2>{{ user.firstName }} {{ user.lastName }}</h2>
              <p class="member-since">Member since {{ formatDate(user.createdAt) }}</p>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>
        </div>
  
        <!-- Personal Information -->
        <div class="profile-card">
          <h3 class="section-title">Personal Information</h3>
          <div v-if="!isEditing" class="info-display">
            <div class="info-row">
              <span class="info-label">First Name:</span>
              <span class="info-value">{{ user.firstName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last Name:</span>
              <span class="info-value">{{ user.lastName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">{{ user.phone || 'Not provided' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">{{ user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided' }}</span>
            </div>
          </div>
          <form v-else class="edit-form" @submit.prevent="savePersonalInfo">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="editForm.firstName" 
                  class="form-input" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="editForm.lastName" 
                  class="form-input" 
                  required
                >
              </div>
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
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                v-model="editForm.dateOfBirth" 
                class="form-input"
              >
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
  
        <!-- Shipping Address -->
        <div class="profile-card">
          <h3 class="section-title">Shipping Address</h3>
          <div v-if="!isEditing" class="info-display">
            <div v-if="user.address">
              <div class="info-row">
                <span class="info-label">Street:</span>
                <span class="info-value">{{ user.address.street }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">City:</span>
                <span class="info-value">{{ user.address.city }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">State/Province:</span>
                <span class="info-value">{{ user.address.state }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Postal Code:</span>
                <span class="info-value">{{ user.address.postalCode }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Country:</span>
                <span class="info-value">{{ user.address.country }}</span>
              </div>
            </div>
            <div v-else class="empty-address">
              <p>No shipping address provided.</p>
            </div>
          </div>
          <form v-else class="edit-form" @submit.prevent="saveAddress">
            <div class="form-group">
              <label for="street">Street Address</label>
              <input 
                type="text" 
                id="street" 
                v-model="editForm.address.street" 
                class="form-input" 
                required
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="editForm.address.city" 
                  class="form-input" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="state">State/Province</label>
                <input 
                  type="text" 
                  id="state" 
                  v-model="editForm.address.state" 
                  class="form-input" 
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  v-model="editForm.address.postalCode" 
                  class="form-input" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  v-model="editForm.address.country" 
                  class="form-input" 
                  required
                >
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">Save Address</button>
            </div>
          </form>
        </div>
  
        <!-- Password Change -->
        <div class="profile-card">
          <h3 class="section-title">Change Password</h3>
          <form class="edit-form" @submit.prevent="changePassword">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                class="form-input" 
                required
              >
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                class="form-input" 
                required
                minlength="8"
              >
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                class="form-input" 
                required
              >
              <p v-if="passwordMismatch" class="error-message">Passwords do not match</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn">Update Password</button>
            </div>
          </form>
        </div>
  
        <!-- Preferences -->
        <div class="profile-card">
          <h3 class="section-title">Preferences</h3>
          <div class="preferences-section">
            <div class="preference-item">
              <div class="preference-info">
                <h4>Email Notifications</h4>
                <p>Receive emails about your orders, account updates, and promotions</p>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="preferences.emailNotifications">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <div class="preference-info">
                <h4>SMS Notifications</h4>
                <p>Receive text messages about your orders and delivery updates</p>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="preferences.smsNotifications">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <div class="preference-info">
                <h4>Newsletter</h4>
                <p>Subscribe to our newsletter for the latest products and deals</p>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="preferences.newsletter">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="form-actions">
              <button @click="savePreferences" class="save-btn">Save Preferences</button>
            </div>
          </div>
        </div>
  
        <!-- Danger Zone -->
        <div class="profile-card danger-zone">
          <h3 class="section-title">Account Actions</h3>
          <div class="danger-actions">
            <div class="danger-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button @click="confirmDeleteAccount" class="delete-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Camera } from 'lucide-vue-next';
  
  export default {
    name: 'ProfilePage',
    components: {
      Camera
    },
    setup() {
      const loading = ref(true);
      const isEditing = ref(false);
      const passwordMismatch = ref(false);
      const user = ref({});
      
      // Form for editing profile
      const editForm = reactive({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      });
      
      // Form for changing password
      const passwordForm = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // User preferences
      const preferences = reactive({
        emailNotifications: true,
        smsNotifications: false,
        newsletter: true
      });
      
      // Fetch user profile
      const fetchUserProfile = async () => {
        try {
          // In a real app, you would fetch from your API
          // const response = await fetch('/api/profile');
          // user.value = await response.json();
          
          // Mock data for demonstration
          setTimeout(() => {
            user.value = {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+1 (555) 123-4567',
              dateOfBirth: '1990-05-15',
              avatar: 'https://via.placeholder.com/150',
              createdAt: '2022-03-10T08:15:30',
              address: {
                street: '123 Main Street',
                city: 'Anytown',
                state: 'CA',
                postalCode: '12345',
                country: 'United States'
              }
            };
            
            // Initialize edit form with user data
            Object.assign(editForm, {
              firstName: user.value.firstName,
              lastName: user.value.lastName,
              email: user.value.email,
              phone: user.value.phone || '',
              dateOfBirth: user.value.dateOfBirth || '',
              address: {
                street: user.value.address?.street || '',
                city: user.value.address?.city || '',
                state: user.value.address?.state || '',
                postalCode: user.value.address?.postalCode || '',
                country: user.value.address?.country || ''
              }
            });
            
            loading.value = false;
          }, 1000);
        } catch (error) {
          console.error('Error fetching profile:', error);
          loading.value = false;
        }
      };
      
      // Toggle edit mode
      const toggleEditMode = () => {
        if (isEditing.value) {
          // Reset form to original values if canceling
          Object.assign(editForm, {
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            email: user.value.email,
            phone: user.value.phone || '',
            dateOfBirth: user.value.dateOfBirth || '',
            address: {
              street: user.value.address?.street || '',
              city: user.value.address?.city || '',
              state: user.value.address?.state || '',
              postalCode: user.value.address?.postalCode || '',
              country: user.value.address?.country || ''
            }
          });
        }
        isEditing.value = !isEditing.value;
      };
      
      // Save personal information
      const savePersonalInfo = async () => {
        try {
          // In a real app, you would send to your API
          // await fetch('/api/profile', {
          //   method: 'PUT',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(editForm)
          // });
          
          // Update local user object
          Object.assign(user.value, {
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            email: editForm.email,
            phone: editForm.phone,
            dateOfBirth: editForm.dateOfBirth
          });
          
          // Exit edit mode
          isEditing.value = false;
          
          console.log('Personal info saved:', editForm);
          alert('Personal information updated successfully!');
        } catch (error) {
          console.error('Error saving profile:', error);
          alert('Failed to update personal information. Please try again.');
        }
      };
      
      // Save address
      const saveAddress = async () => {
        try {
          // In a real app, you would send to your API
          // await fetch('/api/profile/address', {
          //   method: 'PUT',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(editForm.address)
          // });
          
          // Update local user object
          user.value.address = { ...editForm.address };
          
          console.log('Address saved:', editForm.address);
          alert('Address updated successfully!');
        } catch (error) {
          console.error('Error saving address:', error);
          alert('Failed to update address. Please try again.');
        }
      };
      
      // Change password
      const changePassword = async () => {
        // Check if passwords match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          passwordMismatch.value = true;
          return;
        }
        
        passwordMismatch.value = false;
        
        try {
          // In a real app, you would send to your API
          // await fetch('/api/profile/password', {
          //   method: 'PUT',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     currentPassword: passwordForm.currentPassword,
          //     newPassword: passwordForm.newPassword
          //   })
          // });
          
          // Reset password form
          passwordForm.currentPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
          
          console.log('Password changed');
          alert('Password changed successfully!');
        } catch (error) {
          console.error('Error changing password:', error);
          alert('Failed to change password. Please check your current password and try again.');
        }
      };
      
      // Save preferences
      const savePreferences = async () => {
        try {
          // In a real app, you would send to your API
          // await fetch('/api/profile/preferences', {
          //   method: 'PUT',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(preferences)
          // });
          
          console.log('Preferences saved:', preferences);
          alert('Preferences updated successfully!');
        } catch (error) {
          console.error('Error saving preferences:', error);
          alert('Failed to update preferences. Please try again.');
        }
      };
      
      // Handle avatar change
      const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // In a real app, you would upload the file to your server
        // For demo purposes, we'll just create a local URL
        const reader = new FileReader();
        reader.onload = (e) => {
          user.value.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
        
        console.log('Avatar changed');
      };
      
      // Confirm account deletion
      const confirmDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          deleteAccount();
        }
      };
      
      // Delete account
      const deleteAccount = async () => {
        try {
          // In a real app, you would send to your API
          // await fetch('/api/profile', {
          //   method: 'DELETE'
          // });
          
          console.log('Account deleted');
          alert('Your account has been deleted. You will be logged out.');
          // In a real app, you would redirect to logout
          // router.push('/logout');
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      };
      
      // Format date
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      
      onMounted(() => {
        fetchUserProfile();
      });
      
      return {
        user,
        loading,
        isEditing,
        editForm,
        passwordForm,
        passwordMismatch,
        preferences,
        toggleEditMode,
        savePersonalInfo,
        saveAddress,
        changePassword,
        savePreferences,
        handleAvatarChange,
        confirmDeleteAccount,
        formatDate
      };
    }
  }
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .profile-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .edit-btn {
    padding: 0.5rem 1.25rem;
    background-color: #f3f4f6;
    color: #4b5563;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .edit-btn:hover {
    background-color: #e5e7eb;
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
  
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .profile-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .profile-summary {
    display: flex;
    align-items: center;
    gap: 1.5rem;
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
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .avatar-upload-label {
    cursor: pointer;
  }
  
  .camera-icon {
    color: white;
    width: 24px;
    height: 24px;
  }
  
  .avatar-upload {
    display: none;
  }
  
  .profile-info h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #111827;
  }
  
  .member-since {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
  }
  
  .email {
    color: #4b5563;
    margin: 0;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1.25rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .info-display {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .info-label {
    font-weight: 500;
    color: #4b5563;
    min-width: 120px;
  }
  
  .info-value {
    color: #111827;
    flex: 1;
  }
  
  .empty-address {
    color: #6b7280;
    font-style: italic;
  }
  
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    min-width: 250px;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
  }
  
  .form-input {
    padding: 0.625rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
  
  .save-btn {
    padding: 0.5rem 1.25rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .save-btn:hover {
    background-color: #2563eb;
  }
  
  .error-message {
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .preferences-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .preference-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .preference-item:last-of-type {
    border-bottom: none;
  }
  
  .preference-info h4 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    color: #111827;
  }
  
  .preference-info p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
  
  .toggle {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }
  
  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .4s;
    border-radius: 24px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: #3b82f6;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(24px);
  }
  
  .danger-zone {
    border-color: #fee2e2;
  }
  
  .danger-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .danger-info h4 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
    color: #b91c1c;
  }
  
  .danger-info p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    max-width: 500px;
  }
  
  .delete-btn {
    padding: 0.5rem 1.25rem;
    background-color: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .delete-btn:hover {
    background-color: #fecaca;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .profile-summary {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .danger-actions {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .delete-btn {
      align-self: flex-end;
    }
  }
  
  @media (max-width: 640px) {
    .profile-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .edit-btn {
      width: 100%;
    }
    
    .form-row {
      flex-direction: column;
    }
    
    .form-group {
      min-width: 100%;
    }
  }
  </style>