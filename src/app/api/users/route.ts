import { NextResponse } from "next/server";

interface User {
  name: string;
  email: string;
}

const users: User[] = [];

export async function GET() {
  try {
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<User>;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Email is not valid" }, { status: 400 });
    }

    const isEmailExist = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (isEmailExist) {
      return NextResponse.json(
        { message: `Email '${email}' is already exist` },
        { status: 409 }
      );
    }

    const newUser: User = { name, email };
    users.push(newUser);

    return NextResponse.json(
      {
        message: "success",
        data: users,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// prisma
