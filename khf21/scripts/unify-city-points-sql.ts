// SQL直接実行で各都市のポイントを統一
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function unifyCityPointsSQL() {
  console.log('🔄 SQL直接実行で各都市のポイントを統一します...\n');

  // Barcelona, London, New York, Paris, Tokyoのアートを50ptに
  const cities50 = ['Barcelona', 'London', 'New York', 'Paris', 'Tokyo'];

  for (const city of cities50) {
    console.log(`\n📍 ${city} を修正中...`);

    // まずデータを確認
    const { data: artsData } = await supabase
      .from('arts')
      .select('id, name_ja, city, impressed_points')
      .eq('city', city);

    if (artsData && artsData.length > 0) {
      console.log(`  📝 ${city}のアート: ${artsData.length}件`);

      // 各レコードを個別に更新
      for (const art of artsData) {
        console.log(`    - ${art.name_ja}: ${art.impressed_points}pt → 50pt`);

        if (art.impressed_points !== 50) {
          const { error: updateError } = await supabase
            .from('arts')
            .update({ impressed_points: 50 })
            .eq('id', art.id);

          if (updateError) {
            console.error(`      ❌ 更新エラー:`, updateError);
          } else {
            console.log(`      ✅ 更新成功`);
          }
        } else {
          console.log(`      ✅ 既に50pt`);
        }
      }
    } else {
      console.log(`  ℹ️ ${city}にはアートがありません`);
    }
  }

  console.log('\n✅ 全都市のポイント統一が完了しました！');
}

unifyCityPointsSQL();
