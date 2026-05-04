import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";
import mongoose from "mongoose";

// POST: mark trade as completed — update both users' albums
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { matchId } = await params;
  await dbConnect();

  const match = await Match.findById(matchId);
  if (!match) return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });
  if (match.tradeCompleted)
    return NextResponse.json({ error: "Intercambio ya completado" }, { status: 400 });

  const myId = new mongoose.Types.ObjectId(session.user.id);
  const isUser1 = match.user1.equals(myId);
  const isUser2 = match.user2.equals(myId);
  if (!isUser1 && !isUser2) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Stickers I receive
  const iReceive = isUser1
    ? match.stickersUser2ToUser1
    : match.stickersUser1ToUser2;
  // Stickers I give
  const iGive = isUser1
    ? match.stickersUser1ToUser2
    : match.stickersUser2ToUser1;

  // Update my album: add received to pasted/need-resolved, remove given from have
  await User.findByIdAndUpdate(myId, {
    $addToSet: { stickersPasted: { $each: iReceive } },
    $pull: { stickersNeed: { $in: iReceive }, stickersHave: { $in: iGive } },
  });

  // Update other user's album
  const theirId = isUser1 ? match.user2 : match.user1;
  await User.findByIdAndUpdate(theirId, {
    $addToSet: { stickersPasted: { $each: iGive } },
    $pull: { stickersNeed: { $in: iGive }, stickersHave: { $in: iReceive } },
  });

  match.tradeCompleted = true;
  await match.save();

  return NextResponse.json({ ok: true });
}
