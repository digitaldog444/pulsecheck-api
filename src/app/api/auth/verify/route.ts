import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { token } = await req.json();
  const jwtData = jwt.decode(token);
  if (!jwtData || typeof jwtData === "string") {
    return NextResponse.json(
      { success: false, error: "Invalid token!" },
      { status: 400 }
    );
  }
  const { id } = jwtData;
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      avatarUrl: true,
      email: true,
      createdAt: true,
      id: true,
      passwordHash: false,
    },
  });

  return NextResponse.json({ success: true, user });
};
