import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";
import { computeMatchStickers } from "@/lib/utils";

// GET: list of potential match candidates (users I haven't swiped yet)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();

  const me = await User.findById(session.user.id);
  if (!me) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const alreadySwiped = [
    ...(me.swipedRight || []),
    ...(me.swipedLeft || []),
    me._id,
  ];

  // Find all users I haven't swiped yet
  const candidates = await User.find({
    _id: { $nin: alreadySwiped },
  })
    .select("name image city location stickersHave stickersNeed")
    .limit(50)
    .lean();

  // Compute match quality for each
  const withMatchData = candidates
    .map((candidate) => {
      const { iCanGive, theyCanGive, isPerfect, isPartial } =
        computeMatchStickers(
          me.stickersHave,
          me.stickersNeed,
          candidate.stickersHave as string[],
          candidate.stickersNeed as string[]
        );

      // Compute distance
      let distanceKm: number | null = null;
      if (
        me.location?.coordinates &&
        candidate.location?.coordinates &&
        (me.location.coordinates[0] !== 0 || me.location.coordinates[1] !== 0) &&
        (candidate.location.coordinates[0] !== 0 ||
          candidate.location.coordinates[1] !== 0)
      ) {
        const [meLon, meLat] = me.location.coordinates;
        const [theirLon, theirLat] = candidate.location.coordinates as [
          number,
          number
        ];
        distanceKm = haversine(meLat, meLon, theirLat, theirLon);
      }

      return {
        _id: candidate._id,
        name: candidate.name,
        image: candidate.image,
        city: candidate.city,
        distanceKm,
        iCanGive,
        theyCanGive,
        isPerfect,
        isPartial,
        matchScore:
          (theyCanGive.length > 0 ? 1000 : 0) +
          (iCanGive.length > 0 ? 100 : 0) +
          theyCanGive.length +
          iCanGive.length,
      };
    })
    .filter((c) => c.matchScore > 0 || true) // Show all, sorted by match score
    .sort((a, b) => {
      // Perfect matches first, then by distance
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.distanceKm !== null && b.distanceKm !== null)
        return a.distanceKm - b.distanceKm;
      return 0;
    });

  return NextResponse.json({ candidates: withMatchData });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
