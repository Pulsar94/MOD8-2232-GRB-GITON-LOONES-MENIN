// store.js
import { createStore } from 'vuex';

export const store = createStore({
    state: {
        myInitialTransactionsArray: [],
        myTransactionsArray: [],
        numberOfDays: 0,
        chosenTime: 31,
    },
    mutations: {
        SET_INITIAL_TRANSACTIONS(state, iTransactions) {
            state.myInitialTransactionsArray = iTransactions;
        },
        SET_TRANSACTIONS(state, transactions) {
            state.myTransactionsArray = transactions;
        },
        SET_DAYS(state, days) {
            state.numberOfDays = days;
        },
        SET_CHOSEN_TIME(state, chosenTime) {
            state.chosenTime = chosenTime;
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
