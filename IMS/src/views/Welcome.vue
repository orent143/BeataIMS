<template>
  <div class="landing-page">
    <nav class="navbar">
      <div class="logo">Cafe Beata</div>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-content">
        <h1>Welcome to Cafe Beata</h1>
        <p>Streamline your operations with our comprehensive management system</p>
        <div class="cta-buttons">
          <button @click="redirectToLogin('homeims')" class="primary-btn">
  <i class="fas fa-boxes"></i> Inventory Management
</button>
<button @click="redirectToLogin('homesms')" class="secondary-btn">
  <i class="fas fa-chart-line"></i> Sales Management
</button>

          <button @click="redirectToLogin('dashboard')" class="third-btn">
            <i class="fas fa-chart-line"></i>
            Admin
          </button>
        </div>
      </div>
    </header>

    <section id="features" class="features">
      <h2>Key Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <i class="fas fa-boxes"></i>
          <h3>Inventory Tracking</h3>
          <p>Real-time inventory management and stock monitoring</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-chart-pie"></i>
          <h3>Sales Analytics</h3>
          <p>Comprehensive sales reporting and analysis</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-users"></i>
          <h3>User Management</h3>
          <p>Role-based access control and user permissions</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-clock"></i>
          <h3>Real-time Updates</h3>
          <p>Instant synchronization across all devices</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  methods: {
    redirectToLogin(targetRoute) {
    this.$router.push({ path: '/login', query: { redirect: targetRoute } });
  },
    goToLogin() {
      this.$router.push("/login");
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

.landing-page {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(to right, #E54F70, #ed9598);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo {
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

.nav-links a {
  margin: 2rem;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--secondary-color);
}

.hero {
  height: 100vh;
  background: linear-gradient(to right, #e54f6f7e, #ed959821, rgba(0, 0, 0, 0.863)),
              url('@/assets/background.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 5%;
}

.hero-content {
  max-width: 800px;
}

.hero h1 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero p {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.primary-btn, .secondary-btn, .third-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-btn {
  background-color: #E54F70;
  color: white;
}

.secondary-btn {
  color: white;
  background-color: #E54F70;
}

.primary-btn:hover, .secondary-btn:hover, .third-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.third-btn{
  color: white;
  background-color: #E54F70;
}
.features {
  padding: 5rem 5%;
  background: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>