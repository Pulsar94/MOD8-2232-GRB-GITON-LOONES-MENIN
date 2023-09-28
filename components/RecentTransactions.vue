<template>
  <div class="recent-transactions">
    <h2>Recent Transactions</h2>
    <table>
      <thead>
        <tr>
          <th class="category">Category</th>
          <th>Date</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="txn in sortedTransactions" :key="txn.id">
          <td class="category">{{ txn.description }}</td>
          <td>{{ txn.date }}</td>
          <td class="amount">$ {{ txn.amount.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    sortedTransactions() {
      return this.transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.recent-transactions {
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--background-color);
}

.recent-transactions h2 {
  margin-bottom: 10px;
  font-size: 1.5em;
  font-weight: 600;
  color: var(--header-text);
}

.recent-transactions table {
  width: 100%;
  border-collapse: collapse;
}

.recent-transactions th,
.recent-transactions td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.recent-transactions tbody tr:last-child td {
  border-bottom: none;
}

.recent-transactions .category {
  width: 50%; /* or you can give a fixed width like 300px */
}

.recent-transactions .amount {
  width: 10%; /* or another fixed width */
}
</style>
