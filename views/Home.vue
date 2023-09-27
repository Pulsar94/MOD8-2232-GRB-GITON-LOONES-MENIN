<template>
  <div class="home-container">
    <h2>Welcome to ExpenseMate!</h2>
    <p>Struggling to keep track of your spending? Overwhelmed by numerous bills, receipts, and expenses? Say hello to ExpenseMate—your trusted partner in financial management.</p>
    <p>Our platform offers you a comprehensive view of all your expenditures, breaking them down into easy-to-understand categories and visual diagrams. We simplify budgeting so that you can focus on making better financial decisions.</p>
    <p>Unlock the power of smart spending. With ExpenseMate, you gain insight, clarity, and control over your financial world. Don't just view your expenses—understand them.</p>

    <h2>Here's a preview :</h2>

    <div class="container">
      <NavBar @changeChart="handleChangeChart" />
      <PieChart v-if="currentChart === 'Pie'" :transactions="myTransactionsArray"/>
      <ComboChart v-if="currentChart === 'Combo'" :transactions="myTransactionsArray"/>
      <LineChart v-if="currentChart === 'Line'" :transactions="myTransactionsArray"/>
      <Table v-if="currentChart === 'Table'" :transactions="myTransactionsArray"/>
    </div>

    <RecentTransactions :transactions="myTransactionsArray" />

  </div>

</template>

<script>
import NavBar from '../components/NavBar.vue';
import PieChart from "../components/PieChart.vue";
import ComboChart from "../components/ComboChart.vue";
import LineChart from "../components/LineChart.vue";
import Table from "../components/Table.vue";
import RecentTransactions from "../components/RecentTransactions.vue";

export default {
  components: {Table, LineChart, PieChart, RecentTransactions, ComboChart, NavBar},

  data() {
    return {
      currentChart: 'Pie',  // default to showing the current chart
      myTransactionsArray: [
        {
          id: 1,
          description: "Utilities",
          amount: Math.random()*100 + 20,
          date: "8/9"
        },
        {
          id: 2,
          description: "Dining",
          amount: Math.random()*100 + 20,
          date: "9/9"
        },
        {
          id: 3,
          description: "Travel",
          //make the amount random between 100 and 200
          amount: Math.random()*100 + 20,
          date: "10/9"
        },
        {
          id: 4,
          description: "Entertainment",
          amount: Math.random()*100 + 20,
          date: "11/9"
        },
        {
          id: 5,
          description: "Groceries",
          amount: Math.random()*100 + 20,
          date: "12/9"
        }
      ]
    }
  },
  methods: {
    handleChangeChart(chartType) {
      this.currentChart = chartType;
    }
  }
};
</script>

<style scoped>


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
  color: white;
}

.home-container {
  text-align: center;
  margin-top: 50px;
  background-color: white;
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
