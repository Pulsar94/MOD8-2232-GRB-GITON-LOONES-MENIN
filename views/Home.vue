<template>
  <div class="home-container">
    <h2>Welcome to Budget Vision!</h2>
    <p>
      Struggling to keep track of your spending? Overwhelmed by numerous bills,
      receipts, and expenses? Say hello to Budget Vision—your trusted partner in
      financial management.
    </p>
    <p>
      Our platform offers you a comprehensive view of all your expenditures,
      breaking them down into easy-to-understand categories and visual diagrams.
      We simplify budgeting so that you can focus on making better financial
      decisions.
    </p>
    <p>
      Unlock the power of smart spending. With Budget Vision, you gain insight,
      clarity, and control over your financial world. Don't just view your
      expenses—understand them.
    </p>

    <h2>Here's a preview :</h2>

    <div class="container">
      <TotalAndAverageExpenses :transactions="myTransactionsArray" />
      <div class="pie-chart">
        <PieChart
          @categorySelected="updateText"
          :chartWidth="'900px'"
          :chartHeight="'500px'"
          :chartMargin="'none'"
          :transactions="myTransactionsArray"
        />
        <p>{{ selectedCategoryText }}</p>
      </div>
      <div class="combo-chart">
        <ComboChart
          :chartWidth="'900px'"
          :chartHeight="'500px'"
          :chartMargin="'none'"
          :transactions="myTransactionsArray"
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim diam
          vulputate ut pharetra sit amet aliquam. Elit pellentesque habitant
          morbi tristique senectus et netus et. Vulputate enim nulla aliquet
          porttitor. Purus faucibus ornare suspendisse sed. Viverra justo nec
          ultrices dui sapien eget mi. Sit amet justo donec enim diam. Tincidunt
          ornare massa eget egestas purus viverra accumsan. Odio pellentesque
          diam volutpat commodo sed egestas. Integer eget aliquet nibh praesent
          tristique magna sit amet. Sit amet facilisis magna etiam tempor orci
          eu.
        </p>
      </div>
      <div class="line-chart">
        <LineChart
          :chartWidth="'900px'"
          :chartHeight="'500px'"
          :chartMargin="'none'"
          :transactions="myTransactionsArray"
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo
          integer malesuada nunc vel risus commodo. Vel turpis nunc eget lorem.
          Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut.
          Ut tortor pretium viverra suspendisse potenti. Parturient montes
          nascetur ridiculus mus. Facilisi etiam dignissim diam quis enim. Enim
          blandit volutpat maecenas volutpat blandit aliquam etiam. Posuere ac
          ut consequat semper viverra nam libero. In tellus integer feugiat
          scelerisque varius. Est ultricies integer quis auctor elit sed
          vulputate mi sit. Est ullamcorper eget nulla facilisi etiam dignissim
          diam quis.
        </p>
      </div>
      <div class="table-chart">
        <TableChart
          :chartWidth="'750px'"
          :chartHeight="'500px'"
          :chartMargin="'none'"
          :transactions="myTransactionsArray"
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet
          consectetur adipiscing elit duis tristique sollicitudin nibh sit amet.
          Convallis tellus id interdum velit. Nibh sed pulvinar proin gravida
          hendrerit. Sed vulputate odio ut enim blandit volutpat maecenas. Lorem
          sed risus ultricies tristique nulla aliquet. Sed turpis tincidunt id
          aliquet risus feugiat. Dictum varius duis at consectetur. Nulla
          aliquet enim tortor at. Metus dictum at tempor commodo ullamcorper a
          lacus. Ullamcorper dignissim cras tincidunt lobortis feugiat. At
          volutpat diam ut venenatis tellus in. Sapien faucibus et molestie ac
          feugiat sed lectus vestibulum. Tincidunt lobortis feugiat vivamus at
          augue. Facilisis magna etiam tempor orci eu lobortis elementum.
          Pretium fusce id velit ut tortor pretium. Etiam dignissim diam quis
          enim. Eu non diam phasellus vestibulum lorem sed.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import TotalAndAverageExpenses from "../components/TotalAndAverageExpenses.vue";
import PieChart from "../components/PieChart.vue";
import ComboChart from "../components/ComboChart.vue";
import LineChart from "../components/LineChart.vue";
import TableChart from "../components/TableChart.vue";
import RecentTransactions from "../components/RecentTransactions.vue";

export default {
  components: {
    TotalAndAverageExpenses,
    TableChart,
    LineChart,
    PieChart,
    RecentTransactions,
    ComboChart,
    NavBar,
  },

  data() {
    return {
      currentChart: "Pie", // default to showing the current chart
      selectedCategoryText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper sem dolor, id ullamcorper metus condimentum eget. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu efficitur neque. Nulla eget tincidunt purus. Nullam a dapibus sapien. Phasellus quis diam bibendum, fringilla erat eu, dictum quam. Donec eu elit libero. Cras condimentum vel quam et pulvinar. Vivamus a commodo odio. Nullam sollicitudin, sem vitae blandit iaculis, massa urna consectetur tortor, imperdiet bibendum urna dui at mauris. In hac habitasse platea dictumst. Duis pulvinar nunc felis, vulputate lobortis eros tincidunt non. Vestibulum finibus nulla scelerisque, viverra arcu at, faucibus enim.\n",
    };
  },
  computed: {
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray;
    },
  },
  methods: {
    updateText(category) {
      this.selectedCategoryText = `${category}`;
    },
    handleChangeChart(chartType) {
      this.currentChart = chartType;
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");

.pie-chart {
  display: flex;
  flex-direction: row;
}
.pie-chart > p {
  margin-top: 160px;
}
.combo-chart {
  display: flex;
  flex-direction: row-reverse;
}
.combo-chart > p {
  margin-top: 160px;
}
.line-chart {
  display: flex;
  flex-direction: row;
}
.line-chart > p {
  margin-top: 160px;
}
.table-chart {
  display: flex;
  flex-direction: row-reverse;
}
.table-chart > p {
  margin-top: 160px;
}

.container {
  position: relative;
}

.container > * {
  vertical-align: top; /* ensures that inline-block children align properly */
}
.vertical-nav {
  float: left;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: var(--white);
}

.home-container {
  text-align: center;
  margin: 0;
  margin-top: 50px;
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
</style>
