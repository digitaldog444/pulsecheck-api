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
  const organization = await prisma.organization.findFirst({
    where: { id },
    select: {
      email: true,
      id: true,
      createdAt: true,
      name: true,
      passwordHash: false,
      plan: true,
      settings: true,
    },
  });

  return NextResponse.json({ success: true, organization });
};
