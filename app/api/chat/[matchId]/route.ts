import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Match from "@/models/Match";
import Message from "@/models/Message";
import User from "@/models/User";
import mongoose from "mongoose";

// GET: messages for a match + match sticker details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { matchId } = await params;
  await dbConnect();

  const match = await Match.findById(matchId)
    .populate("user1", "name image city")
    .populate("user2", "name image city");

  if (!match) return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });

  const myId = new mongoose.Types.ObjectId(session.user.id);
  if (!match.user1._id.equals(myId) && !match.user2._id.equals(myId)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const messages = await Message.find({ matchId })
    .sort({ createdAt: 1 })
    .limit(200)
    .lean();

  return NextResponse.json({ match, messages });
}

// POST: send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { matchId } = await params;
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
  }

  await dbConnect();

  const match = await Match.findById(matchId);
  if (!match || !match.confirmed) {
    return NextResponse.json({ error: "Match no válido" }, { status: 404 });
  }

  const myId = new mongoose.Types.ObjectId(session.user.id);
  if (!match.user1.equals(myId) && !match.user2.equals(myId)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const message = await Message.create({
    matchId,
    senderId: myId,
    text: text.trim().slice(0, 2000),
  });

  return NextResponse.json({ message }, { status: 201 });
}
