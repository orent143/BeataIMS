<template>
    <Header />

    <div class="header-container">
      <h1>Profile</h1>
      <div class="profile-container">
        <div class="profile-card">
            <h2>User Information</h2>
          <div class="profile-content">
            <!-- Left: User Info -->
            <div class="profile-left">
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Role:</strong> {{ user.role }}</p>
              <p><strong>Joined:</strong> {{ user.joinDate }}</p>
            </div>
  
            <!-- Right: Profile Picture -->
            <div class="profile-right">
              <img :src="user.profilePicture" alt="Profile Picture" class="profile-pic" />
              <h2>{{ user.name }}</h2>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="profile-actions">
            <button @click="editProfile">Edit Profile</button>
            <button @click="logout" class="logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Header from "@/components/Header.vue";

  
  export default {
    components: { Header },
    data() {
      return {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Student",
          joinDate: "January 15, 2023",
          profilePicture: "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG.png"
        }
      };
    },
    methods: {
      editProfile() {
        alert("Edit profile functionality coming soon!");
      },
      logout() {
        console.log("Logging out...");
        this.$router.push("/");
      }
    }
  };
  </script>
  
  <style scoped>
  .header-container {
    margin-left: 18px;
    padding: 20px;

  }
  
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .profile-card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 90%;
    max-width: 600px;
  }
  .profile-card h2{
    color: #333;
  }
  /* Arrange profile content into a row */
  .profile-content {
    display: flex;
    justify-content: space-between;
    text-align: left;
    gap: 20px;
  }
  
  /* Left side: User info */
  .profile-left {
    flex: 1;
  }
  
  /* Right side: Profile Picture */
  .profile-right {
    flex-shrink: 0;
    align-items: center;
  }
  
  .profile-pic {
    margin-top: 10px;
    width: 100%;
    height: 120px;
    border-radius: 50%;
  }
  
  /* Centered buttons */
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
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .logout {
    background: red;
  }
  </style>
  