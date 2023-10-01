<template>
  <div class="chart-container">
    <div id="linechart" :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"></div>
  </div>
</template>
<script>

import { mapState } from "vuex";
export default {
  name: "LineChart",
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
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart()
      },
      deep: true
    },
    chosenTime: {
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
    chosenTime() {
      return this.$store.state.chosenTime;
    },
    dataToDisplay() {
      switch (this.chosenTime) {
        case "7":
          return this.dailyAmount;
        case "31":
          return this.weeklyAmount;
        case "365":
          return this.monthlyAmount;
        case "-1":
          return this.monthlyAmount;
        default:
          return this.weeklyAmount;
      }
    },

    dailyAmount() {
      const dailyAmounts = [['Date', 'Balance']];
      const todayDate = new Date();

      const limitDate = new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;
      const limitDateObj = new Date(limitDate);

      const days = Math.round((todayDate.getTime() - limitDate) / (1000 * 60 * 60 * 24));
      let date = limitDateObj;
      console.log(date);
      let amount = 0;
      let i = 0;
      while (i < days + 1) {
        amount = this.totalBeforeDate(date);
        let dateString = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        dailyAmounts.push([dateString, amount]);

        date = this.addDays(date, 1);
        i++;
      }
      return dailyAmounts;
    },
    weeklyAmount() {
      const weeklyAmounts = [['Date', 'Balance']];
      const todayDate = new Date();
      const todayDateStr = `${todayDate.getFullYear()}/${todayDate.getMonth()+1}/${todayDate.getDate()}`;

      const limitDate = new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;
      const limitDateObj = new Date(limitDate);
      const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth()+1}/${limitDateObj.getDate()}`;

      const days = Math.round((todayDate.getTime() - limitDate) / (1000 * 60 * 60 * 24));
      let date = limitDateObj;
      console.log(date);
      let amount = 0;
      let i = 0;
      while (i < days + 1) {
        amount = this.totalBeforeDate(date);
        let dateString = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        weeklyAmounts.push([dateString, amount]);

        date = this.addDays(date, 7);
        i += 7;
      }
      return weeklyAmounts;
    },
    monthlyAmount() {
      const monthlyAmounts = [['Date', 'Balance']];
      const todayDate = new Date();
      const todayDateStr = `${todayDate.getFullYear()}/${todayDate.getMonth()+1}/${todayDate.getDate()}`;
      const limitDate = this.chosenTime === '-1' ?
          this.transactions[this.transactions.length - 1].rawDate.getTime() :
          (new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000);

      const limitDateObj = new Date(limitDate);
      const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth()+1}/${limitDateObj.getDate()}`;

      const days = Math.round(
          (
              (
                  this.chosenTime === '-1' ?
                  this.transactions[0].rawDate.getTime() :
                  todayDate.getTime()
              )
              - limitDate
          ) / (1000 * 60 * 60 * 24)
      );
      let date = limitDateObj;

      let amount = 0;
      let i = 0;
      while (i < days + 1 ) {
        amount = this.totalBeforeDate(date);
        let dateString = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
        monthlyAmounts.push([dateString, amount]);

        date = this.addDays(date, 30);
        i += 30;
      }
      return monthlyAmounts;
    },

  },

  mounted() {
    this.drawChart();
  },

  methods: {
    totalBeforeDate(date) { //date is of Date type
      const transactionsBeforeDate = this.transactions.filter((t) => t.rawDate < date);
      const total = transactionsBeforeDate.reduce((sum, txn) => sum + txn.amount, 0);
      console.log(total);
      return total;
    },

    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = this.dataToDisplay;
          console.log(dataArray);

          // Use the dataArray directly with arrayToDataTable, which includes headers
          const data = google.visualization.arrayToDataTable(dataArray);

          // Define chart options
          const options = {
            title: "Balance over time",
            curveType: "function",
            Legend: { position: "bottom" },
            haxis: {
              title: "Date",
            },
            vaxis: {
              title: "Balance",
            },
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleTextStyle: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            },
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
            },
          };

          // Draw the chart
          const chart = new google.visualization.LineChart(document.getElementById("linechart"));
          chart.draw(data, options);
        } catch (error) {
          console.error("Error drawing the line chart:", error);
        }
      });
    },


    addDays(date, number) {
      const dateObj = new Date(date);
      dateObj.setDate(dateObj.getDate() + number);
      return dateObj;
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

























<!--<template>-->
<!--  <div class="chart-container">-->
<!--    <div-->
<!--      id="linechart"-->
<!--      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"-->
<!--    ></div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import { mapState } from "vuex";-->

<!--export default {-->
<!--  name: "LineChart",-->
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
<!--    transactions: {-->
<!--      handler(newVal, oldVal) {-->
<!--        this.drawChart()-->
<!--      },-->
<!--      deep: true-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState(["chosenTime"]),-->

<!--    transactions() {-->
<!--      return this.$store.state.transactions;-->
<!--    },-->

<!--    dataToDisplay() {-->
<!--      switch (this.chosenTime) {-->
<!--        case "7":-->
<!--          return this.dailyAmounts;-->
<!--        case "31":-->
<!--          return this.weeklyAmounts;-->
<!--        case "365":-->
<!--          return this.monthlyAmounts;-->
<!--        case "-1":-->
<!--          return this.monthlyAmounts;-->
<!--        default:-->
<!--          return this.weeklyAmounts;-->
<!--      }-->
<!--    },-->
<!--    monthlyAmounts() {-->
<!--      const totalsByMonth = {};-->

<!--      this.transactions.forEach((transaction) => {-->
<!--        //if (transaction.amount >= 0) return; // Skip positive or zero values-->

<!--        const date = new Date(transaction.date);-->
<!--        const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;-->

<!--        if (!totalsByMonth[monthYearKey]) {-->
<!--          totalsByMonth[monthYearKey] = 0;-->
<!--        }-->
<!--        totalsByMonth[monthYearKey] += (transaction.amount);-->
<!--      });-->

<!--      return Object.entries(totalsByMonth).sort(-->
<!--        (a, b) => new Date("01-" + a[0]) - new Date("01-" + b[0])-->
<!--      );-->
<!--    },-->
<!--    weeklyAmounts() {-->
<!--      const totalsByWeek = {};-->

<!--      this.transactions.forEach((transaction) => {-->
<!--        //if (transaction.amount >= 0) return;-->

<!--        const date = new Date(transaction.date);-->
<!--        const startOfWeek = new Date(date);-->
<!--        let dayOfWeek = date.getDay();-->
<!--        if (dayOfWeek === 0) {-->
<!--          dayOfWeek = 6;-->
<!--        } else {-->
<!--          dayOfWeek -= 1;-->
<!--        }-->
<!--        startOfWeek.setDate(date.getDate() - dayOfWeek);-->

<!--        const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(-->
<!--          -2-->
<!--        )}-${("0" + startOfWeek.getDate()).slice(-2)}`;-->

<!--        if (!totalsByWeek[weekString]) {-->
<!--          totalsByWeek[weekString] = 0;-->
<!--        }-->
<!--        totalsByWeek[weekString] += (transaction.amount);-->
<!--      });-->

<!--      return Object.entries(totalsByWeek).sort(-->
<!--        (a, b) => new Date(a[0]) - new Date(b[0])-->
<!--      );-->

<!--      return result;-->
<!--    },-->
<!--    dailyAmounts() {-->
<!--      const totalsByDate = {};-->

<!--      this.transactions.forEach((transaction) => {-->
<!--        //if (transaction.amount >= 0) return;-->

<!--        if (!totalsByDate[transaction.date]) {-->
<!--          totalsByDate[transaction.date] = 0;-->
<!--        }-->
<!--        totalsByDate[transaction.date] += (transaction.amount);-->
<!--      });-->

<!--      return Object.entries(totalsByDate).sort(-->
<!--        (a, b) => new Date(a[0]) - new Date(b[0])-->
<!--      );-->
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
<!--          if (txn.category.includes(category)) {-->
<!--            totals[category] += txn.amount;-->
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
<!--    drawChart() {-->
<!--      google.charts.load("current", { packages: ["corechart"] });-->
<!--      google.charts.setOnLoadCallback(() => {-->
<!--        try {-->
<!--          const data = new google.visualization.DataTable();-->
<!--          data.addColumn("string", "Date");-->
<!--          data.addColumn("number", "Amount Spent");-->

<!--          // Format data to have {v, f} format-->
<!--          const formattedData = this.dataToDisplay.map((item) => {-->
<!--            const date = item[0];-->
<!--            const value = item[1];-->
<!--            return [date, { v: value, f: `$${Math.round(value)}` }];-->
<!--          });-->

<!--          data.addRows(formattedData);-->

<!--          const options = {-->
<!--            title: "Balance over time",-->
<!--            curveType: "function",-->
<!--            Legend: { position: "bottom" },-->
<!--            haxis: {-->
<!--              title: "Date",-->
<!--            },-->
<!--            vaxis: {-->
<!--              title: "Amount Spent",-->
<!--            },-->
<!--            backgroundColor: getComputedStyle(-->
<!--              document.documentElement-->
<!--            ).getPropertyValue("&#45;&#45;background-color"),-->
<!--            titleColor: getComputedStyle(-->
<!--              document.documentElement-->
<!--            ).getPropertyValue("&#45;&#45;header-text"),-->
<!--            legend: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(-->
<!--                  document.documentElement-->
<!--                ).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            },-->
<!--            hAxis: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(-->
<!--                  document.documentElement-->
<!--                ).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            },-->
<!--            vAxis: {-->
<!--              textStyle: {-->
<!--                color: getComputedStyle(-->
<!--                  document.documentElement-->
<!--                ).getPropertyValue("&#45;&#45;text"),-->
<!--              },-->
<!--            },-->
<!--          };-->

<!--          const chart = new google.visualization.LineChart(-->
<!--            document.getElementById("linechart")-->
<!--          );-->
<!--          chart.draw(data, options);-->
<!--        } catch (error) {-->
<!--          console.error("Error drawing the line chart:", error);-->
<!--        }-->
<!--      });-->
<!--    },-->
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
