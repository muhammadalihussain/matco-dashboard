import { VerifyToken } from "@/app/lib/services/Token.service";
import { NextRequest, NextResponse } from "next/server";

// const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }
    // console.log(token);

    const decoded = token ? await VerifyToken(token) : null;

    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
};
