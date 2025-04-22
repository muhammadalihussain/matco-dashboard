"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import style from "./../sidebar/sidebar.module.css";
import Image from "next/image";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
  MdLogout,
} from "react-icons/md";

import { UserContext } from "../../../lib/context/userProvider"; //"@/app/lib/context/userProvider";
import { useContext } from "react";
import noavatar from "../../../images/noavatar.png"; //"./images/dashboard.png";
import { IconButton, Tooltip } from "@mui/material";
const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      {/* <div className={styles.title}>{pathname.split("/").pop()}</div> */}
      <div className={styles.menu}>
        {/* <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div> */}
        <div className={style.user}>
          <Image
            className={style.userImage}
            src={noavatar}
            alt=""
            width="30"
            height="30"
          />

          <span className={style.username}>{user?.user.username}</span>
          {/* <span className={style.userTitle}>{user?.username}</span> */}

          <button className={styles.logout} onClick={logout}>
            <Tooltip title="Logout" arrow>
              {/* <MdLogout size={25} /> */}
              Logout
            </Tooltip>
          </button>
        </div>
        <div className={styles.icons}></div>
      </div>
    </div>
  );
};

export default Navbar;
