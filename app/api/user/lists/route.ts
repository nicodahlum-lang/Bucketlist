import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserLists, getUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the DB by email to get the UUID
    const user = await getUserByIdByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const lists = await getUserLists(user.id);
    return NextResponse.json(lists);
  } catch (e) {
    console.error("Fetch User Lists Error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function getUserByIdByEmail(email: string) {
  const { sql } = await import('@vercel/postgres');
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result.rows[0];
}
