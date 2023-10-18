<template>
  <div id="login-view">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin()">
      <p>
        <label for="username">Email:</label>
        <input type="text" id="username" v-model="askedUsername" required />
      </p>
      <p>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="askedPassword" required />
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  </div>
  <div id="signup">
    <p>Don't have an account? <RouterLink to="/signup">Sign up</RouterLink></p>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import axios from "axios";
import initializeApp from "../store.js";

const askedUsername = ref("");
const askedPassword = ref("");
const store = useStore();
const router = useRouter();
const users = ref(store.state.user);

async function handleLogin() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;

  if (!emailRegex.test(askedUsername.value)) {
    alert("Please enter a valid email address");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8081/api/user", {
      email: askedUsername.value,
      password: askedPassword.value,
    });

    if (response.status === 200) {
      if (response.data.length === 0) {
        alert("Invalid credentials");
        return;
      }
      store.commit("SET_USER_ID_ACTIVE", askedUsername.value);
      try {
        const response = await axios.post("http://localhost:8081/api/sessions", {
          email: askedUsername.value,
          startTime: new Date(Date.now()).toISOString().slice(0, 19).replace("T", " "),
          expiryTime: new Date(new Date().getTime() + 30 * 60000).toISOString().slice(0, 19).replace("T", " "),
        });
      } catch (error) {
        alert("Error occurred during login. Please try again later.");
      }
      logIn();
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    alert("Error occurred during login. Please try again later.");
  }
}

const logIn = async () => {
  try {
    const response = await axios.get("http://localhost:8081/api/sessions");
    if (response.data.length > 0) {
      store.commit("LOG_IN");
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
  alert("You successfully logged in");
  router.push("/dashboard");
};
</script>

<style scoped>
@import url("../../assets/css/variables.css");
#login-view {
  margin: 0 auto;
  width: 50%;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

#login-view h2 {
  color: var(--about-header);
}

#login-view form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#login-view form p {
  margin: 5px 0;
}

#login-view form p label {
  margin-right: 10px;
}

#login-view form p input {
  width: 200px;
}

#login-view form p button {
  margin: 20px 15px 40px 15px;
  padding: 5px 10px;
  background-color: var(--form-button);
  color: var(--black);
  border: none;
  border-radius: 5px;
}

#login-view form p button:hover {
  background-color: var(--form-button-hover);
}

#signup {
  text-align: center;
  margin-top: 20px;
}

#signup p {
  font-size: 1.2rem;
}

#signup p a {
  color: var(--link);
  text-decoration: none;
}

#signup p a:hover {
  text-decoration: underline;
}

@media screen and (max-width: 768px) {
  #login-view {
    width: 80%;
  }
}
</style>
