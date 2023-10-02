<!-- NavBar.vue -->
<template>
  <div class="vertical-nav">
    <ul class="nav-links">
      <li><a @click="showChart('Pie')">Pie Chart</a></li>
      <li><a @click="showChart('Combo')">Combo Chart</a></li>
      <li><a @click="showChart('Line')">Line Chart</a></li>
      <li><a @click="showChart('Table')">Table</a></li>
      <!-- Add other links as needed -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    showChart(chartType) {
      this.$emit("changeChart", chartType);
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.vertical-nav {
  margin-top: 25px;
  width: 200px;
  background-color: var(--navbar); /* Dark shade of blue */
  height: 80vh; /* Full viewport height */
  border-radius: 8px;
}

.nav-links {
  list-style-type: none;
  padding: 0;
}

.nav-links li {
  margin-bottom: 10px;
}

.nav-links a {
  text-decoration: none;
  padding: 10px 15px;
  display: block; /* So the whole area is clickable */
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover {
  background-color: var(--navbar-hover); /* A slightly lighter shade of blue */
}

@media (max-width: 768px) {
  .vertical-nav {
    height: auto;
    width: 100%;
  }
  .nav-links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>
