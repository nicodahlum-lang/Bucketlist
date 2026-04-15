import { sql } from '@vercel/postgres';

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        name TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        list_id UUID REFERENCES lists(id) ON DELETE CASCADE, 
        category TEXT, 
        text TEXT NOT NULL, 
        completed BOOLEAN DEFAULT false, 
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
  } catch (e) {
    console.error("Database initialization failed:", e);
  }
}

export async function createList(name: string) {
  await initDb();
  const result = await sql`
    INSERT INTO lists (name) 
    VALUES (${name}) 
    RETURNING id;
  `;
  return result.rows[0].id;
}

export async function createItems(listId: string, items: {category: string, text: string}[]) {
  await initDb();
  for (const item of items) {
    await sql`
      INSERT INTO items (list_id, category, text, completed) 
      VALUES (${listId}, ${item.category}, ${item.text}, false);
    `;
  }
}

export async function getListItems(listId: string) {
  await initDb();
  const result = await sql`
    SELECT * FROM items 
    WHERE list_id = ${listId} 
    ORDER BY category, created_at ASC;
  `;
  return result.rows;
}

export async function toggleItem(itemId: string, completed: boolean) {
  await initDb();
  await sql`
    UPDATE items 
    SET completed = ${completed} 
    WHERE id = ${itemId};
  `;
}

export async function deleteItem(itemId: string) {
  await initDb();
  await sql`
    DELETE FROM items WHERE id = ${itemId};
  `;
}
