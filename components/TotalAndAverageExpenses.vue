<template>
  <div class="summary">
    <div class="total">
      Total Expenses in
      <select v-model="chosenTime" @change="setSelectWidth()">
        <option value="-1">all periods combined</option>
        <option value="365">a year</option>
        <option value="31">a month</option>
        <option value="7">a week</option>
        <option value="-2">custom</option></select
      >: ${{ Math.abs(totalExpenses) }}
    </div>
    <div>Total Gain: ${{ Math.abs(totalGain) }}</div>
    <div>Difference: ${{ totalGain + totalExpenses }}</div>
    <div>Average Daily Expense: ${{ Math.abs(averageDailyExpense) }}</div>
    <div class="datepicker" v-if="this.router.currentRoute.path === `/dashboard`">
      <VueDatePicker :dark="isDarkMode" class="dp__theme_dark" v-if="chosenTime === '-2'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[[this.myInitialTransactionsArray.length-1]].rawDate" :max-date="new Date()" range :format="'yyyy-MM-dd'"></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" class="dp__theme_dark" v-if="chosenTime === '7'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[[this.myInitialTransactionsArray.length-1]].rawDate" :max-date="new Date()" week-picker :format="'yyyy-MM-dd'"></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" class="dp__theme_dark" v-if="chosenTime === '31'" v-model="month" auto-apply :min-date="myInitialTransactionsArray[[this.myInitialTransactionsArray.length-1]].rawDate" :max-date="new Date()" month-picker :format="'yyyy-MM'"></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" class="dp__theme_dark" v-if="chosenTime === '365'" v-model="year" auto-apply :min-date="myInitialTransactionsArray[[this.myInitialTransactionsArray.length-1]].rawDate" :max-date="new Date()" year-picker :format="'yyyy'"></VueDatePicker>
    </div>
  </div>
</template>
<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";

export default {
  components: { VueDatePicker },

  data() {
    return {
      vm: this.watch,
      router: useRouter(),
      chosenTime: "31",
      month: { month: new Date().getMonth(), year: new Date().getFullYear() },
      year: new Date().getFullYear(),
      dateRange: null,
      myInitialTransactionsArray: this.$store.state.myInitialTransactionsArray.sort((a, b) => new Date(b.date) - new Date(a.date)),
      isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
    };
  },
  mounted() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      this.isDarkMode = e.matches;
    });
  },
  watch: {
    chosenTime(newValue) {
      const todayDate = new Date();
      this.$store.commit("SET_CHOSEN_TIME", newValue);
      this.dateRange = null;
      if (newValue === "-2" || newValue === "7") {
        console.log(this);
        this.dateRange = [new Date(todayDate.getTime() - 1000 * 60 * 60 * 24 * 6), todayDate];
      }
      if (newValue !== "-1") {
        this.$emit(
          "filteredTransactions",
          this.$store.state.myInitialTransactionsArray
            .filter((t) => t.rawDate < todayDate)
            .filter((t) => t.rawDate > todayDate - newValue * 24 * 60 * 60 * 1000)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        this.$store.commit(
          "SET_TRANSACTIONS",
          this.$store.state.myInitialTransactionsArray
            .filter((t) => t.rawDate < todayDate)
            .filter((t) => t.rawDate > todayDate - newValue * 24 * 60 * 60 * 1000)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } else {
        this.$emit("filteredTransactions", this.$store.state.myInitialTransactionsArray);
        this.$store.commit("SET_TRANSACTIONS", this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    month(newValue) {
      console.log(newValue);
      if (newValue) {
        const todayDate = new Date();
        this.$store.commit("SET_MONTH", newValue);
        this.$store.commit(
          "SET_TRANSACTIONS",
          this.$store.state.myInitialTransactionsArray.filter((t) => t.rawDate < todayDate).filter((t) => t.rawDate.getMonth() === newValue.month && t.rawDate.getFullYear() === newValue.year)
        );
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        this.$store.commit("SET_TRANSACTIONS", this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    year(newValue) {
      console.log(newValue);

      if (newValue) {
        const todayDate = new Date();
        this.$store.commit("SET_YEAR", newValue);
        this.$store.commit(
          "SET_TRANSACTIONS",
          this.$store.state.myInitialTransactionsArray.filter((t) => t.rawDate < todayDate).filter((t) => t.rawDate.getFullYear() === newValue)
        );
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        this.$store.commit("SET_TRANSACTIONS", this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    dateRange(newValue) {
      console.log(newValue);
      const todayDate = new Date();
      if (newValue !== null && newValue.length === 2) {
        // this.$store.commit('SET_CHOSEN_TIME', '7');
        this.$store.commit("SET_DATE_RANGE", newValue);
        this.$store.commit(
          "SET_TRANSACTIONS",
          this.$store.state.myInitialTransactionsArray.filter((t) => t.rawDate < todayDate).filter((t) => new Date(t.rawDate.getTime() + 1000 * 60 * 60 * 24) > this.dateRange[0] && t.rawDate < this.dateRange[1])
        );
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        console.log("dateRange : newValue null");
      }
      this.$forceUpdate();
    },
  },
  name: "TotalAndAverageExpenses",
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    totalExpenses() {
      if (this.chosenTime !== "-1") {
        return Math.round(
          this.transactions
            .filter((t) => t.amount < 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .reduce((sum, txn) => sum + txn.amount, 0)
        );
      } else {
        return Math.round(
          this.$store.state.myInitialTransactionsArray
            .filter((t) => t.amount < 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .reduce((sum, txn) => sum + txn.amount, 0)
        );
      }
    },
    totalGain() {
      if (this.chosenTime !== "-1") {
        return Math.round(
          this.transactions
            .filter((t) => t.amount > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .reduce((sum, txn) => sum + txn.amount, 0)
        );
      } else {
        return Math.round(
          this.$store.state.myInitialTransactionsArray
            .filter((t) => t.amount > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .reduce((sum, txn) => sum + txn.amount, 0)
        );
      }
    },
    averageDailyExpense() {
      if (this.chosenTime !== "-1") {
        return Math.round(this.totalExpenses / (this.numberOfDays() < this.chosenTime ? this.numberOfDays() : this.chosenTime));
      } else {
        const firstDate = this.$store.state.myInitialTransactionsArray.at(0).rawDate;
        const lastDate = this.$store.state.myInitialTransactionsArray.at(this.$store.state.myInitialTransactionsArray.length - 1).rawDate;
        this.$store.commit("SET_DAYS", Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        return Math.round(this.totalExpenses / this.numberOfDays());
      }
    },
  },

  methods: {
    numberOfDays() {
      return this.$store.state.numberOfDays;
    },
    setSelectWidth() {
      const select = document.querySelector("select");
      console.log(select.value);
      if (window.innerWidth < 680) {
        select.style.width = "21ch";
        return;
      }
      switch (select.value) {
        case "-1": {
          select.style.width = "21ch";
          break;
        }
        case "365": {
          select.style.width = "10ch";
          break;
        }
        case "31": {
          select.style.width = "11ch";
          break;
        }
        case "7": {
          select.style.width = "10ch";
          break;
        }
      }
    },
  },
};
</script>
<style scoped>
/* .datepicker {
  width: 300px;
} */
::v-deep .dp__theme_dark input {
  margin-top: -10px;
  height: 25px;
}

::v-deep .dp__theme_dark svg {
  margin-top: -2px;
  margin-left: -2px;
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

select {
  margin: 0 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
  width: 11ch;
  height: 20px;
}

select:hover {
  background-color: var(--select-hover);
}

.total {
  display: flex;
  flex-direction: row;
}

@media (max-width: 740px) {
  div.summary {
    flex-direction: column;
    align-items: center;
  }

  select {
    width: 20ch;
  }

  .summary > div {
    margin: 10px 0;
  }
}

@media (max-width: 620px) {
  .total {
    flex-direction: column;
    align-items: center;
  }
}
</style>
