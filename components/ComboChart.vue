<template>
  <div class="summary">
    <div>Total Expenses this Month: ${{ totalExpenses }}</div>
    <div>Average Daily Expense: ${{ averageDailyExpense }}</div>
  </div>
  <div class="chart-container">
    <div
      id="combochart"
      style="width: 900px; height: 500px; margin: auto"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ComboChart",
  props: {
    transactionCount: {
      type: Number,
      default: 10,
    },
    maxAmount: {
      type: Number,
      default: 200,
    },
    minAmount: {
      type: Number,
      default: 30,
    },
    categories: {
      type: Array,
      default: () => [
        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },
        { name: "Dining", paymentMethod: "CARD X0000" },
        { name: "Travel", paymentMethod: "CARD X0000" },
        { name: "Entertainment", paymentMethod: "CARD X0000" },
        { name: "Groceries", paymentMethod: "CARD X0000" },
      ],
    },
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    totalExpenses() {
      return Math.round(
        this.transactions.reduce((sum, txn) => sum + txn.amount, 0)
      );
    },
    averageDailyExpense() {
      return Math.round(this.totalExpenses / 30);
    },
    categoryTotals() {
      const totals = {
        Utilities: 0,
        Dining: 0,
        Travel: 0,
        Entertainment: 0,
        Groceries: 0,
      };

      this.transactions.forEach((txn) => {
        for (const category in totals) {
          if (txn.description.includes(category)) {
            totals[category] += txn.amount;
            break;
          }
        }
      });

      return totals;
    },
  },

  mounted() {
    this.drawChart();
  },

  methods: {
    drawChart() {
      // Load Google Charts
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          // Data for Combo Chart
          const data = new google.visualization.DataTable();
          data.addColumn("string", "Category");
          data.addColumn("number", "Amount");
          data.addRows([...Object.entries(this.categoryTotals)]);

          const options = {
            title: "Spending by Category",
            vAxis: { title: "Amount" },
            hAxis: { title: "Category" },
            seriesType: "bars",
            series: { 1: { type: "line" } }, // This line makes it a combo chart
          };

          const chart = new google.visualization.ComboChart(
            document.getElementById("combochart")
          );
          chart.draw(data, options);
        } catch (error) {
          console.error("Error drawing the chart:", error);
        }
      });
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");

.amount {
  align-content: flex-end;
}

/* Add these styles */
.chart-container {
  display: flex;
  align-items: center;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: var(--white);
}

p {
  color: var(--text);
}

button:hover {
  background-color: var(--button-hover);
}

.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
