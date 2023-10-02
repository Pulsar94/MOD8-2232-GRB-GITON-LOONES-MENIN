<template>
  <div class="chart-container">
    <div
        :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
        id="piechart"
    ></div>
  </div>
</template>
<script>
export default {

  name: "PieChart",

  props: {
    chartWidth: {
      type: String,
      default: "900px",
    },
    chartHeight: {
      type: String,
      default: "500px",
    },
    chartMargin: {
      type: String,
      default: "auto",
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
    transactions() {
      return this.$store.state.transactions;
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
          if (txn.category.includes(category)) {
            totals[category] += Math.abs(txn.amount);
            break;
          }
        }
      });
      return totals;
    },
  },
  watch: {
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    }
  },
  mounted() {
    this.drawChart();
  },

  methods: {
    handleContainerClick(chart, data) {
      const selection = chart.getSelection();
      if (!selection.length) {  // If no selection, then user clicked outside a slice
        this.$emit("filteredTransactions", this.transactions);
        console.log("All transactions emitted");
      }
    },
    drawChart() {

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = [["Category", "Amount", { role: 'tooltip', type: 'string' }]];
          for (const [category, amount] of Object.entries(this.categoryTotals)) {
            const tooltip = `${category}: $${Math.round(amount)}`;
            dataArray.push([category, amount, tooltip]);
          }
          const data = google.visualization.arrayToDataTable(dataArray);

          const options = {
            title: "Spending by Category",
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            },
            pieSliceBorderColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            tooltip: { isHtml: true }  // this can be omitted if the tooltip doesn't contain HTML
          };

          const chart = new google.visualization.PieChart(document.getElementById('piechart'));

          chart.draw(data, options);

          google.visualization.events.addListener(chart, 'onmouseover', mouseoverHandler);
          google.visualization.events.addListener(chart, 'onmouseout', mouseoutHandler);
          google.visualization.events.addListener(chart, 'select', onclickHandler);

          document.getElementById('piechart').addEventListener('click', () => {
            this.handleContainerClick(chart, data);
          });


          const vm = this;

          function mouseoverHandler(e) {
            if (e.row != null) {
              //changing text in home
              const category = data.getValue(e.row, 0);
              vm.$emit("categorySelected", category);
            }
          }
          function mouseoutHandler() {
            vm.$emit("categorySelected", "Lorem ipsum dolor ...");
          }

          function onclickHandler() {
            setTimeout(() => {

              console.log("Select event triggered");

              const selection = chart.getSelection();
              console.log("Current selection:", selection);

              if (selection.length > 0 && typeof selection[0].row !== 'undefined') {
                // Pie slice is selected
                const category = data.getValue(selection[0].row, 0);
                const filteredTransactions = vm.transactions.filter((txn) => {
                  return txn.category.includes(category);
                }).sort((a, b) => new Date(b.date) - new Date(a.date));
                vm.$emit("filteredTransactions", filteredTransactions);
                console.log("Filtered transactions emitted:", filteredTransactions);
              } else {
                // Nothing is selected, or something other than a pie slice is selected
                vm.$emit("filteredTransactions", vm.transactions);
                console.log("All transactions emitted");
              }
            }, 100);
          }
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

div.amount {
  align-content: flex-end;
}

div.chart-container {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
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



<!--
<template>
  <div class="chart-container">
    <div
      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
      id="piechart"
    ></div>
  </div>
</template>
<script>
export default {
  name: "PieChart",
  props: {
    chartWidth: {
      type: String,
      default: "900px",
    },
    chartHeight: {
      type: String,
      default: "500px",
    },
    chartMargin: {
      type: String,
      default: "auto",
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
    transactions() {
      return this.$store.state.transactions;
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
          if (txn.category.includes(category)) {
            totals[category] += Math.abs(txn.amount);
            break;
          }
        }
      });
      return totals;
    },
  },
  watch: {
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    }
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = [["Category", "Amount", { role: 'tooltip', type: 'string' }]];
          for (const [category, amount] of Object.entries(this.categoryTotals)) {
            const tooltip = `${category}: $${Math.round(amount)}`;
            dataArray.push([category, amount, tooltip]);
          }
          const data = google.visualization.arrayToDataTable(dataArray);

          const options = {
            title: "Spending by Category",
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;background-color"),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;header-text"),
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),
              },
            },
            pieSliceBorderColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;background-color"),
            tooltip: { isHtml: true }  // this can be omitted if the tooltip doesn't contain HTML
          };

          const chart = new google.visualization.PieChart(document.getElementById("piechart"));
          chart.draw(data, options);

          google.visualization.events.addListener(chart, 'onmouseover', mouseoverHandler);
          google.visualization.events.addListener(chart, 'onmouseout', mouseoutHandler);
          google.visualization.events.addListener(chart, 'select', onclickHandler);

          const vm = this;

          function mouseoverHandler(e) {
            if (e.row != null) {
              //changing text in home
              const category = data.getValue(e.row, 0);
              vm.$emit("categorySelected", category);
            }
          }
          function mouseoutHandler() {
            vm.$emit("categorySelected", "Lorem ipsum dolor ...");
          }

          function onclickHandler() {
            console.log("Select event triggered");

            const selection = chart.getSelection();
            console.log("Current selection:", selection);

            if (selection.length > 0 && typeof selection[0].row !== 'undefined') {
              // Pie slice is selected
              const category = data.getValue(selection[0].row, 0);
              const filteredTransactions = vm.transactions.filter((txn) => {
                return txn.category.includes(category);
              });
              vm.$emit("filteredTransactions", filteredTransactions);
              console.log("Filtered transactions emitted:", filteredTransactions);
            } else {
              // Nothing is selected, or something other than a pie slice is selected
              vm.$emit("filteredTransactions", vm.transactions);
              console.log("All transactions emitted");
            }
          }
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

div.amount {
  align-content: flex-end;
}

div.chart-container {
  display: flex;
  align-items: center;
  background-color: var(&#45;&#45;background-color);
}

div.nav-links li {
  display: inline;
}

div.nav-links a {
  text-decoration: none;
  color: var(&#45;&#45;white);
}

div.chart-container h1 {
  display: flex;
  justify-content: center;
  color: var(&#45;&#45;header-text);
}

div.chart-container p {
  color: var(&#45;&#45;text);
}

div.chart-container button:hover {
  background-color: var(&#45;&#45;button-hover);
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
-->
