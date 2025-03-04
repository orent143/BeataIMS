<template>
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
          <div class="logo">


            <span class="logo-text">Cafe Beata</span> <!-- Logo Text updated to Cafe Beata -->
          </div>
        </div>
        <div class="header-right">
          <div class="search-bar">
            <i class="pi pi-search search-icon"></i> <!-- Search Icon -->
            <input
              type="text"
              placeholder="Search"
              v-model="localSearchQuery"
              @input="updateSearchQuery"
            />
          </div>
          <div class="profile">
          <i class="pi pi-bell notification-icon"></i> 
          <div class="profile-dropdown">
            <i class="pi pi-user profile-icon" @mouseenter="showDropdown = true"></i> 
            <div v-if="showDropdown" class="dropdown-menu" @mouseleave="showDropdown = false">
              <a class="dropdown-item" @click="openProfile">View Profile</a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </header>
    <Profile 
      :isProfileOpen="isProfileOpen" 
      @close-profile="closeProfile"
    />
  </template>
  
  <script>
  import Profile from '@/views/Profile.vue';
  export default {
    components: {
    Profile
  },
    props: {
      searchQuery: {
        type: String,
        default: ''
      },
      student: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        localSearchQuery: this.searchQuery, // Local copy of the search query
        showDropdown: false,
        isProfileOpen: false

      };
    },
    methods: {
      openProfile() {
      this.isProfileOpen = true;
      this.showDropdown = false;
      document.body.style.overflow = 'hidden';
    },
    closeProfile() {
      this.isProfileOpen = false;
      document.body.style.overflow = 'auto';
    },
      toggleSidebar() {
        this.$emit('toggleSidebar');
      },
      updateSearchQuery() {
        this.$emit('update:searchQuery', this.localSearchQuery); // Emit event to update parent
      }
    },
    watch: {
      searchQuery(newQuery) {
        this.localSearchQuery = newQuery; // Update local value if prop changes
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard-header {
    position: sticky;
    top: 0;
    background-image: linear-gradient(to right, #E54F70, #ed9598);
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure space between left and right sections */
  }
  
  .header-left {
    display: flex;
    align-items: center; /* Align toggle and logo vertically */
  }
  
  .sidebar-toggle {
    color: rgba(0, 0, 0, 0.932); /* Text color */
    background-color: transparent; /* Transparent background */
    border: none; /* Remove border */
    padding: 0px; /* Padding for the button */
    cursor: pointer; /* Pointer cursor on hover */
    font-size: 25px; /* Font size for the toggle icon */
    font-weight: 900;
    transition: background-color 0.3s; /* Smooth transition */
  }
  
  .sidebar-toggle:hover {
    background-color: rgba(0, 0, 0, 0.1); /* Light background on hover */
  }
  
  .logo {
    display: flex;
    margin-left: 10px; /* Add some spacing from the toggle button */
  }
  
  .header-right {
    display: flex;
    align-items: center; /* Align search and profile vertically */
  }
  
  .search-bar {
    position: relative; /* Position relative for the input */
    display: flex; /* Align icon and input horizontally */
    align-items: center; /* Center the icon and input */
  }
  
  .search-icon {
    position: absolute;
    left: 10px; /* Position the search icon inside the input */
    top: 50%;
    transform: translateY(-50%);
    color: #333; /* Ensure the color is visible */
    pointer-events: none; /* Prevent interaction with the icon */
  }
  
  .notification-icon {
    margin-left: 10px;
    color: #333; /* Color for the notification icon */
    cursor: pointer; /* Pointer cursor on hover */
    font-size: 17px; /* Font size for the profile icon */
  }
  
  .profile {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}
  .profile-icon {
    margin-right: 10px; /* Spacing between notification icon and profile icon */
    color: #333; /* Color for the profile icon */
    cursor: pointer; /* Pointer cursor on hover */
    font-size: 17px; /* Font size for the profile icon */
  }
  
  .profile-dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  width: 150px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in-out;
}

.dropdown-item {
  padding: 10px;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.dropdown-item:hover {
  background: #f0f0f0;
}

.logout {
  color: red;
  font-weight: bold;
}

  .search-bar input {
    padding: 8px 30px 8px 30px; /* Adjust padding */
    border: 1px solid #94949400; /* Border for the input */
    border-radius: 10px; /* Rounded corners */
    width: 130px; /* Width of the input */
    font-size: 14px; /* Font size */
    font-weight: bold; /* Bold text */
    color: #333; /* Text color */
    background-color: #F5F5F5; /* Background color */
  }
  
  .search-bar input:focus {
    border-color: #007BF6; /* Change border color on focus */
    outline: none; /* Remove default outline */
  }
  
  .profile {
    display: flex;
    align-items: center;
    gap: 15px; /* Add spacing between search bar and profile */
  }
  
  .profile-pic {
    border-radius: 50%;
    margin-left: 10px; /* Add spacing between notification icon and profile picture */
  }
  
  .logo-text {
    font-family: 'Inknut Antiqua', serif;
    font-size: 30px; /* Increase the font size to make the logo text bigger */
    font-weight: bolder;
    color: white;
    text-shadow: 
      1px 1px 0#940358, 
      -1px 1px 0 #940358,
      1px -1px 0 #940358,
      -1px -1px 0 #940358,
      0px 1px 0 #940358,
      0px -1px 0 #940358,
      1px 0px 0 #940358,
      -1px 0px 0 #940358;
    line-height: 1.2; /* Adjust line-height for better spacing */
  }
  </style>