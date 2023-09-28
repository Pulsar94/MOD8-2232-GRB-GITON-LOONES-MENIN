// store.js
import { createStore } from 'vuex';

export const store = createStore({
    state: {
        myTransactionsArray: [],
        numberOfDays: 0
    },
    mutations: {
        SET_TRANSACTIONS(state, transactions) {
            state.myTransactionsArray = transactions;
        },
        SET_DAYS(state, days) {
            state.numberOfDays = days;
        }
    },
    // mutations: {
    //     addTransaction(state, transaction) {
    //         state.transactions.push(transaction);
    //     }
    // },
    getters: {
        transactions: (state) => state.myTransactionsArray
    }
});
