import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LOCAL_SQLITE_DB_PATH = path.join(rootDir, '.data', 'healthcheck.sqlite');
const SERVERLESS_SQLITE_DB_PATH = path.join('/tmp', 'healthcheck.sqlite');

function getSqliteDbPath() {
  const configuredPath = process.env.SQLITE_DB_PATH?.trim();
  if (configuredPath) return configuredPath;

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) {
    return SERVERLESS_SQLITE_DB_PATH;
  }

  return LOCAL_SQLITE_DB_PATH;
}

function getPostgresConnectionString() {
  return process.env.SUBMISSIONS_POSTGRES_URL?.trim() || process.env.DATABASE_URL?.trim() || '';
}

function getDriver() {
  const configured = process.env.SUBMISSIONS_DB_DRIVER?.trim().toLowerCase();
  if (configured === 'postgres' || configured === 'sqlite') {
    return configured;
  }

  return getPostgresConnectionString() ? 'postgres' : 'sqlite';
}

function readMigrationSql(driver) {
  const migrationFile = path.join(rootDir, 'migrations', driver, '001_submissions.sql');
  return fs.readFileSync(migrationFile, 'utf8');
}

async function migratePostgres() {
  const connectionString = getPostgresConnectionString();
  if (!connectionString) {
    throw new Error('Missing Postgres connection string. Set SUBMISSIONS_POSTGRES_URL or DATABASE_URL.');
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.PGSSLMODE === 'disable' ? false : undefined,
  });

  try {
    const sql = readMigrationSql('postgres');
    await pool.query(sql);
    // eslint-disable-next-line no-console
    console.log('Postgres submissions migration applied.');
  } finally {
    await pool.end();
  }
}

function migrateSqlite() {
  const dbPath = getSqliteDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const database = new DatabaseSync(dbPath);
  try {
    const sql = readMigrationSql('sqlite');
    database.exec(sql);
    // eslint-disable-next-line no-console
    console.log(`SQLite submissions migration applied at ${dbPath}.`);
  } finally {
    database.close();
  }
}

async function main() {
  const driver = getDriver();
  if (driver === 'postgres') {
    await migratePostgres();
    return;
  }

  migrateSqlite();
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`Submissions migration failed: ${message}`);
  process.exit(1);
});
