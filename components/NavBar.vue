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
  <select @change="showChart(selectedChart)">
    <option value="Pie" selected>Pie Chart</option>
    <option value="Combo">Combo Chart</option>
    <option value="Line">Line Chart</option>
    <option value="Table">Table</option>
  </select>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    showChart(chartType) {
      this.$emit("changeChart", chartType);
      const optionSelected = document.querySelector(`option[value=${chartType}]`);
      optionSelected.selected = true;
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");
.vertical-nav {
  margin-top: 25px;
  width: 150px; /* or your preferred width */
  background-color: var(--navbar); /* Dark shade of blue */
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
  background-color: var(--navbar-hover); /* A slightly lighter shade of blue */
}

select {
  display: none;
}

@media (max-width: 768px) {
  .vertical-nav {
    display: none;
  }

  select {
    display: block;
    margin: 10px auto;
    background-color: var(--navbar);
    color: var(--black);
    border: none;
    border-radius: 5px;
    padding: 5px 7px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
  }
}
</style>
