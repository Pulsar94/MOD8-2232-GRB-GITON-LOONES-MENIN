<template>
  <div class="summary">
    <div>
      Total Expenses in
      <select v-model="chosenTime">
        <option value="365">a year</option>
        <option value="31">a month</option>
        <option value="7">a week</option>
      </select>
      : ${{ totalExpenses }}
    </div>
    <div>Average Daily Expense: ${{ averageDailyExpense }}</div>
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
      this.$store.commit('SET_CHOSEN_TIME', newValue);
      this.$store.commit('SET_TRANSACTIONS', this.$store.state.myInitialTransactionsArray.filter(t => t.rawDate > new Date()-this.chosenTime* 24 * 60 * 60 * 1000));
      this.$forceUpdate();
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
      return Math.round(this.transactions.reduce((sum, txn) => sum + txn.amount, 0));
    },
    averageDailyExpense() {
      return Math.round(this.totalExpenses / (this.numberOfDays() < this.chosenTime ? this.numberOfDays() : this.chosenTime))
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