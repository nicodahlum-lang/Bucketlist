import { sql } from '@vercel/postgres';

export async function initDb() {
  try {
    // Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        email TEXT UNIQUE NOT NULL, 
        name TEXT, 
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    // Lists Table (Updated with user_id)
    await sql`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    // Items Table
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

export async function createUser(email: string, name?: string, image?: string) {
  await initDb();
  const result = await sql`
    INSERT INTO users (email, name, image) 
    VALUES (${email}, ${name}, ${image}) 
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image
    RETURNING id;
  `;
  return result.rows[0].id;
}

export async function getUserById(id: string) {
  await initDb();
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result.rows[0];
}

export async function createList(name: string, userId?: string) {
  await initDb();
  const result = await sql`
    INSERT INTO lists (name, user_id) 
    VALUES (${name}, ${userId}) 
    RETURNING id;
  `;
  return result.rows[0].id;
}

export async function getUserLists(userId: string) {
  await initDb();
  const result = await sql`SELECT * FROM lists WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return result.rows;
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
