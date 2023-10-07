<template>
  <div id="login-view">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin()">
      <p>
        <label for="username">Email:</label>
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
  <div id="signup">
    <p>Don't have an account? <RouterLink to="/signup">Sign up</RouterLink></p>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { useRouter, RouterLink } from "vue-router";
  
  const askedUsername = ref("");
  const askedPassword = ref("");
  const store = useStore();
  const router = useRouter();
  const users = ref(store.state.user);

  

  function handleLogin() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(askedUsername.value)) {
                  alert("Please enter a valid email address");
                  return;
                }
    const user = ref(users.value.map((user) => {
          if( user.email === askedUsername.value && user.password === askedPassword.value){
            store.commit("SET_USER_ID_ACTIVE", askedUsername.value)
            logIn()
          }
      }));
    if (!store.state.authenticated) {
      alert("Invalid credentials");
    }
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

#signup{
  text-align: center;
  margin-top: 50px;
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
