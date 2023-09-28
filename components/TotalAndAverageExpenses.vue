<template>
  <div class="summary">
    <div>Total Expenses in 2023 : ${{ totalExpenses }}</div>
    <div>Average Daily Expense: ${{ averageDailyExpense }}</div>
  </div>
</template>
<script>
export default {
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
      return Math.round(this.totalExpenses / this.numberOfDays());
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