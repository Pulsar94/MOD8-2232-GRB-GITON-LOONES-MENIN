<template>
  <div class="chart-container">
    <div
      :style="{ width: chartWidth, height: chartHeight, margin: chartMargin }"
      id="piechart"
    ></div>
  </div>
</template>
<script>
export default {
  name: "PieChart",
  props: {
    chartWidth: {
      type: String,
      default: "900px",
    },
    chartHeight: {
      type: String,
      default: "500px",
    },
    chartMargin: {
      type: String,
      default: "50px auto",
    },
    categories: {
      type: Array,
      default: () => [
        { name: "Utilities", paymentMethod: "AUTO-PAYMENT" },
        { name: "Dining", paymentMethod: "CARD X0000" },
        { name: "Travel", paymentMethod: "CARD X0000" },
        { name: "Entertainment", paymentMethod: "CARD X0000" },
        { name: "Groceries", paymentMethod: "CARD X0000" },
      ],
    },
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    categoryTotals() {
      const totals = {
        Utilities: 0,
        Dining: 0,
        Travel: 0,
        Entertainment: 0,
        Groceries: 0,
      };
      this.transactions.forEach((txn) => {
        for (const category in totals) {
          if (txn.description.includes(category)) {
            totals[category] += Math.abs(txn.amount);
            break;
          }
        }
      });
      return totals;
    },
  },
  watch: {
    transactions(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.drawChart();
      }
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    // drawChart() {
    //   google.charts.load("current", { packages: ["corechart"] });
    //   google.charts.setOnLoadCallback(() => {
    //     try {
    //       const data = google.visualization.arrayToDataTable([
    //         ["Category", "Amount"],
    //         ...Object.entries(this.categoryTotals),
    //       ]);
    //
    //       const options = {
    //         title: "Spending by Category",
    //         backgroundColor: getComputedStyle(
    //           document.documentElement
    //         ).getPropertyValue("--background-color"),
    //         titleColor: getComputedStyle(
    //           document.documentElement
    //         ).getPropertyValue("--header-text"),
    //         legend: {
    //           textStyle: {
    //             color: getComputedStyle(
    //               document.documentElement
    //             ).getPropertyValue("--text"),
    //           },
    //         },
    //         pieSliceBorderColor: getComputedStyle(
    //           document.documentElement
    //         ).getPropertyValue("--background-color"),
    //       };
    //
    //       const chart = new google.visualization.PieChart(
    //         document.getElementById("piechart")
    //       );
    //
    //       chart.draw(data, options);
    //
    //       google.visualization.events.addListener(chart, 'onmouseover', selectHandler);
    //       google.visualization.events.addListener(chart, 'onmouseout', mouseoutHandler);
    //
    //
    //       const vm = this;
    //       function selectHandler(e) {
    //         // e.row contains the index of the hovered point
    //         if (e.row != null) {
    //           const category = data.getValue(e.row, 0);
    //           vm.$emit("categorySelected", category);
    //         }
    //       }
    //       function mouseoutHandler() {
    //         vm.$emit("categorySelected","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper sem dolor, id ullamcorper metus condimentum eget. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu efficitur neque. Nulla eget tincidunt purus. Nullam a dapibus sapien. Phasellus quis diam bibendum, fringilla erat eu, dictum quam. Donec eu elit libero. Cras condimentum vel quam et pulvinar. Vivamus a commodo odio. Nullam sollicitudin, sem vitae blandit iaculis, massa urna consectetur tortor, imperdiet bibendum urna dui at mauris. In hac habitasse platea dictumst. Duis pulvinar nunc felis, vulputate lobortis eros tincidunt non. Vestibulum finibus nulla scelerisque, viverra arcu at, faucibus enim.\n",
    //         );
    //       }
    //
    //     } catch (error) {
    //       console.error("Error drawing the chart:", error);
    //     }
    //   });
    // },
    //
    drawChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        try {
          const dataArray = [
            ["Category", "Amount", { role: "tooltip", type: "string" }],
          ];
          for (const [category, amount] of Object.entries(
            this.categoryTotals
          )) {
            const tooltip = `${category}: $${Math.round(amount)}`;
            dataArray.push([category, amount, tooltip]);
          }
          const data = google.visualization.arrayToDataTable(dataArray);

          const options = {
            title: "Spending by Category",
            backgroundColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--background-color"),
            titleColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--header-text"),
            chartArea: {
              width: "100%",
              height: "100%",
            },
            legend: {
              position: "right",
              alignment: "center",
              textStyle: {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--text"),
              },
            },
            pieSliceBorderColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--background-color"),
            tooltip: { isHtml: true }, // this can be omitted if the tooltip doesn't contain HTML
          };

          const chart = new google.visualization.PieChart(
            document.getElementById("piechart")
          );
          chart.draw(data, options);

          google.visualization.events.addListener(
            chart,
            "onmouseover",
            selectHandler
          );
          google.visualization.events.addListener(
            chart,
            "onmouseout",
            mouseoutHandler
          );

          const vm = this;

          function selectHandler(e) {
            if (e.row != null) {
              const category = data.getValue(e.row, 0);
              vm.$emit("categorySelected", category);
            }
          }

          function mouseoutHandler() {
            vm.$emit("categorySelected", "Lorem ipsum dolor ..."); // truncated for brevity
          }
        } catch (error) {
          console.error("Error drawing the chart:", error);
        }
      });
    },
  },
};
</script>
<style scoped>
@import url("../assets/css/variables.css");

div.amount {
  align-content: flex-end;
}

div.chart-container {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
}

div.nav-links li {
  display: inline;
}

div.nav-links a {
  text-decoration: none;
  color: var(--white);
}

div.chart-container h1 {
  display: flex;
  justify-content: center;
  color: var(--header-text);
}

div.chart-container p {
  color: var(--text);
}

div.chart-container button:hover {
  background-color: var(--button-hover);
}

div.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
