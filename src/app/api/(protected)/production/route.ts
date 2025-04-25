import { NextResponse, NextRequest } from "next/server";
const data = require("../../../lib/dal/productiondbutils");
import { VerifyToken } from "../../../lib/services/Token.service";

// Function to fetch data from MSSQL
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // Get query param

    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }
    const decoded = token ? await VerifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized token" },
        { status: 401 }
      );
    }

    // const result = await sql.query("SELECT * FROM ProductionData");

    if (type === "ProductionOEE") {
    } else if (type === "allproductiondata") {
      const result = await data.getAllProductionData();

      const productionData = result[0].map((row: any) => ({
        supervisor: row.supervisor,
        runningHours: row.runningHours,
        downHours: row.downHours,
        finalProduction: row.finalProduction,
        biProductProduction: row.biProductProduction,
        remarks: row.remarks,
        shiftLabel: row.ShiftLabel,
      }));
      // Or alternatively:
      const downtimeCounts: { [reason: string]: number } = {};
      productionData.forEach((item: any) => {
        const reason = item.remarks || "Unknown";
        downtimeCounts[reason] = (downtimeCounts[reason] || 0) + 1;
      });

      return NextResponse.json({
        alldata: productionData,

        productionData: {
          labels: productionData.map((d: any, i: any) => `Shift ${i + 1}`),
          datasets: [
            {
              label: "Total Running Hours",
              data: productionData.map((d: any) => d.runningHours),
              backgroundColor: "#4CAF50",
            },
            {
              label: "Total Down Hours",
              data: productionData.map((d: any) => d.downHours),
              backgroundColor: "#FF5733",
            },
          ],
        },
        finalProductionData: {
          labels: ["Product A", "Product B", "Product C"],
          datasets: [
            {
              label: "Total Production",
              data: productionData.map((d: any) => d.finalProduction),
              backgroundColor: "#007bff",
            },
          ],
        },
        biProductData: {
          labels: ["Waste A", "Waste B", "Waste C"],
          datasets: [
            {
              label: "Bi-Product Production",
              data: productionData.map((d: any) => d.biProductProduction),
              backgroundColor: ["#f39c12", "#e74c3c", "#2ecc71"],
            },
          ],
        },
        downtimeReasons: {
          labels: Object.keys(downtimeCounts),
          datasets: [
            {
              label: "Downtime Reasons",
              data: Object.values(downtimeCounts),
              backgroundColor: ["#8e44ad", "#3498db", "#e67e22"],
            },
          ],
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to fetch production data" },
      { status: 500 }
    );
  }
}

export const POST = async (request: NextRequest) => {
  try {
    // const { site } = await request.json();
    const { action, ...dataSend } = await request.json(); // Destructure action from body

    // console.log(dataSend);
    // console.log(action);

    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }
    const decoded = token ? await VerifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized token" },
        { status: 401 }
      );
    }

    switch (action) {
      case "getFinishedGoodsAndBiProducts": {
        console.log(dataSend.site);

        //  return NextResponse.json({ message: 'Created', data }, { status: 201 });
        const result = await data.getFinishedGoodsAndBiProducts(dataSend.site);

        return NextResponse.json({
          finalFinishedGoodsData: {
            labels: (result ?? [])
              .filter((item: any) => item.ItemCategory === "Finished Goods") // Filter only Bi-Products
              .map((item: any) => item.ItemCategory),
            datasets: [
              {
                label: "Finished Goods",
                data: (result ?? [])
                  .filter((item: any) => item.ItemCategory === "Finished Goods") // Apply same filter
                  .map((item: any) => item.OnHandQuantity),
                backgroundColor: "#4CAF50",
              },
            ],
          },
          biProductData: {
            labels: (result ?? [])
              .filter((item: any) => item.ItemCategory === "Bi-Products") // Filter only Bi-Products
              .map((item: any) => item.ItemCategory),
            datasets: [
              {
                label: "Bi-Products",
                data: (result ?? [])
                  .filter((item: any) => item.ItemCategory === "Bi-Products") // Apply same filter
                  .map((item: any) => item.OnHandQuantity),
                backgroundColor: ["#FF5733"],
              },
            ],
          },
        });
      }

      case "getDispatchInventory": {
        //  return NextResponse.json({ message: 'Created', data }, { status: 201 });
        const resultDispatchInventory = await data.getDispatchInventory(
          dataSend
        );

        return NextResponse.json({
          dispatchInventory: {
            labels: resultDispatchInventory.map(
              (item: any) => item.ItemCategory
            ),
            datasets: [
              {
                label: "Qty",
                data: resultDispatchInventory.map(
                  (item: any) => item.OnHandQuantity
                ),
                backgroundColor: ["#082567", "red", "green"],
                // borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
            ],
          },
        });

        // return NextResponse.json({
        //   biProductsData: {
        //     labels: (resultDispatchInventory ?? [])
        //       .filter((item:any) => item.ItemCategory === "BiProducts") // Filter only Bi-Products
        //       .map((item:any) => item.ItemCategory),
        //     datasets: [
        //       {
        //         label: "Bi-Products",
        //         data: (resultDispatchInventory ?? [])
        //           .filter((item:any) => item.ItemCategory === "BiProducts") // Apply same filter
        //           .map((item:any) => item.OnHandQuantity),
        //         backgroundColor: "#4CAF50",
        //       },
        //     ],
        //   },
        //   exportData: {
        //     labels: (resultDispatchInventory ?? [])
        //       .filter((item:any) => item.ItemCategory === "Export") // Filter only Bi-Products
        //       .map((item:any) => item.ItemCategory),
        //     datasets: [
        //       {
        //         label: "Export",
        //         data: (resultDispatchInventory ?? [])
        //           .filter((item:any) => item.ItemCategory === "Export") // Apply same filter
        //           .map((item:any) => item.OnHandQuantity),
        //         backgroundColor: ["#FF5733"],
        //       },
        //     ],
        //   },

        //   localSNDData: {
        //     labels: (resultDispatchInventory ?? [])
        //       .filter((item:any) => item.ItemCategory === "LocalSND") // Filter only Bi-Products
        //       .map((item:any) => item.ItemCategory),
        //     datasets: [
        //       {
        //         label: "Export",
        //         data: (resultDispatchInventory ?? [])
        //           .filter((item:any) => item.ItemCategory === "LocalSND") // Apply same filter
        //           .map((item:any) => item.OnHandQuantity),
        //         backgroundColor: ["#FF5733"],
        //       },
        //     ],
        //   },
        // });
      }

      case "getProductionOEE": {
        const result = await data.getProductionOEE(dataSend);
        const resultInventory = await data.getInventory(dataSend);

        // console.log(result[0]);
        // console.log(result[1]);

        return NextResponse.json({
          inventoryData: {
            labels: resultInventory.map((item: any) => item.ItemCategory),
            datasets: [
              {
                label: "Qty",
                data: resultInventory.map((item: any) => item.OnHandQuantity),
                backgroundColor: ["#082567", "red", "#FEBE10", "green"],
                // borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
            ],
          },

          finalProductionAllData: {
            labels: result[1]?.map((item: any) => item.AllShifts),
            datasets: [
              {
                label: "Availability",
                data: result[1]?.map((item: any) => item.PlantAvailability),
                backgroundColor: "green",
                // borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "Performance",
                data: result[1]?.map((item: any) => item.PlantPerformance),
                backgroundColor: "#082567",
                // borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "Quality",
                data: result[1]?.map((item: any) => item.Quality),
                backgroundColor: "#FEBE10",
                // borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "OEE (%)",
                data: result[1]?.map((item: any) => item.OEE),
                backgroundColor: "red",
                // borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                // yAxisID: "y1",
              },
            ],
          },

          // inventoryData: {
          //   labels: resultInventory.map((item:any) => item.Measure),

          //   datasets: [
          //     {
          //       label: "Bi-Products",
          //       data: resultInventory.map((item:any) => item.BiProducts),
          //       backgroundColor: "#4CAF50",
          //       // borderColor: "rgba(54, 162, 235, 1)",
          //       borderWidth: 1,
          //       // yAxisID: "y",
          //     },
          //     {
          //       label: "Raw",
          //       data: resultInventory.map((item:any) => item.Raw),
          //       backgroundColor: "#FF5733",
          //       // borderColor: "rgba(75, 192, 192, 1)",
          //       borderWidth: 1,
          //       // yAxisID: "y",
          //     },
          //     {
          //       label: "Semi Finish",
          //       data: resultInventory.map((item:any) => item.SemiFinish),
          //       backgroundColor: "#00308F",
          //       // borderColor: "rgba(75, 192, 192, 1)",
          //       borderWidth: 1,
          //       // yAxisID: "y",
          //     },
          //     {
          //       label: "Finishing",
          //       data: resultInventory.map((item:any) => item.Finishing),
          //       backgroundColor: "#8e44ad",
          //       // borderColor: "rgba(255, 99, 132, 1)",
          //       borderWidth: 1,
          //       // yAxisID: "y1",
          //     },
          //   ],
          // },

          finalProductionData: {
            labels: result[0]?.map((item: any) => item.ShiftName),
            datasets: [
              {
                label: "Availability",
                data: result[0]?.map((item: any) => item.PlantAvailability),
                backgroundColor: "green",
                // borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "Performance",
                data: result[0]?.map((item: any) => item.PlantPerformance),
                backgroundColor: "#082567",
                // borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "Quality",
                data: result[0]?.map((item: any) => item.Quality),
                backgroundColor: "#FEBE10",
                // borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                // yAxisID: "y",
              },
              {
                label: "OEE (%)",
                data: result[0]?.map((item: any) => item.OEE),
                backgroundColor: "red",
                // borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                // yAxisID: "y1",
              },
            ],
          },
        });
      }

      // case "getInventory": {
      //   const result = await data.getInventory(dataSend);

      //   return NextResponse.json({
      //     inventoryData: {
      //       labels: result.map((item:any) => item.ItemCategory),
      //       datasets: [
      //         {
      //           label: "OnHandQuantityTon",
      //           data: result.map((item:any) => item.OnHandQuantity),
      //           backgroundColor: "#4CAF50",
      //           // borderColor: "rgba(54, 162, 235, 1)",
      //           borderWidth: 1,
      //           // yAxisID: "y",
      //         },
      //       ],
      //     },
      //   });
      // }

      case "delete":
        return NextResponse.json({ message: "Deleted", data }, { status: 200 });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
