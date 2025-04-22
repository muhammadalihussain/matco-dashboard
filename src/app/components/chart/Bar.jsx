"use client";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import styles from "./chart.module.css";
const data = [
  {
    name: "Page A",
    Expenses: 4000,
    Revenue: 2400,
    amt: 2400,
  },
];

const BarCharts = () => {
  //static demoUrl = "https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5";

  return (
    <div className={styles.container_}>
      <h2 className={styles.title}>Profit & Loss</h2>
      <ResponsiveContainer width="120%" height="60%">
        <BarChart
          width={300}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="Revenue"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="Expenses"
            fill="#82ca9d"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
