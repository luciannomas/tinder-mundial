import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { STICKER_BY_CODE } from "@/lib/sticker-data";

// GET: return current user's sticker state
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.user.id).select(
    "stickersHave stickersNeed stickersPasted"
  );

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  return NextResponse.json({
    stickersHave: user.stickersHave,
    stickersNeed: user.stickersNeed,
    stickersPasted: user.stickersPasted,
  });
}

// POST: bulk update stickers
// body: { action: "have"|"need"|"pasted"|"remove", codes: string[] }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { action, codes } = await req.json();

  if (!action || !Array.isArray(codes)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // Validate all codes exist in catalog
  const validCodes = codes
    .map((c: string) => c.trim().toUpperCase())
    .filter((c: string) => STICKER_BY_CODE.has(c));

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  switch (action) {
    case "have":
      user.stickersHave = [...new Set([...user.stickersHave, ...validCodes])];
      break;
    case "need":
      user.stickersNeed = [...new Set([...user.stickersNeed, ...validCodes])];
      break;
    case "pasted":
      user.stickersPasted = [...new Set([...user.stickersPasted, ...validCodes])];
      // Remove from need if pasted
      user.stickersNeed = user.stickersNeed.filter((c) => !validCodes.includes(c));
      break;
    case "remove_have":
      user.stickersHave = user.stickersHave.filter((c) => !validCodes.includes(c));
      break;
    case "remove_need":
      user.stickersNeed = user.stickersNeed.filter((c) => !validCodes.includes(c));
      break;
    case "remove_pasted":
      user.stickersPasted = user.stickersPasted.filter((c) => !validCodes.includes(c));
      break;
    case "replace_have":
      user.stickersHave = validCodes;
      break;
    case "replace_need":
      user.stickersNeed = validCodes;
      break;
    default:
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  }

  await user.save();

  return NextResponse.json({
    stickersHave: user.stickersHave,
    stickersNeed: user.stickersNeed,
    stickersPasted: user.stickersPasted,
    invalidCodes: codes.filter(
      (c: string) => !STICKER_BY_CODE.has(c.trim().toUpperCase())
    ),
  });
}
