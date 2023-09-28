<template>
  <div class="chart-container">
    <div id="tablechart" :style="{ width: chartWidth, height: chartHeight, margin:chartMargin }"></div>
  </div>
</template>
<script>
export default {
  name: 'TableChart',
  props: {
    chartWidth: {
      type: String,
      default: "750px"
    },
    chartHeight: {
      type: String,
      default: "460px"
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
  methods: {
    drawChart() {
      this.transactions.forEach((transaction) => {
        const category = transaction.description.split(" ")[2]; // Assuming format "CARD X0000 8/9 Utilities"
        if (this.categoryTotals.hasOwnProperty(category)) {
          this.categoryTotals[category] += transaction.amount;
        }
      });

      google.charts.load('current', {'packages': ['table']});
      google.charts.setOnLoadCallback(() => {
        try {
          const data = new google.visualization.DataTable();
          data.addColumn("string", "Category");
          data.addColumn("number", "Amount");
          data.addRows([...Object.entries(this.categoryTotals)]);

          const table = new google.visualization.Table(document.getElementById('tablechart'));

          table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
        } catch (error) {
          console.error("Error drawing the table:", error);
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
  padding: 20px;
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
