// store.js
import { createStore } from 'vuex';
import {toRaw} from "vue";

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
        }
    },
    mutations: {
        SET_INITIAL_TRANSACTIONS(state, transactions) {
            state.myInitialTransactionsArray = transactions;
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
        addTransaction(state, transaction) {
            state.myTransactionsArray.push(toRaw(transaction));
            // state.myInitialTransactionsArray.push(toRaw(transaction));
        },
    },
    getters: {
        transactions: (state) => state.myTransactionsArray
    }
});
