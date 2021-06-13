import process from 'process';
import readline from 'readline';

import { Knex } from 'knex';
import umzug, { Umzug } from 'umzug';

import dbClient from '../src/db/client';

const MIGRATIONS_TABLE_NAME = 'migrations';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (msg: string): Promise<string> =>
  new Promise((res) => {
    rl.question(msg, res);
  });

class PostgresMigrationStorage implements umzug.Storage {
  constructor(private readonly database: Knex) {}

  async logMigration(migrationName: string): Promise<void> {
    await this.prepareMigrationsTable();
    await this.database
      .insert({
        name: migrationName,
      })
      .into(MIGRATIONS_TABLE_NAME);
  }

  async unlogMigration(migrationName: string): Promise<void> {
    await this.prepareMigrationsTable();
    await this.database(MIGRATIONS_TABLE_NAME)
      .where({
        name: migrationName,
      })
      .delete();
  }

  async executed(): Promise<string[]> {
    await this.prepareMigrationsTable();
    const rows = await this.database
      .select('name')
      .from(MIGRATIONS_TABLE_NAME)
      .orderBy('created_at', 'ASC');
    return rows.map((row) => row.name);
  }

  private async prepareMigrationsTable(): Promise<void> {
    const tableExists = await this.database.schema.hasTable(MIGRATIONS_TABLE_NAME);
    if (tableExists) {
      return;
    }

    await this.database.schema.createTable(MIGRATIONS_TABLE_NAME, (table) => {
      table.specificType('name', 'VARCHAR(255)').notNullable().primary();
      table.timestamp('created_at').notNullable().defaultTo(this.database.fn.now());
    });
  }
}

function createPostgresUmzug(): umzug.Umzug {
  return new umzug({
    logging: console.log,
    storage: new PostgresMigrationStorage(dbClient),
    migrations: { path: 'db/migrations', pattern: /^\d+[\w-]+\.ts$/, params: [dbClient] },
  });
}

async function runMigrationsAsync(umzug: Umzug): Promise<void> {
  try {
    await umzug.up();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function run({
  yes = false,
  force = false,
}: { yes?: boolean; force?: boolean } = {}): Promise<void> {
  if (process.argv.includes('help') || process.argv.includes('-h')) {
    console.log('\nA database migration tool. Available options:\n');
    console.log('  -y, --yes\tSkip confirmation');
    console.log('  --force\tForce run all migrations');

    process.exit(0);
  }

  if (force) {
    await dbClient.schema.dropTableIfExists(MIGRATIONS_TABLE_NAME);
  }

  const umzug = createPostgresUmzug();

  if (!yes) {
    const pendingMigrations = await umzug.pending();
    console.log('\nThe following migrations will be run:');
    pendingMigrations.forEach((pendingMigration) => {
      console.log(`- ${pendingMigration.file}`);
    });
    console.log('\n');

    const answer = await question(
      'Are you sure you want to run these migrations? Operation is permanent. [y/N] '
    );

    if (answer.toLowerCase() !== 'y') {
      process.exit(0);
    }
  }

  await runMigrationsAsync(umzug);

  process.exit(0);
}

// main
void run({
  yes: process.argv.includes('-y') || process.argv.includes('--yes'),
  force: process.argv.includes('--force'),
});
