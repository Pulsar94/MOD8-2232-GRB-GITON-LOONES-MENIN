<template>
  <body>
    <div class="description">
      <h1>Welcome to Your Financial Companion</h1>
      <p>Are you looking for a simple and efficient way to take control of your finances? Look no further than Your Financial Companion, your all-in-one solution for managing expenses, tracking income, and achieving your financial goals.</p>

      <div class="presentation">
        <div>
          <h2>Key Features:</h2>
          <ul>
            <li><strong>Expense Tracking:</strong> Easily record your daily expenses, categorize them, and gain insights into your spending habits.</li>
            <li><strong>Budget Management:</strong> Set monthly budgets for different spending categories and receive alerts to stay on track.</li>
            <li><strong>Financial Goals:</strong> Define your financial objectives, whether it's saving for a dream vacation or paying off debt, and track your progress.</li>
            <li><strong>Automated Expense Categorization:</strong> Let our smart categorization engine organize your expenses for you, or customize it to fit your unique needs.</li>
            <li><strong>Detailed Reports:</strong> Access detailed monthly spending reports and analyze your financial data with intuitive charts and graphs.</li>
            <li><strong>Secure and Personalized:</strong> Your data's security is our top priority. We offer customizable account settings, two-factor authentication, and more.</li>
            <li><strong>24/7 Support:</strong> Need assistance or have questions? Our support team is here to help you whenever you need it.</li>
          </ul>
        </div>
        <img src="../assets/img/home_image.svg" alt="Image" />
      </div>

      <p>Take the first step towards financial freedom and join Your Financial Companion today. Sign up now and start making informed financial decisions, achieving your goals, and securing your financial future. Your financial journey begins here.</p>
    </div>

    <h2 id="preview-header">Here's a preview :</h2>

    <div class="container">
      <TotalAndAverageExpenses :transactions="myTransactionsArray" />
      <div class="pie-chart">
        <PieChart @categorySelected="updatePieText" :chartWidth="'600px'" :chartHeight="'300px'" :chartMargin="'10px'" :transactions="myTransactionsArray" />
        <p>{{ selectedPieText }}</p>
      </div>
      <div class="combo-chart">
        <ComboChart @categorySelected="updateComboText" :chartWidth="'700px'" :chartHeight="'500px'" :chartMargin="'10px'" :transactions="myTransactionsArray" />
        <p>{{ selectedComboText }}</p>
      </div>
      <div class="line-chart">
        <LineChart :chartWidth="'700px'" :chartHeight="'400px'" :chartMargin="'none'" :transactions="myTransactionsArray" />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo integer malesuada nunc vel risus commodo. Vel turpis nunc eget lorem. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Ut tortor pretium viverra suspendisse potenti. Parturient montes nascetur ridiculus mus. Facilisi etiam dignissim diam quis enim. Enim blandit volutpat maecenas volutpat blandit aliquam etiam. Posuere ac ut consequat semper viverra nam libero. In tellus integer feugiat scelerisque varius. Est ultricies integer quis auctor elit sed vulputate mi sit. Est ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
      </div>
      <div class="table-chart">
        <TableChart :chartWidth="'750px'" :chartHeight="'500px'" :chartMargin="'0'" :transactions="myTransactionsArray" />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Convallis tellus id interdum velit. Nibh sed pulvinar proin gravida hendrerit. Sed vulputate odio ut enim blandit volutpat maecenas. Lorem sed risus ultricies tristique nulla aliquet. Sed turpis tincidunt id aliquet risus feugiat. Dictum varius duis at consectetur. Nulla aliquet enim tortor at. Metus dictum at tempor commodo ullamcorper a lacus. Ullamcorper dignissim cras tincidunt lobortis feugiat. At volutpat diam ut venenatis tellus in. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. Tincidunt lobortis feugiat vivamus at augue. Facilisis magna etiam tempor orci eu lobortis elementum. Pretium fusce id velit ut tortor pretium. Etiam dignissim diam quis enim. Eu non diam phasellus vestibulum lorem sed.</p>
      </div>
    </div>
  </body>
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
      selectedPieText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper sem dolor, id ullamcorper metus condimentum eget. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu efficitur neque. Nulla eget tincidunt purus. Nullam a dapibus sapien. Phasellus quis diam bibendum, fringilla erat eu, dictum quam. Donec eu elit libero. Cras condimentum vel quam et pulvinar. Vivamus a commodo odio. Nullam sollicitudin, sem vitae blandit iaculis, massa urna consectetur tortor, imperdiet bibendum urna dui at mauris. In hac habitasse platea dictumst. Duis pulvinar nunc felis, vulputate lobortis eros tincidunt non. Vestibulum finibus nulla scelerisque, viverra arcu at, faucibus enim.\n",
      selectedComboText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim diam vulputate ut pharetra sit amet aliquam. Elit pellentesque habitant morbi tristique senectus et netus et. Vulputate enim nulla aliquet porttitor. Purus faucibus ornare suspendisse sed. Viverra justo nec ultrices dui sapien eget mi. Sit amet justo donec enim diam. Tincidunt ornare massa eget egestas purus viverra accumsan. Odio pellentesque diam volutpat commodo sed egestas. Integer eget aliquet nibh praesent tristique magna sit amet. Sit amet facilisis magna etiam tempor orci eu."
    };
  },
  computed: {
    myTransactionsArray() {
      return this.$store.state.myTransactionsArray;
    },
  },
  methods: {
    updatePieText(category) {
      this.selectedPieText = `${category}`;
    },
    updateComboText(category) {
      this.selectedComboText = `${category}`;
    },
    handleChangeChart(chartType) {
      this.currentChart = chartType;
    },
  },
};
</script>

<style scoped>
@import url("../assets/css/variables.css");

.description {
  margin: 0 auto;
  width: 80%;
  text-align: left;
}

.presentation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#preview-header {
  margin-top: 50px;
}

img {
  width: 35vw;
  margin-left: 12px;
}

.pie-chart {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  padding: 0;
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

body {
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
  font-size: large;
}

li {
  font-size: large;
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

@media (max-width: 1000px) {
  .description {
    width: 100%;
  }

  img {
    width: 100%;
    margin: 0;
  }

  .presentation {
    flex-direction: column;
  }

  .presentation > div {
    margin-bottom: 20px;
  }

  .pie-chart {
    flex-direction: column;
  }

  .combo-chart {
    flex-direction: column;
  }

  .line-chart {
    flex-direction: column;
  }

  .table-chart {
    flex-direction: column;
  }

  .pie-chart > p {
    margin-top: 0;
  }

  .combo-chart > p {
    margin-top: 0;
  }

  .line-chart > p {
    margin-top: 0;
  }

  .table-chart > p {
    margin-top: 0;
  }

  .container {
    position: relative;
  }

  .container > * {
    vertical-align: top; /* ensures that inline-block children align properly */
  }
}
</style>
