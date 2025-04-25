// context/UserProvider.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService"; ///app/lib/services/authService"; //services/authService
import dayjs from "dayjs";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const [menus, setMenuItems] = useState([]);
  const router = useRouter();

  const [dataSites, setDataSites] = useState({
    site: 0,
    dataAreaId:
      typeof window !== "undefined" ? localStorage.getItem("dataAreaId") : 0,
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });

  // Load user from localStorage when app starts
  useEffect(() => {
    authService.getUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const u = await authService.getUser();
      // const menus = await authService.getMenuItems();
      localStorage.setItem("dataAreaId", u.user.dataAreaId);
      setDataSites({
        site: 0,
        dataAreaId: u.user.dataAreaId,
        start: dayjs().startOf("month"),
        end: dayjs().endOf("month"),
      });

      setUser(u);
      // setMenuItems(menus);
      setLoading(false);
      router.push("/dashboard");
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dataAreaId");

    setUser(null);
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        dataSites,
        setDataSites,
        // menus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
