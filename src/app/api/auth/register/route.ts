import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const users: any[] = []; // Simulating a database

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
