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
      console.log(this.chosenTime);
      // if (this.chosenTime === '-2'){
      //   this.chosenTime = '7'
      //   this.$store.commit("SET_CHOSEN_TIME" , '7')
      // }
      if (this.$store.state.dateRange && this.chosenTime === "-2") {
        return this.customAmount;
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

    customAmount() {
      const dailyAmounts = [];

      const filteredTransactions = this.transactions; //.filter(t => t.transaction_date < this.$store.state.dateRange[1] && t.transaction_date >= this.$store.state.dateRange[0])
      const uniqueDatesSet = new Set();
      filteredTransactions.forEach((t) => {
        const dateStr = `${t.transaction_date.getFullYear()}/${t.transaction_date.getMonth() + 1}/${t.transaction_date.getDate()}`;
        uniqueDatesSet.add(dateStr);
      });

      uniqueDatesSet.forEach((dateStr) => {
        const [year, month, day] = dateStr.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        const amount = this.totalBeforeDate(date);
        dailyAmounts.push([date, amount]);
      });

      if (this.$store.state.dateRange[1].getTime() - this.$store.state.dateRange[0] < 21 * 86400000) {
        // Find the start (min) and end (max) dates in dailyAmounts
        let minDate = this.$store.state.dateRange[0];//new Date(Math.min.apply(null, dailyAmounts.map(item => item[0])));
        let maxDate = this.$store.state.dateRange[1];//new Date(Math.max.apply(null, dailyAmounts.map(item => item[0])));

        // Generate an array of all dates between minDate and maxDate
        let currentDate = new Date(minDate);
        let allDates = [];
        while (currentDate <= maxDate) {
          allDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Map over this array to produce the ticks format
        this.ticks = allDates.map(date => ({
          v: date,
          f: `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`
        }));

        // this.ticks = dailyAmounts.map((item) => ({
        //   v: item[0],
        //   f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`,
        // }));
      } else if (this.$store.state.dateRange[1].getTime() - this.$store.state.dateRange[0] < 92 * 86400000) {
        //filter for the first day of the week

        // Find the start (min) and end (max) dates in dailyAmounts
        let minDate = this.$store.state.dateRange[0];//new Date(Math.min.apply(null, dailyAmounts.map(item => item[0])));
        let maxDate = this.$store.state.dateRange[1];//new Date(Math.max.apply(null, dailyAmounts.map(item => item[0])));

        // Adjust the minDate to the next Monday if it's not already a Monday
        while (minDate.getDay() !== 1) {
          minDate.setDate(minDate.getDate() + 1);
        }

        // Generate an array of all Mondays between minDate and maxDate
        let currentDate = new Date(minDate);
        let allMondays = [];
        while (currentDate <= maxDate) {
          allMondays.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 7); // Jump to next Monday
        }

        // Map over this array to produce the ticks format
        this.ticks = allMondays.map(date => ({
          v: date,
          f: `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`
        }));


        // this.ticks = dailyAmounts
        //   .filter((item) => item[0].getDay() === 1) // Filter for the first day of the week
        //   .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` }));
      } else {
        console.log("AAAAAAAAAAAAAAAAAA");

        // Find the start (min) and end (max) dates in dailyAmounts
        let minDate = this.$store.state.dateRange[0];//new Date(Math.min.apply(null, dailyAmounts.map(item => item[0])));
        let maxDate = this.$store.state.dateRange[1];//new Date(Math.max.apply(null, dailyAmounts.map(item => item[0])));

        // Adjust the minDate to the first day of the next month if it's not already the first day
        if (minDate.getDate() !== 1) {
          minDate.setMonth(minDate.getMonth() + 1); // Move to the next month
          minDate.setDate(1); // Set to the first day of that month
        }

        // Generate an array of all the first days of each month between minDate and maxDate
        let currentDate = new Date(minDate);
        let allFirstDays = [];
        while (currentDate <= maxDate) {
          allFirstDays.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1); // Jump to next month
        }

        // Map over this array to produce the ticks format
        this.ticks = allFirstDays.map(date => ({
          v: date,
          f: `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`
        }));


        // this.ticks = dailyAmounts
        //   .filter((item) => item[0].getDate() === 1) // Filter for the first day of the month
        //   .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` }));
      }
      return dailyAmounts;
    },
    dailyAmount() {
      const dailyAmounts = [];
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
        let dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        dailyAmounts.push([new Date(dateString), amount]);

        date = this.addDays(date, 1);
        i++;
      }
      this.ticks = dailyAmounts.map((item) => ({
        v: item[0],
        f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`,
      })); // Transform to desired format
      console.log(this.ticks);

      console.log(dailyAmounts);
      return dailyAmounts;
    },
    weeklyAmount() {
      const weeklyAmounts = []; //[['Date', 'Balance']];
      if (this.$store.state.month) {
        const filteredTransactions = this.transactions;
        const uniqueDatesSet = new Set();
        filteredTransactions.forEach((t) => {
          const dateStr = `${t.transaction_date.getFullYear()}/${t.transaction_date.getMonth() + 1}/${t.transaction_date.getDate()}`;
          uniqueDatesSet.add(dateStr);
        });

        uniqueDatesSet.forEach((dateStr) => {
          const [year, month, day] = dateStr.split("/").map(Number);
          const date = new Date(year, month - 1, day);
          const amount = this.totalBeforeDate(date);
          weeklyAmounts.push([date, amount]);
        });

        this.ticks = weeklyAmounts
          .filter((item) => item[0].getDay() === 1) // Filter for the first day of the month
          .map((item) => ({ v: item[0], f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}` })); // Transform to desired format
      } else {
        console.log(this.$store.state.month);
        const todayDate = new Date();
        const todayDateStr = `${todayDate.getFullYear()}/${todayDate.getMonth() + 1}/${todayDate.getDate()}`;

        const limitDate = new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;
        const limitDateObj = new Date(limitDate);
        const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth() + 1}/${limitDateObj.getDate()}`;

        const days = Math.round((todayDate.getTime() - limitDate) / (1000 * 60 * 60 * 24));
        let date = limitDateObj;
        // console.log(date);
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
        // // console.log(ticks);
      }

      console.log(weeklyAmounts);
      return weeklyAmounts;
    },
    monthlyAmount() {
      const monthlyAmounts = []; //[['Date', 'Balance']];
      if (this.$store.state.year) {
        const filteredTransactions = this.transactions;
        const uniqueDatesSet = new Set();
        filteredTransactions.forEach((t) => {
          const dateStr = `${t.transaction_date.getFullYear()}/${t.transaction_date.getMonth() + 1}/${t.transaction_date.getDate()}`;
          uniqueDatesSet.add(dateStr);
        });

        uniqueDatesSet.forEach((dateStr) => {
          const [year, month, day] = dateStr.split("/").map(Number);
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
        const limitDate = this.chosenTime === "-1" ? this.transactions[this.transactions.length - 1].transaction_date.getTime() : new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000;

        const limitDateObj = new Date(limitDate);
        const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth() + 1}/${limitDateObj.getDate()}`;

        const days = Math.round(((this.chosenTime === "-1" ? this.transactions[0].transaction_date.getTime() : todayDate.getTime()) - limitDate) / (1000 * 60 * 60 * 24));
        let date = limitDateObj;

        let amount = 0;
        let i = 0;
        console.log(days);
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
            f: `${item[0].getFullYear()}/${("0" + (item[0].getMonth() + 1)).slice(-2)}/${("0" + item[0].getDate()).slice(-2)}`,
          })); // Transform to desired format
        // // console.log(ticks);
      }
      console.log(monthlyAmounts);
      return monthlyAmounts;
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
    totalBeforeDate(date) {
      //date is of Date type
      const transactionsBeforeDate = this.$store.state.myInitialTransactionsArray.filter((t) => t.transaction_date < date).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
      const total = transactionsBeforeDate.reduce((sum, txn) => sum + parseInt(txn.amount), 0);
      // console.log(total);
      return total;
    },

    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = this.dataToDisplay;
          console.log(dataArray);

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
        //console.log(dateObj.getMonth() + Math.abs(number));
        return dateObj;
      }
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

<!--
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
          this.transactions[this.transactions.length - 1].transaction_date.getTime() :
          (new Date().getTime() - this.chosenTime * 24 * 60 * 60 * 1000);

      const limitDateObj = new Date(limitDate);
      const limitDateStr = `${limitDateObj.getFullYear()}/${limitDateObj.getMonth()+1}/${limitDateObj.getDate()}`;

      const days = Math.round(
          (
              (
                  this.chosenTime === '-1' ?
                  this.transactions[0].transaction_date.getTime() :
                  todayDate.getTime()
              )
              - limitDate
          ) / (1000 * 60 * 60 * 24)
      );
      let date = limitDateObj;

      let amount = 0;
      let i = 0;
      console.log(days);
      while (i < days + 1 ) {
        amount = this.totalBeforeDate(date);
        let dateString = date.getDate() === 1 ? `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}` : null;
        monthlyAmounts.push([dateString, amount]);

        date = this.addDays(date, 1);
        i++;
      }
      return monthlyAmounts;
    },

  },

  mounted() {
    this.drawChart();
  },

  methods: {
    totalBeforeDate(date) { //date is of Date type
      const transactionsBeforeDate = this.transactions.filter((t) => t.transaction_date < date).sort((a, b) => new Date(b.date) - new Date(a.date));
      const total = transactionsBeforeDate.reduce((sum, txn) => sum + txn.amount, 0);
      //console.log(total);
      return total;
    },

    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = this.dataToDisplay;
          console.log(dataArray);

          // Use the dataArray directly with arrayToDataTable, which includes headers

          //make sure the first element is not null
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
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;background-color"),
            titleTextStyle: {
              color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;header-text"),
            },
            legend: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),
              },
            },
            hAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),
              },
            },
            vAxis: {
              textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue("&#45;&#45;text"),
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
      if(number >= 0){
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + number);
        return dateObj;
      }else {
        const dateObj = new Date(date);
        dateObj.setMonth(dateObj.getMonth() + Math.abs(number));
        //console.log(dateObj.getMonth() + Math.abs(number));
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

























&lt;!&ndash;<template>&ndash;&gt;
&lt;!&ndash;  <div class="chart-container">&ndash;&gt;
&lt;!&ndash;    <div&ndash;&gt;
&lt;!&ndash;      id="linechart"&ndash;&gt;
&lt;!&ndash;      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"&ndash;&gt;
&lt;!&ndash;    ></div>&ndash;&gt;
&lt;!&ndash;  </div>&ndash;&gt;
&lt;!&ndash;</template>&ndash;&gt;
&lt;!&ndash;<script>&ndash;&gt;
&lt;!&ndash;import { mapState } from "vuex";&ndash;&gt;

&lt;!&ndash;export default {&ndash;&gt;
&lt;!&ndash;  name: "LineChart",&ndash;&gt;
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
&lt;!&ndash;    transactions: {&ndash;&gt;
&lt;!&ndash;      handler(newVal, oldVal) {&ndash;&gt;
&lt;!&ndash;        this.drawChart()&ndash;&gt;
&lt;!&ndash;      },&ndash;&gt;
&lt;!&ndash;      deep: true&ndash;&gt;
&lt;!&ndash;    }&ndash;&gt;
&lt;!&ndash;  },&ndash;&gt;
&lt;!&ndash;  computed: {&ndash;&gt;
&lt;!&ndash;    ...mapState(["chosenTime"]),&ndash;&gt;

&lt;!&ndash;    transactions() {&ndash;&gt;
&lt;!&ndash;      return this.$store.state.transactions;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;

&lt;!&ndash;    dataToDisplay() {&ndash;&gt;
&lt;!&ndash;      switch (this.chosenTime) {&ndash;&gt;
&lt;!&ndash;        case "7":&ndash;&gt;
&lt;!&ndash;          return this.dailyAmounts;&ndash;&gt;
&lt;!&ndash;        case "31":&ndash;&gt;
&lt;!&ndash;          return this.weeklyAmounts;&ndash;&gt;
&lt;!&ndash;        case "365":&ndash;&gt;
&lt;!&ndash;          return this.monthlyAmounts;&ndash;&gt;
&lt;!&ndash;        case "-1":&ndash;&gt;
&lt;!&ndash;          return this.monthlyAmounts;&ndash;&gt;
&lt;!&ndash;        default:&ndash;&gt;
&lt;!&ndash;          return this.weeklyAmounts;&ndash;&gt;
&lt;!&ndash;      }&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    monthlyAmounts() {&ndash;&gt;
&lt;!&ndash;      const totalsByMonth = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach((transaction) => {&ndash;&gt;
&lt;!&ndash;        //if (transaction.amount >= 0) return; // Skip positive or zero values&ndash;&gt;

&lt;!&ndash;        const date = new Date(transaction.date);&ndash;&gt;
&lt;!&ndash;        const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;&ndash;&gt;

&lt;!&ndash;        if (!totalsByMonth[monthYearKey]) {&ndash;&gt;
&lt;!&ndash;          totalsByMonth[monthYearKey] = 0;&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;        totalsByMonth[monthYearKey] += (transaction.amount);&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      return Object.entries(totalsByMonth).sort(&ndash;&gt;
&lt;!&ndash;        (a, b) => new Date("01-" + a[0]) - new Date("01-" + b[0])&ndash;&gt;
&lt;!&ndash;      );&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    weeklyAmounts() {&ndash;&gt;
&lt;!&ndash;      const totalsByWeek = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach((transaction) => {&ndash;&gt;
&lt;!&ndash;        //if (transaction.amount >= 0) return;&ndash;&gt;

&lt;!&ndash;        const date = new Date(transaction.date);&ndash;&gt;
&lt;!&ndash;        const startOfWeek = new Date(date);&ndash;&gt;
&lt;!&ndash;        let dayOfWeek = date.getDay();&ndash;&gt;
&lt;!&ndash;        if (dayOfWeek === 0) {&ndash;&gt;
&lt;!&ndash;          dayOfWeek = 6;&ndash;&gt;
&lt;!&ndash;        } else {&ndash;&gt;
&lt;!&ndash;          dayOfWeek -= 1;&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;        startOfWeek.setDate(date.getDate() - dayOfWeek);&ndash;&gt;

&lt;!&ndash;        const weekString = `${("0" + (startOfWeek.getMonth() + 1)).slice(&ndash;&gt;
&lt;!&ndash;          -2&ndash;&gt;
&lt;!&ndash;        )}-${("0" + startOfWeek.getDate()).slice(-2)}`;&ndash;&gt;

&lt;!&ndash;        if (!totalsByWeek[weekString]) {&ndash;&gt;
&lt;!&ndash;          totalsByWeek[weekString] = 0;&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;        totalsByWeek[weekString] += (transaction.amount);&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      return Object.entries(totalsByWeek).sort(&ndash;&gt;
&lt;!&ndash;        (a, b) => new Date(a[0]) - new Date(b[0])&ndash;&gt;
&lt;!&ndash;      );&ndash;&gt;

&lt;!&ndash;      return result;&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
&lt;!&ndash;    dailyAmounts() {&ndash;&gt;
&lt;!&ndash;      const totalsByDate = {};&ndash;&gt;

&lt;!&ndash;      this.transactions.forEach((transaction) => {&ndash;&gt;
&lt;!&ndash;        //if (transaction.amount >= 0) return;&ndash;&gt;

&lt;!&ndash;        if (!totalsByDate[transaction.date]) {&ndash;&gt;
&lt;!&ndash;          totalsByDate[transaction.date] = 0;&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;        totalsByDate[transaction.date] += (transaction.amount);&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;

&lt;!&ndash;      return Object.entries(totalsByDate).sort(&ndash;&gt;
&lt;!&ndash;        (a, b) => new Date(a[0]) - new Date(b[0])&ndash;&gt;
&lt;!&ndash;      );&ndash;&gt;
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
&lt;!&ndash;            totals[category] += txn.amount;&ndash;&gt;
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
&lt;!&ndash;    drawChart() {&ndash;&gt;
&lt;!&ndash;      google.charts.load("current", { packages: ["corechart"] });&ndash;&gt;
&lt;!&ndash;      google.charts.setOnLoadCallback(() => {&ndash;&gt;
&lt;!&ndash;        try {&ndash;&gt;
&lt;!&ndash;          const data = new google.visualization.DataTable();&ndash;&gt;
&lt;!&ndash;          data.addColumn("string", "Date");&ndash;&gt;
&lt;!&ndash;          data.addColumn("number", "Amount Spent");&ndash;&gt;

&lt;!&ndash;          // Format data to have {v, f} format&ndash;&gt;
&lt;!&ndash;          const formattedData = this.dataToDisplay.map((item) => {&ndash;&gt;
&lt;!&ndash;            const date = item[0];&ndash;&gt;
&lt;!&ndash;            const value = item[1];&ndash;&gt;
&lt;!&ndash;            return [date, { v: value, f: `$${Math.round(value)}` }];&ndash;&gt;
&lt;!&ndash;          });&ndash;&gt;

&lt;!&ndash;          data.addRows(formattedData);&ndash;&gt;

&lt;!&ndash;          const options = {&ndash;&gt;
&lt;!&ndash;            title: "Balance over time",&ndash;&gt;
&lt;!&ndash;            curveType: "function",&ndash;&gt;
&lt;!&ndash;            Legend: { position: "bottom" },&ndash;&gt;
&lt;!&ndash;            haxis: {&ndash;&gt;
&lt;!&ndash;              title: "Date",&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            vaxis: {&ndash;&gt;
&lt;!&ndash;              title: "Amount Spent",&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            backgroundColor: getComputedStyle(&ndash;&gt;
&lt;!&ndash;              document.documentElement&ndash;&gt;
&lt;!&ndash;            ).getPropertyValue("&#45;&#45;background-color"),&ndash;&gt;
&lt;!&ndash;            titleColor: getComputedStyle(&ndash;&gt;
&lt;!&ndash;              document.documentElement&ndash;&gt;
&lt;!&ndash;            ).getPropertyValue("&#45;&#45;header-text"),&ndash;&gt;
&lt;!&ndash;            legend: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(&ndash;&gt;
&lt;!&ndash;                  document.documentElement&ndash;&gt;
&lt;!&ndash;                ).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            hAxis: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(&ndash;&gt;
&lt;!&ndash;                  document.documentElement&ndash;&gt;
&lt;!&ndash;                ).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;            vAxis: {&ndash;&gt;
&lt;!&ndash;              textStyle: {&ndash;&gt;
&lt;!&ndash;                color: getComputedStyle(&ndash;&gt;
&lt;!&ndash;                  document.documentElement&ndash;&gt;
&lt;!&ndash;                ).getPropertyValue("&#45;&#45;text"),&ndash;&gt;
&lt;!&ndash;              },&ndash;&gt;
&lt;!&ndash;            },&ndash;&gt;
&lt;!&ndash;          };&ndash;&gt;

&lt;!&ndash;          const chart = new google.visualization.LineChart(&ndash;&gt;
&lt;!&ndash;            document.getElementById("linechart")&ndash;&gt;
&lt;!&ndash;          );&ndash;&gt;
&lt;!&ndash;          chart.draw(data, options);&ndash;&gt;
&lt;!&ndash;        } catch (error) {&ndash;&gt;
&lt;!&ndash;          console.error("Error drawing the line chart:", error);&ndash;&gt;
&lt;!&ndash;        }&ndash;&gt;
&lt;!&ndash;      });&ndash;&gt;
&lt;!&ndash;    },&ndash;&gt;
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
&lt;!&ndash;</style>&ndash;&gt;
-->
