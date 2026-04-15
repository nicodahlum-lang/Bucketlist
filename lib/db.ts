import { sql } from '@vercel/postgres';

export async function createList(name: string) {
  const result = await sql`
    INSERT INTO lists (name) 
    VALUES (${name}) 
    RETURNING id;
  `;
  return result.rows[0].id;
}

export async function createItems(listId: string, items: {category: string, text: string}[]) {
  for (const item of items) {
    await sql`
      INSERT INTO items (list_id, category, text, completed) 
      VALUES (${listId}, ${item.category}, ${item.text}, false);
    `;
  }
}

export async function getListItems(listId: string) {
  const result = await sql`
    SELECT * FROM items 
    WHERE list_id = ${listId} 
    ORDER BY category, created_at ASC;
  `;
  return result.rows;
}

export async function toggleItem(itemId: string, completed: boolean) {
  await sql`
    UPDATE items 
    SET completed = ${completed} 
    WHERE id = ${itemId};
  `;
}

export async function deleteItem(itemId: string) {
  await sql`
    DELETE FROM items WHERE id = ${itemId};
  `;
}
