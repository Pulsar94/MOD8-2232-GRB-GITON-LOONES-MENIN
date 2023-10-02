<template>
  <div class="home-container">
    <TotalAndAverageExpenses :transactions="myTransactionsArray" />
    <div class="container">
      <NavBar @changeChart="handleChangeChart" />
      <PieChart @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Pie'" :transactions="myTransactionsArray"
      />
      <ComboChart @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Combo'" :transactions="myTransactionsArray"
      />
      <LineChart v-if="currentChart === 'Line'" :transactions="myInitialTransactionsArray"
      />
      <Table @filteredTransactions="updateRecentTransactions" v-if="currentChart === 'Table'" :transactions="myTransactionsArray"
      />
    </div>

    <RecentTransactions :transactions="filteredTransactions" />
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
      filteredTransactions: this.$store.state.myTransactionsArray,
    };
  },
  computed: {
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
      this.filteredTransactions = filteredTransactions;
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.container {
  position: relative;
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
</style>
