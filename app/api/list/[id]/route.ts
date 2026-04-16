import { NextRequest, NextResponse } from "next/server";
import { getListItems, toggleItem } from "../../../../lib/db";
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = await getListItems(params.id);
    return NextResponse.json(items);
  } catch (e) {
    console.error("Get Items Error:", e);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id, completed } = await req.json();
    await toggleItem(id, completed);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Toggle Item Error:", e);
    return NextResponse.json({ error: "Failed to toggle item" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { text, category } = await req.json();
    const result = await sql`
      INSERT INTO items (list_id, category, text, completed) 
      VALUES (${params.id}, ${category}, ${text}, false) 
      RETURNING *;
    `;
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error("Add Item Error:", e);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
