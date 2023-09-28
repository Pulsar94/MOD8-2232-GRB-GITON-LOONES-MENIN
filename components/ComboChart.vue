<template>
  <div class="chart-container">
    <div
      id="combochart"
      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ComboChart",
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
  watch: {
    transactions(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.drawChart();
      }
    },
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
            vAxis: {
              title: "Amount",
              titleTextStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--header-text"),
              },
              textStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--text"),
              },
            },
            hAxis: {
              title: "Category",
              titleTextStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--header-text"),
              },
              textStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--text"),
              },
            },
            seriesType: "bars",
            series: { 1: { type: "line" } }, // This line makes it a combo chart
            backgroundColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--header-text"),
            annotations: {
              textStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--text"),
              },
              stem: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--text"),
              },
            },
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
