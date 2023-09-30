// store.js
import { createStore } from 'vuex';

export const store = createStore({
    state: {
        myInitialTransactionsArray: [],
        myTransactionsArray: [],
        numberOfDays: 0,
        chosenTime: 31,
        user: {
            id: 1,
            name: 'Patrick',
            email: 'patrick@gmail.com',
            password: '123456',
            phone: '1234567890',
            age: 24,
        },
        authenticated: true,
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
        },
        UPDATE_USER(state, updatedUser) {
            state.user.name = updatedUser.name;
            state.user.age = updatedUser.age;
            state.user.email = updatedUser.email;
            state.user.phone = updatedUser.phone;
            state.user.password = updatedUser.password;
        },
        LOG_IN(state) {
            state.authenticated = true;
        },
        LOG_OUT(state) {
            state.authenticated = false;
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
