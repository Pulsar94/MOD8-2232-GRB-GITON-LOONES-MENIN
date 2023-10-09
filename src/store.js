// store.js
import {createStore} from 'vuex';
import {toRaw} from "vue";

export const store = createStore({
    state: {
        myInitialTransactionsArray: [],
        myTransactionsArray: [],
        numberOfDays: 0,
        chosenTime: '31',
        month: null,
        year: null,
        dateRange: '',
        user: [{
            id: 1,
            name: 'Patrick',
            email: 'patrick@gmail.com',
            password: '123456',
            phone: '1234567890',
            age: 24,
        },
        {
            id: 2,
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'admin',
            phone: '0000000000',
            age: 100,
        }],
        authenticated: false,
        limit: -3000,
        balance: 0,
        userIDActive: "",
    },
    mutations: {
        SET_USER_ID_ACTIVE(state, userIDActive) {
            state.userIDActive = userIDActive;
        },
        SET_INITIAL_TRANSACTIONS(state, transactions) {
            state.myInitialTransactionsArray = transactions;

        },
        SET_TRANSACTIONS(state, transactions) {
            state.myTransactionsArray = transactions;
        },
        SET_BALANCE(state, transactions) {
            state.balance = 0;
            //update balance
            for (let i = 0; i < transactions.length; i++) {
                // console.log(state.balance + " + " + transactions[i].amount)
                state.balance += transactions[i].amount;
                // console.log("= " + state.balance, transactions[i].date)
            }
        },
        SET_DAYS(state, days) {
            state.numberOfDays = days;
        },
        SET_CHOSEN_TIME(state, chosenTime) {
            state.chosenTime = chosenTime;
        },
        SET_MONTH(state, month) {
            state.month = month;
        },
        SET_YEAR(state, year) {
            state.year = year;
        },
        SET_DATE_RANGE(state, dateRange) {
            state.dateRange = dateRange;
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
            state.myInitialTransactionsArray.push(toRaw(transaction));
            //update balance
            // console.log(state.balance)
            state.balance = state.myTransactionsArray.reduce((sum, txn) => sum + txn.amount, 0);
        },
        LOG_IN(state) {
            state.authenticated = true;
        },
        LOG_OUT(state) {
            state.authenticated = false;
            state.userIDActive = "";
        },
        SET_LIMIT(state, limit) {
            state.limit = limit;
        }
    },
    getters: {
        transactions: (state) => state.myTransactionsArray
    }
});
