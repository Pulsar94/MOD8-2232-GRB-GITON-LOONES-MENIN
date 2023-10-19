<template>
  <div class="home-container">
    <TotalAndAverageExpenses @filteredTransactions="updateRecentTransactions" :transactions="myTransactionsArray" />
    <div class="container">
      <NavBar @changeChart="handleChangeChart" />
      <PieChart @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Pie'" :transactions="myTransactionsArray"/>
      <ComboChart @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Combo' && chosenTime !== '-3'" :transactions="myTransactionsArray"/>

      <p v-if="currentChart === 'Combo' && chosenTime === '-3'"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>Please select a date range<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>

      <LineChart v-if="currentChart === 'Line'" :transactions="myTransactionsArray"/>
      <Table @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Table'" :transactions="myTransactionsArray"/>
    </div>
<!--    <h2>limit: {{limit}},balance: {{balance}} </h2>-->
    <h1 v-if="balance < limit">You are over your limit</h1>

    <RecentTransactions @updateTransactions="updateTransactions" class="transactions" :transactions="filteredTransactions" />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import PieChart from "../components/PieChart.vue";
import ComboChart from "../components/ComboChart.vue";
import LineChart from "../components/LineChart.vue";
import Table from "../components/TableChart.vue";
import RecentTransactions from "../components/RecentTransactions.vue";
import TotalAndAverageExpenses from "../components/TotalAndAverageExpenses.vue";
import {mapState} from "vuex";
import axios from "axios";

export default {
  components: {
    TotalAndAverageExpenses,
    Table,
    LineChart,
    PieChart,
    RecentTransactions,
    ComboChart,
    NavBar,
  },

  data() {
    return {
      currentChart: "Pie",
      limit: this.$store.state.limit,
      balance: this.$store.state.balance,
    };
  },
  computed: {
    ...mapState(["chosenTime"]),

    balance() {
      //create alert dialog
      if (this.$store.state.balance < this.$store.state.limit) {
        alert("You are over your limit");
      }

      return this.$store.state.balance;
    },

    filteredTransactions() {
      return this.$store.state.filteredTransactions;
    },
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray;
    },
    myInitialTransactionsArray() {
      return this.$store.state.myInitialTransactionsArray;
    },
  },

  methods: {
    handleChangeChart(chartType) {
      this.currentChart = chartType;
    },
    updateRecentTransactions(filteredTransactions) {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      this.$store.commit("SET_FILTERED_TRANSACTIONS", filteredTransactions);
      console.log(this.$store.state.filteredTransactions);
      console.log(this.$store.state.myTransactionsArray);  //magic 🧙‍♂️ (do not remove pls)
    },
    async updateTransactions() {
      const email = this.$store.state.userIDActive;

      const user = await axios.get("http://localhost:8081/api/users/" + email);

      const transactionsResponse = await axios.get("http://localhost:8081/api/transactions/" + user.data.id);

      const tempTransactions = transactionsResponse.data;
      tempTransactions.forEach((t) => {
        t.transaction_date =  new Date(t.transaction_date);
      }, tempTransactions);

      console.log(tempTransactions);

      this.$store.commit("SET_TRANSACTIONS", tempTransactions);
      this.$store.commit("SET_FILTERED_TRANSACTIONS", tempTransactions
          .filter((t) => t.transaction_date < new Date())
          .filter((t) => t.transaction_date > new Date(new Date().getTime() - this.$store.state.chosenTime * 24 * 60 * 60 * 1000))
          .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      );
    },
  },
};
</script>

<style scoped>
@import url("../../assets/css/variables.css");
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.container > * {
  vertical-align: top; /* ensures that inline-block children align properly */
}
.vertical-nav {
  float: left;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: var(--white);
}

.home-container {
  text-align: center;
  margin-top: 50px;
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

p {
  color: var(--text);
}

button {
  padding: 10px 20px;
  background-color: var(--button);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: var(--button-hover);
}

@media (max-width: 768px) {
  .container {
    display: flex;
    flex-direction: column;
  }
  .vertical-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .vertical-nav li {
    display: block;
  }
  .vertical-nav a {
    margin: 10px 0;
  }
}
h1 {
  animation: blinker 1ms linear infinite;
  color: red;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
