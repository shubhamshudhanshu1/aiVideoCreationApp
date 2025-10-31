import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin check
    // For now, return empty queue
    // In production, fetch from moderation queue table

    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error("Get mod queue error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

