<template>
  <div class="summary">
    <div>
      Total Expenses in
      <select v-model="chosenTime">
        <option value="-1">all periods combined</option>
        <option value="365">a year</option>
        <option value="31">a month</option>
        <option value="7">a week</option>
        <option value="-3">custom</option>
      </select>: ${{ Math.abs(totalExpenses) }}
    </div>
    <div>Total Gain: ${{ Math.abs(totalGain) }}</div>
    <div>Difference: ${{totalGain+totalExpenses}}</div>
    <div>Average Daily Expense: ${{ Math.abs(averageDailyExpense) }}</div>
    <div class="datepicker">
      <VueDatePicker v-if="chosenTime === '-3'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" range :format="'yyyy-MM-dd'" ></VueDatePicker>
      <VueDatePicker v-if="chosenTime === '7'" v-model="dateRange" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" week-picker :format="'yyyy-MM-dd'"></VueDatePicker>
      <VueDatePicker v-if="chosenTime === '31'" v-model="month" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" month-picker :format="'yyyy-MM'"></VueDatePicker>
      <VueDatePicker v-if="chosenTime === '365'" v-model="year" auto-apply :min-date="myInitialTransactionsArray[0].rawDate" :max-date="new Date()" year-picker :format="'yyyy'"></VueDatePicker>
    </div>
  </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: { VueDatePicker },
  data() {
    return {
      chosenTime: '31',
      month: null,
      year: null,
      dateRange: null,
      myInitialTransactionsArray: this.$store.state.myInitialTransactionsArray,
    }
  },
  watch: {
    chosenTime(newValue) {
      const todayDate = new Date()
      this.$store.commit('SET_CHOSEN_TIME', newValue);

      if (newValue !== "-1"){
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => t.rawDate > new Date()-this.chosenTime* 24 * 60 * 60 * 1000));
      }else {
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
      }
      this.$forceUpdate();
    },
    month(newValue) {
      console.log(newValue)
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
        this.$store.commit('SET_CHOSEN_TIME', '-2');
        this.$store.commit('SET_DATE_RANGE', newValue)
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => t.rawDate > this.dateRange[0] && t.rawDate < this.dateRange[1]));
        this.$emit("filteredTransactions", this.$store.state.myTransactionsArray);
      } else {
        console.log("AAAAAAAAAAAA")
        this.$store.commit('SET_CHOSEN_TIME', '-3');
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
      }
    },
  },
  name: 'TotalAndAverageExpenses',
  props: {
    transactions: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalExpenses() {
      if (this.chosenTime !== "-1") {
        return Math.round(this.transactions.filter((t) => t.amount < 0).reduce((sum, txn) => sum + txn.amount, 0));
      }else {
        return Math.round(this.$store.state.myInitialTransactionsArray.filter((t) => t.amount < 0).reduce((sum, txn) => sum + txn.amount, 0));
      }
    },
    totalGain() {
      if (this.chosenTime !== "-1") {
        return Math.round(this.transactions.filter((t) => t.amount > 0).reduce((sum, txn) => sum + txn.amount, 0));
      }else {
        return Math.round(this.$store.state.myInitialTransactionsArray.filter((t) => t.amount > 0).reduce((sum, txn) => sum + txn.amount, 0));
      }
    },
    averageDailyExpense() {
      if (this.chosenTime !== "-1") {
        return Math.round(this.totalExpenses / (this.numberOfDays() < this.chosenTime ? this.numberOfDays() : this.chosenTime))
      }else {
        const firstDate = this.$store.state.myInitialTransactionsArray.at(0).rawDate;
        const lastDate = this.$store.state.myInitialTransactionsArray.at(this.$store.state.myInitialTransactionsArray.length-1).rawDate;
        this.$store.commit('SET_DAYS', Math.round((lastDate.getTime() - firstDate.getTime() ) / (1000 * 60 * 60 * 24)));
        return Math.round(this.totalExpenses / this.numberOfDays())
      }
    },

  },

  methods: {
    numberOfDays() {
      return this.$store.state.numberOfDays
    },

  }
}
</script>
<style scoped>
.datepicker {
  width: 300px;
}
div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>