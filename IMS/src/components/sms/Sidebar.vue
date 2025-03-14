<template>
  <div :class="['sidebar', { 'collapsed': isCollapsed }]">

    <ul v-if="!isCollapsed" class="sidebar-list">
      <li v-for="(link, index) in links" :key="index">
        <router-link
          :to="link.path"
          class="sidebar-link"
          active-class="active-link"
        >
          <i :class="['pi', link.icon]"></i> {{ link.name }}
        </router-link>
      </li>
    </ul>

    <ul v-else class="sidebar-list">
      <li v-for="(link, index) in links" :key="index">
        <router-link :to="link.path" class="sidebar-link" active-class="active-link">
          <i :class="['pi', link.icon]"></i>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer">
      <router-link to="/" class="sidebar-link" @click="logout">
        <i class="pi pi-sign-out"></i> Logout
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
        { name: 'Dashboard', path: '/homesms', icon: 'pi-home' }, 
        { name: 'Orders', path: '/order', icon: 'pi pi-shopping-cart' }, 
        { name: 'Create Orders', path: '/createorder', icon: 'pi pi-plus-circle' }, 
        { name: 'Sales', path: '/sales', icon: 'pi pi-dollar' }, 
        { name: 'Inventory', path: '/inventorysms', icon: 'pi pi-box' }, 
        { name: 'Orders History', path: '/ordershistory', icon: 'pi pi-history' }, 
        { name: 'Reports', path: '/reportssms', icon: 'pi pi-file' } 
      ]
    };
  },
  methods: {
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
  width: 180px;
  padding: 20px;
  background-color:rgb(255, 255, 255);
  height: 100vh;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);

  position: fixed;
  transition: width 0.3s ease;

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
  color: rgb(165, 165, 165);
}


.sidebar-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: auto;
}

.sidebar-link {
  color:rgba(14, 14, 14, 0.54);
  text-decoration: none;
  font-weight: 450;
  font-size: 15px;
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
  border-color: #ed9598;
}

.active-link {
  color: #000000;
  font-weight: bold;
  background-color:#ed9598 !important;
  padding: 8px 5px !important;
  width: 100%;
  box-sizing: content-box;
  border: 2px solidrgb(0, 0, 0);
  border-radius: 10px;
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
  margin-top: auto; /* Ensures the logout stays at the bottom */
  margin-bottom: auto; /* Adds space from the bottom */
}

.sidebar-footer .sidebar-link {
  color:rgba(14, 14, 14, 0.54);
    font-size: 15px;
  font-family: 'Arial', sans-serif;
  padding: 10px 20px;
  border-radius: 25px;
  display: flex;
  align-items: left;
}

.sidebar-footer .sidebar-link i {
  margin-right: 18px;
}

.sidebar-footer .sidebar-link:hover {
  color: rgb(0, 0, 0);
}

</style>
