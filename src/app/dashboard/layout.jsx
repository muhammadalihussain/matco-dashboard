// import Navbar from "../components/dashboard/navbar/navbar";
import Sidebar from "../components/dashboard/sidebar/sidebar";
import styles from "../components/dashboard/dashboard.module.css";
import Footer from "../components/footer/footer";

function layout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        {/* <Navbar /> */}
        {children}
        <Footer />
      </div>
    </div>
  );
}

export default layout;
