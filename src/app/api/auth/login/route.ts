const data = require("../../../lib/dal/userdbutils"); ///app/lib/userdbutils"
import { GenerateToken } from "@/app/lib/services/Token.service";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    // kya banda exist  hai
    const user = await data.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Email is not available" },
        { status: 404 }
      );
    }
    const menus = await data.GetMenusByRole(user.role_id);

    if (!menus) {
      return NextResponse.json(
        { error: "Menus is not available for this user" },
        { status: 404 }
      );
    }

    const groupedMenu = Array.isArray(menus)
      ? menus.reduce((acc: any, item: any) => {
          if (!item.category) item.category = "Uncategorized"; // Default category

          let category = acc.find(
            (group: any) => group.title === item.category
          );
          if (!category) {
            category = { title: item.category, list: [] };
            acc.push(category);
          }
          category.list.push({ title: item.title, path: item.url });
          return acc;
        }, [])
      : [];

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Wrong credentials either email or  password" },
        { status: 401 }
      );
    }

    // token

    // jwt

    // const userData = {
    //   username: user.username,
    //   userId: user.Id,
    //   email: user.email,
    //   isAdmin: user.isAdmin,
    //   isActive: user.isActive,
    //   isLoggedIn: true,
    // };

    const token = await GenerateToken({
      username: user.username,
      userId: user.Id,
      email: user.email,
      // isAdmin: user.isAdmin,
      isActive: user.isActive,
      roleId: user.role_id,
      dataAreaId: user.siteID,
      isLoggedIn: true,
      menus: groupedMenu,
    });

    const response = NextResponse.json(
      {
        msg: "user login successfully",
        token: token,
        user: {
          username: user.username,
          userId: user.Id,
          email: user.email,
          // isAdmin: user.isAdmin,
          isActive: user.isActive,
          roleId: user.role_id,
          dataAreaId: user.siteID,
          isLoggedIn: true,
          menus: groupedMenu,
        },
      },
      {
        status: 201,
      }
    );

    // response.cookies.set("authentication", token, {
    //   httpOnly: true,
    // });

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
