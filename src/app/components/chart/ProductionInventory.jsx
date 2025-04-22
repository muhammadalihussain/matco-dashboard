"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { UserContext } from "../../lib/context/userProvider"; //"../../context/userProvider";
import { dashboardService } from "../../lib/services/dashboardService";
// import { ShiftPerformanceChart } from "./ShiftPerformanceChart";
import styles from "./chart.module.css";
import { Card, TableCard, CardContent } from "../card";
import ShiftPerformanceChart from "./ShiftPerformanceChart ";

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

const ProductionInventory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const { user, dataSites } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      // if (hasFetched.current) return; // Skip if already fetched
      // hasFetched.current = true;

      try {
        setLoading(true);
        await dashboardService.getInventory(dataSites).then((u) => {
          // console.log(u.finalProductionData.labels.length);
          setData(u);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching production data:", error);
      } finally {
      }
    };

    fetchData();
  }, [dataSites]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Error loading data.</p>;

  return user && data.inventoryData.labels.length > 0 ? (
    <div className={styles.container}>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* <Card title="Shift Performance Chart">
            <ShiftPerformanceChart data={data} />
          </Card> */}
          <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
            <legend className="px-2 text-sm font-medium text-green-500">
              Inventory
            </legend>
            <Card title="">
              <Bar
                data={data.finalProductionData}
                options={{
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
                    legend: {
                      position: "top", // 'top', 'bottom', 'left', 'right'
                      labels: {
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
                        label: function (context) {
                          return `${
                            context.dataset.label
                          }: ${context.parsed.y.toFixed(2)}%`; // Custom tooltip label
                        },
                      },
                    },
                  },
                }}
              />
            </Card>
          </fieldset>

          <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
            <legend className="px-2 text-sm font-medium text-green-500">
              Inventory
            </legend>
          </fieldset>

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

export default ProductionInventory;
