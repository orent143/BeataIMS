<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Cafe Beata</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="login-btn">Login</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",  // Changed from email to username
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/Auth/login/', {
      username: this.username,
      password: this.password,
    });

    localStorage.setItem("user", JSON.stringify(response.data));

    const redirectPath = this.$route.query.redirect; // Get redirect parameter

    if (response.data.role === "admin") {
      this.$router.push('/dashboard');
    } else if (response.data.role === "cafe_staff") {
      // Redirect based on query parameter
      if (redirectPath === "homesms") {
        this.$router.push('/homesms'); // Sales Management
      } else {
        this.$router.push('/homeims'); // Default to Inventory Management
      }
    }
  } catch (error) {
    this.errorMessage = error.response?.data?.detail || "Invalid username or password";
  }
},
  },
};
</script>

<style scoped>
:root {
  --primary-color: #FF32BA;
  --secondary-color: #FF32BA;
  --accent-color: #e74c3c;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #e54f6f7e, #ed959821, rgba(0, 0, 0, 0.863)),
              url('@/assets/background.jpg') center/cover no-repeat;
}

.login-container {
  background: rgba(255, 255, 255, 0.979);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.795);
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
}

.login-container h1 {
  margin-bottom: 2rem;
  color: #E54F70;

    text-shadow: 
      1px 1px 0#fbf1f3, 
      -1px 1px 0 #fbf1f3,
      1px -1px 0 #fbf1f3,
      -1px -1px 0 #fbf1f3,
      0px 1px 0 #fbf1f3,
      0px -1px 0 #fbf1f3,
      1px 0px 0 #fbf1f3,
      -1px 0px 0 #fbf1f3;
    line-height: 1.2; /* Adjust line-height for better spacing */
  font-family: 'Inknut Antiqua', serif;
    font-size: 50px;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-family: 'Poppins', sans-serif;
  font-weight: bolder;
}

.input-group input {
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #ffffff;
  background-color: #D9D9D9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(255, 50, 186, 0.5);
}

.login-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background-color:#E54F70 ;
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  font-family: 'Poppins', sans-serif;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

</style>