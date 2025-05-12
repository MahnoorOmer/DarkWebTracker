import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from '@shared/schema'; // Assuming your schema exports `users`

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pass both the pool and the schema to drizzle
export const db = drizzle(pool, { schema });

async function runQuery() {
  try {
    const result = await db.select().from(schema.users);
    console.log(result);
  } catch (err) {
    console.error('Error executing query:', err);
  }
}

runQuery();
