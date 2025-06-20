import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { email, password, name } = await req.json();
  const user = await prisma.organization.findFirst({ where: { email } });
  if (user) {
    return NextResponse.json(
      { success: false, error: "User already exists!!" },
      { status: 400 }
    );
  }
  if (!email || !password || !name) {
    return NextResponse.json(
      { success: false, error: "Remember all fields!" },
      { status: 400 }
    );
  }
  const newUser = await prisma.organization.create({
    data: {
      email,
      name,
      passwordHash: bcrypt.hashSync(password, 12),
    },
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.SECRET!
  );

  newUser.passwordHash = "";
  // const cookieStore = await cookies()
  // cookieStore.set("foresite_token", token)
  return NextResponse.json({ success: true, token, organization: newUser });
};
