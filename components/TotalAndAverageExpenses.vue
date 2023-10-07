<template>
  <div class="summary">
    <div class="total">
      Total Expenses in
      <select v-model="chosenTime" @change="setSelectWidth()">
        <option value="-1">all periods combined</option>
        <option value="365">a year</option>
        <option value="31">a month</option>
        <option value="7">a week</option>
        <option value="-2">custom</option>
      </select>: ${{ Math.abs(totalExpenses) }}
    </div>
    <div>Total Gain: ${{ Math.abs(totalGain) }}</div>
    <div>Difference: ${{ totalGain + totalExpenses }}</div>
    <div>Average Daily Expense: ${{ Math.abs(averageDailyExpense) }}</div>
    <div class="datepicker">
      <VueDatePicker :dark="isDarkMode" v-if="chosenTime === '-2'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" range :format="'yyyy-MM-dd'" ></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" v-if="chosenTime === '7'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" week-picker :format="'yyyy-MM-dd'"></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" v-if="chosenTime === '31'" v-model="month" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" month-picker :format="'yyyy-MM'"></VueDatePicker>
      <VueDatePicker :dark="isDarkMode" v-if="chosenTime === '365'" v-model="year" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" year-picker :format="'yyyy'"></VueDatePicker>
    </div>
  </div>
</template>
<script>
import lineChart from "./LineChart.vue";
import pieChart from "./PieChart.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import router from "../router";
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  this.isDarkMode = e.matches;
});
export default {
  components: { VueDatePicker },
  data() {
    return {
      chosenTime: '31',
      month: null,
      year: null,
      dateRange: null,
      myInitialTransactionsArray: this.$store.state.myInitialTransactionsArray,
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    }
  },

  watch: {
    chosenTime(newValue) {
      const todayDate = new Date();
      this.$store.commit("SET_CHOSEN_TIME", newValue);
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
      if (newValue) {
        const todayDate = new Date()
        this.$store.commit('SET_MONTH', newValue);
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => t.rawDate.getMonth() === newValue.month && t.rawDate.getFullYear() === newValue.year));
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    year(newValue) {
      if (newValue) {
        const todayDate = new Date()
        this.$store.commit('SET_YEAR', newValue);
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => t.rawDate.getFullYear() === newValue));
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    dateRange(newValue) {
      const todayDate = new Date()
      if (newValue !== null && newValue.length === 2) {
        // this.$store.commit('SET_CHOSEN_TIME', '7');
        this.$store.commit('SET_DATE_RANGE', newValue)
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => new Date(t.rawDate.getTime() + 1000*60*60*24) > this.dateRange[0] && t.rawDate < this.dateRange[1]));
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        this.$store.commit('SET_CHOSEN_TIME', '-3');
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
      }
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
      if (window.innerWidth < 680) {
        select.style.width = "19.2ch";
        return;
      }
      switch (select.value) {
        case "-1": {
          select.style.width = "19.2ch";
          break;
        }
        case "365": {
          select.style.width = "9ch";
          break;
        }
        case "31": {
          select.style.width = "10.3ch";
          break;
        }
        case "7": {
          select.style.width = "9.2ch";
          break;
        }
      }
    },
  },
};
</script>
<style scoped>
.datepicker {
  width: 300px;
}

.dp__theme_dark{
  --dp-background-color: #212121;
  --dp-text-color: #ffffff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #005cb2;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #1976d2;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

select {
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
  width: 10.3ch;
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
    width: 19.2ch;
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
