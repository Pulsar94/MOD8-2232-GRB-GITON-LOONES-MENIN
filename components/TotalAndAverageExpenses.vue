<template>
  <div class="summary">
    <div class="total">
      Total Expenses in
      <div>
        <select v-model="chosenTime" @change="setSelectWidth()">
          <option value="-1">all periods combined</option>
          <option value="365">a year</option>
          <option value="31">a month</option>
          <option value="7">a week</option>
        </select>
        : ${{ Math.abs(totalExpenses) }}
      </div>
    </div>
    <div>Total Gain: ${{ Math.abs(totalGain) }}</div>
    <div>Difference: ${{ totalGain + totalExpenses }}</div>
    <div>Average Daily Expense: ${{ Math.abs(averageDailyExpense) }}</div>
  </div>
</template>
<script>
import lineChart from "./LineChart.vue";
import pieChart from "./PieChart.vue";

export default {
  data() {
    return {
      chosenTime: "31",
    };
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
        select.style.width = "19.2ch";
        return;
      }
      switch (select.value) {
        case "-1": {
          console.log("here");
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
