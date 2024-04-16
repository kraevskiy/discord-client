import { NextResponse } from "next/server";
import { MemberRole } from ".prisma/client";
import { ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = (await req.json()) as {
      name: string;
      type: ChannelType;
    };
    const { searchParams } = new URL(req.url);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name.toLowerCase() === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("[CHANNELS_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
