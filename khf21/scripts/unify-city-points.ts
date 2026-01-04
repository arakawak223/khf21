// 各都市の名所・アート・グルメのポイントを統一するスクリプト
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function unifyCityPoints() {
  console.log('🔄 各都市の名所・アート・グルメのポイントを統一します...\n');

  // 問題のある都市のアートを50ptに統一
  const citiesToFix = ['Barcelona', 'London', 'New York', 'Paris', 'Tokyo'];

  for (const city of citiesToFix) {
    console.log(`\n📍 ${city} を修正中...`);

    // この都市のアートを50ptに更新
    const { error: artsError } = await supabase
      .from('arts')
      .update({ impressed_points: 50 })
      .eq('city', city);

    if (artsError) {
      console.error(`  ❌ ${city}のアート更新エラー:`, artsError);
    } else {
      console.log(`  ✅ ${city}のアートを50ptに統一`);
    }
  }

  // Las Vegasは60ptのままなので、名所・グルメがあれば60ptに統一
  console.log('\n📍 Las Vegas を確認中...');
  const { data: lvAttractions } = await supabase
    .from('attractions')
    .select('*')
    .eq('city', 'Las Vegas');

  const { data: lvGourmet } = await supabase
    .from('gourmet')
    .select('*')
    .eq('city', 'Las Vegas');

  if (lvAttractions && lvAttractions.length > 0) {
    const { error } = await supabase
      .from('attractions')
      .update({ impressed_points: 60 })
      .eq('city', 'Las Vegas');
    if (!error) {
      console.log(`  ✅ Las Vegasの名所を60ptに統一`);
    }
  }

  if (lvGourmet && lvGourmet.length > 0) {
    const { error } = await supabase
      .from('gourmet')
      .update({ impressed_points: 60 })
      .eq('city', 'Las Vegas');
    if (!error) {
      console.log(`  ✅ Las Vegasのグルメを60ptに統一`);
    }
  }

  // Moscowは60ptのままなので、名所・グルメがあれば60ptに統一
  console.log('\n📍 Moscow を確認中...');
  const { data: mscAttractions } = await supabase
    .from('attractions')
    .select('*')
    .eq('city', 'Moscow');

  const { data: mscGourmet } = await supabase
    .from('gourmet')
    .select('*')
    .eq('city', 'Moscow');

  if (mscAttractions && mscAttractions.length > 0) {
    const { error } = await supabase
      .from('attractions')
      .update({ impressed_points: 60 })
      .eq('city', 'Moscow');
    if (!error) {
      console.log(`  ✅ Moscowの名所を60ptに統一`);
    }
  }

  if (mscGourmet && mscGourmet.length > 0) {
    const { error } = await supabase
      .from('gourmet')
      .update({ impressed_points: 60 })
      .eq('city', 'Moscow');
    if (!error) {
      console.log(`  ✅ Moscowのグルメを60ptに統一`);
    }
  }

  console.log('\n✅ 全都市のポイント統一が完了しました！');
  console.log('\n統一後の方針:');
  console.log('  - Barcelona, London, New York, Paris, Tokyo: 全て50pt');
  console.log('  - Las Vegas, Moscow: 全て60pt');
  console.log('  - その他の都市: 既に統一済み');
}

unifyCityPoints();
