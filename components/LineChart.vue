<template>
  <div class="chart-container">
    <div id="linechart" :style="{ width: chartWidth, height: chartHeight, margin:chartMargin }"></div>
  </div>
</template>
<script>
export default {
  name: 'LineChart',
  props: {
    chartWidth: {
      type: String,
      default: "900px"
    },
    chartHeight: {
      type: String,
      default: "500px"
    },
    chartMargin: {
      type: String,
      default: "auto"
    },
    transactionCount: {
      type: Number,
      default: 10
    },
    maxAmount: {
      type: Number,
      default: 200
    },
    minAmount: {
      type: Number,
      default: 30
    },
    categories: {
      type: Array,
      default: () => [
        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },
        { name: "Dining", paymentMethod: "CARD X0000" },
        { name: "Travel", paymentMethod: "CARD X0000" },
        { name: "Entertainment", paymentMethod: "CARD X0000" },
        { name: "Groceries", paymentMethod: "CARD X0000" },
      ]
    },
    transactions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    };
  },
  computed: {
    categoryTotals() {
      const totals = {
        Utilities: 0,
        Dining: 0,
        Travel: 0,
        Entertainment: 0,
        Groceries: 0,
      };

      this.transactions.forEach(txn => {
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
      this.transactions.forEach(transaction => {
        const category = transaction.description.split(" ")[2]; // Assuming format "CARD X0000 8/9 Utilities"
        if (this.categoryTotals.hasOwnProperty(category)) {
          this.categoryTotals[category] += transaction.amount;
        }
      });
      google.charts.load('current', {'packages': ['corechart']});
      google.charts.setOnLoadCallback(() => {
        try {
          const data = new google.visualization.DataTable();
          data.addColumn('string', 'Category');
          data.addColumn('number', 'Amount');

          // Adjusted this to push data into Google's DataTable
          data.addRows([
            ...Object.entries(this.categoryTotals)
          ]);

          const options = {
            title: 'Spending by Category Over Time',
            curveType: 'function',
            legend: { position: 'bottom' }
          };

          const chart = new google.visualization.LineChart(document.getElementById('linechart'));
          chart.draw(data, options);
        } catch (error) {
          console.error("Error drawing the line chart:", error);
        }
      });


    },
  },
};
</script>
<style scoped>
div.amount {
  align-content: flex-end;
}

div.chart-container {
  display: flex;
  align-items: center;
}

div.nav-links li {
  display: inline;
}

div.nav-links a {
  text-decoration: none;
  color: white;
}

div.chart-container h1 {
  display: flex;
  justify-content: center;
  color: #333;
}

div.chart-container p {
  color: #666;
}

div.chart-container button:hover {
  background-color: #0056b3;
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

</style>
