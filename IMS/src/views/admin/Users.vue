<template>
    <sidebar />
    <div class="app-container">
      <div class="dashboard-container">
        <main class="main-content">
          <nav class="top-nav">
            <div class="search-bar">
              <i class="fas fa-search"></i>
              <input type="text" v-model="searchQuery" placeholder="Search users..." />
            </div>
          </nav>
  
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
            <table>
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
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import sidebar from '@/components/admin/sidebar.vue';
  
  export default {
    name: 'UserManagement',
    components: {
      sidebar,
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
        showNotification: false, // For showing success notification
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
      this.getUsers(); // Fetch users from the backend when the component is created
    },
  
    methods: {
      async getUsers() {
        try {
          const response = await axios.get('http://localhost:8000/api/users/'); // Backend API call
          this.users = response.data; // Assign the fetched users to the array
        } catch (error) {
          console.error('There was an error fetching the users:', error);
        }
      },
  
      toggleStatus(user) {
        // Only toggling status text for the front end, backend does not handle it yet
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      },
  
      viewUserDetails(user) {
        this.selectedUser = user; // Open the details modal for the selected user
      },
  
      closeModal() {
        this.selectedUser = null; // Close the modal
      },
  
      async addUser() {
        try {
          const formData = new FormData();
          formData.append('username', this.newUser.username);
          formData.append('password', this.newUser.password);
  
          const response = await axios.post('http://localhost:8000/api/users/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Required for FormData
            },
          });
  
          // Add the newly created user to the list
          this.users.push(response.data);
  
          // Reset form fields
          this.newUser = { username: '', password: '' };
  
          // Show success notification
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false; // Hide after 3 seconds
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
    flex-grow: 1;
    margin-left: 250px;
    height: 100%;
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
    display: flex;
    background-color: #f5f5f5;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
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
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    font-weight: 600;
    color: #666;
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
  