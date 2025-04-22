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
    name: "01-06-2023",
    Expenses: 4000,
    Revenue: 2400,
    amt: 2400,
  },
  {
    name: "01-07-2023",
    Expenses: 3000,
    Revenue: 1398,
    amt: 2210,
  },
  {
    name: "01-08-2023",
    Expenses: 2000,
    Revenue: 9800,
    amt: 2290,
  },
  {
    name: "01-09-2023",
    Expenses: 2780,
    Revenue: 3908,
    amt: 2000,
  },
  {
    name: "01-10-2023",
    Expenses: 1890,
    Revenue: 4800,
    amt: 2181,
  },
  {
    name: "01-11-2023",
    Expenses: 2390,
    Revenue: 3800,
    amt: 2500,
  },
  {
    name: "01-12-2023",
    Expenses: 3490,
    Revenue: 4300,
    amt: 2100,
  },
];

const PLBarChart = () => {
  //static demoUrl = "https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Profit & Loss</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
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

export default PLBarChart;
