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
      default: window.innerWidth.valueOf() / 1.2 + "px",
    },
    chartHeight: {
      type: String,
      default: "500px",
    },
    chartMargin: {
      type: String,
      default: "none",
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
    return {
      ticks: null,
    };
  },
  watch: {
    transactions: {
      handler(newVal, oldVal) {
        this.drawChart();
      },
      deep: true,
    },
    chosenTime: {
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
    chosenTime() {
      return this.$store.state.chosenTime;
    },
    dataToDisplay() {
      if (this.chosenTime === '-2'){
        this.chosenTime = '7'
        this.$store.commit("SET_CHOSEN_TIME" , '7')
      }
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
      const dailyAmounts = [];
      if (this.$store.state.dateRange){

        const filteredTransactions = this.transactions//.filter(t => t.rawDate < this.$store.state.dateRange[1] && t.rawDate >= this.$store.state.dateRange[0])
        const uniqueDatesSet = new Set();
        filteredTransactions.forEach((t) => {
          const dateStr = `${t.rawDate.getFullYear()}/${t.rawDate.getMonth() + 1}/${t.rawDate.getDate()}`;
          uniqueDatesSet.add(dateStr);
        });

        uniqueDatesSet.forEach((dateStr) => {
          const [year, month, day] = dateStr.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          const amount = this.totalBeforeDate(date);
          dailyAmounts.push([date, amount]);
        });

        if(this.$store.state.dateRange[1].getTime() - this.$store.state.dateRange[0]  < 21 * 86400000){
          this.ticks = dailyAmounts.map((item) => ({
            v: item[0],
            f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`
          }));
        } else if(this.$store.state.dateRange[1].getTime() - this.$store.state.dateRange[0] < 92 * 86400000) {
          //filter for the first day of the week
          this.ticks = dailyAmounts
              .filter((item) => item[0].getDay() === 1) // Filter for the first day of the month
              .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` }));

        } else {
          this.ticks = dailyAmounts
              .filter((item) => item[0].getDate() === 1) // Filter for the first day of the month
              .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` }));
        }

        } else {
        const todayDate = new Date();

        const limitDate = new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;
        const limitDateObj = new Date(limitDate);

        const days = Math.round((todayDate.getTime() - limitDate) / (1000 * 60 * 60 * 24));
        let date = limitDateObj;
        let amount = 0;
        let i = 0;
        while (i < days + 1) {
          amount = this.totalBeforeDate(date);
          let dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          dailyAmounts.push([new Date(dateString), amount]);

          date = this.addDays(date, 1);
          i++;
        }
        this.ticks = dailyAmounts.map((item) => ({
          v: item[0],
          f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`
        })); // Transform to desired format
      }
      return dailyAmounts;
    },
    weeklyAmount() {
      const weeklyAmounts = []; //[['Date', 'Balance']];
      if (this.$store.state.month){
        const filteredTransactions = this.transactions
        const uniqueDatesSet = new Set();
        filteredTransactions.forEach((t) => {
          const dateStr = `${t.rawDate.getFullYear()}/${t.rawDate.getMonth() + 1}/${t.rawDate.getDate()}`;
          uniqueDatesSet.add(dateStr);
        });

        uniqueDatesSet.forEach((dateStr) => {
          const [year, month, day] = dateStr.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          const amount = this.totalBeforeDate(date);
          weeklyAmounts.push([date, amount]);
        });

        this.ticks = weeklyAmounts
            .filter((item) => item[0].getDay() === 1) // Filter for the first day of the month
            .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` })); // Transform to desired format
      } else {
        const todayDate = new Date();
        const todayDateStr = `${todayDate.getFullYear()}/${todayDate.getMonth() + 1}/${todayDate.getDate()}`;

        const limitDate = new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;
        const limitDateObj = new Date(limitDate);
        const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth() + 1}/${limitDateObj.getDate()}`;

        const days = Math.round((todayDate.getTime() - limitDate) / (1000 * 60 * 60 * 24));
        let date = limitDateObj;
        let amount = 0;
        let i = 0;
        while (i < days + 1) {
          amount = this.totalBeforeDate(date);
          let dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          weeklyAmounts.push([new Date(dateString), amount]);

          date = this.addDays(date, 1);
          i++;
        }
        this.ticks = weeklyAmounts
            .filter((item) => item[0].getDay() === 1) // Filter for the first day of the month
            .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` })); // Transform to desired format
      }

      return weeklyAmounts;
    },
    monthlyAmount() {
      const monthlyAmounts = []; //[['Date', 'Balance']];
      if (this.$store.state.year){
        const filteredTransactions = this.transactions
        const uniqueDatesSet = new Set();
        filteredTransactions.forEach((t) => {
          const dateStr = `${t.rawDate.getFullYear()}/${t.rawDate.getMonth() + 1}/${t.rawDate.getDate()}`;
          uniqueDatesSet.add(dateStr);
        });

        uniqueDatesSet.forEach((dateStr) => {
          const [year, month, day] = dateStr.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          const amount = this.totalBeforeDate(date);
          monthlyAmounts.push([date, amount]);
        });

        this.ticks = monthlyAmounts
            .filter((item) => item[0].getDate() === 1) // Filter for the first day of the month
            .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` })); // Transform to desired format

      } else {

        const todayDate = new Date();
        const todayDateStr = `${todayDate.getFullYear()}/${todayDate.getMonth() + 1}/${todayDate.getDate()}`;
        const limitDate = this.chosenTime === "-1" ? this.transactions[this.transactions.length - 1].rawDate.getTime() : new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;

        const limitDateObj = new Date(limitDate);
        const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth() + 1}/${limitDateObj.getDate()}`;

        const days = Math.round(((this.chosenTime === "-1" ? this.transactions[0].rawDate.getTime() : todayDate.getTime()) - limitDate) / (1000 * 60 * 60 * 24));
        let date = limitDateObj;

        let amount = 0;
        let i = 0;
        while (i < days + 1) {
          amount = this.totalBeforeDate(date);
          let actualDateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          monthlyAmounts.push([new Date(actualDateStr), amount]);

          date = this.addDays(date, 1);
          i++;
        }
        this.ticks = monthlyAmounts
            .filter((item) => item[0].getDate() === 1) // Filter for the first day of the month
            .map((item) => ({
              v: item[0],
              f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`
            })); // Transform to desired format
      }
      return monthlyAmounts;
    },
  },

  mounted() {
    this.drawChart();
  },
  methods: {
    totalBeforeDate(date) {
      //date is of Date type
      const transactionsBeforeDate = this.$store.state.myInitialTransactionsArray.filter((t) => t.rawDate < date).sort((a, b) => new Date(b.date) - new Date(a.date));
      const total = transactionsBeforeDate.reduce((sum, txn) => sum + txn.amount, 0);
      return total;
    },

    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = this.dataToDisplay;

          // Convert dataArray to a DataTable
          const data = new google.visualization.DataTable();
          data.addColumn("date", "Date");
          data.addColumn("number", "Balance");
          data.addRows(dataArray);

          // Define chart options
          const options = {
            title: "Balance over time",
            curveType: "function",
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background-color"),
            titleTextStyle: {
              color: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
            },
            chartArea: {
              width: "75%",
              height: "60%",
            },
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
              position: "in",
            },
            hAxis: {
              title: "Date",
              titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
              gridlines: {
                color: "transparent",
              },
              ticks: this.ticks,
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("--text"),
              },
              slantedText: true,
              slantedTextAngle: 45,
            },
            vAxis: {
              title: "Balance",
              titleColor: getComputedStyle(document.documentElement).getPropertyValue("--header-text"),
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
      if (number >= 0) {
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + number);
        return dateObj;
      } else {
        const dateObj = new Date(date);
        dateObj.setMonth(dateObj.getMonth() + Math.abs(number));
        return dateObj;
      }
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