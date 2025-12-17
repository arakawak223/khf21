/**
 * Supabaseマイグレーションスクリプト
 *
 * このスクリプトは、supabase/migrations/ ディレクトリ内のSQLファイルを
 * Supabaseデータベースに対して実行します。
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Supabaseクライアントの作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 指定されたSQLファイルを実行
 */
async function runMigrationFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Running migration: ${fileName}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');

    // SQLを実行（Supabase REST APIではrpc経由で実行する必要があります）
    // 注: anon keyではDDLを実行できない可能性があるため、service_role keyが必要
    console.log('⚠️  Warning: This script requires service_role key to execute DDL statements.');
    console.log('💡 Please run these migrations manually in Supabase Dashboard SQL Editor:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/_/sql`);
    console.log('\nSQL to execute:');
    console.log('---');
    console.log(sql.substring(0, 500) + (sql.length > 500 ? '...\n[truncated]' : ''));
    console.log('---\n');

    return { success: false, fileName, message: 'Manual execution required' };
  } catch (error) {
    console.error(`❌ Error reading ${fileName}:`, error.message);
    return { success: false, fileName, error: error.message };
  }
}

/**
 * マイグレーションを実行
 */
async function runMigrations() {
  console.log('🚀 Starting Supabase migrations...\n');

  const migrationsDir = path.join(__dirname, '../supabase/migrations');

  // マイグレーションファイルを取得してソート
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .filter(f => f.startsWith('20251213000005') ||
                 f.startsWith('20251213000006') ||
                 f.startsWith('20251213000007') ||
                 f.startsWith('20251213000008') ||
                 f.startsWith('20251213000009'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  No migration files found for encouragement_gratitude_scenarios');
    return;
  }

  console.log(`Found ${files.length} migration files to run:\n`);
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));

  const results = [];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const result = await runMigrationFile(filePath);
    results.push(result);
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 Migration Summary\n');

  console.log('❗ IMPORTANT: These migrations must be run manually in Supabase Dashboard');
  console.log('   Reason: anon key does not have permissions to execute DDL statements\n');

  console.log('📋 Steps to run migrations manually:');
  console.log('   1. Go to Supabase Dashboard SQL Editor:');
  console.log(`      ${supabaseUrl.replace('/rest/v1', '')}/project/_/sql`);
  console.log('   2. Copy and paste each SQL file content in order');
  console.log('   3. Execute each SQL file one by one\n');

  console.log('Migration files in order:');
  results.forEach((result, i) => {
    console.log(`   ${i + 1}. ${result.fileName}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Migration script completed');
  console.log('💡 Remember to run the SQL files manually in Supabase Dashboard!\n');
}

// スクリプト実行
runMigrations().catch(error => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});
