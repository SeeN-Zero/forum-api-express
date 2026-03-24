/* istanbul ignore file */
import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test', override: true });

const getPool = async () => {
  const { default: pool } = await import('../src/Infrastructures/database/postgres/pool.js');
  return pool;
};

const DatabaseTestHelper = {
  async getPool() {
    return getPool();
  },

  async connect() {
    const pool = await getPool();
    await pool.query('SELECT 1');
  },

  migrateSchema() {
    execSync('npm run migrate:test:up', {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' },
    });
  },

  async truncateAllTables() {
    const pool = await getPool();
    const tablesResult = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('pgmigrations', 'pgmigrations_lock')
    `);

    if (!tablesResult.rowCount) {
      return;
    }

    const tableNames = tablesResult.rows
      .map((row) => `"${row.tablename}"`)
      .join(', ');

    await pool.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`);
  },

  async closeConnection() {
    const pool = await getPool();
    await pool.end();
  },
};

export default DatabaseTestHelper;
