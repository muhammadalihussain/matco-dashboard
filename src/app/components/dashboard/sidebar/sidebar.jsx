"use client";
import styles from "./sidebar.module.css";
import MenuLink from "./menuLink/menuLink";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdAnalytics,
  MdOutlineSettings,
  MdHelpCenter,
  MdPerson,
} from "react-icons/md";
import Image from "next/image";

import React, { useContext, useEffect, useState, useRef } from "react";
import logo from "../../../images/logo.png"; //"./images/dashboard.png";
// const menuItems = [
//   {
//     title: "Pages",
//     list: [
//       {
//         title: "Dashboard",
//         path: "/dashboard",
//         icon: <MdDashboard />,
//       },
//       {
//         title: "Users",
//         path: "/dashboard/users",
//         icon: <MdSupervisedUserCircle />,
//       },
//     ],
//   },
//   {
//     title: "Analytics",
//     list: [
//       {
//         title: "Reports",
//         path: "/dashboard/reports",
//         icon: <MdAnalytics />,
//       },
//     ],
//   },
//   {
//     title: "User",
//     list: [
//       {
//         title: "Settings",
//         path: "/dashboard/settings",
//         icon: <MdOutlineSettings />,
//       },
//       {
//         title: "Help",
//         path: "/dashboard/help",
//         icon: <MdHelpCenter />,
//       },
//     ],
//   },
// ];
import { authService } from "../../../lib/services/authService"; //"../../lib/services/authService"
import { UserContext } from "../../../lib/context/userProvider";
const iconMap = {
  Dashboard: <MdDashboard />,
  Users: <MdSupervisedUserCircle />,
  Reports: <MdAnalytics />,
  Settings: <MdOutlineSettings />,
  Help: <MdHelpCenter />,
  Profile: <MdPerson />,
};

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;
      try {
        await authService.getMenuItems().then((u) => {
          const formattedMenu = u?.map((group) => ({
            title: group.title,
            list: group.list.map((item) => ({
              ...item,
              icon: iconMap[item.title] || null,
            })),
          }));
          setMenuItems(formattedMenu);

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
  if (!menuItems) return <p>Error loading data.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.logoImage}
          src={logo}
          alt=""
          width="80"
          height="80"
        />
      </div>
      <ul className={styles.list}>
        {menuItems.map((section, index) => (
          <li key={index}>
            <span className={styles.section}>{section.title}</span>
            {section.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
