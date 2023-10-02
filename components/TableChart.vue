<template>
  <div class="chart-container">
    <div
      id="tablechart"
      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
    ></div>
  </div>
</template>


<script>
export default {
  name: "TableChart",
  props: {
    chartWidth: {
      type: String,
      default: "750px",
    },
    chartHeight: {
      type: String,
      default: "460px",
    },
    chartMargin: {
      type: String,
      default: "50px auto",
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
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    }
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
      this.transactions.forEach((transaction) => {
        const category = transaction.category.split(" ")[2]; // Assuming format "CARD X0000 8/9 Utilities"
        if (this.categoryTotals.hasOwnProperty(category)) {
          this.categoryTotals[category] += transaction.amount;
        }
      });

      google.charts.load("current", { packages: ["table"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const data = new google.visualization.DataTable();
          data.addColumn("string", "Category");
          data.addColumn("string", "Amount"); //
          // Format the amounts to include the $ sign
          const formattedData = Object.entries(this.categoryTotals).map(
            ([category, amount]) => {
              return [category, `$${amount.toFixed(2)}`];
            }
          );
          data.addRows(formattedData);
          const cssClassNames = {
            headerRow: "header-row",
            tableRow: "table-row",
            oddTableRow: "odd-table-row",
            selectedTableRow: "selected-table-row",
            hoverTableRow: "hover-table-row",
            headerCell: "header-cell",
            tableCell: "table-cell",
            rowNumberCell: "row-number-cell",
          };

          const options = {
            showRowNumber: true,
            width: "100%",
            height: "100%",
            cssClassNames: cssClassNames,
          };

          const table = new google.visualization.Table(
            document.getElementById("tablechart")
          );

          table.draw(data, options);

          // google.visualization.events.addListener(table, 'onmouseover', mouseoverHandler);
          // google.visualization.events.addListener(table, 'onmouseout', mouseoutHandler);
          google.visualization.events.addListener(table, 'select', onclickHandler);

          document.getElementById('tablechart').addEventListener('click', () => {
            this.handleContainerClick(table, data);
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

              const selection = table.getSelection();
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
            }, 100);
          }


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

<style>
@import url("../assets/css/variables.css");
.header-row {
  background-color: var(--table-header);
  color: var(--black);
  font-weight: bold;
}

.table-row {
  background-color: var(--table-row);
  /* background-color: green; */
  color: var(--text);
}

.odd-table-row {
  background-color: var(--table-row-odd);
  color: var(--text);
}

.hover-table-row {
  background-color: var(--table-row-hover);
  color: var(--text);
}
</style>
