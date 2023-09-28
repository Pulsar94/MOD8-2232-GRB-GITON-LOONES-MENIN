<template>
  <div id="login-view">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <p>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </p>
      <p>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const handleLogin = () => {
  if (username.value === "admin" && password.value === "admin") {
    alert("You successfully logged in");
  } else {
    alert("Invalid credentials");
  }
  console.log(`Username: ${username.value}, Password: ${password.value}`);
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: var(--white);
}

p {
  color: var(--text);
}

button {
  padding: 10px 20px;
  background-color: var(--button);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: var(--button-hover);
}

#login-view {
  text-align: center;
}
</style>
