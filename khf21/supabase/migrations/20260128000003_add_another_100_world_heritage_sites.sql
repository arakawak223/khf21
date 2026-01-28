-- Add another 100 UNESCO World Heritage Sites for better variety
-- Migration: 20260128000003_add_another_100_world_heritage_sites.sql

-- Natural Heritage Sites (50 sites)

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Serengeti National Park', 'セレンゲティ国立公園', 'world_heritage', 'Arusha', 'Tanzania', 93, '大移動で知られる広大なサバンナ。ライオン、ゾウ、キリンなどが自由に暮らす世界自然遺産。', ST_SetSRID(ST_MakePoint(34.8333, -2.3333), 4326), -2.3333, 34.8333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ngorongoro Conservation Area', 'ンゴロンゴロ保全地域', 'world_heritage', 'Arusha', 'Tanzania', 92, '巨大な火山のカルデラに広がる野生動物の楽園。クロサイなど希少動物が見られる世界複合遺産。', ST_SetSRID(ST_MakePoint(35.5833, -3.2167), 4326), -3.2167, 35.5833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kilimanjaro National Park', 'キリマンジャロ国立公園', 'world_heritage', 'Kilimanjaro', 'Tanzania', 91, 'アフリカ最高峰の雪を頂く山。赤道直下の氷河が神秘的な世界自然遺産。', ST_SetSRID(ST_MakePoint(37.3556, -3.0674), 4326), -3.0674, 37.3556);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Okavango Delta', 'オカバンゴ・デルタ', 'world_heritage', 'Maun', 'Botswana', 90, '砂漠に出現する奇跡の湿地帯。ゾウやカバが暮らす世界自然遺産。', ST_SetSRID(ST_MakePoint(22.9167, -19.2833), 4326), -19.2833, 22.9167);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Victoria Falls', 'ヴィクトリアの滝', 'world_heritage', 'Livingstone', 'Zambia', 94, '轟音とともに落ちる世界三大瀑布。「雷鳴の轟く水煙」と呼ばれる世界自然遺産。', ST_SetSRID(ST_MakePoint(25.8572, -17.9243), 4326), -17.9243, 25.8572);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Simien National Park', 'シミエン国立公園', 'world_heritage', 'Addis Ababa', 'Ethiopia', 87, 'エチオピア高原の絶景。希少なゲラダヒヒが生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(38.0000, 13.2500), 4326), 13.2500, 38.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Virunga National Park', 'ヴィルンガ国立公園', 'world_heritage', 'Goma', 'DR Congo', 89, 'アフリカ最古の国立公園。マウンテンゴリラの生息地である世界自然遺産。', ST_SetSRID(ST_MakePoint(29.4667, -0.9167), 4326), -0.9167, 29.4667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Bwindi Impenetrable National Park', 'ブウィンディ原生国立公園', 'world_heritage', 'Entebbe', 'Uganda', 88, '密林に暮らすマウンテンゴリラ。霧に包まれた原生林の世界自然遺産。', ST_SetSRID(ST_MakePoint(29.7167, -1.0667), 4326), -1.0667, 29.7167);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lake Malawi National Park', 'マラウイ湖国立公園', 'world_heritage', 'Lilongwe', 'Malawi', 84, '世界で最も透明度が高い湖の一つ。色とりどりの固有魚が泳ぐ世界自然遺産。', ST_SetSRID(ST_MakePoint(34.9000, -14.0167), 4326), -14.0167, 34.9000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Aldabra Atoll', 'アルダブラ環礁', 'world_heritage', 'Victoria', 'Seychelles', 91, '世界最大級の環礁。巨大なゾウガメが暮らす楽園の世界自然遺産。', ST_SetSRID(ST_MakePoint(46.4200, -9.4000), 4326), -9.4000, 46.4200);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Vallee de Mai Nature Reserve', 'ヴァレ・ド・メ自然保護区', 'world_heritage', 'Victoria', 'Seychelles', 86, '原始の森に巨大なヤシの実。伝説のエデンの園と呼ばれる世界自然遺産。', ST_SetSRID(ST_MakePoint(55.7392, -4.3333), 4326), -4.3333, 55.7392);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Pitons Management Area', 'ピトン管理地域', 'world_heritage', 'Castries', 'St Lucia', 85, 'カリブ海に聳える双子の火山。熱帯の海と山が織りなす世界自然遺産。', ST_SetSRID(ST_MakePoint(-61.0667, 13.8000), 4326), 13.8000, -61.0667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Morne Trois Pitons National Park', 'モーン・トロワ・ピトン国立公園', 'world_heritage', 'Roseau', 'Dominica', 83, '熱帯雨林と火山湖。沸騰する湖が見られる世界自然遺産。', ST_SetSRID(ST_MakePoint(-61.3500, 15.3667), 4326), 15.3667, -61.3500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Blue and John Crow Mountains', 'ブルー・アンド・ジョン・クロウ・マウンテンズ', 'world_heritage', 'Kingston', 'Jamaica', 82, 'ジャマイカの原生林。高品質なコーヒーが育つ山々の世界複合遺産。', ST_SetSRID(ST_MakePoint(-76.5000, 18.0500), 4326), 18.0500, -76.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Alejandro de Humboldt National Park', 'アレハンドロ・デ・フンボルト国立公園', 'world_heritage', 'Havana', 'Cuba', 84, 'カリブ海で最も生物多様性が高い地域。固有種の宝庫である世界自然遺産。', ST_SetSRID(ST_MakePoint(-75.0000, 20.5000), 4326), 20.5000, -75.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Viñales Valley', 'ビニャーレス渓谷', 'world_heritage', 'Havana', 'Cuba', 85, 'カルスト地形の奇岩群。伝統的な葉巻農園が広がる世界文化遺産。', ST_SetSRID(ST_MakePoint(-83.7333, 22.6167), 4326), 22.6167, -83.7333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sangay National Park', 'サンガイ国立公園', 'world_heritage', 'Quito', 'Ecuador', 86, 'アンデスの活火山と熱帯雨林。標高差6000mに広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-78.3333, -2.0000), 4326), -2.0000, -78.3333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Coiba National Park', 'コイバ国立公園', 'world_heritage', 'Panama City', 'Panama', 87, '太平洋の孤島。サメやクジラが見られる海洋生物の宝庫、世界自然遺産。', ST_SetSRID(ST_MakePoint(-81.7500, 7.3667), 4326), 7.3667, -81.7500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Monarch Butterfly Biosphere Reserve', 'モナルカ蝶生物圏保護区', 'world_heritage', 'Mexico City', 'Mexico', 88, '数億匹のオオカバマダラが集まる森。冬の蝶の大移動が見られる世界自然遺産。', ST_SetSRID(ST_MakePoint(-100.2500, 19.6000), 4326), 19.6000, -100.2500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Archipiélago de Revillagigedo', 'レビジャヒヘド諸島', 'world_heritage', 'La Paz', 'Mexico', 90, '太平洋の孤島群。マンタやハンマーヘッドの楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(-112.7833, 18.8167), 4326), 18.8167, -112.7833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Waterton Glacier International Peace Park', 'ウォータートン・グレイシャー国際平和自然公園', 'world_heritage', 'Calgary', 'Canada', 89, 'カナダとアメリカにまたがる氷河と山々。平和の象徴である世界自然遺産。', ST_SetSRID(ST_MakePoint(-113.9000, 48.9833), 4326), 48.9833, -113.9000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Wood Buffalo National Park', 'ウッド・バッファロー国立公園', 'world_heritage', 'Edmonton', 'Canada', 85, '北米最大の国立公園。野生バッファローとツルの繁殖地、世界自然遺産。', ST_SetSRID(ST_MakePoint(-112.0000, 59.5000), 4326), 59.5000, -112.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Dinosaur Provincial Park', 'ダイナソール州立公園', 'world_heritage', 'Calgary', 'Canada', 83, '恐竜化石の宝庫。バッドランドの荒涼とした風景が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-111.5000, 50.7667), 4326), 50.7667, -111.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Joggins Fossil Cliffs', 'ジョギンズ化石断崖', 'world_heritage', 'Halifax', 'Canada', 80, '石炭紀の化石が露出する断崖。生命の歴史を物語る世界自然遺産。', ST_SetSRID(ST_MakePoint(-64.4333, 45.7000), 4326), 45.7000, -64.4333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Papahānaumokuākea', 'パパハナウモクアケア', 'world_heritage', 'Honolulu', 'United States', 92, 'ハワイ北西部の島々。サンゴ礁と海洋生物の楽園、世界複合遺産。', ST_SetSRID(ST_MakePoint(-170.0000, 25.0000), 4326), 25.0000, -170.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mammoth Cave National Park', 'マンモス・ケーブ国立公園', 'world_heritage', 'Louisville', 'United States', 84, '世界最長の洞窟システム。600km以上の地下通路が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-86.1000, 37.1833), 4326), 37.1833, -86.1000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Carlsbad Caverns National Park', 'カールズバッド洞窟群国立公園', 'world_heritage', 'El Paso', 'United States', 86, '巨大な石灰岩洞窟。鍾乳石の巨大な部屋が圧巻の世界自然遺産。', ST_SetSRID(ST_MakePoint(-104.4433, 32.1755), 4326), 32.1755, -104.4433);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Waterton-Glacier International Peace Park', 'ウォータートン・グレイシャー国際平和公園', 'world_heritage', 'Kalispell', 'United States', 88, '米加国境の壮大な山岳地帯。氷河湖が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(-113.8000, 48.8000), 4326), 48.8000, -113.8000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Wrangell-St. Elias National Park', 'ランゲル=セント・イライアス国立公園', 'world_heritage', 'Anchorage', 'United States', 90, '北米最大の氷河地帯。アラスカの原生自然が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-142.9833, 61.4167), 4326), 61.4167, -142.9833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kluane National Park', 'クルアニー国立公園', 'world_heritage', 'Whitehorse', 'Canada', 89, 'カナダ最高峰と巨大氷河。グリズリーとダルシープの生息地、世界自然遺産。', ST_SetSRID(ST_MakePoint(-138.6667, 60.8333), 4326), 60.8333, -138.6667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Te Urewera', 'テ・ウレウェラ', 'world_heritage', 'Auckland', 'New Zealand', 84, 'マオリの聖地。原生林とタウポ湖が美しい地域。', ST_SetSRID(ST_MakePoint(177.1667, -38.5000), 4326), -38.5000, 177.1667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Fraser Island', 'フレーザー島', 'world_heritage', 'Brisbane', 'Australia', 87, '世界最大の砂の島。クリアな湖と熱帯雨林が共存する世界自然遺産。', ST_SetSRID(ST_MakePoint(153.1833, -25.2167), 4326), -25.2167, 153.1833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Wet Tropics of Queensland', 'クイーンズランドの湿潤熱帯地域', 'world_heritage', 'Cairns', 'Australia', 86, '世界最古の熱帯雨林。独特の動植物が生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(145.5000, -17.5000), 4326), -17.5000, 145.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Gondwana Rainforests', 'ゴンドワナ多雨林群', 'world_heritage', 'Brisbane', 'Australia', 85, '超大陸ゴンドワナ時代からの原生林。古代の植物が残る世界自然遺産。', ST_SetSRID(ST_MakePoint(153.2833, -28.2500), 4326), -28.2500, 153.2833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Purnululu National Park', 'パーヌルル国立公園', 'world_heritage', 'Perth', 'Australia', 88, '蜂の巣状の縞模様の奇岩群。バングル・バングルと呼ばれる世界自然遺産。', ST_SetSRID(ST_MakePoint(128.3667, -17.4833), 4326), -17.4833, 128.3667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Macquarie Island', 'マッコーリー島', 'world_heritage', 'Hobart', 'Australia', 83, '南極海の孤島。ペンギンとアザラシのコロニーが広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(158.9500, -54.6167), 4326), -54.6167, 158.9500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Heard and McDonald Islands', 'ハード島とマクドナルド諸島', 'world_heritage', 'Perth', 'Australia', 80, '南極海の火山島。ペンギンやアザラシが暮らす世界自然遺産。', ST_SetSRID(ST_MakePoint(73.5000, -53.1000), 4326), -53.1000, 73.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('New Zealand Sub-Antarctic Islands', 'ニュージーランドの亜南極諸島', 'world_heritage', 'Christchurch', 'New Zealand', 82, '南極海の孤島群。アホウドリなど海鳥の楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(166.1667, -50.5000), 4326), -50.5000, 166.1667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('East Rennell', 'イースト・レンネル', 'world_heritage', 'Honiara', 'Solomon Islands', 81, '世界最大の隆起環礁。テガノ湖と原生林が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(160.2500, -11.5833), 4326), -11.5833, 160.2500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Phoenix Islands Protected Area', 'フェニックス諸島保護地域', 'world_heritage', 'Tarawa', 'Kiribati', 89, '太平洋最大の海洋保護区。原始のサンゴ礁が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-171.0000, -3.7200), 4326), -3.7200, -171.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Rock Islands Southern Lagoon', 'ロック・アイランド群と南ラグーン', 'world_heritage', 'Koror', 'Palau', 91, 'マッシュルーム型の岩島群。ジェリーフィッシュレイクが有名な世界複合遺産。', ST_SetSRID(ST_MakePoint(134.4000, 7.3000), 4326), 7.3000, 134.4000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lagoons of New Caledonia', 'ニューカレドニアのラグーン', 'world_heritage', 'Noumea', 'France', 90, '世界第二位のバリアリーフ。多様なサンゴと海洋生物の楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(165.6180, -21.1151), 4326), -21.1151, 165.6180);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lord Howe Island Group', 'ロード・ハウ諸島群', 'world_heritage', 'Sydney', 'Australia', 85, '太平洋の楽園。固有種が多数生息する美しい島々の世界自然遺産。', ST_SetSRID(ST_MakePoint(159.0833, -31.5500), 4326), -31.5500, 159.0833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sub-Antarctic Islands of New Zealand', 'ニュージーランド亜南極諸島', 'world_heritage', 'Invercargill', 'New Zealand', 83, '荒涼とした亜南極の島々。アホウドリやペンギンの繁殖地、世界自然遺産。', ST_SetSRID(ST_MakePoint(166.2833, -50.5000), 4326), -50.5000, 166.2833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Three Parallel Rivers', '三江並流', 'world_heritage', 'Kunming', 'China', 91, '3つの大河が並行して流れる絶景。チベット高原から流れ出る世界自然遺産。', ST_SetSRID(ST_MakePoint(99.0000, 27.5000), 4326), 27.5000, 99.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('China Danxia', '中国丹霞', 'world_heritage', 'Guilin', 'China', 89, '赤い砂岩が織りなす奇観。虹色の山々が連なる世界自然遺産。', ST_SetSRID(ST_MakePoint(110.5000, 25.0000), 4326), 25.0000, 110.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('South China Karst', '中国南方カルスト', 'world_heritage', 'Guilin', 'China', 88, '石林や洞窟が連なるカルスト地形。桂林の山水画のような景観の世界自然遺産。', ST_SetSRID(ST_MakePoint(108.0000, 25.0000), 4326), 25.0000, 108.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sichuan Giant Panda Sanctuaries', '四川省ジャイアントパンダ保護区群', 'world_heritage', 'Chengdu', 'China', 92, '野生パンダの最大生息地。竹林と山々が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(103.0000, 31.0000), 4326), 31.0000, 103.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Tsingy de Bemaraha', 'ツィンギ・デ・ベマラハ', 'world_heritage', 'Antananarivo', 'Madagascar', 90, '石灰岩の針の森。刃のように尖った岩が連なる世界自然遺産。', ST_SetSRID(ST_MakePoint(44.7833, -18.6667), 4326), -18.6667, 44.7833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Atsinanana Rainforests', 'アツィナナナの雨林群', 'world_heritage', 'Antananarivo', 'Madagascar', 87, 'マダガスカルの原生林。固有種が90%を占める世界自然遺産。', ST_SetSRID(ST_MakePoint(48.5000, -18.0000), 4326), -18.0000, 48.5000);

-- Cultural Heritage Sites (50 sites)

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Forbidden City', '故宮', 'world_heritage', 'Beijing', 'China', 93, '明清王朝の王宮。9000を超える部屋を持つ世界最大の木造宮殿、世界文化遺産。', ST_SetSRID(ST_MakePoint(116.3972, 39.9163), 4326), 39.9163, 116.3972);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Temple of Heaven', '天壇', 'world_heritage', 'Beijing', 'China', 88, '明清の皇帝が天を祀った祭壇。美しい円形建築の世界文化遺産。', ST_SetSRID(ST_MakePoint(116.4074, 39.8826), 4326), 39.8826, 116.4074);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Summer Palace', '頤和園', 'world_heritage', 'Beijing', 'China', 87, '清朝の離宮。広大な庭園と湖が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(116.2734, 39.9993), 4326), 39.9993, 116.2734);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Terracotta Army', '秦始皇帝陵と兵馬俑', 'world_heritage', 'Xian', 'China', 95, '8000体もの等身大の兵士像。始皇帝の地下軍団、世界文化遺産。', ST_SetSRID(ST_MakePoint(109.2786, 34.3848), 4326), 34.3848, 109.2786);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Potala Palace', 'ポタラ宮', 'world_heritage', 'Lhasa', 'China', 92, 'チベット仏教の聖地。標高3700mに聳える白亜の宮殿、世界文化遺産。', ST_SetSRID(ST_MakePoint(91.1170, 29.6550), 4326), 29.6550, 91.1170);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mogao Caves', '莫高窟', 'world_heritage', 'Dunhuang', 'China', 90, '敦煌の仏教石窟群。492の洞窟に壁画と仏像が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(94.8036, 40.0408), 4326), 40.0408, 94.8036);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Longmen Grottoes', '龍門石窟', 'world_heritage', 'Luoyang', 'China', 89, '10万体以上の仏像が彫られた石窟群。巨大な盧舎那仏が圧巻の世界文化遺産。', ST_SetSRID(ST_MakePoint(112.4747, 34.5550), 4326), 34.5550, 112.4747);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lijiang Old Town', '麗江古城', 'world_heritage', 'Lijiang', 'China', 86, 'ナシ族の古都。石畳の路地と水路が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(100.2333, 26.8667), 4326), 26.8667, 100.2333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Pingyao Ancient City', '平遥古城', 'world_heritage', 'Taiyuan', 'China', 84, '明清時代の城壁都市。中国の金融街として栄えた世界文化遺産。', ST_SetSRID(ST_MakePoint(112.1667, 37.2000), 4326), 37.2000, 112.1667);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Dazu Rock Carvings', '大足石刻', 'world_heritage', 'Chongqing', 'China', 87, '数万体の仏教彫刻群。色彩豊かな磨崖仏が圧巻の世界文化遺産。', ST_SetSRID(ST_MakePoint(105.7333, 29.7000), 4326), 29.7000, 105.7333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Leshan Giant Buddha', '楽山大仏', 'world_heritage', 'Chengdu', 'China', 91, '世界最大の磨崖仏。高さ71mの巨大な石仏が川を見下ろす世界文化遺産。', ST_SetSRID(ST_MakePoint(103.7700, 29.5450), 4326), 29.5450, 103.7700);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Fujian Tulou', '福建土楼', 'world_heritage', 'Xiamen', 'China', 85, '客家の円形集合住宅。要塞のような土楼群が並ぶ世界文化遺産。', ST_SetSRID(ST_MakePoint(117.0000, 25.0000), 4326), 25.0000, 117.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Gyeongju Historic Areas', '慶州歴史地域', 'world_heritage', 'Busan', 'South Korea', 88, '新羅王朝の古都。古墳と仏教寺院が点在する世界文化遺産。', ST_SetSRID(ST_MakePoint(129.2247, 35.8422), 4326), 35.8422, 129.2247);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Himeji Castle', '姫路城', 'world_heritage', 'Osaka', 'Japan', 91, '白鷺城と呼ばれる美しい天守。日本の木造城郭建築の最高傑作、世界文化遺産。', ST_SetSRID(ST_MakePoint(134.6939, 34.8394), 4326), 34.8394, 134.6939);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Historic Monuments of Ancient Nara', '古都奈良の文化財', 'world_heritage', 'Osaka', 'Japan', 89, '奈良時代の寺社群。東大寺の大仏と鹿が有名な世界文化遺産。', ST_SetSRID(ST_MakePoint(135.8050, 34.6851), 4326), 34.6851, 135.8050);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Historic Monuments of Ancient Kyoto', '古都京都の文化財', 'world_heritage', 'Osaka', 'Japan', 92, '千年の都の寺社群。金閣寺、銀閣寺、清水寺など17の寺社が含まれる世界文化遺産。', ST_SetSRID(ST_MakePoint(135.7681, 35.0116), 4326), 35.0116, 135.7681);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hiroshima Peace Memorial', '原爆ドーム', 'world_heritage', 'Hiroshima', 'Japan', 88, '原爆の悲劇を伝える建物。平和への祈りを込めた世界文化遺産。', ST_SetSRID(ST_MakePoint(132.4536, 34.3955), 4326), 34.3955, 132.4536);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Itsukushima Shrine', '厳島神社', 'world_heritage', 'Hiroshima', 'Japan', 90, '海に浮かぶ大鳥居。満潮時の幻想的な景観が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(132.3197, 34.2956), 4326), 34.2956, 132.3197);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Nikko Shrines and Temples', '日光の社寺', 'world_heritage', 'Tokyo', 'Japan', 87, '徳川家康を祀る豪華絢爛な社寺群。東照宮の陽明門が有名な世界文化遺産。', ST_SetSRID(ST_MakePoint(139.5989, 36.7580), 4326), 36.7580, 139.5989);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Gusuku Sites of Okinawa', '琉球王国のグスク及び関連遺産群', 'world_heritage', 'Naha', 'Japan', 85, '琉球王国の城跡群。首里城など独特の文化が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(127.7195, 26.2171), 4326), 26.2171, 127.7195);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Iwami Ginzan', '石見銀山', 'world_heritage', 'Hiroshima', 'Japan', 83, '世界最大級の銀山遺跡。江戸時代に栄えた鉱山町の世界文化遺産。', ST_SetSRID(ST_MakePoint(132.4358, 35.1042), 4326), 35.1042, 132.4358);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hoi An Ancient Town', 'ホイアン旧市街', 'world_heritage', 'Da Nang', 'Vietnam', 88, 'ランタンが灯る古い港町。日本橋など多文化が融合した世界文化遺産。', ST_SetSRID(ST_MakePoint(108.3380, 15.8801), 4326), 15.8801, 108.3380);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('My Son Sanctuary', 'ミーソン聖域', 'world_heritage', 'Da Nang', 'Vietnam', 84, 'チャンパ王国のヒンドゥー遺跡群。密林に眠るレンガ造りの塔が並ぶ世界文化遺産。', ST_SetSRID(ST_MakePoint(108.1217, 15.7642), 4326), 15.7642, 108.1217);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Imperial City of Thang Long', 'タンロン遺跡', 'world_heritage', 'Hanoi', 'Vietnam', 82, 'ハノイの中心にある王宮跡。13世紀から続く都の遺跡、世界文化遺産。', ST_SetSRID(ST_MakePoint(105.8342, 21.0285), 4326), 21.0285, 105.8342);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Vat Phou', 'ワット・プー', 'world_heritage', 'Pakse', 'Laos', 83, 'クメール様式の寺院遺跡。山の中腹に建つ神秘的な世界文化遺産。', ST_SetSRID(ST_MakePoint(105.8167, 14.8333), 4326), 14.8333, 105.8167);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Prambanan Temple', 'プランバナン寺院', 'world_heritage', 'Yogyakarta', 'Indonesia', 90, 'ジャワ島最大のヒンドゥー寺院。尖塔が天を突く壮大な世界文化遺産。', ST_SetSRID(ST_MakePoint(110.4914, -7.7520), 4326), -7.7520, 110.4914);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sangiran Early Man Site', 'サンギラン初期人類遺跡', 'world_heritage', 'Solo', 'Indonesia', 78, 'ジャワ原人の化石が発見された遺跡。人類進化の謎を解く世界文化遺産。', ST_SetSRID(ST_MakePoint(110.8333, -7.4167), 4326), -7.4167, 110.8333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Melaka and George Town', 'マラッカとジョージタウン', 'world_heritage', 'Kuala Lumpur', 'Malaysia', 86, '東西貿易の拠点。多文化が融合した歴史的港町、世界文化遺産。', ST_SetSRID(ST_MakePoint(100.3500, 5.4145), 4326), 5.4145, 100.3500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hampi', 'ハンピ', 'world_heritage', 'Bangalore', 'India', 89, 'ヴィジャヤナガル王国の遺跡群。巨石と寺院が点在する世界文化遺産。', ST_SetSRID(ST_MakePoint(76.4600, 15.3350), 4326), 15.3350, 76.4600);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ajanta Caves', 'アジャンター石窟群', 'world_heritage', 'Mumbai', 'India', 90, '仏教壁画の宝庫。29の石窟に美しいフレスコ画が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(75.7033, 20.5519), 4326), 20.5519, 75.7033);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ellora Caves', 'エローラ石窟群', 'world_heritage', 'Mumbai', 'India', 91, '34の石窟寺院群。巨大な一枚岩から彫り出されたカイラーサナータ寺院が圧巻の世界文化遺産。', ST_SetSRID(ST_MakePoint(75.1794, 20.0267), 4326), 20.0267, 75.1794);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Khajuraho Temples', 'カジュラホ寺院群', 'world_heritage', 'Delhi', 'India', 87, '官能的な彫刻で知られる寺院群。ミトゥナ像が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(79.9192, 24.8318), 4326), 24.8318, 79.9192);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Konark Sun Temple', 'コナーラクの太陽神寺院', 'world_heritage', 'Bhubaneswar', 'India', 88, '巨大な馬車の形をした太陽神殿。精巧な彫刻が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(86.0950, 19.8876), 4326), 19.8876, 86.0950);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Fatehpur Sikri', 'ファテープル・シークリー', 'world_heritage', 'Agra', 'India', 86, 'ムガル帝国の都。赤砂岩で造られた宮殿都市の世界文化遺産。', ST_SetSRID(ST_MakePoint(77.6617, 27.0945), 4326), 27.0945, 77.6617);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Qutub Minar', 'クトゥブ・ミナール', 'world_heritage', 'Delhi', 'India', 85, 'デリーの巨大な石塔。高さ73mのミナレットが聳える世界文化遺産。', ST_SetSRID(ST_MakePoint(77.1855, 28.5244), 4326), 28.5244, 77.1855);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Red Fort', 'レッド・フォート', 'world_heritage', 'Delhi', 'India', 87, 'ムガル帝国の赤い城塞。デリーの象徴である世界文化遺産。', ST_SetSRID(ST_MakePoint(77.2410, 28.6562), 4326), 28.6562, 77.2410);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Jaipur City', 'ジャイプル旧市街', 'world_heritage', 'Jaipur', 'India', 86, 'ピンクシティと呼ばれる古都。整然とした街並みが美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(75.7873, 26.9124), 4326), 26.9124, 75.7873);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Anuradhapura', 'アヌラーダプラ', 'world_heritage', 'Colombo', 'Sri Lanka', 85, 'スリランカ最古の王都。巨大な仏塔と菩提樹が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(80.3833, 8.3114), 4326), 8.3114, 80.3833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Polonnaruwa', 'ポロンナルワ', 'world_heritage', 'Colombo', 'Sri Lanka', 84, '中世シンハラ王朝の都。巨大な仏像と遺跡群が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(81.0000, 7.9403), 4326), 7.9403, 81.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Dambulla Cave Temple', 'ダンブッラ石窟寺院', 'world_heritage', 'Colombo', 'Sri Lanka', 83, '5つの石窟に157体の仏像。壁画と彫刻が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(80.6481, 7.8567), 4326), 7.8567, 80.6481);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kathmandu Valley', 'カトマンズ盆地', 'world_heritage', 'Kathmandu', 'Nepal', 88, 'ネワール文化の中心地。7つの記念建造物群が点在する世界文化遺産。', ST_SetSRID(ST_MakePoint(85.3240, 27.7172), 4326), 27.7172, 85.3240);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lumbini', 'ルンビニ', 'world_heritage', 'Bhairahawa', 'Nepal', 89, '仏陀誕生の地。仏教の四大聖地の一つ、世界文化遺産。', ST_SetSRID(ST_MakePoint(83.2767, 27.4833), 4326), 27.4833, 83.2767);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Bagan Archaeological Zone', 'バガン考古学地域', 'world_heritage', 'Mandalay', 'Myanmar', 93, '3000以上の仏塔が立ち並ぶ平原。朝日に染まる景観が神秘的な世界文化遺産。', ST_SetSRID(ST_MakePoint(94.8580, 21.1717), 4326), 21.1717, 94.8580);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Shwedagon Pagoda', 'シュエダゴン・パゴダ', 'world_heritage', 'Yangon', 'Myanmar', 90, '黄金に輝く巨大仏塔。ミャンマー仏教の総本山、世界文化遺産候補。', ST_SetSRID(ST_MakePoint(96.1481, 16.7983), 4326), 16.7983, 96.1481);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kamphaeng Phet', 'カムペーン・ペッ', 'world_heritage', 'Bangkok', 'Thailand', 81, 'スコータイ王朝の城塞都市。仏教遺跡が森に眠る世界文化遺産。', ST_SetSRID(ST_MakePoint(99.5228, 16.4828), 4326), 16.4828, 99.5228);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ban Chiang', 'バン・チエン', 'world_heritage', 'Bangkok', 'Thailand', 79, '先史時代の遺跡。5000年前の土器が発掘された世界文化遺産。', ST_SetSRID(ST_MakePoint(103.2333, 17.3833), 4326), 17.3833, 103.2333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Preah Vihear', 'プレア・ヴィヒア寺院', 'world_heritage', 'Siem Reap', 'Cambodia', 87, '断崖に建つクメール寺院。タイとの国境に聳える世界文化遺産。', ST_SetSRID(ST_MakePoint(104.6833, 14.3933), 4326), 14.3933, 104.6833);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sambor Prei Kuk', 'サンボー・プレイ・クック', 'world_heritage', 'Phnom Penh', 'Cambodia', 82, 'アンコール以前のクメール遺跡群。密林に眠る煉瓦造りの寺院、世界文化遺産。', ST_SetSRID(ST_MakePoint(105.0333, 12.8667), 4326), 12.8667, 105.0333);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Rizal Park', 'リサール公園', 'world_heritage', 'Manila', 'Philippines', 75, 'フィリピン独立の象徴。リサール記念碑が立つ歴史的公園。', ST_SetSRID(ST_MakePoint(120.9842, 14.5833), 4326), 14.5833, 120.9842);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Bahla Fort', 'バハラ城塞', 'world_heritage', 'Muscat', 'Oman', 83, 'オマーン最古の城塞。泥レンガで造られた巨大な要塞、世界文化遺産。', ST_SetSRID(ST_MakePoint(57.3000, 22.9667), 4326), 22.9667, 57.3000);
