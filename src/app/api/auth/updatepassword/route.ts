import { SendEmail } from "@/app/lib/services/MainService";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import {
  GenerateToken,
  GenerateTokenReset,
  VerifyTokenReset,
} from "@/app/lib/services/Token.service";
const data = require("../../../lib/dal/userdbutils"); ///app/lib/userdbutils"

export const POST = async (request: NextRequest) => {
  try {
    const { password, cpassword, token } = await request.json();

    // kya banda exist  hai

    if (password !== cpassword) {
      return NextResponse.json(
        { error: "Password and confirm password do not match" },
        {
          status: 400,
        }
      );
    }

    // Verify token and get user ID
    const tokenData = await VerifyTokenReset(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const userId = tokenData;

    // console.log(userId);
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // console.log(hashedPassword);

    const result = await data.UpdateUserPassword(userId, hashedPassword);

    if (result == "User not founds") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { msg: "password reset successfully" },
      {
        status: 200,
      }
    );

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
