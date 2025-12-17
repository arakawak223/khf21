const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGameData() {
  console.log('🔍 ゲームデータの確認\n');

  try {
    // 空港データ
    const { data: airports, error: airportsError } = await supabase
      .from('airports')
      .select('*');

    if (airportsError) throw airportsError;
    console.log(`✈️  空港: ${airports.length}件`);
    if (airports.length > 0) {
      const countries = [...new Set(airports.map(a => a.country))];
      const cities = [...new Set(airports.map(a => a.city))];
      console.log(`   国: ${countries.length}種類`);
      console.log(`   都市: ${cities.length}種類`);
      console.log(`   サンプル: ${airports.slice(0, 3).map(a => `${a.city}, ${a.country}`).join(' | ')}`);
    }

    // 名所データ
    const { data: attractions, error: attractionsError } = await supabase
      .from('attractions')
      .select('*');

    if (attractionsError) throw attractionsError;
    console.log(`\n🏛️  名所: ${attractions.length}件`);
    if (attractions.length > 0) {
      const countries = [...new Set(attractions.map(a => a.country))];
      console.log(`   国: ${countries.length}種類`);
      console.log(`   サンプル: ${attractions.slice(0, 3).map(a => `${a.name_ja || a.name} (${a.country})`).join(' | ')}`);
      console.log(`   国リスト: ${countries.slice(0, 10).join(', ')}...`);
    }

    // アートデータ
    const { data: arts, error: artsError } = await supabase
      .from('arts')
      .select('*');

    if (artsError) throw artsError;
    console.log(`\n🎨 アート: ${arts.length}件`);
    if (arts.length > 0) {
      const cities = [...new Set(arts.map(a => a.city))];
      console.log(`   都市: ${cities.length}種類`);
      console.log(`   サンプル: ${arts.slice(0, 3).map(a => `${a.name_ja || a.name} (${a.city})`).join(' | ')}`);
      console.log(`   都市リスト: ${cities.slice(0, 10).join(', ')}...`);
    }

    // グルメデータ
    const { data: gourmets, error: gourmetsError } = await supabase
      .from('gourmet')
      .select('*');

    if (gourmetsError) throw gourmetsError;
    console.log(`\n🍽️  グルメ: ${gourmets.length}件`);
    if (gourmets.length > 0) {
      const countries = [...new Set(gourmets.map(g => g.country))];
      console.log(`   国: ${countries.length}種類`);
      console.log(`   サンプル: ${gourmets.slice(0, 3).map(g => `${g.name_ja || g.name} (${g.country})`).join(' | ')}`);
      console.log(`   国リスト: ${countries.slice(0, 10).join(', ')}...`);
    }

    // データ整合性チェック
    console.log('\n\n📊 データ整合性チェック\n');

    const airportCountries = [...new Set(airports.map(a => a.country))];
    const airportCities = [...new Set(airports.map(a => a.city))];
    const attractionCountries = [...new Set(attractions.map(a => a.country))];
    const artCities = [...new Set(arts.map(a => a.city))];
    const gourmetCountries = [...new Set(gourmets.map(g => g.country))];

    console.log('🔍 空港の国に対応する名所データの有無:');
    const missingAttractionCountries = airportCountries.filter(c => !attractionCountries.includes(c));
    if (missingAttractionCountries.length > 0) {
      console.log(`   ⚠️  名所データがない国 (${missingAttractionCountries.length}件): ${missingAttractionCountries.slice(0, 5).join(', ')}...`);
    } else {
      console.log('   ✅ すべての国に名所データあり');
    }

    console.log('\n🔍 空港の都市に対応するアートデータの有無:');
    const missingArtCities = airportCities.filter(c => !artCities.includes(c));
    if (missingArtCities.length > 0) {
      console.log(`   ⚠️  アートデータがない都市 (${missingArtCities.length}件): ${missingArtCities.slice(0, 5).join(', ')}...`);
    } else {
      console.log('   ✅ すべての都市にアートデータあり');
    }

    console.log('\n🔍 空港の国に対応するグルメデータの有無:');
    const missingGourmetCountries = airportCountries.filter(c => !gourmetCountries.includes(c));
    if (missingGourmetCountries.length > 0) {
      console.log(`   ⚠️  グルメデータがない国 (${missingGourmetCountries.length}件): ${missingGourmetCountries.slice(0, 5).join(', ')}...`);
    } else {
      console.log('   ✅ すべての国にグルメデータあり');
    }

    // 推奨事項
    console.log('\n\n💡 推奨事項\n');
    if (missingAttractionCountries.length > 0 || missingArtCities.length > 0 || missingGourmetCountries.length > 0) {
      console.log('⚠️  一部の空港に対応するデータがありません。');
      console.log('   これにより、到着時にランダムな地域のデータが表示される問題が発生します。');
      console.log('\n   解決方法:');
      console.log('   1. 不足している国・都市のデータをデータベースに追加');
      console.log('   2. または、空港の国・都市名をデータベース内の名所・アート・グルメの国・都市名に合わせる');
    } else {
      console.log('✅ データの整合性に問題はありません！');
    }

  } catch (err) {
    console.error('❌ エラー:', err.message);
  }
}

checkGameData();
