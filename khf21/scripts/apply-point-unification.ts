// 名所・アート・グルメのポイント均一化スクリプト
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// .env.localを読み込む
const envPath = path.join(process.cwd(), '.env.local');
console.log('📂 環境変数ファイルパス:', envPath);
console.log('📂 ファイル存在確認:', fs.existsSync(envPath));

dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('🔑 Supabase URL:', supabaseUrl);
console.log('🔑 Key available:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('Keys checked:', {
    SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    PUBLISHABLE: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function unifyPoints() {
  console.log('🔄 名所・アート・グルメのポイントを均一化します...\n');

  try {
    // 名所を50ptに統一
    console.log('📍 名所のポイントを50ptに統一中...');
    const { error: attractionsError } = await supabase
      .from('attractions')
      .update({ impressed_points: 50 })
      .neq('impressed_points', 50);

    if (attractionsError) {
      console.error('❌ 名所の更新エラー:', attractionsError);
    } else {
      console.log('✅ 名所のポイントを50ptに統一しました');
    }

    // アートを60ptに統一
    console.log('🎭 アートのポイントを60ptに統一中...');
    const { error: artsError } = await supabase
      .from('arts')
      .update({ impressed_points: 60 })
      .neq('impressed_points', 60);

    if (artsError) {
      console.error('❌ アートの更新エラー:', artsError);
    } else {
      console.log('✅ アートのポイントを60ptに統一しました');
    }

    // グルメを50ptに統一
    console.log('🍽️  グルメのポイントを50ptに統一中...');
    const { error: gourmetError } = await supabase
      .from('gourmet')
      .update({ impressed_points: 50 })
      .neq('impressed_points', 50);

    if (gourmetError) {
      console.error('❌ グルメの更新エラー:', gourmetError);
    } else {
      console.log('✅ グルメのポイントを50ptに統一しました');
    }

    // 確認
    console.log('\n📊 更新後のポイント数を確認中...');

    const { data: attractions } = await supabase
      .from('attractions')
      .select('impressed_points')
      .limit(5);

    const { data: arts } = await supabase
      .from('arts')
      .select('impressed_points')
      .limit(5);

    const { data: gourmet } = await supabase
      .from('gourmet')
      .select('impressed_points')
      .limit(5);

    console.log('\n結果:');
    console.log('名所のポイント (サンプル):', attractions?.map(a => a.impressed_points));
    console.log('アートのポイント (サンプル):', arts?.map(a => a.impressed_points));
    console.log('グルメのポイント (サンプル):', gourmet?.map(g => g.impressed_points));

    console.log('\n✅ 全ての更新が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

unifyPoints();
