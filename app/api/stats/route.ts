import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";

export async function GET() {
  await dbConnect();

  const [totalUsers, confirmedMatches, completedTrades] = await Promise.all([
    User.countDocuments(),
    Match.countDocuments({ confirmed: true }),
    Match.countDocuments({ tradeCompleted: true }),
  ]);

  // Approximate total stickers in circulation
  const users = await User.find().select("stickersHave stickersNeed").lean();
  const stickersInCirculation = users.reduce(
    (acc, u) => acc + (u.stickersHave?.length ?? 0),
    0
  );

  return NextResponse.json({
    totalUsers,
    confirmedMatches,
    completedTrades,
    stickersInCirculation,
  });
}
