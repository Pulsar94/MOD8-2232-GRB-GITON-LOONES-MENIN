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
import {computed} from "vue";

export default {
  name: "combochart",
  props: {
    chartWidth: {
      type: String,
      default: window.innerWidth.valueOf() / 1.2 + "px",
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
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["chosenTime"]),

    transactions() {
      return this.$store.state.transactions;
    },

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

        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByDate[date][category.name] += -(transaction.amount);
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
        //const weekString = `${startOfWeek.getFullYear()}/${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}/${("0" + startOfWeek.getDate()).slice(-2)}`;

        // Initialize the week if not yet created
        if (!totalsByWeek[weekString]) {
          totalsByWeek[weekString] = {};
          this.categories.forEach(c => {
            totalsByWeek[weekString][c.name] = 0;  // Initialize every category for the date
          });
        }
        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByWeek[weekString][category.name] += -(transaction.amount);
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
        const monthYearKey = `${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;

        // Initialize the date if not yet created
        if (!totalsByMonth[monthYearKey]) {
          totalsByMonth[monthYearKey] = {};
          this.categories.forEach(c => {
            totalsByMonth[monthYearKey][c.name] = 0;  // Initialize every category for the date
          });
        }
        // Check if the category exists in the transaction's category
        for (const category of this.categories) {
          if (transaction.category.includes(category.name)) {
            totalsByMonth[monthYearKey][category.name] += -(transaction.amount);
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

    handleContainerClick(chart, data) {
      const selection = chart.getSelection();
      // console.log("Selection length: ", selection.length);
      if (selection.length) {
        this.$emit("filteredTransactions", this.transactions);
        // console.log("All transactions emitted");
      }
    },
    drawChart() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(() => {
        try {
          // Some raw data (not necessarily accurate)
          const dataArray = this.dataToDisplay;
          //console.log(typeof dataArray, dataArray);
          const data = google.visualization.arrayToDataTable(dataArray());

          const options = {
            title: 'Amount spent by category over time',
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


          //google.visualization.events.addListener(chart, 'onmouseover', mouseoverHandler);
          //google.visualization.events.addListener(chart, 'onmouseout', mouseoutHandler);
          google.visualization.events.addListener(chart, 'select', onclickHandler);

          document.getElementById('combochart').addEventListener('click', () => {
            // console.log("Container clicked");
            this.handleContainerClick(chart, data);
          });



          const vm = this;
          function onclickHandler() {
            setTimeout(() => {
              console.log("Select event triggered");

              const selection = chart.getSelection();
              console.log("Current selection:", selection);

              // If no selection, emit all transactions
              if (selection.length === 0) {
                vm.$emit("filteredTransactions", vm.transactions);
                console.log("All transactions emitted");
                return;
              }

              // If the row is null, then it might be a click on the legend or axes
              if (selection[0].row === null) {

                const clickedTargetID = selection[0].targetID;
                console.log("clickedTargetID:", clickedTargetID);

                if (selection[0].row === null && typeof selection[0].column !== 'undefined') {
                  // This might indicate a category (legend) click
                  const clickedCategory = data.getColumnLabel(selection[0].column);
                  console.log("Clicked Category from legend:", clickedCategory);

                  const filteredTransactionsByCategory = vm.transactions.filter((txn) => txn.category === clickedCategory);
                  console.log("Filtered transactions by category:", filteredTransactionsByCategory);
                  vm.$emit("filteredTransactions", filteredTransactionsByCategory);
                } else if (selection.length > 0 && typeof selection[0].row !== 'undefined') {
                  // Handle the case where the chart background or other non-legend, non-data areas are clicked
                  vm.$emit("filteredTransactions", vm.transactions);
                  console.log("All transactions emitted");
                }

                return;
              }
              // Handle when a bar/line is clicked
              let datePeriodString = data.getValue(selection[0].row, 0);
              if (vm.chosenTime === '-1' || vm.chosenTime === '365'){
                datePeriodString =("01/" +  data.getValue(selection[0].row, 0)).slice(-10);
              }
              const datePeriod = new Date(datePeriodString);
              const clickedCategory = data.getColumnLabel(selection[0].column);

              const currentDateYear = new Date().getFullYear();
              const convertedDatePeriod = `${currentDateYear}/${("0" + (datePeriod.getMonth()+1)).slice(-2)}/${("0" + (datePeriod.getDate())).slice(-2)}`;
              console.log(datePeriodString)
              console.log(datePeriod, convertedDatePeriod)
              let convertedDatePeriodO = `${currentDateYear}/${datePeriodString.replace('-', '/')}`;
              if(vm.chosenTime === '7'){
                convertedDatePeriodO = datePeriodString.replace('-', '/');
              }

              console.log(convertedDatePeriodO)
              const mondayDate = new Date(convertedDatePeriod);
              const sundayDate = new Date(mondayDate);

              sundayDate.setDate(mondayDate.getDate() + 6); // Move to Sunday of that week
              let filteredTransactions = vm.transactions;
              console.log(vm.chosenTime)
              if (vm.chosenTime === '7'){
                console.log("777777777777")
                filteredTransactions = vm.transactions.filter((txn) => {
                  const txnDate = new Date(txn.date);
                  return txnDate.getTime() === mondayDate.getTime() && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                });
              }else if(vm.chosenTime === '31'){
                console.log("3131313131313")
                filteredTransactions = vm.transactions.filter((txn) => {
                  const txnDate = new Date(txn.date);
                  return txnDate >= mondayDate && txnDate <= sundayDate && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                });
              }else if(vm.chosenTime === '365' || vm.chosenTime === '-1') {
                console.log("365365365365365")
                filteredTransactions = vm.transactions.filter((txn) => {
                  const txnDate = new Date(txn.date);
                  return txnDate.getMonth() === mondayDate.getMonth() && txnDate.getFullYear() === mondayDate.getFullYear() && txn.category.toLowerCase() === clickedCategory.toLowerCase();
                });
              }
              console.log("Retrieved category:", clickedCategory);
              console.log("Date range:", mondayDate, "to", sundayDate);
              console.log(JSON.parse(JSON.stringify(vm.transactions.slice(0, 10))));
              console.log("Sample transactions:", vm.transactions.slice(0, 10));
              console.log("Filtered transactions for the week and category:", filteredTransactions);

              vm.$emit("filteredTransactions", filteredTransactions);
            }, 10);
          }
        }catch (error) {
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


























<!--
&lt;!&ndash;<template>&ndash;&gt;
&lt;!&ndash;  <div class="chart-container">&ndash;&gt;
&lt;!&ndash;    <div&ndash;&gt;
&lt;!&ndash;        id="combochart"&ndash;&gt;
&lt;!&ndash;        :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"&ndash;&gt;
&lt;!&ndash;    ></div>&ndash;&gt;
&lt;!&ndash;  </div>&ndash;&gt;
&lt;!&ndash;</template>&ndash;&gt;
&lt;!&ndash;<script>&ndash;&gt;
&lt;!&ndash;import { mapState } from "vuex";&ndash;&gt;

&lt;!&ndash;export default {&ndash;&gt;
&lt;!&ndash;  name: "combochart",&ndash;&gt;
&lt;!&ndash;  props: {&ndash;&gt;
&lt;!&ndash;    chartWidth: {&ndash;&gt;
&lt;!&ndash;      type: String,&ndash;&gt;
&lt;!&ndash;      default: "900px",&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    chartHeight: {&ndash;&gt;
&lt;!&ndash;      type: String,&ndash;&gt;
&lt;!&ndash;      default: "500px",&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    chartMargin: {&ndash;&gt;
&lt;!&ndash;      type: String,&ndash;&gt;
&lt;!&ndash;      default: "auto",&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    transactionCount: {&ndash;&gt;
&lt;!&ndash;      type: Number,&ndash;&gt;
&lt;!&ndash;      default: 10,&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    maxAmount: {&ndash;&gt;
&lt;!&ndash;      type: Number,&ndash;&gt;
&lt;!&ndash;      default: 200,&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    minAmount: {&ndash;&gt;
&lt;!&ndash;      type: Number,&ndash;&gt;
&lt;!&ndash;      default: 30,&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    categories: {&ndash;&gt;
&lt;!&ndash;      type: Array,&ndash;&gt;
&lt;!&ndash;      default: () => [&ndash;&gt;
&lt;!&ndash;        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },&ndash;&gt;
&lt;!&ndash;        { name: "Dining", paymentMethod: "CARD X0000" },&ndash;&gt;
&lt;!&ndash;        { name: "Travel", paymentMethod: "CARD X0000" },&ndash;&gt;
&lt;!&ndash;        { name: "Entertainment", paymentMethod: "CARD X0000" },&ndash;&gt;
&lt;!&ndash;        { name: "Groceries", paymentMethod: "CARD X0000" },&ndash;&gt;
&lt;!&ndash;      ],&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    transactions: {&ndash;&gt;
&lt;!&ndash;      type: Array,&ndash;&gt;
&lt;!&ndash;      required: true,&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;
&lt;!&ndash;  data() {&ndash;&gt;
&lt;!&ndash;    return {};&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;
&lt;!&ndash;  watch: {&ndash;&gt;
&lt;!&ndash;    transactions(newVal, oldVal) {&ndash;&gt;
&lt;!&ndash;      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {&ndash;&gt;
&lt;!&ndash;        this.drawChart();&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;

&lt;!&ndash;  computed: {&ndash;&gt;
&lt;!&ndash;    ...mapState(["chosenTime"]),&ndash;&gt;

&lt;!&ndash;    dataToDisplay() {&ndash;&gt;
&lt;!&ndash;      console.log(this.chosenTime);&ndash;&gt;
&lt;!&ndash;      switch (this.chosenTime) {&ndash;&gt;
&lt;!&ndash;        case "7":&ndash;&gt;
&lt;!&ndash;          return this.generateDailyDataTable;&ndash;&gt;
&lt;!&ndash;        case "31":&ndash;&gt;
&lt;!&ndash;          return this.generateWeeklyDataTable;&ndash;&gt;
&lt;!&ndash;        case "365":&ndash;&gt;
&lt;!&ndash;          return this.generateMonthlyDataTable;&ndash;&gt;
&lt;!&ndash;        case "-1":&ndash;&gt;
&lt;!&ndash;          return this.generateMonthlyDataTable;&ndash;&gt;
&lt;!&ndash;        default:&ndash;&gt;
&lt;!&ndash;          return this.generateWeeklyDataTable;&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;

&lt;!&ndash;    categoryTotals() {&ndash;&gt;
&lt;!&ndash;      const totals = {&ndash;&gt;
&lt;!&ndash;        Utilities: 0,&ndash;&gt;
&lt;!&ndash;        Dining: 0,&ndash;&gt;
&lt;!&ndash;        Travel: 0,&ndash;&gt;
&lt;!&ndash;        Entertainment: 0,&ndash;&gt;
&lt;!&ndash;        Groceries: 0,&ndash;&gt;
&lt;!&ndash;      };&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach((txn) => {&ndash;&gt;
&lt;!&ndash;        for (const category in totals) {&ndash;&gt;
&lt;!&ndash;          if (txn.category.includes(category)) {&ndash;&gt;
&lt;!&ndash;            totals[category] += Math.abs(txn.amount);&ndash;&gt;
&lt;!&ndash;            break;&ndash;&gt;
&lt;!&ndash;          }&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      return totals;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;

&lt;!&ndash;  mounted() {&ndash;&gt;
&lt;!&ndash;    this.drawChart();&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;

&lt;!&ndash;  methods: {&ndash;&gt;
&lt;!&ndash;    generateDailyDataTable() {&ndash;&gt;
&lt;!&ndash;      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];&ndash;&gt;
&lt;!&ndash;      const dataTable = [headers];&ndash;&gt;

&lt;!&ndash;      const totalsByDate = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach(transaction => {&ndash;&gt;
&lt;!&ndash;        const date = transaction.date;&ndash;&gt;

&lt;!&ndash;        // Initialize the date if not yet created&ndash;&gt;
&lt;!&ndash;        if (!totalsByDate[date]) {&ndash;&gt;
&lt;!&ndash;          totalsByDate[date] = {};&ndash;&gt;
&lt;!&ndash;          this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;            totalsByDate[date][c.name] = 0;  // Initialize every category for the date&ndash;&gt;
&lt;!&ndash;          });&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;

&lt;!&ndash;        // Check if the category exists in the transaction's category&ndash;&gt;
&lt;!&ndash;        for (const category of this.categories) {&ndash;&gt;
&lt;!&ndash;          if (transaction.category.includes(category.name)) {&ndash;&gt;
&lt;!&ndash;            totalsByDate[date][category.name] += Math.abs(transaction.amount);&ndash;&gt;
&lt;!&ndash;            break;  // Stop looping once we found a matching category&ndash;&gt;
&lt;!&ndash;          }&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      // Convert the object into an array format for Google Charts&ndash;&gt;
&lt;!&ndash;      for (const [date, categories] of Object.entries(totalsByDate)) {&ndash;&gt;
&lt;!&ndash;        const row = [date];&ndash;&gt;
&lt;!&ndash;        let sum = 0;&ndash;&gt;
&lt;!&ndash;        this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;          const value = categories[c.name] || 0;&ndash;&gt;
&lt;!&ndash;          row.push(value);&ndash;&gt;
&lt;!&ndash;          sum += value;&ndash;&gt;
&lt;!&ndash;        });&ndash;&gt;
&lt;!&ndash;        const mean = sum / this.categories.length;&ndash;&gt;
&lt;!&ndash;        row.push(mean);&ndash;&gt;
&lt;!&ndash;        dataTable.push(row);&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;

&lt;!&ndash;      return dataTable;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    generateWeeklyDataTable() {&ndash;&gt;
&lt;!&ndash;      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];&ndash;&gt;
&lt;!&ndash;      const dataTable = [headers];&ndash;&gt;

&lt;!&ndash;      const totalsByWeek = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach(transaction => {&ndash;&gt;
&lt;!&ndash;        const date = new Date(transaction.date);&ndash;&gt;
&lt;!&ndash;        const startOfWeek = date;&ndash;&gt;
&lt;!&ndash;        let dayOfWeek = date.getDay();&ndash;&gt;
&lt;!&ndash;        if (dayOfWeek === 0) {&ndash;&gt;
&lt;!&ndash;          dayOfWeek = 6;&ndash;&gt;
&lt;!&ndash;        } else {&ndash;&gt;
&lt;!&ndash;          dayOfWeek -= 1;&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;        startOfWeek.setDate(date.getDate() - dayOfWeek);&ndash;&gt;
&lt;!&ndash;        const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(-2)}-${("0" + startOfWeek.getDate()).slice(-2)}`;&ndash;&gt;

&lt;!&ndash;        // Initialize the week if not yet created&ndash;&gt;
&lt;!&ndash;        if (!totalsByWeek[weekString]) {&ndash;&gt;
&lt;!&ndash;          totalsByWeek[weekString] = {};&ndash;&gt;
&lt;!&ndash;          this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;            totalsByWeek[weekString][c.name] = 0;  // Initialize every category for the date&ndash;&gt;
&lt;!&ndash;          });&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;

&lt;!&ndash;        // Check if the category exists in the transaction's category&ndash;&gt;
&lt;!&ndash;        for (const category of this.categories) {&ndash;&gt;
&lt;!&ndash;          if (transaction.category.includes(category.name)) {&ndash;&gt;
&lt;!&ndash;            totalsByWeek[weekString][category.name] += Math.abs(transaction.amount);&ndash;&gt;
&lt;!&ndash;            break;  // Stop looping once we found a matching category&ndash;&gt;
&lt;!&ndash;          }&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      // Convert the object into an array format for Google Charts&ndash;&gt;
&lt;!&ndash;      for (const [weekString, categories] of Object.entries(totalsByWeek)) {&ndash;&gt;
&lt;!&ndash;        const row = [weekString];&ndash;&gt;
&lt;!&ndash;        let sum = 0;&ndash;&gt;
&lt;!&ndash;        this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;          const value = categories[c.name] || 0;&ndash;&gt;
&lt;!&ndash;          row.push(value);&ndash;&gt;
&lt;!&ndash;          sum += value;&ndash;&gt;
&lt;!&ndash;        });&ndash;&gt;
&lt;!&ndash;        const mean = sum / this.categories.length;&ndash;&gt;
&lt;!&ndash;        row.push(mean);&ndash;&gt;
&lt;!&ndash;        dataTable.push(row);&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;

&lt;!&ndash;      return dataTable;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    generateMonthlyDataTable() {&ndash;&gt;
&lt;!&ndash;      const headers = ['Date', ...this.categories.map(c => c.name), 'Mean'];&ndash;&gt;
&lt;!&ndash;      const dataTable = [headers];&ndash;&gt;

&lt;!&ndash;      const totalsByMonth = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach(transaction => {&ndash;&gt;
&lt;!&ndash;        const date = new Date(transaction.date);&ndash;&gt;
&lt;!&ndash;        const monthYearKey = `${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;&ndash;&gt;

&lt;!&ndash;        // Initialize the date if not yet created&ndash;&gt;
&lt;!&ndash;        if (!totalsByMonth[monthYearKey]) {&ndash;&gt;
&lt;!&ndash;          totalsByMonth[monthYearKey] = {};&ndash;&gt;
&lt;!&ndash;          this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;            totalsByMonth[monthYearKey][c.name] = 0;  // Initialize every category for the date&ndash;&gt;
&lt;!&ndash;          });&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;

&lt;!&ndash;        // Check if the category exists in the transaction's category&ndash;&gt;
&lt;!&ndash;        for (const category of this.categories) {&ndash;&gt;
&lt;!&ndash;          if (transaction.category.includes(category.name)) {&ndash;&gt;
&lt;!&ndash;            totalsByMonth[monthYearKey][category.name] += Math.abs(transaction.amount);&ndash;&gt;
&lt;!&ndash;            break;  // Stop looping once we found a matching category&ndash;&gt;
&lt;!&ndash;          }&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      // Convert the object into an array format for Google Charts&ndash;&gt;
&lt;!&ndash;      for (const [monthString, categories] of Object.entries(totalsByMonth)) {&ndash;&gt;
&lt;!&ndash;        const row = [monthString];&ndash;&gt;
&lt;!&ndash;        let sum = 0;&ndash;&gt;
&lt;!&ndash;        this.categories.forEach(c => {&ndash;&gt;
&lt;!&ndash;          const value = categories[c.name] || 0;&ndash;&gt;
&lt;!&ndash;          row.push(value);&ndash;&gt;
&lt;!&ndash;          sum += value;&ndash;&gt;
&lt;!&ndash;        });&ndash;&gt;
&lt;!&ndash;        const mean = sum / this.categories.length;&ndash;&gt;
&lt;!&ndash;        row.push(mean);&ndash;&gt;
&lt;!&ndash;        dataTable.push(row);&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;


&lt;!&ndash;      return dataTable;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;


&lt;!&ndash;    drawChart() {&ndash;&gt;
&lt;!&ndash;      google.charts.load('current', {'packages':['corechart']});&ndash;&gt;
&lt;!&ndash;      google.charts.setOnLoadCallback(() => {&ndash;&gt;
&lt;!&ndash;        try {&ndash;&gt;
&lt;!&ndash;          // Some raw data (not necessarily accurate)&ndash;&gt;
&lt;!&ndash;          const dataArray = this.dataToDisplay;&ndash;&gt;
&lt;!&ndash;          console.log(typeof dataArray, dataArray);&ndash;&gt;
&lt;!&ndash;          const data = google.visualization.arrayToDataTable(dataArray());&ndash;&gt;

&lt;!&ndash;          const options = {&ndash;&gt;
&lt;!&ndash;            title: 'Monthly Coffee Production by Country',&ndash;&gt;
&lt;!&ndash;            vaxis: {title: 'Cups'},&ndash;&gt;
&lt;!&ndash;            haxis: {title: 'Month'},&ndash;&gt;
&lt;!&ndash;            seriesType: 'bars',&ndash;&gt;
&lt;!&ndash;            series: {5: {type: 'line'}},&ndash;&gt;

&lt;!&ndash;            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;background-color"),&ndash;&gt;
&lt;!&ndash;            titleColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;header-text"),&ndash;&gt;
&lt;!&ndash;            legend: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            hAxis: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            vAxis: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            }&ndash;&gt;
&lt;!&ndash;          };&ndash;&gt;

&lt;!&ndash;          const chart = new google.visualization.ComboChart(document.getElementById('combochart'));&ndash;&gt;
&lt;!&ndash;          chart.draw(data, options);&ndash;&gt;
&lt;!&ndash;        }catch (error) {&ndash;&gt;
&lt;!&ndash;          console.error("Error drawing the combo chart:", error);&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;
&lt;!&ndash;    }&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;
&lt;!&ndash;};&ndash;&gt;
&lt;!&ndash;</script>&ndash;&gt;
&lt;!&ndash;<style scoped>&ndash;&gt;
&lt;!&ndash;@import url("../assets/css/variables.css");&ndash;&gt;
&lt;!&ndash;div.amount {&ndash;&gt;
&lt;!&ndash;  align-content: flex-end;&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.chart-container {&ndash;&gt;
&lt;!&ndash;  display: flex;&ndash;&gt;
&lt;!&ndash;  align-items: center;&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.nav-links li {&ndash;&gt;
&lt;!&ndash;  display: inline;&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.nav-links a {&ndash;&gt;
&lt;!&ndash;  text-decoration: none;&ndash;&gt;
&lt;!&ndash;  color: var(&#45;&#45;white);&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.chart-container h1 {&ndash;&gt;
&lt;!&ndash;  display: flex;&ndash;&gt;
&lt;!&ndash;  justify-content: center;&ndash;&gt;
&lt;!&ndash;  color: var(&#45;&#45;header-text);&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.chart-container p {&ndash;&gt;
&lt;!&ndash;  color: var(&#45;&#45;text);&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.chart-container button:hover {&ndash;&gt;
&lt;!&ndash;  background-color: var(&#45;&#45;button-hover);&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;

&lt;!&ndash;div.summary {&ndash;&gt;
&lt;!&ndash;  display: flex;&ndash;&gt;
&lt;!&ndash;  justify-content: space-around;&ndash;&gt;
&lt;!&ndash;  margin-bottom: 20px;&ndash;&gt;
&lt;!&ndash;}&ndash;&gt;
&lt;!&ndash;</style>&ndash;&gt;-->
