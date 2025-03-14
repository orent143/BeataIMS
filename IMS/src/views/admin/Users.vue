<template>
  <Header />
  <sidebar />
  <div class="app-container">
    <div class="dashboard-container">  
      <div class="user-management-container">
        <h2>User Management</h2>

        <!-- Add User Form -->
        <div class="add-user-form">
          <h3>Add New User</h3>
          <form @submit.prevent="addUser" enctype="multipart/form-data">
            <input v-model="newUser.username" type="text" placeholder="Username" required />
            <input v-model="newUser.password" type="password" placeholder="Password" required />
            <select v-model="newUser.role" required>
              <option value="admin">Admin</option>
              <option value="cafe_staff">Cafe Staff</option>
            </select>
            <input type="file" @change="handleFileUpload" />
            <button type="submit">Add User</button>
          </form>
        </div>

        <!-- Notification -->
        <div v-if="showNotification" class="notification">
          User added successfully!
        </div>

        <!-- User List Table -->
        <table class="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Profile Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
              <td>
                <img v-if="user.profile_pic" :src="user.profile_pic" alt="Profile Picture" class="profile-pic" />
                <span v-else>No Image</span>
              </td>
              <td>
                <button @click="toggleStatus(user)">Toggle Status</button>
                <button @click="viewUserDetails(user)">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- User Details Modal -->
        <div v-if="selectedUser" class="user-details-modal">
          <div class="modal-content">
            <h3>User Details</h3>
            <p><strong>Username:</strong> {{ selectedUser.username }}</p>
            <p><strong>Role:</strong> {{ selectedUser.role }}</p>
            <img v-if="selectedUser.profile_pic" :src="selectedUser.profile_pic" alt="Profile Picture" class="profile-pic" />
            <button @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import sidebar from '@/components/admin/sidebar.vue';
import Header from '@/components/Header.vue';
import { useToast } from "vue-toastification";

export default {
  name: 'UserManagement',
  components: {
    sidebar,
    Header
  },
  data() {
    return {
      searchQuery: '',
      selectedUser: null,
      users: [],
      newUser: {
        username: '',
        password: '',
        role: '',
        profile_pic: null
      },
      showNotification: false,
      toast: useToast(),  
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter((user) =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  created() {
    this.getUsers(); 
  },

  methods: {
    async getUsers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/'); 
        this.users = response.data;
      } catch (error) {
        console.error('There was an error fetching the users:', error);
      }
    },

    toggleStatus(user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    },

    viewUserDetails(user) {
      this.selectedUser = user; 
    },

    closeModal() {
      this.selectedUser = null; 
    },

    handleFileUpload(event) {
      this.newUser.profile_pic = event.target.files[0];
    },

    async addUser() {
      try {
        const formData = new FormData();
        formData.append('username', this.newUser.username);
        formData.append('password', this.newUser.password);
        formData.append('role', this.newUser.role);
        if (this.newUser.profile_pic) {
          formData.append('profile_pic', this.newUser.profile_pic);
        }

        const response = await axios.post('http://127.0.0.1:8000/api/users/users/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.users.push(response.data);
        this.newUser = { username: '', password: '', role: '', profile_pic: null };

        this.toast.success("User added successfully!", {
          timeout: 3000,
          position: "top-right",
          closeOnClick: true,
        });

      } catch (error) {
        this.toast.error("Error creating user: " + error.message, {
          timeout: 5000,
          position: "top-right",
          closeOnClick: true,
        });
        console.error('There was an error creating the user:', error);
      }
    },
  },
};
</script>

  <style scoped>

  
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow the container to take remaining space */
  margin-left: 230px; /* Make space for sidebar, adjust as needed */
  height: 100%; /* Full height of the page */
}
.add-user-form {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
}

  
  .add-user-form form {
    display: flex;
    flex-direction: column;
  }
  
  .add-user-form input,
  .add-user-form select {
    margin: 8px 0;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .add-user-form button {
    padding: 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .add-user-form button:hover {
    background-color: #1976d2;
  }
  
  .user-management-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
  
  .table th,
  .table td {
    text-align: center;
  }
  
  .dashboard-container {
    flex-grow: 1;
  background-color: #EFEFEF;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  }
  

  
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 8px 15px;
    border-radius: 20px;
  }
  
  .search-bar input {
    border: none;
    background: none;
    margin-left: 10px;
    outline: none;
  }
  
  .user-table {
  flex: 1;
  max-height: calc(100% - 200px); /* Adjust based on other elements */
  overflow-y: auto;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
}

  
.user-table thead {
  position: sticky;
  top: 0;
  background-color: #f4f4f4;
  z-index: 1;
}

.user-table tbody {
  display: block;
  overflow-y: auto;
}

.user-table thead tr,
.user-table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
  th {
    background-color: #f4f4f4;
  padding: 13px;
  font-weight: bold;
  }
  
  button {
    padding: 6px 12px;
    margin: 5px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #1976d2;
  }
  
  .user-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .modal-content button {
    background-color: #f44336;
  }
  .user-table::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.user-table::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.user-table::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.user-table::-webkit-scrollbar-thumb:hover {
  background: #555;
}
  @media (max-width: 768px) {
    .main-content {
      padding: 15px;
    }
  
    table {
      font-size: 14px;
    }
  }
  </style>
  