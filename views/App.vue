<template>
  <header class="header">
    <div class="container">
      <h1>ExpenseMate</h1>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    this.populateTransactions(); // Call the function when the component is created
  },
  computed:{
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray
    }
  },
  methods: {
    populateTransactions() {
      const descriptions = ["Utilities", "Dining", "Travel", "Entertainment", "Groceries"];

      function getRandomDescription() {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        return descriptions[randomIndex];
      }

      function getRandomAmount(min, max) {
        return Math.random() * (max - min) + min;
      }

      function formatDate(date) {
        const month = date.getMonth() + 1; // 0-indexed month
        const day = date.getDate();
        return `${month}/${day}`;
      }

      for (let i = 1; i <= 365; i++) {
        const date = new Date(2023, 0); // Start from January 1, 2023
        date.setDate(i); // Increase the date for each iteration

        this.myTransactionsArray.push({
          id: i,
          description: getRandomDescription(),
          amount: getRandomAmount(20, 120),
          date: formatDate(date),
          rawDate: date // Keep the original Date object for later comparison
        });
      }
      const todayDate = new Date();

      this.$store.commit('SET_TRANSACTIONS', this.myTransactionsArray.filter(t => t.rawDate < todayDate));
      this.$store.commit('SET_DAYS', Math.round((todayDate.getTime() - (new Date(2023, 0)).getTime() ) / (1000 * 60 * 60 * 24)));
    }
  }
}
</script>
<style scoped>
.header {
  background-color: #333;
  color: white;
  padding: 15px 0;
}

.container {
  margin: 0 30px;
  max-width: 1400px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 15px;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: white;
}

h1 {
  color: #666;
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