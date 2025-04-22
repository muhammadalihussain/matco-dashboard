"use client";

import Image from "next/image";
import styles from "./rightbar.module.css";
// import {useStore} from "../../lib/stores"
import React, { useContext, useEffect, useState, useRef } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { UserContext } from "../../lib/context/userProvider"; //"../../context/userProvider";
import { dashboardService } from "../../lib/services/dashboardService";
import { Card, TableCard, CardContent } from "../card";
import {
  Chart,
  registerables,
  CategoryScale,
  ArcElement,
  BarElement,
  LinearScale,
} from "chart.js";

Chart.register(
  ...registerables,
  CategoryScale,
  ArcElement,
  BarElement,
  LinearScale
);
// import BarCharts from "../../components/chart/Bar";
// import InvoicesPieChart from "../../components/chart/InvoicesPieChart";

const Rightbar = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls
  // const site = useStore((state) => state.data);
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
        position: "bottom", // 'top', 'bottom', 'left', 'right'
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
          // padding: 20, // Spacing around labels
          // boxWidth: 15, // Color box size
          // usePointStyle: true, // Circle/point style instead of box
        },
        align: "start", // or 'start', 'end'
      },
      layout: {
        padding: 0, // Removes all padding
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
        await dashboardService.getDispatchInventory(dataSites).then((u) => {
          hasFetched.current = false;
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

  return user && data ? (
    <div className={styles.container}>
      <div className={styles.cards}>
        <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
          <legend className="px-2 text-sm font-medium text-green-500">
            Dispatch (Ton)
          </legend>

          <div
            style={{
              minWidth: "200px",
              maxWidth: "200px",
              height: "250px",
            }}
          >
            <Doughnut
              data={data.dispatchInventory}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                },
              }}
            />
          </div>
        </fieldset>
      </div>
    </div>
  ) : (
    <p>Error loading data.</p>
  );
};

export default Rightbar;
