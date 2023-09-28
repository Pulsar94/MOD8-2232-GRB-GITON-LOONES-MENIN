<template>
  <div class="chart-container">
    <div :style="{ width: chartWidth, height: chartHeight, margin:chartMargin }" id="piechart"></div>
  </div>

</template>
<script>
export default {
  name: "PieChart",
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
  watch: {
    transactions(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.drawChart();
      }
    }
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      google.charts.load('current', {'packages': ['corechart']});
      google.charts.setOnLoadCallback(() => {
        try {
          const data = google.visualization.arrayToDataTable([
            ['Category', 'Amount'],
            ...Object.entries(this.categoryTotals)
          ]);

          const options = {
            title: "Spending by Category",
          };

          const chart = new google.visualization.PieChart(document.getElementById('piechart'));
          google.visualization.events.addListener(chart, 'select', selectHandler);


          const vm = this;
          function selectHandler(e) {
            const selectedItem = chart.getSelection()[0];
            if (selectedItem) {
              const category = data.getValue(selectedItem.row, 0);
              // Emit the event to the parent
              vm.$emit('categorySelected', category);
            }
          }

          chart.draw(data, options);
        } catch (error) {
          console.error("Error drawing the chart:", error);
        }
      });
    }

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
