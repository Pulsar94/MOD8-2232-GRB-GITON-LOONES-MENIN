<template>
  <div class="recent-transactions">
    <h1>Recent Transactions</h1>
    <button @click="transactionForm">Add a transaction</button>
    <form v-if="clicked" @submit.prevent="submitForm">
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
      <input v-model="newTransaction.libelle" placeholder="Libelle" type="text" />
      <input v-model="newTransaction.amount" placeholder="Amount" type="number" />
      <!--  <input v-model="newTransaction.transaction_date" placeholder="Date" type="date" />-->
      <VueDatePicker class="datepicker" :dark="true" v-model="newTransaction.date" auto-apply :max-date="new Date()"></VueDatePicker>
      <button class="addbutton" @click.prevent="addTransaction">Add</button>
    </form>
    <table>
      <thead>
        <tr>
          <th class="category">Category</th>
          <th class="libelle">Libelle</th>
          <th class="date">Date</th>
          <th class="amount">Amount</th>
          <th class="delete">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="txn in pagedTransactions" :key="txn.id">
          <td class="category">{{ txn.category }}</td>
          <td class="libelle">{{ txn.libelle }}</td>
          <td>{{ new Date(txn.transaction_date).getFullYear() }}/{{ ("0" + (new Date(txn.transaction_date).getMonth() + 1)).slice(-2) }}/{{ ("0" + new Date(txn.transaction_date).getDate()).slice(-2) }}</td>
          <td class="amount">$ {{ txn.amount }}</td>
          <td class="delete">
            <button @click="deleteTransaction(txn)" class="delete-button"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="prevPage">Prev Page</button>
    <button @click="nextPage">Next Page</button>
  </div>
</template>

<script>
import { integer } from "@vuelidate/validators";
import VueDatePicker from "@vuepic/vue-datepicker";
import axios from "axios";
export default {
  components: { VueDatePicker },
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
    chosenTime(newValue) {},
  },
  computed: {
    pagedTransactions() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedTransactions.slice(start, end);
    },
    sortedTransactions() {
      console.log(typeof this.transactions);
      return this.transactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    },
  },
  methods: {
    submitForm() {
      if (this.newTransaction.amount instanceof integer) {
        alert("Please enter a valid amount");
      }
    },
    prevPage() {
      if (this.currentPage > 0) this.currentPage--;
      const ypos = document.documentElement.scrollHeight - window.scrollY;
      setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight - ypos);
      }, 1); // to remove to remove auto scroll
    },
    nextPage() {
      if (this.currentPage < Math.ceil(this.sortedTransactions.length / this.itemsPerPage) - 1) this.currentPage++;
      const ypos = document.documentElement.scrollHeight - window.scrollY;
      setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight - ypos);
      }, 1);
    },
    transactionForm() {
      this.clicked = !this.clicked;
    },
    formatDate(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${year}/${month}/${day}`;
    },
    async addTransaction() {
      // Generating unique ID using Date.now()
      this.newTransaction.id = Date.now();
      this.newTransaction.transaction_date = this.formatDate(new Date(this.newTransaction.transaction_date)); //.replace(/-/g, "/")));
      if (this.newTransaction.category === "Received bonus" || this.newTransaction.category === "Refund" || this.newTransaction.category === "Gift received" || this.newTransaction.category === "Sold item" || this.newTransaction.category === "Salary") this.newTransaction.amount = Math.abs(this.newTransaction.amount);
      else {
        this.newTransaction.amount = -Math.abs(this.newTransaction.amount);
      }

      const transactionDate = new Date(this.newTransaction.transaction_date).getTime();
      const limitDate = new Date().getTime() - this.$store.state.chosenTime * 24 * 60 * 60 * 1000;

      if (transactionDate > limitDate) {
        this.$store.commit("addTransaction", this.newTransaction);
      }

      console.log(this.newTransaction);

      const email = this.$store.state.userIDActive;

      const user = await axios.get("http://localhost:8081/api/users/" + email);

      console.log(user);

      this.newTransaction.date = new Date(this.newTransaction.date);

      const newDatabaseTransaction = {
        id: this.newTransaction.id,
        category: this.newTransaction.category,
        libelle: this.newTransaction.libelle,
        amount: this.newTransaction.amount,
        transaction_date: new Date(this.newTransaction.date).toISOString().slice(0, 19).replace("T", " "),
        user_id: user.data.id,
      };

      const response = await axios.post("http://localhost:8081/api/transactions", newDatabaseTransaction);
      console.log(response);

      this.$emit("updateTransactions");

      this.clicked = false;
      this.newTransaction = {
        id: 0,
        category: "Utilities",
        amount: 1000,
        date: "",
      };
    },
    async deleteTransaction(txn) {
      const email = this.$store.state.userIDActive;

      const user = await axios.get("http://localhost:8081/api/users/" + email);

      console.log(user);

      // const newDatabaseTransaction = {
      //   id: this.newTransaction.id,
      //   category: this.newTransaction.category,
      //   libelle: this.newTransaction.libelle,
      //   amount: this.newTransaction.amount,
      //   transaction_date: new Date(this.newTransaction.date).toISOString().slice(0, 19).replace("T", " "),
      //   user_id: user.data.id,
      // };

      console.log("id", txn);
      const response = await axios.delete("http://localhost:8081/api/transactions/" + txn.transaction_id);
      console.log(response);

      this.$emit("updateTransactions");
    },
  },
};
</script>

<style scoped>
@import url("../../assets/css/variables.css");

.datepicker {
  width: 200px;
  justify-self: center;
}

.addbutton {
  margin: 0;
}

form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.dp__theme_dark {
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

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

tbody tr:last-child td {
  border-bottom: none;
}

.category {
  width: 31%;
}

.libelle {
  width: 31%;
}

.date {
  width: 25%;
}

.amount {
  width: 37%;
}

td:last-child,
th:last-child {
  text-align: center;
}

input {
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
}

select {
  width: 200px;
  padding: 5px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background-color: var(--text-input);
  color: var(--text);
}

select:hover {
  background-color: var(--select-hover);
}

button {
  margin: 20px 15px 40px 15px;
  padding: 5px 10px;
  background-color: var(--form-button);
  color: var(--black);
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: var(--form-button-hover);
}

.delete-button {
  background-color: transparent;
  border: none;
  color: var(--delete-button);
  padding: 0%;
  margin: 0%;
}

@media (max-width: 670px) {
  .recent-transactions {
    padding: 0;
  }

  td {
    padding: 10px 2px;
    font-size: 12px;
  }

  .category {
    width: auto;
  }

  .libelle {
    width: auto;
  }

  .date {
    width: auto;
  }

  .amount {
    width: auto;
  }
}
</style>
