<template>
  <header class="header">
    <div class="container">
      <h1>ExpenseMate</h1>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style scoped>
.header {
  background-color: #333;
  color: white;
  padding: 15px 0;
}

.container {
  margin: 0 30px;
  max-width: 1400px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: white;
}

h1 {
  color: #666;
}

p {
  color: #666;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>