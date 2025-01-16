<template>
  <div :class="['sidebar', { 'collapsed': isCollapsed }]">
    <h2 v-if="!isCollapsed" class="sidebar-title">
      <img src="@/assets/Cafe-Logo-Transparent-Background.png" class="sidebar-logo" />
      <span class="sidebar-title-text">Café Beata</span>
    </h2>

    <ul v-if="!isCollapsed" class="sidebar-list">
      <li v-for="(link, index) in links" :key="index">
        <router-link
          v-if="link.submenu"
          :to="link.path"
          class="sidebar-link"
          @click.prevent="toggleSubmenu(link)"  
        >
          <i :class="link.icon"></i> {{ link.name }}
        </router-link>
        <router-link
          v-else
          :to="link.path"
          class="sidebar-link"
          active-class="active-link"
        >
          <i :class="link.icon"></i> {{ link.name }}
        </router-link>

        <!-- Submenu that stays open when toggled -->
        <ul v-if="link.submenu && link.isOpen" class="submenu">
          <li v-for="(subLink, subIndex) in link.submenu" :key="subIndex">
            <router-link
              :to="subLink.path"
              class="sidebar-link"
              active-class="active-link"
              @click.stop="stayOpen" 
            >
              <i :class="subLink.icon"></i> {{ subLink.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>

    <ul v-else class="sidebar-list">
      <li v-for="(link, index) in links" :key="index">
        <router-link :to="link.path" class="sidebar-link" active-class="active-link">
          <i :class="link.icon"></i>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer">
      <router-link to="/" class="sidebar-link" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
      links: [
        { name: 'Home', path: '/homeims', icon: 'fas fa-home' },
        {
          name: 'Manage Inventory',
          path: '#',
          icon: 'fas fa-box',
          submenu: [
            { name: 'Products', path: '/inventoryims', icon: 'fas fa-cogs' },
            { name: 'Stock', path: '/stocks', icon: 'fas fa-boxes' }
          ],
          isOpen: false // Initially, the submenu is closed
        },
        { name: 'Create Product', path: '/create', icon: 'fas fa-plus-circle' },
        { name: 'Suppliers', path: '/suppliers', icon: 'fas fa-truck' },
        { name: 'Categories', path: '/category', icon: 'fas fa-th-list' },
        { name: 'Reports', path: '/reportsims', icon: 'fas fa-chart-line' }
      ]
    };
  },
  mounted() {
    this.checkActiveSubmenu();
  },
  methods: {
    toggleSubmenu(link) {
      if (link.submenu) {
        link.isOpen = !link.isOpen; // Toggle the submenu open/close
      }
    },
    stayOpen() {
      // Prevent submenu from closing when a submenu item is clicked
    },
    checkActiveSubmenu() {
      this.links.forEach(link => {
        if (link.submenu) {
          link.isOpen = link.submenu.some(subLink => this.$route.path === subLink.path);
        }
      });
    },
    logout() {
      console.log("Logging out...");
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  padding: 20px;
  background-color: #FF32BA;
  height: 100vh;
  position: fixed;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px #FF00A9;
}

.sidebar-logo {
  width: 42%;
  height: auto;
  margin: 0 auto;
  display: block;
}

.sidebar-title {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 30px;
}

.collapsed {
  width: 50px;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #fff;
}

.sidebar-title-text {
  color: #fff;
  font-size: 25px;
  font-family: 'Verdana', sans-serif;
  margin-top: 10px;
  display: block;
}

.sidebar-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: auto;
}

.sidebar-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 0;
  font-size: 17px;
  font-family: 'Arial', sans-serif;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin: 15px 0;
  transition: color 0.3s, border-color 0.3s;
}

.sidebar-link i {
  margin-right: 20px;
  font-size: 18px;
  vertical-align: middle;
}

.sidebar-link:hover {
  color: #000000;
  border-color: #000000;
}

.active-link {
  color: #000000;
  font-weight: bold;
  background-color: #ffffff !important;
  padding: 8px 5px !important;
  width: 100%;
  box-sizing: content-box;
  border: 2px solid #ffffff;
  border-radius: 4px;
}

.submenu {
  list-style-type: none;
  padding-left: 0;
  margin-left: 20px;
}

.collapsed .sidebar-link {
  justify-content: center;
}

.sidebar-footer {
  width: 100%;
  display: flex;
  justify-content: left;
  padding: 0;
  margin-top: auto;
}

.sidebar-footer .sidebar-link {
  color: white;
  font-size: 17px;
  font-family: 'Arial', sans-serif;
  padding: 10px 20px;
  border-radius: 25px;
  margin-top: 15px;
  display: flex;
  align-items: left;
}

.sidebar-footer .sidebar-link i {
  margin-right: 18px;
}

.sidebar-footer .sidebar-link:hover {
  color: #000000;
}
</style>
