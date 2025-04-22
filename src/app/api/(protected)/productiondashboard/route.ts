import { NextResponse } from "next/server";
import { VerifyToken } from "../../../lib/services/Token.service";

export const GET = async (req: Request) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token" },
      { status: 401 }
    );
  }
  // console.log(token);
  try {
    const decoded = token ? await VerifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      productionData: {
        labels: ["Shift 1", "Shift 2", "Shift 3"],
        datasets: [
          {
            label: "Total Running Hours",
            data: [8, 7, 9],
            backgroundColor: "#4CAF50",
          },
          {
            label: "Total Down Hours",
            data: [1, 2, 1],
            backgroundColor: "#FF5733",
          },
        ],
      },
      finalProductionData: {
        labels: ["Product A", "Product B", "Product C"],
        datasets: [
          {
            label: "Total Production",
            data: [500, 600, 700],
            backgroundColor: "#007bff",
          },
        ],
      },
      biProductData: {
        labels: ["Waste A", "Waste B", "Waste C"],
        datasets: [
          {
            label: "Bi-Product Production",
            data: [20, 30, 25],
            backgroundColor: ["#f39c12", "#e74c3c", "#2ecc71"],
          },
        ],
      },
      downtimeReasons: {
        labels: ["Mechanical Failure", "Power Outage", "Material Shortage"],
        datasets: [
          {
            label: "Downtime Reasons",
            data: [3, 4, 2],
            backgroundColor: ["#8e44ad", "#3498db", "#e67e22"],
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // try {

  //   let id = 15;
  //   const users = await data.UserfindById(id);
  //   return new NextResponse(JSON.stringify(users), { status: 200 });
  // } catch (error: any) {
  //   return new NextResponse("Error in fetching users" + error.message, {
  //     status: 500,
  //   });
  // }
};
