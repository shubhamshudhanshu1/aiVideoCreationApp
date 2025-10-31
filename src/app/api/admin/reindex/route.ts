import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin authorization check
    // TODO: Reindex search index (if using Algolia/Meilisearch/etc.)

    // Placeholder for reindexing logic
    console.log("Reindex triggered by user:", user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reindex error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

