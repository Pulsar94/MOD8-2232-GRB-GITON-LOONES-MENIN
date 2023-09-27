<template>
  <div class="dashboard">
    <h1>Welcome to Your Dashboard</h1>
    </div>
      <div class="summary">
        <div>Total Expenses this Month: ${{ totalExpenses }}</div>
        <div>Average Daily Expense: ${{ averageDailyExpense }}</div>
      </div>
  <div class="chart-container">
    <div id="piechart" style="width: 900px; height: 500px; margin: auto;"></div>
  </div>
    <div class="recent-transactions">
      <h2>Recent Transactions</h2>
      <div v-for="txn in sortedTransactions" :key="txn.id" class="transaction">
        <span class="description">{{ txn.description }}</span>
        <span class="date">{{ txn.date }}</span>
        <span class="amount">Amount: ${{ txn.amount.toFixed(2) }}</span>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      totalExpenses: 0,
      averageDailyExpense: 0,
      recentTransactions: [],
      categoryTotals: {
        Utilities: 0,
        Dining: 0,
        Travel: 0,
        Entertainment: 0,
        Groceries: 0,
      },
    };
  },
  computed: {
    sortedTransactions() {
      return [...this.recentTransactions].sort((a, b) => {
        if (a.date && b.date) {
          const [dayA, monthA] = a.date.split('/').map(Number);
          const [dayB, monthB] = b.date.split('/').map(Number);

          const dateA = new Date(new Date().getFullYear(), monthA - 1, dayA);
          const dateB = new Date(new Date().getFullYear(), monthB - 1, dayB);

          return dateB - dateA; // For descending order. Use `dateA - dateB` for ascending.
        }
        return 0;
      });
    }
  },

  mounted() {
    this.generateTransactions();
    this.drawChart();
  },
  methods: {
    generateTransactions() {
      const categories = [
        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },
        { name: "Dining", paymentMethod: "CARD X0000" },
        { name: "Travel", paymentMethod: "CARD X0000" },
        { name: "Entertainment", paymentMethod: "CARD X0000" },
        { name: "Groceries", paymentMethod: "CARD X0000" },
      ];

      // Reset category totals before populating
      Object.keys(this.categoryTotals).forEach(category => {
        this.categoryTotals[category] = 0;
      });

      this.recentTransactions = []; // Clear out any old transactions

      for (let i = 0; i < 25; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = Math.floor(Math.random() * 151) + 50;
        this.recentTransactions.push({
          id: i,
          description: `${category.paymentMethod} ${Math.floor(Math.random() * 30) + 1}/${Math.floor(Math.random() * 2) + 8} ${category.name}`,
          amount,
        });
        this.categoryTotals[category.name] += amount;
      }

      this.totalExpenses = Object.values(this.categoryTotals).reduce((acc, val) => acc + val, 0);
      this.averageDailyExpense = Math.round(this.totalExpenses / 30);
    },
    drawChart() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable([
          ['Category', 'Amount'],
          ...Object.entries(this.categoryTotals)
        ]);

        const options = {
          title: 'Spending by Category'
        };

        const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      });
    },
  },
};
</script>
<style scoped>

.amount {
  align-content: flex-end;
}

/* Add these styles */
.chart-container {
  display: flex;
  align-items: center;
  padding-left: 15%;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: white;
}

h1 {
  display: flex;
  justify-content: center;
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

.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.recent-transactions {
  margin-top: 20px;
  border-radius: 5px;
  padding: 200px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.recent-transactions h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
  font-weight: 600;
  color: #333333;
}

.recent-transactions div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e1e1e1;
  font-size: 1em;
  color: #555555;
}

.recent-transactions div:last-child {
  border-bottom: none;
}

</style>


