<template>
  <div class="chart-container">
    <div
        id="combochart"
        :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
    ></div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "combochart",
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
  watch: {
    transactions(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.drawChart();
      }
    },
  },

  computed: {
    ...mapState(["chosenTime"]),

    dataToDisplay() {
      console.log(this.chosenTime);
      switch (this.chosenTime) {
        case "7":
          return this.generateDailyDataTable;
        case "31":
          return this.generateWeeklyDataTable;
        case "365":
          return this.generateMonthlyDataTable;
        case "-1":
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
          if (txn.description.includes(category)) {
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
    generateDailyDataTable() {
      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];
      let dataTable = [headers];

      const totalsByDate = {};

      this.transactions.forEach(transaction => {
        const date = transaction.date;

        // Initialize the date if not yet created
        if (!totalsByDate[date]) {
          totalsByDate[date] = {};
          this.categories.forEach(c => {
            totalsByDate[date][c.name] = 0;  // Initialize every category for the date
          });
        }

        // Check if the category exists in the transaction's description
        for (const category of this.categories) {
          if (transaction.description.includes(category.name)) {
            totalsByDate[date][category.name] += Math.abs(transaction.amount);
            break;  // Stop looping once we found a matching category
          }
        }
      });

      // Convert the object into an array format for Google Charts
      for (const [date, categories] of Object.entries(totalsByDate)) {
        const row = [date];
        let sum = 0;

        this.categories.forEach(c => {
          const value = categories[c.name] || 0;
          row.push({v: value, f: `$${Math.round(value)}`});
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({v: mean, f: `$${mean.toFixed(2)}`});

        dataTable.push(row);
      }

      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;

    },
    generateWeeklyDataTable() {
      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];
      let dataTable = [headers];

      const totalsByWeek = {};

      this.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const startOfWeek = date;
        let dayOfWeek = date.getDay();
        if (dayOfWeek === 0) {
          dayOfWeek = 6;
        } else {
          dayOfWeek -= 1;
        }
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}-${("0" + startOfWeek.getDate()).slice(-2)}`;

        // Initialize the week if not yet created
        if (!totalsByWeek[weekString]) {
          totalsByWeek[weekString] = {};
          this.categories.forEach(c => {
            totalsByWeek[weekString][c.name] = 0;  // Initialize every category for the date
          });
        }

        // Check if the category exists in the transaction's description
        for (const category of this.categories) {
          if (transaction.description.includes(category.name)) {
            totalsByWeek[weekString][category.name] += Math.abs(transaction.amount);
            break;  // Stop looping once we found a matching category
          }
        }
      });

      // Convert the object into an array format for Google Charts
      for (const [weekString, categories] of Object.entries(totalsByWeek)) {
        const row = [weekString];
        let sum = 0;
        this.categories.forEach(c => {
          const value = categories[c.name] || 0;
          row.push({v: value, f: `$${Math.round(value)}`});
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({v: mean, f: `$${mean.toFixed(2)}`});

        dataTable.push(row);
      }

      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;

    },
    generateMonthlyDataTable() {
      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];
      let dataTable = [headers];

      const totalsByMonth = {};

      this.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYearKey = `${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;

        // Initialize the date if not yet created
        if (!totalsByMonth[monthYearKey]) {
          totalsByMonth[monthYearKey] = {};
          this.categories.forEach(c => {
            totalsByMonth[monthYearKey][c.name] = 0;  // Initialize every category for the date
          });
        }

        // Check if the category exists in the transaction's description
        for (const category of this.categories) {
          if (transaction.description.includes(category.name)) {
            totalsByMonth[monthYearKey][category.name] += Math.abs(transaction.amount);
            break;  // Stop looping once we found a matching category
          }
        }
      });

      // Convert the object into an array format for Google Charts
      for (const [monthString, categories] of Object.entries(totalsByMonth)) {
        const row = [monthString];
        let sum = 0;
        this.categories.forEach(c => {
          const value = categories[c.name] || 0;
          row.push({v: value, f: `$${Math.round(value)}`});
          sum += value;
        });
        const mean = sum / this.categories.length;
        row.push({v: mean, f: `$${mean.toFixed(2)}`});
        dataTable.push(row);
      }


      dataTable = [headers, ...dataTable.slice(1).reverse()];
      return dataTable;
    },


    drawChart() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(() => {
        try {
          // Some raw data (not necessarily accurate)
          const dataArray = this.dataToDisplay;
          console.log(typeof dataArray, dataArray);
          const data = google.visualization.arrayToDataTable(dataArray());

          const options = {
            title: 'Monthly Coffee Production by Country',
            vaxis: {title: 'Cups'},
            haxis: {title: 'Month'},
            tooltip: { isHtml: true },
            seriesType: 'bars',
            series: {5: {type: 'line'}},


            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            },
            hAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            },
            vAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
            }
          };

          const chart = new google.visualization.ComboChart(document.getElementById('combochart'));
          chart.draw(data, options);
        }catch (error) {
          console.error("Error drawing the combo chart:", error);
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


























<!--<template>-->
<!--  <div class="chart-container">-->
<!--    <div-->
<!--        id="combochart"-->
<!--        :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"-->
<!--    ></div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import { mapState } from "vuex";-->

<!--export default {-->
<!--  name: "combochart",-->
<!--  props: {-->
<!--    chartWidth: {-->
<!--      type: String,-->
<!--      default: "900px",-->
<!--    },-->
<!--    chartHeight: {-->
<!--      type: String,-->
<!--      default: "500px",-->
<!--    },-->
<!--    chartMargin: {-->
<!--      type: String,-->
<!--      default: "auto",-->
<!--    },-->
<!--    transactionCount: {-->
<!--      type: Number,-->
<!--      default: 10,-->
<!--    },-->
<!--    maxAmount: {-->
<!--      type: Number,-->
<!--      default: 200,-->
<!--    },-->
<!--    minAmount: {-->
<!--      type: Number,-->
<!--      default: 30,-->
<!--    },-->
<!--    categories: {-->
<!--      type: Array,-->
<!--      default: () => [-->
<!--        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },-->
<!--        { name: "Dining", paymentMethod: "CARD X0000" },-->
<!--        { name: "Travel", paymentMethod: "CARD X0000" },-->
<!--        { name: "Entertainment", paymentMethod: "CARD X0000" },-->
<!--        { name: "Groceries", paymentMethod: "CARD X0000" },-->
<!--      ],-->
<!--    },-->
<!--    transactions: {-->
<!--      type: Array,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {};-->
<!--  },-->
<!--  watch: {-->
<!--    transactions(newVal, oldVal) {-->
<!--      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {-->
<!--        this.drawChart();-->
<!--      }-->
<!--    },-->
<!--  },-->

<!--  computed: {-->
<!--    ...mapState(["chosenTime"]),-->

<!--    dataToDisplay() {-->
<!--      console.log(this.chosenTime);-->
<!--      switch (this.chosenTime) {-->
<!--        case "7":-->
<!--          return this.generateDailyDataTable;-->
<!--        case "31":-->
<!--          return this.generateWeeklyDataTable;-->
<!--        case "365":-->
<!--          return this.generateMonthlyDataTable;-->
<!--        case "-1":-->
<!--          return this.generateMonthlyDataTable;-->
<!--        default:-->
<!--          return this.generateWeeklyDataTable;-->
<!--      }-->
<!--    },-->

<!--    categoryTotals() {-->
<!--      const totals = {-->
<!--        Utilities: 0,-->
<!--        Dining: 0,-->
<!--        Travel: 0,-->
<!--        Entertainment: 0,-->
<!--        Groceries: 0,-->
<!--      };-->

<!--      this.transactions.forEach((txn) => {-->
<!--        for (const category in totals) {-->
<!--          if (txn.description.includes(category)) {-->
<!--            totals[category] += Math.abs(txn.amount);-->
<!--            break;-->
<!--          }-->
<!--        }-->
<!--      });-->

<!--      return totals;-->
<!--    },-->
<!--  },-->

<!--  mounted() {-->
<!--    this.drawChart();-->
<!--  },-->

<!--  methods: {-->
<!--    generateDailyDataTable() {-->
<!--      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];-->
<!--      const dataTable = [headers];-->

<!--      const totalsByDate = {};-->

<!--      this.transactions.forEach(transaction => {-->
<!--        const date = transaction.date;-->

<!--        // Initialize the date if not yet created-->
<!--        if (!totalsByDate[date]) {-->
<!--          totalsByDate[date] = {};-->
<!--          this.categories.forEach(c => {-->
<!--            totalsByDate[date][c.name] = 0;  // Initialize every category for the date-->
<!--          });-->
<!--        }-->

<!--        // Check if the category exists in the transaction's description-->
<!--        for (const category of this.categories) {-->
<!--          if (transaction.description.includes(category.name)) {-->
<!--            totalsByDate[date][category.name] += Math.abs(transaction.amount);-->
<!--            break;  // Stop looping once we found a matching category-->
<!--          }-->
<!--        }-->
<!--      });-->

<!--      // Convert the object into an array format for Google Charts-->
<!--      for (const [date, categories] of Object.entries(totalsByDate)) {-->
<!--        const row = [date];-->
<!--        let sum = 0;-->
<!--        this.categories.forEach(c => {-->
<!--          const value = categories[c.name] || 0;-->
<!--          row.push(value);-->
<!--          sum += value;-->
<!--        });-->
<!--        const mean = sum / this.categories.length;-->
<!--        row.push(mean);-->
<!--        dataTable.push(row);-->
<!--      }-->

<!--      return dataTable;-->
<!--    },-->
<!--    generateWeeklyDataTable() {-->
<!--      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];-->
<!--      const dataTable = [headers];-->

<!--      const totalsByWeek = {};-->

<!--      this.transactions.forEach(transaction => {-->
<!--        const date = new Date(transaction.date);-->
<!--        const startOfWeek = date;-->
<!--        let dayOfWeek = date.getDay();-->
<!--        if (dayOfWeek === 0) {-->
<!--          dayOfWeek = 6;-->
<!--        } else {-->
<!--          dayOfWeek -= 1;-->
<!--        }-->
<!--        startOfWeek.setDate(date.getDate() - dayOfWeek);-->
<!--        const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}-${("0" + startOfWeek.getDate()).slice(-2)}`;-->

<!--        // Initialize the week if not yet created-->
<!--        if (!totalsByWeek[weekString]) {-->
<!--          totalsByWeek[weekString] = {};-->
<!--          this.categories.forEach(c => {-->
<!--            totalsByWeek[weekString][c.name] = 0;  // Initialize every category for the date-->
<!--          });-->
<!--        }-->

<!--        // Check if the category exists in the transaction's description-->
<!--        for (const category of this.categories) {-->
<!--          if (transaction.description.includes(category.name)) {-->
<!--            totalsByWeek[weekString][category.name] += Math.abs(transaction.amount);-->
<!--            break;  // Stop looping once we found a matching category-->
<!--          }-->
<!--        }-->
<!--      });-->

<!--      // Convert the object into an array format for Google Charts-->
<!--      for (const [weekString, categories] of Object.entries(totalsByWeek)) {-->
<!--        const row = [weekString];-->
<!--        let sum = 0;-->
<!--        this.categories.forEach(c => {-->
<!--          const value = categories[c.name] || 0;-->
<!--          row.push(value);-->
<!--          sum += value;-->
<!--        });-->
<!--        const mean = sum / this.categories.length;-->
<!--        row.push(mean);-->
<!--        dataTable.push(row);-->
<!--      }-->

<!--      return dataTable;-->
<!--    },-->
<!--    generateMonthlyDataTable() {-->
<!--      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];-->
<!--      const dataTable = [headers];-->

<!--      const totalsByMonth = {};-->

<!--      this.transactions.forEach(transaction => {-->
<!--        const date = new Date(transaction.date);-->
<!--        const monthYearKey = `${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;-->

<!--        // Initialize the date if not yet created-->
<!--        if (!totalsByMonth[monthYearKey]) {-->
<!--          totalsByMonth[monthYearKey] = {};-->
<!--          this.categories.forEach(c => {-->
<!--            totalsByMonth[monthYearKey][c.name] = 0;  // Initialize every category for the date-->
<!--          });-->
<!--        }-->

<!--        // Check if the category exists in the transaction's description-->
<!--        for (const category of this.categories) {-->
<!--          if (transaction.description.includes(category.name)) {-->
<!--            totalsByMonth[monthYearKey][category.name] += Math.abs(transaction.amount);-->
<!--            break;  // Stop looping once we found a matching category-->
<!--          }-->
<!--        }-->
<!--      });-->

<!--      // Convert the object into an array format for Google Charts-->
<!--      for (const [monthString, categories] of Object.entries(totalsByMonth)) {-->
<!--        const row = [monthString];-->
<!--        let sum = 0;-->
<!--        this.categories.forEach(c => {-->
<!--          const value = categories[c.name] || 0;-->
<!--          row.push(value);-->
<!--          sum += value;-->
<!--        });-->
<!--        const mean = sum / this.categories.length;-->
<!--        row.push(mean);-->
<!--        dataTable.push(row);-->
<!--      }-->


<!--      return dataTable;-->
<!--    },-->


<!--    drawChart() {-->
<!--      google.charts.load('current', {'packages':['corechart']});-->
<!--      google.charts.setOnLoadCallback(() => {-->
<!--        try {-->
<!--          // Some raw data (not necessarily accurate)-->
<!--          const dataArray = this.dataToDisplay;-->
<!--          console.log(typeof dataArray, dataArray);-->
<!--          const data = google.visualization.arrayToDataTable(dataArray());-->

<!--          const options = {-->
<!--            title: 'Monthly Coffee Production by Country',-->
<!--            vaxis: {title: 'Cups'},-->
<!--            haxis: {title: 'Month'},-->
<!--            seriesType: 'bars',-->
<!--            series: {5: {type: 'line'}},-->

<!--            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;background-color"),-->
<!--            titleColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;header-text"),-->
<!--            legend: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            },-->
<!--            hAxis: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            },-->
<!--            vAxis: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            }-->
<!--          };-->

<!--          const chart = new google.visualization.ComboChart(document.getElementById('combochart'));-->
<!--          chart.draw(data, options);-->
<!--        }catch (error) {-->
<!--          console.error("Error drawing the combo chart:", error);-->
<!--        }-->
<!--      });-->
<!--    }-->
<!--  },-->
<!--};-->
<!--</script>-->
<!--<style scoped>-->
<!--@import url("../assets/css/variables.css");-->
<!--div.amount {-->
<!--  align-content: flex-end;-->
<!--}-->

<!--div.chart-container {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--div.nav-links li {-->
<!--  display: inline;-->
<!--}-->

<!--div.nav-links a {-->
<!--  text-decoration: none;-->
<!--  color: var(&#45;&#45;white);-->
<!--}-->

<!--div.chart-container h1 {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  color: var(&#45;&#45;header-text);-->
<!--}-->

<!--div.chart-container p {-->
<!--  color: var(&#45;&#45;text);-->
<!--}-->

<!--div.chart-container button:hover {-->
<!--  background-color: var(&#45;&#45;button-hover);-->
<!--}-->

<!--div.summary {-->
<!--  display: flex;-->
<!--  justify-content: space-around;-->
<!--  margin-bottom: 20px;-->
<!--}-->
<!--</style>-->