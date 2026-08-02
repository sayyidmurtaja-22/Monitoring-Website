import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { LOCATIONS } from "@/config/Location";

// Stasiun dianggap ONLINE jika data terakhir tidak lebih tua dari ambang ini (menit).
const STALE_THRESHOLD_MINUTES = 15;

export async function GET() {
  try {
    const now = Date.now();
    const stations = [];

    for (const loc of Object.values(LOCATIONS)) {
      const clientModel = prisma[loc.table] as unknown as {
        findFirst: (args: {
          orderBy: { time: "desc" };
          select: { time: true };
        }) => Promise<{ time: Date | null } | null>;
      };
      const last = await clientModel.findFirst({
        orderBy: { time: "desc" },
        select: { time: true },
      });

      const latestTime = last?.time ?? null;
      const ageMinutes =
        latestTime != null
          ? Math.round((now - new Date(latestTime).getTime()) / 60000)
          : null;

      stations.push({
        key: loc.table,
        label: loc.label,
        region: loc.region,
        href: loc.href,
        latestTime: latestTime ? new Date(latestTime).toISOString() : null,
        ageMinutes,
        isOnline: ageMinutes != null && ageMinutes <= STALE_THRESHOLD_MINUTES,
      });
    }

    return NextResponse.json(
      {
        success: true,
        systemOnline: true,
        stations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("db error", error);
    return NextResponse.json(
      {
        success: false,
        systemOnline: false,
        stations: [],
        message: "failed fetch data",
      },
      { status: 500 }
    );
  }
}
