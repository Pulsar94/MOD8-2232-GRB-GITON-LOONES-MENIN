<template>
  <header class="header">
    <a href="/">
      <img src="../assets/img/logo.svg" alt="Logo" />
    </a>
    <nav>
      <ul class="nav-links">
        <li><router-link to="/about">About Us</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
  </header>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style scoped>
@import url("../assets/css/variables.css");
.header {
  background-color: var(--background);
  color: var(--black);
  padding: 10px 15px;
  border-radius: 0 0 8px 8px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  height: 80px;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 15px;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: var(--link);
  font-size: 20px;
  font-weight: 600;
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
</style>
