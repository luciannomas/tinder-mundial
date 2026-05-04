import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Match from "@/models/Match";
import mongoose from "mongoose";

// GET: list confirmed matches (for chat list)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const myId = new mongoose.Types.ObjectId(session.user.id);

  const matches = await Match.find({
    $or: [{ user1: myId }, { user2: myId }],
    confirmed: true,
  })
    .sort({ updatedAt: -1 })
    .populate("user1", "name image city")
    .populate("user2", "name image city")
    .lean();

  const result = matches.map((m) => {
    const isUser1 = (m.user1 as { _id: mongoose.Types.ObjectId })._id.equals(myId);
    const otherUser = isUser1 ? m.user2 : m.user1;
    return {
      _id: m._id,
      otherUser,
      stickersToReceive: (isUser1
        ? m.stickersUser2ToUser1
        : m.stickersUser1ToUser2
      ).length,
      stickersToGive: (isUser1
        ? m.stickersUser1ToUser2
        : m.stickersUser2ToUser1
      ).length,
      tradeCompleted: m.tradeCompleted,
      updatedAt: m.updatedAt,
    };
  });

  return NextResponse.json({ matches: result });
}
