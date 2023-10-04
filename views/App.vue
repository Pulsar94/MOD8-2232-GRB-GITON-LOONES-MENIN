<template>
  <div class="app-container">
    <header class="header">
      <div class="header-nav">
        <a href="/">
          <img class="logo" src="../assets/img/logo.svg" alt="Logo" />
        </a>
        <a href="javascript:void(0);" class="icon" v-if="navInactive" @click="toggleMenu()">
          <i class="fa fa-bars fa-xl"></i>
        </a>
        <a href="javascript:void(0);" class="icon" v-else @click="toggleMenu()">
          <i class="fa fa-times fa-xl"></i>
        </a>
      </div>
      <nav>
        <ul class="nav-links" v-if="!navInactive">
          <li v-if="!navInactive">
            <router-link to="/about" @click="toggleMenu()">About Us</router-link>
          </li>
          <li v-if="authenticated && !navInactive">
            <router-link to="/dashboard" @click="toggleMenu()">Dashboard</router-link>
          </li>
          <li v-if="authenticated && !navInactive">
            <router-link to="/settings" @click="toggleMenu()">Settings</router-link>
          </li>
          <li v-if="!authenticated && !navInactive">
            <router-link to="/login" @click="toggleMenu()">Login</router-link>
          </li>
        </ul>
      </nav>
    </header>
    <div id="app">
      <router-view></router-view>
    </div>
  </div>
  <footer ref="footer">
    <a href="/about/">
      <text class="footer-btn">About Us</text>
    </a>
    <a href="/about/">
      <text class="footer-btn">Contact</text>
    </a>
    <div>
      <router-link class="footer-btn" to="/policy">Privacy Policy</router-link>
    </div>
    <div>
      <router-link class="footer-btn" to="/terms">Terms of Service</router-link>
    </div>
  </footer>
</template>

<script>
import { ref } from "vue";

export default {
  name: "App",
  setup() {
    if (window.innerWidth < 640) {
      const navInactive = ref(true);
      return { navInactive };
    }
    const navInactive = ref(false);
    return { navInactive };
  },
  created() {
    this.populateTransactions(); // Call the function when the component is created
  },
  mounted() {
    setTimeout(() => {
      const footerHeight = this.$refs.footer.offsetHeight;
      document.documentElement.style.setProperty("--footer-height", `${footerHeight}px`);
    }, 100);
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
    toggleMenu() {
      if (window.innerWidth < 680) {
        this.navInactive = !this.navInactive;
      }
    },
    populateTransactions() {
      const categories = ["Utilities", "Dining", "Travel", "Entertainment", "Groceries"];
      const positiveCategories = ["Received bonus", "Refund", "Gift received", "Sold item"];

      const libelles = ["Electricity", "Water", "Gas", "Internet", "Phone", "Restaurant", "Fast food", "Coffee shop", "Airplane", "Train", "Bus", "Taxi", "Movie", "Concert", "Clothes", "Shoes"];

      function getRandomCategories() {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
      }
      function getRandomPositiveCategories() {
        const randomIndex = Math.floor(Math.random() * positiveCategories.length);
        return positiveCategories[randomIndex];
      }

      function getRandomLibelle() {
        const randomIndex = Math.floor(Math.random() * libelles.length);
        return libelles[randomIndex];
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
          category: getRandomCategories(), // Negative category
          libelle: getRandomLibelle(),
          amount: -getRandomAmount(20, 120), // Negative amount
          date: formatDate(date),
          rawDate: date,
        });
      }

      for (let i = 1; i <= 365; i++) {
        const date = new Date(2023, 0); // Start from January 1, 2023
        date.setDate(i); // Increase the date for each iteration
        if (formatDate(date).split("/")[2] === "1") {
          this.myTransactionsArray.push({
            id: i,
            category: "Salary",
            libelle: "Salary",
            amount: 3600, // Positive amount
            date: formatDate(date),
            rawDate: date,
          });
        } else if (i % 11 === 0 && formatDate(date).split("/")[2] !== "25") {
          // For every 11th transaction, make it positive
          this.myTransactionsArray.push({
            id: i,
            category: getRandomPositiveCategories(),
            libelle: getRandomLibelle(),
            amount: getRandomAmount(100, 250), // Positive amount
            //amount: getRandomAmount(20, 120),
            date: formatDate(date),
            rawDate: date,
          });
        } else {
          this.myTransactionsArray.push({
            id: i,
            category: getRandomCategories(), // Negative category
            libelle: getRandomLibelle(),
            amount: -getRandomAmount(20, 120), // Negative amount
            date: formatDate(date),
            rawDate: date,
          });
        }
      }
      // this.myTransactionsArray.push({
      //   id: new Date().getTime(),
      //   category: "AAAAAAAAA",
      //   libelle: "AAAAAAAAA",
      //   amount: 4000, // Positive amount
      //   date: formatDate(new Date(2020, 0, 1)),
      //   rawDate: new Date(2020, 0, 1),
      // });

      const todayDate = new Date();
      this.$store.commit("SET_INITIAL_TRANSACTIONS", this.myTransactionsArray);
      this.$store.commit(
        "SET_TRANSACTIONS",
        this.myTransactionsArray
          .filter((t) => t.rawDate < todayDate)
          .filter((t) => t.rawDate > todayDate - this.$store.state.chosenTime * 24 * 60 * 60 * 1000)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      this.$store.commit("SET_DAYS", Math.round((todayDate.getTime() - new Date(2023, 0).getTime()) / (1000 * 60 * 60 * 24)));
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
:root {
  --footer-height: 0;
}

.header {
  background-color: var(--background);
  color: var(--black);
  padding: 10px 15px;
  border-radius: 0 0 8px 8px;
  /* height: 80px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  height: 80px;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--footer-height));
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
  border-radius: 8px 8px 0 0;
  margin-top: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}

.footer-btn {
  background-color: var(--footer-btn);
  border: none;
  margin: 20px 30px;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  flex-basis: calc(50% - 20px);
}

.footer-btn:hover {
  background-color: var(--footer-hover);
}

footer a {
  text-decoration: none;
  color: var(--black);
}

.icon {
  display: none;
  color: var(--white);
  cursor: pointer;
  margin-right: 20px;
  font-size: 20px;
}

.logo {
  left: 0;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    justify-content: center;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
  }

  .nav-links li {
    margin: 10px 0;
  }

  /* footer {
    flex-direction: column;
    align-items: center;
  } */

  .header-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .icon {
    display: block;
    cursor: pointer;
    justify-self: right;
  }

  @media (max-width: 380px) {
    img {
      height: 60px;
    }
  }
}
</style>
