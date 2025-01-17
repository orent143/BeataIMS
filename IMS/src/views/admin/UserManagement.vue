<template>
  <sidebar />

  <div class="app-container">
    <!-- Header Section -->
    <div class="header-container">
      <h1 class="users-header">User Management</h1>
      <div class="header-actions">
        <!-- Search Bar -->
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search users..."
            class="search-bar"
            @input="filterUsers"
          />
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- Filter Dropdown -->
        <div class="filter-container">
          <button class="filter-btn" @click="toggleFilterDropdown">
            <i class="fas fa-filter"></i>
          </button>
          <div v-if="showFilterDropdown" class="dropdown">
            <select v-model="roleFilter" class="filter-select" @change="filterUsers">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select v-model="statusFilter" class="filter-select" @change="filterUsers">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <!-- Add User Button -->
        <button @click="toggleAddForm" class="add-user-btn">Add</button>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <div class="users-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'selected': selectedUsers.includes(user.id) }">
              <td>
                <input 
                  type="checkbox" 
                  :value="user.id" 
                  v-model="selectedUsers"
                >
              </td>
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="user.role">{{ user.role }}</span>
              </td>
              <td>
                <span class="status-badge" :class="user.status">{{ user.status }}</span>
              </td>
              <td>{{ formatDate(user.lastLogin) }}</td>
              <td>
                <button class="action-btn" @click="editUser(user)">Edit</button>
                <button class="action-btn delete" @click="confirmDelete(user)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-show="selectedUsers.length">
      <span>{{ selectedUsers.length }} users selected</span>
      <div class="bulk-buttons">
        <button @click="bulkChangeStatus('active')" class="btn-success">
          Activate
        </button>
        <button @click="bulkChangeStatus('inactive')" class="btn-warning">
          Deactivate
        </button>
        <button @click="confirmBulkDelete" class="btn-danger">
          Delete
        </button>
      </div>
    </div>

    <!-- Add User Form -->
    <add-user
      v-if="showAddForm"
      :isVisible="showAddForm"
      @close="toggleAddForm"
      @add="addUser"
    />

    <!-- Edit User Form -->
    <edit-user
      v-if="showEditForm"
      :isVisible="showEditForm"
      :userToEdit="selectedUser"
      @close="toggleEditForm"
      @update="updateUser"
    />
  </div>
</template>


<script>
import AddUser from '@/components/admin/AddUser.vue';
import EditUser from '@/components/admin/EditUser.vue';
import Sidebar from '@/components/admin/sidebar.vue';

export default {
  name: 'UserManagement',
  components: {
    AddUser,
    EditUser,
    Sidebar
  },
  data() {
    return {
      users: [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', lastLogin: '2025-01-15T10:15:00' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'manager', status: 'inactive', lastLogin: '2025-01-14T14:20:00' },
        { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'user', status: 'suspended', lastLogin: '2025-01-12T09:00:00' },
        
      ],
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',
      showFilterDropdown: false,
      showAddForm: false,
      showEditForm: false,
      selectedUser: null,
      selectedUsers: [],
      selectAll: false,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = !this.searchQuery || 
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesRole = !this.roleFilter || user.role === this.roleFilter;
        const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
      });
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    toggleFilterDropdown() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },
    toggleEditForm() {
      this.showEditForm = !this.showEditForm;
    },
    filterUsers() {
      // Just triggers re-filtering
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedUsers = this.filteredUsers.map(user => user.id);
      } else {
        this.selectedUsers = [];
      }
    },
    editUser(user) {
      this.selectedUser = user;
      this.showEditForm = true;
    },
    updateUser(updatedUser) {
      const index = this.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
      this.toggleEditForm();
    },
    addUser(newUser) {
      newUser.id = this.users.length + 1;
      newUser.avatar = 'https://via.placeholder.com/40';
      this.users.push(newUser);
      this.toggleAddForm();
    },
    confirmDelete(user) {
      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        this.users = this.users.filter(u => u.id !== user.id);
      }
    },
    confirmBulkDelete() {
      if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`)) {
        this.users = this.users.filter(u => !this.selectedUsers.includes(u.id));
        this.selectedUsers = [];
      }
    },
    bulkChangeStatus(status) {
      this.selectedUsers.forEach(id => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.status = status;
        }
      });
      this.selectedUsers = [];
    }
  }
};
</script>


<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 250px;
  height: 100vh;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 18px;
  width: 95%;
}

.users-header {
  color: #000000;
  font-size: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.users-container {
  position: relative;
  flex-grow: 1;
  background-color: #dfdfdf;
  border-radius: 25px;
  overflow-y: auto; /* Enable scrolling if content overflows */
  margin-left: 5px;
  padding: 0;
  height: 500px;  /* Fixed height for scrolling */
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.users-table td {
  padding: 10px;
  text-align: center; /* Ensure text is centered */
  vertical-align: middle; /* Vertically align the content */
}
.users-table tbody {
  font-family: 'Arial', sans-serif;
  font-size: 15px;
}

.users-table th {
  background-color: #f4f4f4;
  padding: 13px;
  font-weight: bold;
}

.search-container {
  position: relative;
  margin-right: 3px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  pointer-events: none;
}

.search-bar {
  padding: 8px 30px 8px 8px;
  border: 1px solid #94949400;
  border-radius: 10px;
  width: 130px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  background-color: #D9D9D9;
}

.filter-btn {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 19px;
  color: #333;
  transition: color 0.3s;
}

.filter-container {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 35px;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
  width: 8dvw;
}

.filter-select {
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
}

.add-user-btn {
  padding: 8px 12px;
  background-color: #01A501;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 10px;
  width: 70px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.add-user-btn:hover {
  background-color: #00b32dad;
}

.action-btn {
  padding: 6px 9px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Arial', sans-serif;
  font-weight: 500;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.action-btn:hover {
  background-color: #0056b3;
}

.action-btn.delete {
  background-color: #dc3545;
}

.action-btn.delete:hover {
  background-color: #c82333;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.badge.admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge.manager {
  background-color: #e8f5e9;
  color: #388e3c;
}

.badge.user {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.inactive {
  background-color: #fafafa;
  color: #666;
}

.status-badge.suspended {
  background-color: #ffebee;
  color: #d32f2f;
}

.user-info {
  display: inline-block; /* Ensure it behaves as inline content */
  text-align: left; /* Align text to the left */
  margin: 0; /* Remove any margin that may affect alignment */
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.btn-page {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bulk-actions {
  position: fixed;
  bottom: 0;
  left: 250px;
  right: 0;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-buttons {
  display: flex;
  gap: 1rem;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

tr.selected {
  background-color: #f8f9fa;
}
</style>
