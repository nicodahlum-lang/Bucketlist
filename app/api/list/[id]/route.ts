import { NextRequest, NextResponse } from "next/server";
import { getListItems, toggleItem, createItems } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = await getListItems(params.id);
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id, completed } = await req.json();
    await toggleItem(id, completed);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to toggle item" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { text, category } = await req.json();
    // We create the item manually here since createItems helper is for batches
    // In a real app I'd add a single createItem helper to db.ts
    // Using raw sql for the a single item:
    const { sql } = await import('@vercel/postgres');
    const result = await sql`
      INSERT INTO items (list_id, category, text, completed) 
      VALUES (${params.id}, ${category}, ${text}, false) 
      RETURNING *;
    `;
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
