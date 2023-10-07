<template>
  <div id="login-view">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin()">
      <p>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="askedUsername" required/>
      </p>
      <p>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="askedPassword" required/>
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const askedUsername = ref("");
  const askedPassword = ref("");
  const store = useStore();
  const router = useRouter();
  const users = ref(store.state.user);

  function handleLogin() {
    const user = ref(users.value.map((user) => {
          if( user.email === askedUsername.value && user.password === askedPassword.value){
            // verifier que le username est une adresse mail
            store.commit("SET_USER_ID_ACTIVE", askedUsername.value)
            logIn()
          }
      }));
    if (!store.state.authenticated) {
      alert("Invalid credentials");
    }
    // console.log(`Username: ${askedUsername.value}, Password: ${askedPassword.value}`);
  };

  const logIn = () => {
      store.commit("LOG_IN");
      alert("You successfully logged in");
      router.push("/dashboard");
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
