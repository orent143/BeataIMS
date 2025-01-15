<template>
  <div class="admin-layout">
    <sidebar />
    <div class="main-content">
      <!-- Header Section -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1>Admin Dashboard</h1>
          <span class="current-date">{{ currentDate }}</span>
        </div>
        <div class="header-right">
          <div class="search-bar">
            <input type="text" placeholder="Search..." v-model="searchQuery">
            <i class="fas fa-search"></i>
          </div>
          <div class="admin-profile">
            <img :src="adminAvatar" alt="Admin" class="avatar">
            <div class="dropdown">
              <span>{{ adminName }}</span>
              <div class="dropdown-content">
                <a href="#" @click="viewProfile">Profile</a>
                <a href="#" @click="openSettings">Settings</a>
                <a href="#" @click="logout">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Stats -->
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in dashboardStats" :key="stat.id">
          <div class="stat-icon" :class="stat.color">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-details">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
            <span class="trend" :class="stat.trend > 0 ? 'positive' : 'negative'">
              {{ stat.trend }}% from last month
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button @click="navigateTo('createUser')" class="btn-primary">
            <i class="fas fa-user-plus"></i> Add New User
          </button>
          <button @click="navigateTo('inventory')" class="btn-success">
            <i class="fas fa-box"></i> Manage Inventory
          </button>
          <button @click="navigateTo('reports')" class="btn-info">
            <i class="fas fa-chart-bar"></i> View Reports
          </button>
          <button @click="openSystemSettings" class="btn-warning">
            <i class="fas fa-cog"></i> System Settings
          </button>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="recent-activity">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <button @click="viewAllActivity" class="btn-text">View All</button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-details">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
            <button @click="viewActivityDetails(activity.id)" class="btn-icon">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- System Status -->
      <section class="system-status">
        <h2>System Status</h2>
        <div class="status-grid">
          <div class="status-card" v-for="status in systemStatus" :key="status.id">
            <div class="status-header">
              <span class="status-label">{{ status.label }}</span>
              <span class="status-indicator" :class="status.state"></span>
            </div>
            <div class="status-details">
              <p>{{ status.details }}</p>
              <small>Last updated: {{ status.lastUpdate }}</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import sidebar from '@/components/admin/sidebar.vue';

export default {
  name: 'AdminPage',
  components: {
    sidebar
  },
  data() {
    return {
      searchQuery: '',
      adminName: 'Admin User',
      adminAvatar: '/path/to/avatar.jpg',
      currentDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      dashboardStats: [
        {
          id: 1,
          label: 'Total Users',
          value: '1,234',
          icon: 'fas fa-users',
          color: 'blue',
          trend: 12
        },
        {
          id: 2,
          label: 'Active Items',
          value: '5,678',
          icon: 'fas fa-box',
          color: 'green',
          trend: 8
        },
        {
          id: 3,
          label: 'Pending Orders',
          value: '42',
          icon: 'fas fa-clock',
          color: 'orange',
          trend: -3
        },
        {
          id: 4,
          label: 'Total Revenue',
          value: '$12,345',
          icon: 'fas fa-dollar-sign',
          color: 'purple',
          trend: 15
        }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'user',
          icon: 'fas fa-user',
          description: 'New user registration: John Doe',
          time: '5 minutes ago'
        },
        {
          id: 2,
          type: 'inventory',
          icon: 'fas fa-box',
          description: 'Inventory updated: +50 items',
          time: '1 hour ago'
        },
        {
          id: 3,
          type: 'system',
          icon: 'fas fa-cog',
          description: 'System backup completed',
          time: '2 hours ago'
        }
      ],
      systemStatus: [
        {
          id: 1,
          label: 'Database',
          state: 'healthy',
          details: 'Operating normally',
          lastUpdate: '5 mins ago'
        },
        {
          id: 2,
          label: 'API Services',
          state: 'healthy',
          details: 'All endpoints responsive',
          lastUpdate: '2 mins ago'
        },
        {
          id: 3,
          label: 'Storage',
          state: 'warning',
          details: '85% capacity used',
          lastUpdate: '1 min ago'
        }
      ]
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(`/admin/${route}`);
    },
    viewProfile() {
      this.$router.push('/admin/profile');
    },
    openSettings() {
      this.$router.push('/admin/settings');
    },
    logout() {
      // Implement logout logic
      this.$router.push('/login');
    },
    viewAllActivity() {
      this.$router.push('/admin/activity');
    },
    viewActivityDetails(id) {
      this.$router.push(`/admin/activity/${id}`);
    },
    openSystemSettings() {
      this.$router.push('/admin/system-settings');
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

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin: 0;
  color: #2c3e50;
}

.current-date {
  color: #666;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-bar {
  position: relative;
}

.search-bar input {
  padding: 0.5rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 250px;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  min-width: 150px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-content a:hover {
  background: #f5f5f5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.blue { background: #e3f2fd; color: #1976d2; }
.stat-icon.green { background: #e8f5e9; color: #388e3c; }
.stat-icon.orange { background: #fff3e0; color: #f57c00; }
.stat-icon.purple { background: #f3e5f5; color: #7b1fa2; }

.stat-details h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.stat-details p {
  margin: 0.25rem 0;
  color: #666;
}

.trend {
  font-size: 0.8rem;
}

.trend.positive { color: #388e3c; }
.trend.negative { color: #d32f2f; }

.quick-actions {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary, .btn-success, .btn-info, .btn-warning {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-primary { background: #1976d2; }
.btn-success { background: #388e3c; }
.btn-info { background: #0288d1; }
.btn-warning { background: #f57c00; }

.btn-primary:hover, .btn-success:hover, .btn-info:hover, .btn-warning:hover {
  opacity: 0.9;
}

.recent-activity {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-text {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  background: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.activity-icon.user { background: #e3f2fd; color: #1976d2; }
.activity-icon.inventory { background: #e8f5e9; color: #388e3c; }
.activity-icon.system { background: #fff3e0; color: #f57c00; }

.activity-details {
  flex: 1;
}

.activity-text {
  margin: 0;
  color: #333;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.system-status {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.status-card {
  padding: 1rem;
  border-radius: 4px;
  background: #f8f9fa;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-indicator.healthy { background: #4caf50; }
.status-indicator.warning { background: #ff9800; }
.status-indicator.error { background: #f44336; }

.status-details p {
  margin: 0;
  color: #333;
}

.status-details small {
  color: #666;
  font-size: 0.8rem;
}
</style>
