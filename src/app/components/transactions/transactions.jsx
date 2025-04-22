"use client";
import Image from "next/image";
import styles from "./transactions.module.css";
import noavatar from "../../images/noavatar.png"; //"../../../images/noavatar.png";
import { dashboardService } from "../../lib/services/dashboardService";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../lib/context/userProvider";
const Transactions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const { user } = useContext(UserContext);

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
  return (
    <div className={styles.container}>
      <h2 className="text-lg font-semibold mb-2 text-green-500 ">
        Latest Transactions
      </h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Shift Label</td>
            <td>Supervisor</td>
            <td>Running Hours</td>
            <td>Down Hours</td>
            <td>Final Production </td>
            <td>BI-Product Production</td>
            <td>Reason of Downtime</td>
          </tr>
        </thead>
        <tbody>
          {data.alldata.map((d, index) => (
            <tr key={index}>
              <td> {d?.shiftLabel}</td>
              <td>
                <div className={styles.user}>
                  <Image
                    src={noavatar}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {d?.supervisor}
                </div>
              </td>
              <td>
                {d?.runningHours}
                {/* <span className={`${styles.status} ${styles.pending}`}>
                Pending
              </span> */}
              </td>
              <td>{d?.downHours}</td>
              <td>{d?.finalProduction}</td>
              <td>{d?.biProductProduction}</td>
              <td>{d?.remarks || "No remarks"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
