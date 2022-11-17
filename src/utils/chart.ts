import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import { ChartData } from "../models/chart";
import { Child } from "../models/child";
import { findPopulationFitness } from "../fitness";
import { initialChild } from "../population";

export function createChartDataFromChild(child: Child): ChartData[] {
  return child.map((sign, index) => ({ x: initialChild[index], y: sign }));
}

export function createChart(chartData: ChartData[]): void {
  const chartEl = document.createElement("div");
  chartEl.classList.add("chart");
  document.getElementById("app")?.insertAdjacentElement("beforeend", chartEl);

  /* Chart code */
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  const root = am5.Root.new(chartEl);

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  const cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "none",
    })
  );
  cursor.lineY.set("visible", false);

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.2,
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
      max: Math.max(...chartData.map((value) => Number(value.x))),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "y",
      valueXField: "x",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
      }),
    })
  );

  // Set data
  series.data.setAll(chartData);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);
}

export function createBestChildChart(population: Child[]) {
  const bestMember = population[findPopulationFitness(population)[0].index];
  createChart(createChartDataFromChild(bestMember));
}
