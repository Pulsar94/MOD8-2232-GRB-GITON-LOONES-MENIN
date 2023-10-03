<template>
  <div class="recent-transactions">
    <h1>Recent Transactions</h1>
    <button @click="transactionForm">Add a transaction</button>
    <form>
      <select v-if="clicked" v-model="newTransaction.category">
        <option value="Utilities">Utilities</option>
        <option value="Dining">Dining</option>
        <option value="Travel">Travel</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Received bonus">Received bonus</option>
        <option value="Refund">Refund</option>
        <option value="Gift received">Gift received</option>
        <option value="Sold item">Sold item</option>
        <option value="Salary">Salary</option>
      </select>
      <input v-if="clicked" v-model="newTransaction.libelle" placeholder="Libelle" type="text"/>
      <input v-if="clicked" v-model="newTransaction.amount" placeholder="Amount" type="number"/>
      <input v-if="clicked" v-model="newTransaction.date" placeholder="Date" type="date"/>
      <button v-if="clicked" @click.prevent="addTransaction">Add</button>

    </form>
    <table>
      <thead>
        <tr>
          <th class="category">Category</th>
          <th class="libelle">Libelle</th>
          <th class="date">Date</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="txn in pagedTransactions" :key="txn.id">
          <td class="category">{{ txn.category }}</td>
          <td class="libelle">{{ txn.libelle }}</td>
          <td>{{new Date(txn.date).getFullYear() }}/{{('0'+(new Date(txn.date).getMonth()+1)).slice(-2)}}/{{('0'+(new Date(txn.date).getDate())).slice(-2) }}</td>
          <td class="amount">$ {{ txn.amount.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="prevPage">Prev Page</button>
    <button @click="nextPage">Next Page</button>
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
  data() {
    return {
      currentPage: 0,
      itemsPerPage: 40,
      newTransaction: {
        id: 0,
        category: "Utilities",
        libelle: "Libelle",
        amount: 1000,
        date: "",
      },
      clicked: false,
    };
  },
  watch: {
    chosenTime(newValue){
      console.log(newValue)
    }
  },


  computed: {
    pagedTransactions() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedTransactions.slice(start, end);
    },
    sortedTransactions() {
      return this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage > 0)
        this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < Math.ceil(this.sortedTransactions.length / this.itemsPerPage) - 1)
        this.currentPage++;
    },
    transactionForm() {
      this.clicked = true;
    },
    formatDate(date) {
      const month = date.getMonth() + 1; // 0-indexed month
      const day = date.getDate();
      const year = date.getFullYear();
      return `${year}/${month}/${day}`;
    },
    addTransaction() {
      // Generating unique ID using Date.now()
      this.newTransaction.id = Date.now();
      this.newTransaction.date = this.formatDate(new Date(this.newTransaction.date));
      if(this.newTransaction.category === "Received bonus" || this.newTransaction.category === "Refund" || this.newTransaction.category === "Gift received" || this.newTransaction.category === "Sold item" || this.newTransaction.category === "Salary")
        this.newTransaction.amount = Math.abs(this.newTransaction.amount);
      else{
        this.newTransaction.amount = -Math.abs(this.newTransaction.amount);
      }

      const transactionDate = new Date(this.newTransaction.date).getTime();
      const limitDate = new Date().getTime() - this.$store.state.chosenTime * 24 * 60 * 60 * 1000;
      console.log(transactionDate, limitDate);

      if (transactionDate > limitDate) {
        this.$store.commit('addTransaction', this.newTransaction);
      }

      this.clicked = false;
      this.newTransaction = {
        id: 0,
        category: "Utilities",
        amount: 1000,
        date: "",
      };
    }

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
  width: 31%;
}

.recent-transactions .libelle {
  width: 31%;
}

.recent-transactions .date {
  width: 31%;
}

.recent-transactions .amount {
  width: 31%;
}
</style>
