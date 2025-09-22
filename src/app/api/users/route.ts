import { NextResponse } from "next/server";

interface User {
  name: string;
  email: string;
}

const users: User[] = [];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();

  let isEmailExist: boolean = false;

  for (let i = 0; i < users.length; i++) {
    if (body.email == users[i].email) {
      isEmailExist = true;
    }
  }

  if (!isEmailExist) {
    users.push(body);
    return NextResponse.json(
      {
        message: "success",
        data: users,
      },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      {
        message: `Email '${body.email}' is already exist`,
      },
      { status: 403 }
    );
  }
}

// prisma
