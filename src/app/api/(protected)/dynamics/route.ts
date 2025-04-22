import { NextResponse, NextRequest } from "next/server";
const data = require("../../../lib/dal/userdbutils");
import {
  VerifyToken,
  VerifyTokenGetUserId,
} from "../../../lib/services/Token.service";

// Function to fetch data from MSSQL
export async function GET(req: Request) {
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
    return NextResponse.json({ error: "Unauthorized token" }, { status: 401 });
  }

  const userId = token ? await VerifyTokenGetUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized token" }, { status: 401 });
  }

  try {
    if (type === "company") {
      const result = await data.GetAllCompany();

      return NextResponse.json({ result });
    } else if (type === "getAllRole") {
      const result = await data.GetAllRole();

      return NextResponse.json({ result });
    } else if (type === "getsitesbyuserid") {
      const result = await data.GetSitesByUserId(userId);
      return NextResponse.json({ result });
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
    const { id, type } = await request.json();
    if (type === "sites") {
      const result = await data.GetAllInventSite(id);
      return NextResponse.json({ result });
    } else if (type === "fetchUser") {
      const result = await data.UserfindById(id);
      return NextResponse.json({ result });
    }

    if (type === "getsitesbyuserid") {
      const result = await data.GetSitesByUserId(id);

      return NextResponse.json({ result });
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
