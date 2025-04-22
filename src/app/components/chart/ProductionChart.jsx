"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { UserContext } from "../../lib/context/userProvider"; //"../../context/userProvider";
import { dashboardService } from "../../lib/services/dashboardService";

import styles from "./chart.module.css";
import { Card, TableCard, CardContent } from "../card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../table";

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

// const Card = ({ title, children }) => (
//   <div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col">
//     <h2 className="text-lg font-semibold mb-2">{title}</h2>
//     <div className="flex-1">{children}</div>
//   </div>
// );

const ProductionChart = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const { user, dataSites } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;
      try {
        await dashboardService.getProduction().then((u) => {
          setData(u);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching production data:", error);
      } finally {
      }
    };

    if (loading) fetchData();
  }, [loading]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Error loading data.</p>;

  return user && data ? (
    <div className={styles.container}>
      <div className="flex-1">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
          <Card title="Running & Down Hours">
            <Bar
              data={data.productionData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Card>
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
    <p>Error loading data.</p>
  );
};

export default ProductionChart;
