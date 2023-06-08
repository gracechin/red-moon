import React, { useRef } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
import {
  Line,
  Chart,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";

const lineOptions = {
  onClick: (e, element) => {
    console.log("e", e);
    getElementAtEvent(e, element);
  },
};

export function LineChart({ data }) {
  return <Line datasetIdKey="id" data={data} options={lineOptions} />;
}

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ["January", "February", "March"];
const datasets = [
  {
    type: "line",
    label: "Dataset 1",
    borderColor: "rgb(255, 99, 132)",
    borderWidth: 2,
    fill: false,
    data: [1, 2, 3],
  },
  {
    type: "bar",
    label: "Dataset 2",
    backgroundColor: "rgb(75, 192, 192)",
    data: [1, 2, 3],
    borderColor: "white",
    borderWidth: 2,
  },
  {
    type: "bar",
    label: "Dataset 3",
    backgroundColor: "rgb(53, 162, 235)",
    data: [1, 2, 3],
  },
];

export const data = {
  labels,
  datasets,
};

export function CustomChart() {
  const printDatasetAtEvent = (dataset) => {
    if (!dataset.length) return;

    const datasetIndex = dataset[0].datasetIndex;

    console.log(data.datasets[datasetIndex].label);
  };

  const printElementAtEvent = (element) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];

    console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
  };

  const printElementsAtEvent = (elements) => {
    if (!elements.length) return;

    console.log(elements.length);
  };

  const chartRef = useRef(null);

  const onClick = (event) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    printDatasetAtEvent(getDatasetAtEvent(chart, event));
    printElementAtEvent(getElementAtEvent(chart, event));
    printElementsAtEvent(getElementsAtEvent(chart, event));
  };

  return (
    <Chart ref={chartRef} onClick={onClick} options={options} data={data} />
  );
}
