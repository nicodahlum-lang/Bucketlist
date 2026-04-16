import { NextRequest, NextResponse } from "next/server";
import { deleteItem } from "../../../../../lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const itemId = params.id;
    await deleteItem(itemId);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete Item Error:", e);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
