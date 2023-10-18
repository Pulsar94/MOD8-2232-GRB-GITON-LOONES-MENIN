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

const name = ref("");
const email = ref("");
const phone = ref("");
const age = ref("");
const password = ref("");
const confirmPassword = ref("");

const store = useStore();
const router = useRouter();
const users = ref(store.state.user);
const exist = ref(false);

function submitForm() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("Please enter a valid email address");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  users.value.forEach((oldUser) => {
    if (email.value === oldUser.email) {
      exist.value = true;
    }
  });

  if (exist.value) {
    alert("This email is already used");
    exist.value = false;
    return;
  } else {
    addUser();
    store.commit("SET_USER_ID_ACTIVE", email.value);
    logIn();
  }
}

// function addUser() {
//   const user = {
//     id: users.value.length + 1,
//     name: name.value,
//     email: email.value,
//     password: password.value,
//     phone: phone.value,
//     age: age.value,
//   };

//   store.commit("ADD_USER", user);
//   alert("You successfully signed up");
// }

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
    } else {
      alert("Error occurred during sign up. Please try again later.");
    }
  } catch (error) {
    alert("Error occurred during sign up. Please try again later.");
  }
}

const logIn = () => {
  store.commit("LOG_IN");
  router.push("/dashboard");
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
