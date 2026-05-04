import { NextResponse } from "next/server";
import { STICKERS, TEAMS } from "@/lib/sticker-data";

export async function GET() {
  return NextResponse.json({ stickers: STICKERS, teams: TEAMS });
}
