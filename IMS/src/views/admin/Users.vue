<template>
  <!-- Import Header component -->
  <Header />
    <sidebar />
    <div class="app-container">
      <div class="dashboard-container">  
          <div class="user-management-container">
            <h2>User Management</h2>
  
            <!-- Add User Form -->
            <div class="add-user-form">
              <h3>Add New User</h3>
              <form @submit.prevent="addUser">
                <input v-model="newUser.username" type="text" placeholder="Username" required />
                <input v-model="newUser.password" type="password" placeholder="Password" required />
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
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
        },
        showNotification: false, 
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
          const response = await axios.get('http://localhost:8000/api/users/'); 
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
  
      async addUser() {
        try {
          const formData = new FormData();
          formData.append('username', this.newUser.username);
          formData.append('password', this.newUser.password);
  
          const response = await axios.post('http://localhost:8000/api/users/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          this.users.push(response.data);
  
          this.newUser = { username: '', password: '' };
  
          // Show success notification
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false; 
          }, 3000);
        } catch (error) {
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
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  
  .notification {
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border-radius: 5px;
    margin-top: 10px;
    text-align: center;
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    width: auto;
    z-index: 1000;
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
  
  .user-management-container {
    padding: 20px;
  }
  
  .user-table {
    position: relative;
  flex-grow: 1;
  height: 37dvw;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  border-collapse: collapse;

  background-color: #ffffff;
  border-radius: 25px;
  overflow-y: auto;
  margin-left: 5px;
  padding: 0;
  }
  
  .user-table th,
  .user-table td {
    padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  border-bottom: 1px solid #eee;
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
  
  @media (max-width: 768px) {
    .main-content {
      padding: 15px;
    }
  
    table {
      font-size: 14px;
    }
  }
  </style>
  