<template>
  <header class="header">
    <a href="/">
      <img src="../assets/img/logo.svg" alt="Logo" />
    </a>
    <nav>
      <ul class="nav-links">
        <li><router-link to="/about">About Us</router-link></li>
        <li v-if="authenticated">
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li v-if="authenticated">
          <router-link to="/settings">Settings</router-link>
        </li>
        <li v-else><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
  </header>
  <div id="app">
    <router-view></router-view>
  </div>
  <footer>
    <a href="/about/">
      <text class="footer-btn">About Us</text>
      <text class="footer-btn">Contact</text>
    </a>
    <router-link class="footer-btn" to="/policy">Privacy Policy</router-link>
    <router-link class="footer-btn" to="/terms">Terms of Service</router-link>
  </footer>
</template>

<script>
export default {
  name: "App",
  created() {
    this.populateTransactions(); // Call the function when the component is created
  },
  computed: {
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray;
    },
    authenticated() {
      return this.$store.state.authenticated;
    },
  },
  methods: {
    populateTransactions() {
      const descriptions = [
        "Utilities",
        "Dining",
        "Travel",
        "Entertainment",
        "Groceries",
      ];
      const positiveDescriptions = [
        "Received bonus",
        "Refund",
        "Gift received",
        "Sold item",
      ];

      function getRandomDescription() {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        return descriptions[randomIndex];
      }
      function getRandomPositiveDescription() {
        const randomIndex = Math.floor(
          Math.random() * positiveDescriptions.length
        );
        return positiveDescriptions[randomIndex];
      }

      function getRandomAmount(min, max) {
        return Math.random() * (max - min) + min;
      }

      function formatDate(date) {
        const month = date.getMonth() + 1; // 0-indexed month
        const day = date.getDate();
        const year = date.getFullYear();
        return `${year}/${month}/${day}`;
      }
      for (let i = 1; i <= 365; i++) {
        const date = new Date(2023, 0); // Start from January 1, 2023
        date.setDate(i); // Increase the date for each iteration
        this.myTransactionsArray.push({
          id: i + 365,
          description: getRandomDescription(), // Negative description
          amount: -getRandomAmount(20, 120), // Negative amount
          date: formatDate(date),
          rawDate: date,
        });
      }

      for (let i = 1; i <= 365; i++) {
        const date = new Date(2023, 0); // Start from January 1, 2023
        date.setDate(i); // Increase the date for each iteration
        if (i % 11 === 0 && formatDate(date).split("/")[2] !== "25") {
          // For every 11th transaction, make it positive
          this.myTransactionsArray.push({
            id: i,
            description: getRandomPositiveDescription(),
            amount: getRandomAmount(20, 120), // Positive amount
            date: formatDate(date),
            rawDate: date,
          });
        } else if (formatDate(date).split("/")[2] === "25") {
          this.myTransactionsArray.push({
            id: i,
            description: "Salary",
            amount: 3000, // Positive amount
            date: formatDate(date),
            rawDate: date,
          });
        } else {
          this.myTransactionsArray.push({
            id: i,
            description: getRandomDescription(), // Negative description
            amount: -getRandomAmount(20, 120), // Negative amount
            date: formatDate(date),
            rawDate: date,
          });
        }
      }

      const todayDate = new Date();
      this.$store.commit("SET_INITIAL_TRANSACTIONS", this.myTransactionsArray);
      this.$store.commit(
        "SET_TRANSACTIONS",
        this.myTransactionsArray
          .filter((t) => t.rawDate < todayDate)
          .filter((t) => t.rawDate > todayDate - 31 * 24 * 60 * 60 * 1000)
      );
      this.$store.commit(
        "SET_DAYS",
        Math.round(
          (todayDate.getTime() - new Date(2023, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.header {
  background-color: var(--background);
  color: var(--black);
  padding: 10px 15px;
  border-radius: 0 0 8px 8px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  height: 80px;
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
  color: var(--link);
  font-size: 20px;
  font-weight: 600;
}

footer {
  background-color: var(--background);
  color: var(--black);
  padding: 10px 15px;
  margin-top: -13px;
  border-radius: 8px 8px 0 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-btn {
  background-color: var(--footer-btn);
  border: none;
  margin: 0 30px;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}

.footer-btn:hover {
  background-color: var(--footer-hover);
}

footer a {
  text-decoration: none;
  color: var(--black);
}
</style>
