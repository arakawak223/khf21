const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  try {
    console.log('🔍 Checking encouragement_gratitude_scenarios table...\n');

    const { data, error, count } = await supabase
      .from('encouragement_gratitude_scenarios')
      .select('*', { count: 'exact', head: false })
      .limit(3);

    if (error) {
      console.log('❌ Table does not exist or error:', error.message);
      console.log('\n💡 You need to run migrations in Supabase Dashboard:');
      console.log('   1. Go to SQL Editor in your Supabase Dashboard');
      console.log('   2. Run the migration files in order (20251213000005 through 20251213000009)');
      return;
    }

    console.log('✅ Table exists!');
    console.log('📊 Total scenarios in database:', count);

    if (data && data.length > 0) {
      console.log('\n📝 Sample data:');
      data.forEach((item, i) => {
        console.log(`  ${i+1}. Category: ${item.category}, Trigger: ${item.trigger_type}`);
        if (item.background_story) {
          console.log(`     Story: ${item.background_story.substring(0, 50)}...`);
        }
      });
    } else {
      console.log('⚠️  Table exists but no data found. You may need to run data migration files.');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkTable();
