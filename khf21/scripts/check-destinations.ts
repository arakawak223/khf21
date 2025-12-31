// 各都市の名所・アート・グルメを確認するスクリプト
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDestinations() {
  console.log('🌍 各目的地の名所・アート・グルメを確認します...\n');

  // 名所を都市別に取得
  const { data: attractions } = await supabase
    .from('attractions')
    .select('city, name_ja, impressed_points')
    .order('city');

  // アートを都市別に取得
  const { data: arts } = await supabase
    .from('arts')
    .select('city, name_ja, impressed_points')
    .order('city');

  // グルメを都市別に取得
  const { data: gourmet } = await supabase
    .from('gourmet')
    .select('city, name_ja, impressed_points')
    .order('city');

  // 都市ごとにグループ化
  const citiesMap = new Map<string, {
    attractions: any[],
    arts: any[],
    gourmet: any[]
  }>();

  attractions?.forEach(a => {
    if (!citiesMap.has(a.city)) {
      citiesMap.set(a.city, { attractions: [], arts: [], gourmet: [] });
    }
    citiesMap.get(a.city)!.attractions.push(a);
  });

  arts?.forEach(a => {
    if (!citiesMap.has(a.city)) {
      citiesMap.set(a.city, { attractions: [], arts: [], gourmet: [] });
    }
    citiesMap.get(a.city)!.arts.push(a);
  });

  gourmet?.forEach(g => {
    if (!citiesMap.has(g.city)) {
      citiesMap.set(g.city, { attractions: [], arts: [], gourmet: [] });
    }
    citiesMap.get(g.city)!.gourmet.push(g);
  });

  // 都市ごとに表示
  Array.from(citiesMap.keys()).sort().forEach(city => {
    const data = citiesMap.get(city)!;
    console.log(`\n📍 ${city}:`);

    if (data.attractions.length > 0) {
      console.log('  名所:');
      data.attractions.forEach(a => {
        console.log(`    - ${a.name_ja}: ${a.impressed_points}pt`);
      });
    }

    if (data.arts.length > 0) {
      console.log('  アート:');
      data.arts.forEach(a => {
        console.log(`    - ${a.name_ja}: ${a.impressed_points}pt`);
      });
    }

    if (data.gourmet.length > 0) {
      console.log('  グルメ:');
      data.gourmet.forEach(g => {
        console.log(`    - ${g.name_ja}: ${g.impressed_points}pt`);
      });
    }

    // ポイント数の統一状況をチェック
    const allPoints = [
      ...data.attractions.map(a => a.impressed_points),
      ...data.arts.map(a => a.impressed_points),
      ...data.gourmet.map(g => g.impressed_points)
    ];
    const uniquePoints = new Set(allPoints);

    if (uniquePoints.size > 1) {
      console.log(`  ⚠️ この都市のポイントはバラバラです: ${Array.from(uniquePoints).join(', ')}pt`);
    } else if (allPoints.length > 0) {
      console.log(`  ✅ この都市は全て ${allPoints[0]}pt に統一されています`);
    }
  });

  console.log('\n\n📊 統計:');
  console.log(`総都市数: ${citiesMap.size}`);
  console.log(`名所総数: ${attractions?.length || 0}`);
  console.log(`アート総数: ${arts?.length || 0}`);
  console.log(`グルメ総数: ${gourmet?.length || 0}`);
}

checkDestinations();
