import { SendEmail } from "@/app/lib/services/MainService";

import { NextRequest, NextResponse } from "next/server";

import {
  GenerateToken,
  GenerateTokenReset,
} from "@/app/lib/services/Token.service";
const data = require("../../../lib/dal/userdbutils"); ///app/lib/userdbutils"

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json();

    // kya banda exist  hai
    const user = await data.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Email is not available" },
        { status: 404 }
      );
    }

    const token = await GenerateTokenReset({
      username: user.username,
      userId: user.Id,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      isLoggedIn: true,
    });

    await SendEmail(user.username, user.email, token);

    const response = NextResponse.json(
      { msg: "Mail send successsfully kindly" },
      {
        status: 201,
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
