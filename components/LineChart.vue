<template>
  <div class="chart-container">
    <div id="linechart" :style="{ width: chartWidth, height: chartHeight, margin:chartMargin }"></div>
  </div>
</template>
<script>
export default {
  name: "LineChart",
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
  watch: {
    transactions(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.drawChart();
      }
    }
  },
  computed: {
    accumulatedAmounts() {
      let total = 0;
      return this.transactions.map(transaction => {
        total += transaction.amount;
        return [transaction.date, total];
      });
    },
    dailyAmounts() {
      const totalsByDate = {};

      this.transactions.forEach(transaction => {
        if (!totalsByDate[transaction.date]) {
          totalsByDate[transaction.date] = 0;
        }
        totalsByDate[transaction.date] += transaction.amount;
      });

      // Convert the object into an array of [date, amount] pairs
      return Object.entries(totalsByDate).sort((a, b) => new Date(a[0]) - new Date(b[0]));
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
      google.charts.load('current', {'packages': ['corechart']});
      google.charts.setOnLoadCallback(() => {
        try {
          const data = new google.visualization.DataTable();
          data.addColumn("string", "Date");
          data.addColumn("number", "Amount Spent");

          // Use the daily amounts for the line chart
          data.addRows(this.dailyAmounts);

          const options = {
            title: "Amount Spent Each Day Over Time",
            curveType: "function",
            legend: { position: "bottom" },
            hAxis: {
              title: 'Date'
            },
            vAxis: {
              title: 'Amount Spent'
            }
          };

          const chart = new google.visualization.LineChart(document.getElementById('linechart'));
          chart.draw(data, options);
        } catch (error) {
          console.error("Error drawing the line chart:", error);
        }
      });
    }


    // drawChart() {
    //   google.charts.load('current', {'packages': ['corechart']});
    //   google.charts.setOnLoadCallback(() => {
    //     try {
    //       const data = new google.visualization.DataTable();
    //       data.addColumn("string", "Date");
    //       data.addColumn("number", "Total Amount");
    //
    //       // Use the accumulated amounts for the line chart
    //       data.addRows(this.accumulatedAmounts);
    //
    //       const options = {
    //         title: "Total Amount Over Time",
    //         curveType: "function",
    //         legend: { position: "bottom" },
    //         hAxis: {
    //           title: 'Date'
    //         },
    //         vAxis: {
    //           title: 'Total Amount'
    //         }
    //       };
    //
    //       const chart = new google.visualization.LineChart(document.getElementById('linechart'));
    //       chart.draw(data, options);
    //     } catch (error) {
    //       console.error("Error drawing the line chart:", error);
    //     }
    //   });
    // }
  },
};
</script>
<style scoped>
@import url("../assets/css/variables.css");
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
  color: var(--white);
}

div.chart-container h1 {
  display: flex;
  justify-content: center;
  color: var(--header-text);
}

div.chart-container p {
  color: var(--text);
}

div.chart-container button:hover {
  background-color: var(--button-hover);
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
