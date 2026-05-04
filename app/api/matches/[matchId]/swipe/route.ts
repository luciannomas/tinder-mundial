import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";
import mongoose from "mongoose";
import { computeMatchStickers } from "@/lib/utils";

// POST: swipe on a user (right = interested, left = pass)
// body: { targetUserId: string, direction: "right" | "left" }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { targetUserId, direction } = await req.json();
  if (!targetUserId || !["right", "left"].includes(direction)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await dbConnect();

  const myId = new mongoose.Types.ObjectId(session.user.id);
  const theirId = new mongoose.Types.ObjectId(targetUserId);

  const me = await User.findById(myId);
  if (!me) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  if (direction === "left") {
    await User.findByIdAndUpdate(myId, { $addToSet: { swipedLeft: theirId } });
    return NextResponse.json({ matched: false });
  }

  // Swipe right
  await User.findByIdAndUpdate(myId, { $addToSet: { swipedRight: theirId } });

  // Check if the other user already swiped right on me
  const [user1Id, user2Id] = myId < theirId ? [myId, theirId] : [theirId, myId];
  const isUser1 = myId.equals(user1Id);

  let match = await Match.findOne({ user1: user1Id, user2: user2Id });

  if (!match) {
    match = await Match.create({
      user1: user1Id,
      user2: user2Id,
      user1Swiped: isUser1,
      user2Swiped: !isUser1,
    });
  } else {
    if (isUser1) match.user1Swiped = true;
    else match.user2Swiped = true;

    if (match.user1Swiped && match.user2Swiped) {
      match.confirmed = true;
      // Compute stickers to exchange
      const them = await User.findById(theirId).select("stickersHave stickersNeed");
      if (them) {
        const { iCanGive, theyCanGive } = computeMatchStickers(
          me.stickersHave,
          me.stickersNeed,
          them.stickersHave,
          them.stickersNeed
        );
        if (isUser1) {
          match.stickersUser1ToUser2 = iCanGive;
          match.stickersUser2ToUser1 = theyCanGive;
        } else {
          match.stickersUser2ToUser1 = iCanGive;
          match.stickersUser1ToUser2 = theyCanGive;
        }
      }
    }
    await match.save();
  }

  return NextResponse.json({
    matched: match.confirmed,
    matchId: match._id.toString(),
  });
}
