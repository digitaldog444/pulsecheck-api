import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();
  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Invalid Credentials!" },
      { status: 400 }
    );
  }
  if (bcrypt.compareSync(password, user.passwordHash!)) {
    // User is valid
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET!
    );
    // const cookieStore = await cookies();
    // cookieStore.set("foresite_token", token);
    user.passwordHash = "";
    return NextResponse.json({ success: true, token, user });
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid Credentials!" },
      { status: 400 }
    );
  }
};
