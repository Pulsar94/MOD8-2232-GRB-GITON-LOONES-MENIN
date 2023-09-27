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
  name: 'NavBar',
  methods: {
    showChart(chartType) {
      this.$emit('changeChart', chartType);
    }
  }
}
</script>

<style scoped>
.vertical-nav {
  margin-top: 25px;
  width: 150px; /* or your preferred width */
  background-color: lightgray; /* Dark shade of blue */
  height: 80vh; /* Full viewport height */
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
  background-color: #555555; /* A slightly lighter shade of blue */
}
</style>

