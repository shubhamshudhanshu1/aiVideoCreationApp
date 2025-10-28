import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { logAuditEvent } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const sid = cookies().get("sid")?.value;
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0] || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    if (sid) {
      // Get user before deleting session for audit log
      const session = await prisma.session.findUnique({
        where: { id: sid },
        include: { user: true },
      });

      await prisma.session.delete({ where: { id: sid } }).catch(() => {});

      if (session?.user) {
        await logAuditEvent(
          "session.destroyed",
          session.user.id,
          ip,
          userAgent,
          { sessionId: sid }
        );
      }
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("sid", "", { path: "/", maxAge: 0 });
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
