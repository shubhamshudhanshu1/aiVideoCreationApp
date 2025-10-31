import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getUser();
    const sid = cookies().get("sid")?.value;

    if (sid) {
      await prisma.session.deleteMany({
        where: { id: sid },
      });
    }

    cookies().delete("sid");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
