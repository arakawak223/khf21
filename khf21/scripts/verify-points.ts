// ポイント数を確認するスクリプト
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPoints() {
  console.log('🔍 全ての名所・アート・グルメのポイント数を確認します...\n');

  // 名所の全データを取得
  const { data: attractions, error: attractionsError } = await supabase
    .from('attractions')
    .select('name, name_ja, impressed_points')
    .order('impressed_points', { ascending: false });

  if (attractionsError) {
    console.error('❌ 名所データ取得エラー:', attractionsError);
  } else {
    console.log('📍 名所（全データ）:');
    const uniquePoints = new Set(attractions?.map(a => a.impressed_points));
    console.log(`  総数: ${attractions?.length}件`);
    console.log(`  ユニークなポイント数: ${Array.from(uniquePoints).join(', ')}`);
    if (uniquePoints.size > 1) {
      console.log('  ⚠️ ポイントがバラバラです:');
      attractions?.forEach(a => {
        console.log(`    - ${a.name_ja || a.name}: ${a.impressed_points}pt`);
      });
    } else {
      console.log(`  ✅ 全て ${attractions?.[0]?.impressed_points}pt に統一されています`);
    }
  }

  console.log('');

  // アートの全データを取得
  const { data: arts, error: artsError } = await supabase
    .from('arts')
    .select('name, name_ja, impressed_points')
    .order('impressed_points', { ascending: false });

  if (artsError) {
    console.error('❌ アートデータ取得エラー:', artsError);
  } else {
    console.log('🎭 アート（全データ）:');
    const uniquePoints = new Set(arts?.map(a => a.impressed_points));
    console.log(`  総数: ${arts?.length}件`);
    console.log(`  ユニークなポイント数: ${Array.from(uniquePoints).join(', ')}`);
    if (uniquePoints.size > 1) {
      console.log('  ⚠️ ポイントがバラバラです:');
      arts?.forEach(a => {
        console.log(`    - ${a.name_ja || a.name}: ${a.impressed_points}pt`);
      });
    } else {
      console.log(`  ✅ 全て ${arts?.[0]?.impressed_points}pt に統一されています`);
    }
  }

  console.log('');

  // グルメの全データを取得
  const { data: gourmet, error: gourmetError } = await supabase
    .from('gourmet')
    .select('name, name_ja, impressed_points')
    .order('impressed_points', { ascending: false });

  if (gourmetError) {
    console.error('❌ グルメデータ取得エラー:', gourmetError);
  } else {
    console.log('🍽️ グルメ（全データ）:');
    const uniquePoints = new Set(gourmet?.map(g => g.impressed_points));
    console.log(`  総数: ${gourmet?.length}件`);
    console.log(`  ユニークなポイント数: ${Array.from(uniquePoints).join(', ')}`);
    if (uniquePoints.size > 1) {
      console.log('  ⚠️ ポイントがバラバラです:');
      gourmet?.forEach(g => {
        console.log(`    - ${g.name_ja || g.name}: ${g.impressed_points}pt`);
      });
    } else {
      console.log(`  ✅ 全て ${gourmet?.[0]?.impressed_points}pt に統一されています`);
    }
  }
}

verifyPoints();
