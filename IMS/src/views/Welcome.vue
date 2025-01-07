<template>
    <div class="welcome-container">
      <h1>Welcome to Our Management System</h1>
      <p>Please choose one of the options below:</p>
      
      <div class="options">
        <button @click="goToIMS">Go to Inventory Management System (IMS)</button>
        <button @click="goToSMS">Go to Sales Management System (SMS)</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Welcome",
    methods: {
      goToIMS() {
        this.$router.push("/inventory");  // or '/stock' if you want to start with stock page
      },
      goToSMS() {
        this.$router.push("/sales");
      },
    },
  };
  </script>
  
  <style scoped>
  .welcome-container {
    text-align: center;
    padding: 50px;
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
  