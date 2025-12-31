// 全データベースの名所・アート・グルメを確認
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllData() {
  console.log('🔍 全データを確認します...\n');

  // 全ての名所を取得
  const { data: attractions, count: attractionsCount } = await supabase
    .from('attractions')
    .select('*', { count: 'exact' })
    .order('city');

  console.log(`📍 名所: ${attractionsCount}件`);
  if (attractions && attractions.length > 0) {
    const pointsSet = new Set(attractions.map(a => a.impressed_points));
    console.log(`  ポイント種類: ${Array.from(pointsSet).sort((a, b) => a - b).join(', ')}pt`);

    // バラバラの場合は全て表示
    if (pointsSet.size > 1) {
      console.log(`  ⚠️ ポイントがバラバラです:`);
      attractions.forEach(a => {
        console.log(`    - ${a.city}: ${a.name_ja || a.name} = ${a.impressed_points}pt`);
      });
    }
  }

  console.log('');

  // 全てのアートを取得
  const { data: arts, count: artsCount } = await supabase
    .from('arts')
    .select('*', { count: 'exact' })
    .order('city');

  console.log(`🎭 アート: ${artsCount}件`);
  if (arts && arts.length > 0) {
    const pointsSet = new Set(arts.map(a => a.impressed_points));
    console.log(`  ポイント種類: ${Array.from(pointsSet).sort((a, b) => a - b).join(', ')}pt`);

    if (pointsSet.size > 1) {
      console.log(`  ⚠️ ポイントがバラバラです:`);
      arts.forEach(a => {
        console.log(`    - ${a.city}: ${a.name_ja || a.name} = ${a.impressed_points}pt`);
      });
    }
  }

  console.log('');

  // 全てのグルメを取得
  const { data: gourmet, count: gourmetCount } = await supabase
    .from('gourmet')
    .select('*', { count: 'exact' })
    .order('city');

  console.log(`🍽️ グルメ: ${gourmetCount}件`);
  if (gourmet && gourmet.length > 0) {
    const pointsSet = new Set(gourmet.map(g => g.impressed_points));
    console.log(`  ポイント種類: ${Array.from(pointsSet).sort((a, b) => a - b).join(', ')}pt`);

    if (pointsSet.size > 1) {
      console.log(`  ⚠️ ポイントがバラバラです:`);
      gourmet.forEach(g => {
        console.log(`    - ${g.city}: ${g.name_ja || g.name} = ${g.impressed_points}pt`);
      });
    }
  }

  console.log('\n📊 合計データ数:');
  console.log(`  名所: ${attractionsCount}件`);
  console.log(`  アート: ${artsCount}件`);
  console.log(`  グルメ: ${gourmetCount}件`);
  console.log(`  総計: ${(attractionsCount || 0) + (artsCount || 0) + (gourmetCount || 0)}件`);
}

checkAllData();
