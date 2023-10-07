<template>
  <div class="chart-container">
    <div id="combochart" :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { computed } from "vue";

export default {
  name: "combochart",
  props: {
    chartWidth: {
      type: String,
      default: window.innerWidth.valueOf() / 1.2 + "px",
    },
    chartHeight: {
      type: String,
      default: "700px",
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
        this.drawChart();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState(["chosenTime"]),

    transactions() {
      return this.$store.state.transactions;
    },

    dataToDisplay() {
      switch (this.chosenTime) {
        case "7":
          return this.generateDailyDataTable;
        case "31":
          return this.generateWeeklyDataTable;
        case "365":
          return this.generateMonthlyDataTable;
        case "-1":
          return this.generateMonthlyDataTable;
        case "-2":

          if (this.$store.state.dateRange[1] - this.$store.state.dateRange[0] < 21 * 86400000){
            return this.generateDailyDataTable;
          }else if (this.$store.state.dateRange[1] - this.$store.state.dateRange[0] < 92 * 86400000){
            return this.generateWeeklyDataTable;
          }else {
            return this.generateMonthlyDataTable;
          }
        case "-3":
          this.chosenTime = "365";
          return this.generateMonthlyDataTable;

        default:
          return this.generateWeeklyDataTable;
      }
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
    generateDailyDataTable() {
      const headers = ["Date", ...this.categories.map((c) => c.name), "Mean"];
      let dataTable = [headers];

      const totalsByDate = {};

      this.transactions.forEach((transaction) => {
        const date = transaction.date;

        // Initialize the date if not yet created
        if (!totalsByDate[date]) {
          totalsByDate[date] = {};
          this.categories.forEach((c) => {
            totalsByDate[date][c.name] = 0; // Initialize every category for the date
          });
        }

        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByDate[date][category.name] += -transaction.amount;
            break; // Stop looping once we found a matching category
          }
        }
      });

      // Convert the object into an array format for Google Charts
      for (const [date, categories] of Object.entries(totalsByDate)) {
        const row = [date];
        let sum = 0;

        this.categories.forEach((c) => {
          const value = categories[c.name] || 0;
          row.push({ v: value, f: `$${Math.round(value)}` });
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({ v: mean, f: `$${mean.toFixed(2)}` });

        dataTable.push(row);
      }

      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;
    },
    generateWeeklyDataTable() {
      const headers = ["Date", ...this.categories.map((c) => c.name), "Mean"];
      let dataTable = [headers];
      const totalsByWeek = {};

      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const startOfWeek = date;
        let dayOfWeek = date.getDay();
        if (dayOfWeek === 0) {
          dayOfWeek = 6;
        } else {
          dayOfWeek -= 1;
        }
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        //const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}/${("0" + startOfWeek.getDate()).slice(-2)}`;
        const weekString = `${startOfWeek.getFullYear()}/${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}/${("0" + startOfWeek.getDate()).slice(-2)}`;

        // Initialize the week if not yet created
        if (!totalsByWeek[weekString]) {
          totalsByWeek[weekString] = {};
          this.categories.forEach((c) => {
            totalsByWeek[weekString][c.name] = 0; // Initialize every category for the date
          });
        }
        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByWeek[weekString][category.name] += -transaction.amount;
            break; // Stop looping once we found a matching category
          }
        }
      });
      // Convert the object into an array format for Google Charts
      for (const [weekString, categories] of Object.entries(totalsByWeek)) {
        const row = [weekString];
        let sum = 0;
        this.categories.forEach((c) => {
          const value = categories[c.name] || 0;
          row.push({ v: value, f: `$${Math.round(value)}` });
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({ v: mean, f: `$${mean.toFixed(2)}` });
        dataTable.push(row);
      }
      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;
    },
    generateMonthlyDataTable() {
      const headers = ["Date", ...this.categories.map((c) => c.name), "Mean"];
      let dataTable = [headers];
      const totalsByMonth = {};

      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthYearKey = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}`;

        // Initialize the date if not yet created
        if (!totalsByMonth[monthYearKey]) {
          totalsByMonth[monthYearKey] = {};
          this.categories.forEach((c) => {
            totalsByMonth[monthYearKey][c.name] = 0; // Initialize every category for the date
          });
        }
        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByMonth[monthYearKey][category.name] += -transaction.amount;
            break; // Stop looping once we found a matching category
          }
        }
      });
      // Convert the object into an array format for Google Charts
      for (const [monthString, categories] of Object.entries(totalsByMonth)) {
        const row = [monthString];
        let sum = 0;
        this.categories.forEach((c) => {
          const value = categories[c.name] || 0;
          row.push({ v: value, f: `$${Math.round(value)}` });
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({ v: mean, f: `$${mean.toFixed(2)}` });
        dataTable.push(row);
      }
      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;
    },

    handleContainerClick(chart, data) {
      const selection = chart.getSelection();
      if (selection.length) {
        this.$emit("filteredTransactions", this.transactions);
      }
    },
    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          // Some raw data (not necessarily accurate)
          const dataArray = this.dataToDisplay;
          const data = google.visualization.arrayToDataTable(dataArray());

          const options = {
            title: "Amount spent by category over time",
            vaxis: { title: "Cups" },
            haxis: { title: "Month" },
            tooltip: { isHtml: true },
            seriesType: "bars",
            series: { 5: { type: "line" } },
            chartArea: {
              width: "85%",
              height: "60%",
            },

            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
              position: "in",
              margin: "-20px 0",
            },
            hAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
              slantedText: true,
              slantedTextAngle: 45,
            },
            vAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            },
          };

          const chart = new google.visualization.ComboChart(document.getElementById("combochart"));
          chart.draw(data, options);

          //google.visualization.events.addListener(chart, 'onmouseover', mouseoverHandler);
          //google.visualization.events.addListener(chart, 'onmouseout', mouseoutHandler);
          google.visualization.events.addListener(chart, "select", onclickHandler);

          document.getElementById("combochart").addEventListener("click", () => {
            this.handleContainerClick(chart, data);
          });

          const vm = this;
          function onclickHandler() {
            setTimeout(() => {

              const selection = chart.getSelection();

              // If no selection, emit all transactions
              if (selection.length === 0) {
                vm.$emit("filteredTransactions", vm.transactions);
                return;
              }

              // If the row is null, then it might be a click on the legend or axes
              if (selection[0].row === null) {
                const clickedTargetID = selection[0].targetID;

                if (selection[0].row === null && typeof selection[0].column !== "undefined") {
                  // This might indicate a category (legend) click
                  const clickedCategory = data.getColumnLabel(selection[0].column);

                  const filteredTransactionsByCategory = vm.transactions.filter((txn) => txn.category === clickedCategory);
                  vm.$emit("filteredTransactions", filteredTransactionsByCategory);
                } else if (selection.length > 0 && typeof selection[0].row !== "undefined") {
                  // Handle the case where the chart background or other non-legend, non-data areas are clicked
                  vm.$emit("filteredTransactions", vm.transactions);
                }

                return;
              }
              // Handle when a bar/line is clicked
              let datePeriodString = data.getValue(selection[0].row, 0);
              if (vm.chosenTime === "-1" || vm.chosenTime === "365") {
                datePeriodString = data.getValue(selection[0].row, 0) + "/01";
              }
              const datePeriod = new Date(datePeriodString);
              const clickedCategory = data.getColumnLabel(selection[0].column);

              const currentDateYear = new Date().getFullYear();
              const convertedDatePeriod = `${currentDateYear}/${("0" + (datePeriod.getMonth() + 1)).slice(-2)}/${("0" + datePeriod.getDate()).slice(-2)}`;

              const convertedDatePeriodO = datePeriodString.replace("-", "/");

              const mondayDate = new Date(convertedDatePeriod);
              const sundayDate = new Date(mondayDate);

              sundayDate.setDate(mondayDate.getDate() + 6); // Move to Sunday of that week
              let filteredTransactions = vm.transactions;
              if (clickedCategory !== "Mean") {
                if (vm.chosenTime === "7") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate.getTime() === mondayDate.getTime() && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                  });
                } else if (vm.chosenTime === "31") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate >= mondayDate && txnDate <= sundayDate && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                  });
                } else if (vm.chosenTime === "365" || vm.chosenTime === "-1") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate.getMonth() === mondayDate.getMonth() && txnDate.getFullYear() === mondayDate.getFullYear() && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                  });
                }
              } else {
                if (vm.chosenTime === "7") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate.getTime() === mondayDate.getTime();
                  });
                } else if (vm.chosenTime === "31") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate >= mondayDate && txnDate <= sundayDate;
                  });
                } else if (vm.chosenTime === "365" || vm.chosenTime === "-1") {
                  filteredTransactions = vm.transactions.filter((txn) => {
                    const txnDate = new Date(txn.date);
                    return txnDate.getMonth() === mondayDate.getMonth() && txnDate.getFullYear() === mondayDate.getFullYear();
                  });
                }
              }

              vm.$emit("filteredTransactions", filteredTransactions);
            }, 10);
          }
        } catch (error) {
          console.error("Error drawing the combo chart:", error);
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