<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="phone">Phone number</label>
        <input type="number" id="phone" v-model="phone" required />
      </div>
      <div class="form-group">
        <label for="age">Age</label>
        <input type="number" id="age" max="120" min="5" v-model="age" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import initializeApp from "../store.js";

const name = ref("");
const email = ref("");
const phone = ref("");
const age = ref("");
const password = ref("");
const confirmPassword = ref("");

const store = useStore();
const router = useRouter();
const exist = ref(false);

async function submitForm() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("Please enter a valid email address");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  const response = await axios.get("http://localhost:8081/api/users");
  response.data.forEach((oldUser) => {
    if (email.value.toLowerCase() === oldUser.email.toLowerCase()) {
      exist.value = true;
    }
  });

  if (exist.value) {
    alert("This email is already used");
    exist.value = false;
    return;
  } else {
    addUser();
    try {
      const response = await axios.post("http://localhost:8081/api/sessions", {
        email: email.value,
        startTime: new Date(Date.now()).toISOString().slice(0, 19).replace("T", " "),
        expiryTime: new Date(new Date().getTime() + 30 * 60000).toISOString().slice(0, 19).replace("T", " "),
      });
      logIn();
    } catch (error) {
      alert("Error occurred during sign up. Please try again later.");
    }
  }
}

async function addUser() {
  const user = {
    name: name.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
    age: age.value,
    account_limit: 0,
    notification_preference: "both",
    balance: 0,
  };
  try {
    const response = await axios.post("http://localhost:8081/api/users", user);
    if (response.status === 200) {
      alert("You successfully signed up");
      store.commit("ADD_USER", user);
      console.log(store.state.user);
    } else {
      alert("Error occurred during sign up. Please try again later.");
    }
  } catch (error) {
    alert("Error occurred during sign up. Please try again later.");
  }
}

const logIn = async () => {
  try {
    const response = await axios.get("http://localhost:8081/api/sessions");
    if (response.data.length > 0) {
      store.commit("LOG_IN");
      localStorage.setItem("authToken", "connected");
      const responseUser = await axios.get("http://localhost:8081/api/users/" + response.data[response.data.length - 1].email);
      store.commit("SET_USER_ID_ACTIVE", responseUser.data.email);
      const transactionsResponse = await axios.get("http://localhost:8081/api/transactions/" + responseUser.data.id);
      store.commit("SET_TRANSACTIONS", transactionsResponse.data);
      store.commit("SET_INITIAL_TRANSACTIONS", transactionsResponse.data);
      store.commit("SET_BALANCE", transactionsResponse.data);
      initializeApp();
    }
  } catch (error) {
    console.error(error);
  }
  router.push("/settings");
};
</script>

<style scoped>
.signup-container {
  max-width: 50%;
  margin: 0 auto;
  padding: 3% 5% 2% 4%;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

h1 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[id="name"],
input[id="email"],
input[id="phone"],
input[id="age"],
input[id="password"],
input[id="confirm-password"] {
  width: 100%;
  padding: 1%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .signup-container {
    max-width: 100%;
    padding: 10px 20px 10px 10px;
  }

  input[id="name"],
  input[id="email"],
  input[id="phone"],
  input[id="age"],
  input[id="password"],
  input[id="confirm-password"] {
    width: 100%;
    padding: 5px;
  }

  button[type="submit"] {
    padding: 5px 10px;
  }
}
</style>
