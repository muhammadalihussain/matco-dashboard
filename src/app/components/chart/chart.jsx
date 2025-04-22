"use client";

import styles from "./chart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "01-05-2024",
    Sales: 4000,
    Purchases: 2400,
  },
  {
    name: "01-06-2024",
    Sales: 3000,
    Purchases: 1398,
  },
  {
    name: "01-07-2024",
    Sales: 2000,
    Purchases: 3800,
  },
  {
    name: "01-08-2024",
    Sales: 2780,
    Purchases: 3908,
  },
  {
    name: "01-09-2024",
    Sales: 1890,
    Purchases: 4800,
  },
  {
    name: "01-10-2024",
    Sales: 2390,
    Purchases: 3800,
  },
  {
    name: "01-11-2024",
    Sales: 3490,
    Purchases: 4300,
  },
  {
    name: "01-12-2024",
    Sales: 3490,
    Purchases: 4300,
  },
];

const Chart = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sales / Purchases</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Sales"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="Purchases"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
