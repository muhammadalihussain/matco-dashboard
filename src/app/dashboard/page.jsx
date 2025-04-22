import Card from "../components/card/card";
import { cards } from "../lib/data";
import styles from "../components/dashboard/dashboard.module.css";
import Rightbar from "../components/rightbar/rightbar";
import Transactions from "../components/transactions/transactions";
import Chart from "../components/chart/chart";
import PLBarChart from "../components/chart/PLBarChart";
import APLineChart from "../components/chart/APLineChart";
import ARLineChart from "../components/chart/ARLineChart";
import ProductionChart from "../components/chart/ProductionChart";
import ProductionPerformenceOEEChart from "../components/chart/ProductionPerformenceOEEChart";
import Navbar from "../components/dashboard/navbar/navbar";
import Filter from "../components/filters/filters";

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <Filter />
        {/* <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div> */}
        {/* <PLBarChart />
        <ARLineChart />
        <APLineChart />
        <Chart />
     */}
        <ProductionPerformenceOEEChart />
        {/* <ProductionChart /> */}
        {/* <Transactions /> */}
      </div>
      <div className={styles.side}>
        <Navbar />
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
