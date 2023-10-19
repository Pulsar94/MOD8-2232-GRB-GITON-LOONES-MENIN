<template>
  <div class="chart-container">
    <div :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }" id="piechart"></div>
  </div>
</template>
<script>
export default {
  name: "PieChart",
  props: {
    chartWidth: {
      type: String,
      default: window.innerWidth.valueOf() / 1.5 + "px",
    },
    chartHeight: {
      type: String,
      default: "500px",
    },
    chartMargin: {
      type: String,
      default: "50px auto",
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
        this.drawChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.loadGoogleChartsAPI().then(() => {
      this.drawChart();
    });
  },
  methods: {
    loadGoogleChartsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          // Google charts already loaded
          return resolve();
        }
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          google.charts.load("current", { packages: ["corechart"] });
          google.charts.setOnLoadCallback(() => {
            resolve();
          });
        };
        script.onerror = () => {
          reject(new Error("Failed to load Google Charts API"));
        };
        document.head.appendChild(script);
      });
    },
    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = [["Category", "Amount", { role: "tooltip", type: "string" }]];
          for (const [category, amount] of Object.entries(this.categoryTotals)) {
            const tooltip = `${category}: $${Math.round(amount)}`;
            dataArray.push([category, amount, tooltip]);
          }
          const data = google.visualization.arrayToDataTable(dataArray);

          const options = {
            title: "Spending by Category",
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            chartArea: {
              width: "100%",
              height: "90%",
            },
            legend: {
              position: "right",
              alignment: "center",
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            },
            pieSliceBorderColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            tooltip: { isHtml: true }, // this can be omitted if the tooltip doesn't contain HTML
          };

          const chart = new google.visualization.PieChart(document.getElementById("piechart"));

          chart.draw(data, options);

          google.visualization.events.addListener(chart, "onmouseover", mouseoverHandler);
          google.visualization.events.addListener(chart, "onmouseout", mouseoutHandler);
          google.visualization.events.addListener(chart, "select", onclickHandler);

          const vm = this;
          const s = this.$store

          function mouseoverHandler(e) {
            if (e.row != null) {
              //changing text in home
              const categoryTexts = ["Hover here to enlighten your budget! Utilities, including electricity and water bills, allow you to gauge your monthly spending. Manage your consumption wisely to keep your finances in balance.", "Satisfy your taste and budget! Dining expenses reflect your restaurant outings and culinary indulgences. Discover how to dine well while staying within your financial comfort zone.", "Plan your adventures within budget! Travel expenses encompass your vacations and trips. Explore the world without overspending by tracking your travel expenses.", "Entertain yourself responsibly! Entertainment expenses capture your leisure activities and fun outings. Enjoy life's pleasures while keeping an eye on your spending.", "Shop smartly! Groceries expenses include your food and household purchases. Learn how to optimize your grocery budget by tracking your spending."];
              const category = data.getValue(e.row, 0);
              vm.$emit("categorySelected", categoryTexts[vm.categories.findIndex((cat) => cat.name === category)]);
            }
          }
          function mouseoutHandler() {
            vm.$emit("categorySelected", "The pie chart is a powerful visualization tool that provides you with a comprehensive overview of your expenses. It elegantly breaks down your spending into various categories, allowing you to instantly grasp where your money is allocated. Whether it's groceries, entertainment, or utilities, this chart simplifies financial data, making it easier for you to identify areas where you can optimize your budget and make informed financial decisions.");
          }

          // document.getElementById("piechart").addEventListener("click", () => {
          //   this.handleContainerClick(chart, data);
          // });

          function onclickHandler() {
            setTimeout(() => {
              console.log("Select event triggered");
              const selection = chart.getSelection();
              console.log("Current selection:", selection);
              if (selection.length > 0 && typeof selection[0].row !== "undefined") {
                // Pie slice is selected
                const category = data.getValue(selection[0].row, 0);
                const filteredTransactions = vm.transactions
                    .filter((txn) => {return txn.category.includes(category);});
                    // .filter((t) => t.transaction_date < new Date())
                    // .filter((t) => t.transaction_date > new Date(new Date().getTime() - s.state.chosenTime * 24 * 60 * 60 * 1000))
                    // .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

                console.log(typeof filteredTransactions)
                vm.$emit("filteredTransactions", filteredTransactions);
                console.log("Filtered transactions emitted:", filteredTransactions);
              } else {
                // Nothing is selected, or something other than a pie slice is selected
                vm.$emit("filteredTransactions", vm.transactions);
                    // .filter((t) => t.transaction_date < new Date())
                    // .filter((t) => t.transaction_date > new Date(new Date().getTime() - s.state.chosenTime * 24 * 60 * 60 * 1000))
                    // .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)));
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
@import url("../../assets/css/variables.css");

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
