<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      // Handle login logic here
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      // Example: this.$router.push("/dashboard");
    }
  }
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
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
}

.login-container h1 {
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
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
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
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
  background-color: var(--primary-color);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  font-family: 'Poppins', sans-serif;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>