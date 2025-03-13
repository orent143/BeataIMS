<template>
  <div class="overlay" v-if="isProfileOpen">
    <div class="modal-profile">
      <div class="modal-header">
        <h2>User Profile</h2>
        <button class="close-btn" @click="closeProfile">&times;</button>
      </div>

      <div class="modal-content">
        <div v-if="user" class="profile-content">
          <div class="profile-left">
            <p><strong>Name:</strong> {{ user.username }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Joined:</strong> {{ formatDate(user.date_added) }}</p>
          </div>

          <div class="profile-right">
            <img :src="profileImage" alt="Profile Picture" class="profile-pic" />
            <h3>{{ user.username }}</h3>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="logout" class="logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Profile',
  props: {
    isProfileOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: null
    };
  },
  computed: {
    profileImage() {
    if (this.user?.profile_pic) {
      return this.user.profile_pic.startsWith("http") 
        ? this.user.profile_pic 
        : `http://127.0.0.1:8000/uploads/profile_pics/${this.user.profile_pic}`;
    }
    return "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG.png";
  }
  },
  methods: {
    async fetchUserProfile() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        this.logout();
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/users/${storedUser.user_id}`);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        this.logout();
      }
    },
    closeProfile() {
      this.$emit('close-profile');
    },
    editProfile() {
      alert("Edit profile functionality coming soon!");
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/");
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  },
  mounted() {
    this.fetchUserProfile();
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-profile {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  color: white;
  background: linear-gradient(to right, #e54f6f7e, #ed959821, rgba(0, 0, 0, 0.863)),
              url('@/assets/background.jpg') center/cover no-repeat;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 10px;  /* Adjust the value as per your design */
  border-top-right-radius: 10px; /* Adjust the value as per your design */
}

.modal-header h2{
  color: white;
font-family: 'Arial', sans-serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-content {
  padding: 20px;
}

.profile-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-left {
  flex: 1;
  text-align: left;
}

.profile-right {
  text-align: center;
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.profile-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.logout {
  background: #dc3545;
}

.open-profile {
  margin: 20px;
}
</style>