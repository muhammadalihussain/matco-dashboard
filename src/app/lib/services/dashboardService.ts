// services/authService.js
// import Cookies from "js-cookie";
import axios from "axios";

const API_URL = "http://localhost:3000/api";
// Login API Call
export const dashboardService = {
  getProductionDate: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/productiondashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      return null;
    }
  },

  getProduction: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.get(
        `${API_URL}/production?type=allproductiondata`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch {
      return null;
    }
  },

  getProductionOEE: async (data: any) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const response = await axios.post(
        `${API_URL}/production`,
        {
          action: "getProductionOEE",
          dataSend: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch {
      return null;
    }
  },
  getDispatchInventory: async (data: any) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const response = await axios.post(
        `${API_URL}/production`,
        {
          action: "getDispatchInventory",
          dataSend: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch {
      return null;
    }
  },

  //

  getFinishedGoodsAndBiProducts: async (site: any) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await axios.post(
        `${API_URL}/production`,
        { site },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch {
      return null;
    }
  },
};
