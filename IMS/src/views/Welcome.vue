<template>
  <div class="welcome-container">
    <h1>Welcome to Our Management System</h1>
    <p>Please choose one of the options below:</p>
    
    <div class="options">
      <button @click="goToIMS">Go to Inventory Management System (IMS)</button>
      <button @click="goToSMS">Go to Sales Management System (SMS)</button>
      <button @click="goToADMIN">Sign ADMIN</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  methods: {
    goToIMS() {
      this.$router.push("/homeims");  // or '/stock' if you want to start with stock page
    },
    goToSMS() {
      this.$router.push("/homesms");
    },
    goToADMIN() {
      this.$router.push("/admin");
    },
  },
};
</script>

<style scoped>
/* Container to center content */
body, html {
  height: 100%; /* Ensure full height */
  margin: 0;    /* Remove default margin */
}

.welcome-container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  height: 100vh; /* Full viewport height */
  text-align: center;
}

.options {
  margin-top: 30px;
}

button {
  font-size: 16px;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
