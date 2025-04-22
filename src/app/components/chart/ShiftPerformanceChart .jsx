"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ShiftPerformanceChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.ShiftName),
    datasets: [
      {
        label: "PlantAvailability",
        data: data.map((item) => item.PlantAvailability),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "PlantPerformance",
        data: data.map((item) => item.PlantPerformance),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Quality",
        data: data.map((item) => item.Quality),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "OEE (%)",
        data: data.map((item) => item.OEE),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Shift-wise Production Performance",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.dataset.label === "OEE (%)") {
              label += context.raw.toFixed(2) + "%";
            } else {
              label += new Intl.NumberFormat().format(context.raw.toFixed(2));
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Quantity",
        },
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat().format(value);
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "OEE (%)",
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ShiftPerformanceChart;
