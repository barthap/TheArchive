import fs from 'fs/promises';

import { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  const file = await fs.readFile('db/schema.sql', 'utf-8');

  await db.raw(file);
}
