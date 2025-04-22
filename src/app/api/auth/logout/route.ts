import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const response = NextResponse.json(
      { msg: "logout success" },
      {
        status: 200,
      }
    );

    response.cookies.delete("authentication");
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
