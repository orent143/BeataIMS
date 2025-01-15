<template>
  <div class="admin-layout">
    <sidebar />
    <div class="main-content">
      <div class="page-header">
        <h1>User Management</h1>
        <button @click="showCreateModal" class="btn-primary">
          <i class="fas fa-user-plus"></i> Add New User
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search users..."
            @input="filterUsers"
          >
        </div>
        <div class="filter-options">
          <select v-model="roleFilter" @change="filterUsers">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select v-model="statusFilter" @change="filterUsers">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <table v-if="filteredUsers.length">
          <thead>
            <tr>
              <th>
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th @click="sortBy('id')" class="sortable">
                ID
                <i class="fas" :class="getSortIcon('id')"></i>
              </th>
              <th @click="sortBy('name')" class="sortable">
                Name
                <i class="fas" :class="getSortIcon('name')"></i>
              </th>
              <th @click="sortBy('email')" class="sortable">
                Email
                <i class="fas" :class="getSortIcon('email')"></i>
              </th>
              <th @click="sortBy('role')" class="sortable">
                Role
                <i class="fas" :class="getSortIcon('role')"></i>
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <i class="fas" :class="getSortIcon('status')"></i>
              </th>
              <th @click="sortBy('lastLogin')" class="sortable">
                Last Login
                <i class="fas" :class="getSortIcon('lastLogin')"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" :class="{ 'selected': selectedUsers.includes(user.id) }">
              <td>
                <input 
                  type="checkbox" 
                  :value="user.id" 
                  v-model="selectedUsers"
                >
              </td>
              <td>{{ user.id }}</td>
              <td>
                <div class="user-info">
                  <img :src="user.avatar" :alt="user.name" class="user-avatar">
                  {{ user.name }}
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="user.role">{{ user.role }}</span>
              </td>
              <td>
                <span class="status-badge" :class="user.status">{{ user.status }}</span>
              </td>
              <td>{{ formatDate(user.lastLogin) }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editUser(user)" class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="showUserDetails(user)" class="btn-icon" title="View Details">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="confirmDelete(user)" class="btn-icon delete" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-results">
          <i class="fas fa-search"></i>
          <p>No users found matching your criteria</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="filteredUsers.length">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="btn-page"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="btn-page"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
        <select v-model="itemsPerPage" @change="updatePagination">
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
        </select>
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

      <!-- Create/Edit User Modal -->
      <modal v-if="showModal" @close="closeModal">
        <template #header>
          <h2>{{ isEditing ? 'Edit User' : 'Create New User' }}</h2>
        </template>
        
        <template #body>
          <form @submit.prevent="submitForm" class="user-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
                required
              >
            </div>

            <div class="form-group">
              <label for="role">Role</label>
              <select id="role" v-model="formData.role" required>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="formData.status" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div class="form-group">
              <label for="password">
                {{ isEditing ? 'New Password (leave blank to keep current)' : 'Password' }}
              </label>
              <input 
                type="password" 
                id="password" 
                v-model="formData.password"
                :required="!isEditing"
              >
            </div>
          </form>
        </template>

        <template #footer>
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button @click="submitForm" class="btn-primary">
            {{ isEditing ? 'Update User' : 'Create User' }}
          </button>
        </template>
      </modal>

      <!-- Delete Confirmation Modal -->
      <modal v-if="showDeleteModal" @close="closeDeleteModal">
        <template #header>
          <h2>Confirm Delete</h2>
        </template>
        
        <template #body>
          <p v-if="selectedUsers.length > 1">
            Are you sure you want to delete {{ selectedUsers.length }} users? This action cannot be undone.
          </p>
          <p v-else>
            Are you sure you want to delete {{ userToDelete?.name }}? This action cannot be undone.
          </p>
        </template>

        <template #footer>
          <button @click="closeDeleteModal" class="btn-secondary">Cancel</button>
          <button @click="confirmDeleteAction" class="btn-danger">Delete</button>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import sidebar from '@/components/admin/sidebar.vue';

export default {
  name: 'UserManagement',
  components: {
    sidebar
  },
  data() {
    return {
      users: [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', lastLogin: '2025-01-15T10:15:00', avatar: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'manager', status: 'inactive', lastLogin: '2025-01-14T14:20:00', avatar: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'user', status: 'suspended', lastLogin: '2025-01-12T09:00:00', avatar: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Emily Clark', email: 'emily.clark@example.com', role: 'user', status: 'active', lastLogin: '2025-01-10T17:25:00', avatar: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Michael Johnson', email: 'michael.johnson@example.com', role: 'manager', status: 'active', lastLogin: '2025-01-13T12:00:00', avatar: 'https://via.placeholder.com/40' },
      ],
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',
      selectedUsers: [],
      selectAll: false,
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'id',
      sortOrder: 'asc',
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      userToDelete: null,
      formData: {
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        password: ''
      }
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
      }).sort((a, b) => {
        const modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    filterUsers() {
      this.currentPage = 1;
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    getSortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedUsers = this.paginatedUsers.map(user => user.id);
      } else {
        this.selectedUsers = [];
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    updatePagination() {
      this.currentPage = 1;
    },
    showCreateModal() {
      this.isEditing = false;
      this.formData = {
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        password: ''
      };
      this.showModal = true;
    },
    editUser(user) {
      this.isEditing = true;
      this.formData = {
        ...user,
        password: ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.formData = {
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        password: ''
      };
    },
    submitForm() {
      if (this.isEditing) {
        const index = this.users.findIndex(u => u.id === this.formData.id);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...this.formData,
            password: this.formData.password || this.users[index].password
          };
        }
      } else {
        const newUser = {
          ...this.formData,
          id: this.users.length + 1,
          lastLogin: null,
          avatar: 'https://via.placeholder.com/40'
        };
        this.users.push(newUser);
      }
      this.closeModal();
    },
    showUserDetails(user) {
      console.log('Show details for user:', user);
    },
    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    confirmBulkDelete() {
      this.userToDelete = null;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.userToDelete = null;
    },
    confirmDeleteAction() {
      if (this.userToDelete) {
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
      } else {
        this.users = this.users.filter(u => !this.selectedUsers.includes(u.id));
        this.selectedUsers = [];
      }
      this.closeDeleteModal();
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
}

.sortable i {
  margin-left: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge.admin { background: #e3f2fd; color: #1976d2; }
.badge.manager { background: #e8f5e9; color: #388e3c; }
.badge.user { background: #f3e5f5; color: #7b1fa2; }

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active { background: #e8f5e9; color: #388e3c; }
.status-badge.inactive { background: #fafafa; color: #666; }
.status-badge.suspended { background: #ffebee; color: #d32f2f; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #eee;
}

.btn-icon.delete:hover {
  background: #ffebee;
  color: #d32f2f;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
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

.page-info {
  font-size: 0.9rem;
  color: #666;
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

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.user-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  background: #388e3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-warning {
  background: #f57c00;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

tr.selected {
  background: #f8f9fa;
}
</style>
