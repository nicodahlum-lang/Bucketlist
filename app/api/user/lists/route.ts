import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getUserLists, getUserGlobalStats, getUserByIdByEmail } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByIdByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const [lists, stats] = await Promise.all([
      getUserLists(user.id),
      getUserGlobalStats(user.id)
    ]);

    return NextResponse.json({
      lists,
      stats
    });
  } catch (e) {
    console.error("Fetch User Dashboard Error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
