<template>
  <div class="home-container">
    <h2>Welcome to ExpenseMate!</h2>
    <p>Struggling to keep track of your spending? Overwhelmed by numerous bills, receipts, and expenses? Say hello to ExpenseMate—your trusted partner in financial management.</p>
    <p>Our platform offers you a comprehensive view of all your expenditures, breaking them down into easy-to-understand categories and visual diagrams. We simplify budgeting so that you can focus on making better financial decisions.</p>
    <p>Unlock the power of smart spending. With ExpenseMate, you gain insight, clarity, and control over your financial world. Don't just view your expenses—understand them.</p>
    <!-- Add a button to route to the dashboard -->
    <button @click="goToDashboard()">Try it yourself</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: white;
}

.home-container {
  text-align: center;
  margin-top: 50px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
}

p {
  color: #666;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
