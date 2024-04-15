import { NextResponse } from "next/server";
import { db } from "@/lib/db";

import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  req: Response,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("[SERVER_ID_PATCH]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
