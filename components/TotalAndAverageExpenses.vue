<template>
  <div class="summary">
    <div>
      Total Expenses in
      <select v-model="chosenTime">
        <option value="-1">all periods combined</option>
        <option value="365">a year</option>
        <option value="31">a month</option>
        <option value="7">a week</option>
      </select>
      : ${{ Math.abs(totalExpenses) }}
    </div>
    <div>Total Gain: ${{ Math.abs(totalGain) }}</div>
    <div>Difference: ${{totalGain+totalExpenses}}</div>
    <div>Average Daily Expense: ${{ Math.abs(averageDailyExpense) }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chosenTime: '31'
    }
  },
  watch: {
    chosenTime(newValue) {
      const todayDate = new Date()
      this.$store.commit('SET_CHOSEN_TIME', newValue);
      if (newValue !== "-1"){
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate < todayDate).filter(t => t.rawDate > new Date()-this.chosenTime* 24 * 60 * 60 * 1000));
        this.$forceUpdate();
      }else {
        this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray);
        this.$forceUpdate();
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
div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>