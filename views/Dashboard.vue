<template>
  <div class="home-container">
    <TotalAndAverageExpenses :transactions="myTransactionsArray" />
    <div class="container">
      <NavBar @changeChart="handleChangeChart" />
      <PieChart class="chart" v-if="currentChart === 'Pie'" :transactions="myTransactionsArray" />
      <ComboChart v-if="currentChart === 'Combo'" :transactions="myTransactionsArray" />
      <LineChart v-if="currentChart === 'Line'" :transactions="myTransactionsArray" />
      <Table v-if="currentChart === 'Table'" :transactions="myTransactionsArray" />
    </div>

    <RecentTransactions class="transactions" :transactions="myTransactionsArray" />
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
    };
  },
  computed: {
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray;
    },
  },
  methods: {
    handleChangeChart(chartType) {
      this.currentChart = chartType;
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
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
</style>
