import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
const data = require("../../../lib/dal/userdbutils");
import { VerifyTokenGetRoleId } from "../../../lib/services/Token.service";

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  const roleId = token ? await VerifyTokenGetRoleId(token) : null;

  if (!roleId) {
    return NextResponse.json({ error: "Unauthorized token" }, { status: 401 });
  }

  try {
    const menuData = await data.GetMenusByRole(roleId);

    if (!menuData) {
      return NextResponse.json(
        { error: "Menus is not available for this user" },
        { status: 404 }
      );
    }

    // Group menu items by category
    const groupedMenu = Array.isArray(menuData)
      ? menuData.reduce((acc: any, item: any) => {
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

    return NextResponse.json({ groupedMenu });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to fetch production data" },
      { status: 500 }
    );
  }
}
