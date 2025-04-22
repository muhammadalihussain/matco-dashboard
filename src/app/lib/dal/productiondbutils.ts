const {
  executeStoredProcedure,
  executeStoredProcedureByName,
  getPool,
  closePool,
  sql,
} = require("../config/db");
import moment from "moment";

async function getAllProductionData() {
  try {
    let result = await executeStoredProcedure("GetAllProductionData");

    return result.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // closePool();
  }
}

async function getDispatchInventory(data: any) {
  // console.log(data.dataSend.dataAreaId);
  // console.log(data.dataSend.site);

  try {
    const result = await executeStoredProcedure("GetDispatchInventory", {
      dataareaid: { type: sql.NVarChar, value: data.dataSend.dataAreaId },
      site: {
        type: sql.NVarChar(20),
        value: data.dataSend.site == 0 ? null : data.dataSend.site,
      },
    });

    // let result = await pool
    //   .request()
    //   .input("dataareaid", data.dataSend.dataAreaId)
    //   .input("site", data.dataSend.site == 0 ? null : data.dataSend.site)
    //   .execute("GetDispatchInventory");

    // console.log(result.recordsets[0]);
    return result.recordsets[0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // closePool();
  }
}

async function getInventory(data: any) {
  // console.log(data.dataSend.dataAreaId);
  // console.log(data.dataSend.site);

  try {
    // let result = await pool
    //   .request()
    //   .input("dataareaid", data.dataSend.dataAreaId)
    //   .input("site", data.dataSend.site == 0 ? null : data.dataSend.site)
    //   .execute("GetInventory");

    const result = await executeStoredProcedure("GetInventory", {
      dataareaid: { type: sql.NVarChar, value: data.dataSend.dataAreaId },
      site: {
        type: sql.NVarChar(20),
        value: data.dataSend.site == 0 ? null : data.dataSend.site,
      },
    });

    // console.log(result.recordsets[0]);
    return result.recordsets[0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    //closePool();
  }
}

async function getProductionOEE(data: any) {
  // console.log(data.dataSend.dataAreaId);
  // console.log(data.dataSend.site);
  // console.log(moment(data.dataSend.start).format("YYYY-MM-DD"));
  // console.log(moment(data.dataSend.end).format("YYYY-MM-DD"));
  try {
    // let result = await pool
    //   .request()
    //   .input("dataareaid", data.dataSend.dataAreaId)
    //   .input("site", data.dataSend.site == 0 ? null : data.dataSend.site)
    //   .input("start", moment(data.dataSend.start).format("YYYY-MM-DD"))
    //   .input("end", moment(data.dataSend.end).format("YYYY-MM-DD"))
    //   .execute("GetOEE");

    const result = await executeStoredProcedure("GetOEE", {
      dataareaid: { type: sql.NVarChar(10), value: data.dataSend.dataAreaId },
      site: {
        type: sql.NVarChar(20),
        value: data.dataSend.site == 0 ? null : data.dataSend.site,
      },
      start: {
        type: sql.Date,
        value: moment(data.dataSend.start).format("YYYY-MM-DD"),
      },
      end: {
        type: sql.Date,
        value: moment(data.dataSend.end).format("YYYY-MM-DD"),
      },
    });

    // console.log(result.recordsets[0]);
    return result.recordsets;
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
    // closePool();
  }
}

async function getFinishedGoodsAndBiProducts(site: any) {
  try {
    let result = await pool
      .request()
      .input("site", site)
      .execute("GetFinishedGoodsAndBiProductsBySite");

    return result.recordsets[0];
  } catch (err) {
    // Handle errors
    console.error("Error :", err);
  } finally {
  }
}

module.exports = {
  getDispatchInventory: getDispatchInventory,
  getInventory: getInventory,
  getProductionOEE: getProductionOEE,
  getAllProductionData: getAllProductionData,
  getFinishedGoodsAndBiProducts: getFinishedGoodsAndBiProducts,
};
