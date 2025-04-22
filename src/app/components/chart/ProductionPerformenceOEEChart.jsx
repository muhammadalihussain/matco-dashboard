"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { UserContext } from "../../lib/context/userProvider"; //"../../context/userProvider";
import { dashboardService } from "../../lib/services/dashboardService";
// import { ShiftPerformanceChart } from "./ShiftPerformanceChart";
import styles from "./chart.module.css";
import { Card, TableCard, CardContent } from "../card";
import ShiftPerformanceChart from "./ShiftPerformanceChart ";
import clsx from "clsx";
// import {
//   Chart,
//   registerables,
//   CategoryScale,
//   ArcElement,
//   BarElement,
//   LinearScale,
// } from "chart.js";

// Chart.register(
//   ...registerables,
//   CategoryScale,
//   ArcElement,
//   BarElement,
//   LinearScale
// );

// const Card = ({ title, children }) => (
//   <div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col">
//     <h2 className="text-lg font-semibold mb-2">{title}</h2>
//     <div className="flex-1">{children}</div>
//   </div>
// );

const ProductionPerformenceOEEChart = () => {
  const [data, setData] = useState(null);
  const [type, setType] = useState(0);
  const [typeYMW, setTypeYMW] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const { user, dataSites } = useContext(UserContext);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      arc: {
        minAngle: 10, // Minimum segment angle in degrees (default: 0)
      },
    },
    plugins: {
      elements: {
        arc: {
          minAngle: 3, // Force minimum slice size
        },
      },
      legend: {
        position: "right", // 'top', 'bottom', 'left', 'right'

        labels: {
          generateLabels: (chart) => {
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${chart.data.datasets[0].data[i]}`,
              fillStyle: chart.data.datasets[0].backgroundColor[i],

              hidden: false, // Force show all
              fontColor: "white", // Dark blue-gray
              fontFamily: "Arial, sans-serif",
              fontSize: 12,
              fontStyle: "normal",
              lineWidth: 0, // Remove line stroke
            }));
          },
          color: "#9cb0b3", // "rgb(34, 197, 94)", // Text color
          font: {
            size: 14,
            family: "sans-serif",
          },
          padding: 20, // Spacing around labels
          boxWidth: 15, // Color box size
          // usePointStyle: true, // Circle/point style instead of box
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${"Qty"}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;

      try {
        setLoading(true);
        await dashboardService.getProductionOEE(dataSites).then((u) => {
          // console.log(u.finalProductionData.labels.length);

          setData(u);
          setLoading(false);
          hasFetched.current = false;
        });
      } catch (error) {
        console.error("Error fetching production data:", error);
      } finally {
      }
    };

    fetchData();
  }, [dataSites]);

  if (loading) return <p>Wait For Loading Data ...</p>;
  if (!data) return <p>Error loading data.</p>;

  return user && data ? (
    <div className={styles.container}>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* <Card title="Shift Performance Chart">
            <ShiftPerformanceChart data={data} />
          </Card> */}

          {data.finalProductionData.labels.length > 0 ? (
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Production Overall Equipment Effectiveness (OEE)
              </legend>
              <div className="flex gap-3">
                <button
                  key={0}
                  onClick={() => {
                    setType(0);
                    setTypeYMW(0);
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-all ",
                    type === 0 ? "bg-red-600" : "bg-teal-700 hover:bg-blue-500"
                  )}
                >
                  Comparison
                </button>

                <button
                  key={1}
                  onClick={() => {
                    setType(1);
                    setTypeYMW(0);
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-all ",
                    type === 1 ? "bg-red-600" : "bg-teal-700 hover:bg-blue-500"
                  )}
                >
                  Consolidate
                </button>

                {/* <button
                  key={"Y"}
                  onClick={() => {
                    setTypeYMW("Y");
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-all ",
                    typeYMW === "Y"
                      ? "bg-red-600"
                      : "bg-teal-700 hover:bg-blue-500"
                  )}
                >
                  Y
                </button>

                <button
                  key={"M"}
                  onClick={() => {
                    setTypeYMW("M");
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-all ",
                    typeYMW === "M"
                      ? "bg-red-600"
                      : "bg-teal-700 hover:bg-blue-500"
                  )}
                >
                  M
                </button>

                <button
                  key={"W"}
                  onClick={() => {
                    setTypeYMW("W");
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-all ",
                    typeYMW === "W"
                      ? "bg-red-600"
                      : "bg-teal-700 hover:bg-blue-500"
                  )}
                >
                  W
                </button> */}
              </div>
              <Card title="">
                <Bar
                  data={
                    type == 0
                      ? data.finalProductionData
                      : data.finalProductionAllData
                  }
                  plugins={[ChartDataLabels]}
                  options={{
                    barThickness:
                      data.finalProductionData.labels.length > 1 && type != 1
                        ? 25
                        : 45,

                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                      x: {
                        ticks: {
                          color: "#97989c", // Orange X-axis labels
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: "#97989c", // Green Y-axis labels
                          font: {
                            weight: "bold",
                          },
                        },
                      },
                    },

                    plugins: {
                      datalabels: {
                        display: true,
                        formatter: (value) => value.toFixed(1) + " %",
                        align: function (context) {
                          const value = context.dataset.data[context.dataIndex];
                          return value < 1.5 ? "end" : "start";
                        },
                        anchor: "center",
                        color: function (context) {
                          return context.datasetIndex === 0 ? "#fff" : "#fff";
                        },

                        rotation: -90, // Rotate labels 90 degrees counter-clockwise
                        align: "center",

                        font: {
                          size: 14,
                          family: "sans-serif",
                          weight: "bold",
                        },
                      },
                      legend: {
                        position: "top", // 'top', 'bottom', 'left', 'right'
                        marginBottom: 30, // Adds space below legend
                        align: "start",
                        labels: {
                          color: "#9cb0b3", // "rgb(34, 197, 94)", // Text color
                          font: {
                            size: 14,
                            family: "sans-serif",
                          },
                          padding: 10, // Spacing around labels
                          boxWidth: 15, // Color box size

                          // usePointStyle: true, // Circle/point style instead of box
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${
                              context.dataset.label
                            }: ${context.parsed.y.toFixed(2)}%`; // Custom tooltip label
                          },
                        },
                      },
                    },

                    layout: {
                      marginBottom: 10,
                    },
                  }}
                />
              </Card>
            </fieldset>
          ) : (
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Production Overall Equipment Effectiveness (OEE)
              </legend>
              <p> No Data Found</p>
            </fieldset>
          )}

          {data.inventoryData.labels.length > 0 ? (
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Inventory (Ton)
              </legend>

              <Card title="">
                <Doughnut
                  data={data.inventoryData}
                  options={{
                    ...commonOptions,
                    plugins: {
                      ...commonOptions.plugins,
                    },
                  }}
                />
              </Card>
            </fieldset>
          ) : (
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Inventory (Ton)
              </legend>
              <p> No Data Found</p>
            </fieldset>
          )}

          {/* <Card title="Running & Down Hours">
            <Bar
              data={data.productionData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Card> */}
          {/* <Card title="Downtime Reasons">
            <Doughnut
              data={data.downtimeReasons}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Card> */}
        </div>
      </div>
    </div>
  ) : (
    <p>No Data Found.</p>
  );
};

export default ProductionPerformenceOEEChart;
