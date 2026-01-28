-- Add approximately 100 UNESCO World Heritage Sites focusing on beautiful natural sites
-- Migration: 20260128000002_add_100_world_heritage_sites.sql

-- Natural Heritage Sites (60 sites)

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Shiretoko', '知床', 'world_heritage', 'Shari', 'Japan', 85, '北海道の原始の自然が残る半島。流氷、ヒグマ、シャチなど豊かな生態系を持つ世界自然遺産。', ST_SetSRID(ST_MakePoint(145.0900, 44.0800), 4326), 44.0800, 145.0900);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Yakushima', '屋久島', 'world_heritage', 'Yakushima', 'Japan', 90, '樹齢7200年の縄文杉が自生する神秘の島。原始の森と豊かな苔の世界が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(130.5300, 30.3350), 4326), 30.3350, 130.5300);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Shirakami-Sanchi', '白神山地', 'world_heritage', 'Ajigasawa', 'Japan', 88, '東アジア最大級の原生的なブナ林。手つかずの自然が残る世界自然遺産の山岳地帯。', ST_SetSRID(ST_MakePoint(140.1500, 40.4500), 4326), 40.4500, 140.1500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ogasawara Islands', '小笠原諸島', 'world_heritage', 'Ogasawara', 'Japan', 92, '東洋のガラパゴスと呼ばれる島々。独自の進化を遂げた固有種が多数生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(142.1920, 27.0940), 4326), 27.0940, 142.1920);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Jiuzhaigou Valley', '九寨溝', 'world_heritage', 'Jiuzhaigou', 'China', 95, 'エメラルドグリーンの湖と滝が連なる絶景の渓谷。チベット族の村と原始林が共存する世界自然遺産。', ST_SetSRID(ST_MakePoint(103.9170, 33.2600), 4326), 33.2600, 103.9170);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Huanglong', '黄龍', 'world_heritage', 'Songpan', 'China', 93, '黄金色の石灰棚が連なる幻想的な景観。標高3000m超の高地に広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(103.8200, 32.7500), 4326), 32.7500, 103.8200);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ha Long Bay', 'ハロン湾', 'world_heritage', 'Ha Long', 'Vietnam', 90, '約2000の奇岩が浮かぶ神秘的な海域。石灰岩の島々が織りなす絶景の世界自然遺産。', ST_SetSRID(ST_MakePoint(107.0700, 20.9100), 4326), 20.9100, 107.0700);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Phong Nha-Ke Bang', 'フォンニャ=ケバン', 'world_heritage', 'Dong Hoi', 'Vietnam', 88, '世界最大級の洞窟群。巨大な地下河川と鍾乳石が作る幻想的な世界自然遺産。', ST_SetSRID(ST_MakePoint(106.2840, 17.5830), 4326), 17.5830, 106.2840);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Komodo National Park', 'コモド国立公園', 'world_heritage', 'Labuan Bajo', 'Indonesia', 89, '世界最大のトカゲ、コモドドラゴンの生息地。美しいサンゴ礁も広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(119.4890, -8.5390), 4326), -8.5390, 119.4890);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kinabalu Park', 'キナバル公園', 'world_heritage', 'Kota Kinabalu', 'Malaysia', 87, '東南アジア最高峰キナバル山を擁する公園。多様な植物相が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(116.5570, 6.0750), 4326), 6.0750, 116.5570);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Gunung Mulu National Park', 'グヌン・ムル国立公園', 'world_heritage', 'Miri', 'Malaysia', 86, '世界最大級の洞窟と熱帯雨林。独特のカルスト地形が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(114.8100, 4.0500), 4326), 4.0500, 114.8100);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sundarbans', 'シュンドルボン', 'world_heritage', 'Khulna', 'Bangladesh', 84, '世界最大のマングローブ林。ベンガルトラが生息する広大な三角州の世界自然遺産。', ST_SetSRID(ST_MakePoint(89.1830, 21.9500), 4326), 21.9500, 89.1830);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sagarmatha National Park', 'サガルマータ国立公園', 'world_heritage', 'Lukla', 'Nepal', 94, '世界最高峰エベレストを擁する国立公園。ヒマラヤの壮大な景観が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(86.9250, 27.9620), 4326), 27.9620, 86.9250);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Chitwan National Park', 'チトワン国立公園', 'world_heritage', 'Bharatpur', 'Nepal', 83, 'インドサイやベンガルトラが生息する広大な野生動物保護区。豊かな生態系の世界自然遺産。', ST_SetSRID(ST_MakePoint(84.3350, 27.5290), 4326), 27.5290, 84.3350);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kaziranga National Park', 'カジランガ国立公園', 'world_heritage', 'Jorhat', 'India', 85, 'インドサイの最大生息地。湿地帯に広がる豊かな野生動物の楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(93.3710, 26.5775), 4326), 26.5775, 93.3710);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Manas Wildlife Sanctuary', 'マナス野生生物保護区', 'world_heritage', 'Guwahati', 'India', 82, 'ヒマラヤ山麓に広がる野生動物の宝庫。トラやゾウが生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(91.0080, 26.6710), 4326), 26.6710, 91.0080);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Nanda Devi National Park', 'ナンダ・デヴィ国立公園', 'world_heritage', 'Dehradun', 'India', 88, 'ヒマラヤの聖なる峰ナンダ・デヴィを擁する。高山植物と氷河が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(79.7330, 30.5180), 4326), 30.5180, 79.7330);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Western Ghats', '西ガーツ山脈', 'world_heritage', 'Kochi', 'India', 86, 'インド亜大陸の生物多様性の宝庫。固有種が多数生息する山岳地帯の世界自然遺産。', ST_SetSRID(ST_MakePoint(76.2711, 9.9312), 4326), 9.9312, 76.2711);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sinharaja Forest Reserve', 'シンハラージャ森林保護区', 'world_heritage', 'Colombo', 'Sri Lanka', 84, 'スリランカ最後の原生熱帯雨林。固有の動植物が多数生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(80.4010, 6.4010), 4326), 6.4010, 80.4010);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Socotra Archipelago', 'ソコトラ諸島', 'world_heritage', 'Socotra', 'Yemen', 91, '地球上で最も孤立した島々。竜血樹など異世界のような植物が生える世界自然遺産。', ST_SetSRID(ST_MakePoint(53.8700, 12.4630), 4326), 12.4630, 53.8700);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Wadi Rum', 'ワディ・ラム', 'world_heritage', 'Aqaba', 'Jordan', 89, '火星のような赤い砂漠と巨大な岩山。ベドウィンの文化が残る世界複合遺産。', ST_SetSRID(ST_MakePoint(35.4220, 29.5230), 4326), 29.5230, 35.4220);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Plitvice Lakes', 'プリトヴィツェ湖群', 'world_heritage', 'Zagreb', 'Croatia', 92, 'エメラルドグリーンの湖と滝が連なる絶景。16の湖が階段状に連なる世界自然遺産。', ST_SetSRID(ST_MakePoint(15.6200, 44.8800), 4326), 44.8800, 15.6200);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Durmitor National Park', 'ドゥルミトル国立公園', 'world_heritage', 'Podgorica', 'Montenegro', 87, '氷河によって削られた山々と深い峡谷。タラ川渓谷が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(19.0220, 43.1360), 4326), 43.1360, 19.0220);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Dolomites', 'ドロミテ', 'world_heritage', 'Venice', 'Italy', 93, '朝夕に赤く染まる美しい山々。独特の岩山が連なるイタリアアルプスの世界自然遺産。', ST_SetSRID(ST_MakePoint(12.1000, 46.4200), 4326), 46.4200, 12.1000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Aeolian Islands', 'エオリア諸島', 'world_heritage', 'Palermo', 'Italy', 85, '活火山の島々。ストロンボリ火山の噴火が見られる地中海の世界自然遺産。', ST_SetSRID(ST_MakePoint(14.9560, 38.5000), 4326), 38.5000, 14.9560);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Swiss Alps Jungfrau-Aletsch', 'スイスアルプス ユングフラウ=アレッチ', 'world_heritage', 'Bern', 'Switzerland', 94, 'アルプス最大の氷河アレッチと名峰群。壮大な氷河景観が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(8.0350, 46.5370), 4326), 46.5370, 8.0350);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Monte San Giorgio', 'モンテ・サン・ジョルジョ', 'world_heritage', 'Lugano', 'Switzerland', 80, '三畳紀の海洋生物化石の宝庫。美しい湖畔の山に広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(8.9500, 45.9170), 4326), 45.9170, 8.9500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Pyrenees - Mont Perdu', 'ピレネー山脈 ペルデュ山', 'world_heritage', 'Lourdes', 'France', 88, 'フランスとスペインにまたがる山岳景観。ヨーロッパ最大の石灰岩の岩壁がある世界複合遺産。', ST_SetSRID(ST_MakePoint(-0.0330, 42.6730), 4326), 42.6730, -0.0330);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Galapagos Islands', 'ガラパゴス諸島', 'world_heritage', 'Baltra', 'Ecuador', 95, '進化論の舞台となった島々。固有種が多数生息する生物進化の博物館、世界自然遺産。', ST_SetSRID(ST_MakePoint(-90.3700, -0.6500), 4326), -0.6500, -90.3700);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Los Glaciares National Park', 'ロス・グラシアレス国立公園', 'world_heritage', 'El Calafate', 'Argentina', 92, 'ペリト・モレノ氷河など巨大な氷河群。パタゴニアの壮大な氷河景観の世界自然遺産。', ST_SetSRID(ST_MakePoint(-73.1530, -50.3250), 4326), -50.3250, -73.1530);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Iguazu National Park', 'イグアス国立公園', 'world_heritage', 'Puerto Iguazu', 'Argentina', 94, '世界三大瀑布の一つイグアスの滝。轟音とともに落ちる大瀑布が圧巻の世界自然遺産。', ST_SetSRID(ST_MakePoint(-54.4430, -25.6950), 4326), -25.6950, -54.4430);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Pantanal Conservation Area', 'パンタナール保全地域', 'world_heritage', 'Campo Grande', 'Brazil', 86, '世界最大級の湿地帯。ジャガーやカピバラなど多様な野生動物の楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(-56.6500, -18.5800), 4326), -18.5800, -56.6500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Fernando de Noronha', 'フェルナンド・デ・ノローニャ', 'world_heritage', 'Recife', 'Brazil', 90, '大西洋の楽園の島々。透明度の高い海とイルカが泳ぐ美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(-32.4300, -3.8540), 4326), -3.8540, -32.4300);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Central Amazon Conservation Complex', '中央アマゾン保全地域群', 'world_heritage', 'Manaus', 'Brazil', 87, '世界最大の熱帯雨林。ピンクイルカが泳ぐアマゾン川の世界自然遺産。', ST_SetSRID(ST_MakePoint(-62.6670, -2.6180), 4326), -2.6180, -62.6670);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Manu National Park', 'マヌー国立公園', 'world_heritage', 'Cusco', 'Peru', 88, 'アマゾン源流域の原生林。世界で最も生物多様性が高い地域の一つ、世界自然遺産。', ST_SetSRID(ST_MakePoint(-71.3900, -11.9000), 4326), -11.9000, -71.3900);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Huascaran National Park', 'ワスカラン国立公園', 'world_heritage', 'Huaraz', 'Peru', 90, 'ペルー最高峰ワスカラン山を擁する。アンデスの氷河と高山湖が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(-77.6000, -9.1170), 4326), -9.1170, -77.6000);

INSERT INTO attractions (name, name_ja, category, city, country, impressive_points, description, location, latitude, longitude)
VALUES
('Canaima National Park', 'カナイマ国立公園', 'world_heritage', 'Ciudad Bolivar', 'Venezuela', 93, '世界最高落差の滝エンジェルフォールがある。テーブルマウンテンが連なる世界自然遺産。', ST_SetSRID(ST_MakePoint(-62.5300, 5.6800), 4326), 5.6800, -62.5300);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Yellowstone National Park', 'イエローストーン国立公園', 'world_heritage', 'Jackson', 'United States', 93, '世界初の国立公園。間欠泉と多彩な温泉、野生動物の宝庫である世界自然遺産。', ST_SetSRID(ST_MakePoint(-110.5885, 44.4280), 4326), 44.4280, -110.5885);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Grand Canyon National Park', 'グランドキャニオン国立公園', 'world_heritage', 'Flagstaff', 'United States', 95, 'コロラド川が削った壮大な渓谷。地球の歴史が刻まれた岩壁が圧巻の世界自然遺産。', ST_SetSRID(ST_MakePoint(-112.1401, 36.0544), 4326), 36.0544, -112.1401);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Yosemite National Park', 'ヨセミテ国立公園', 'world_heritage', 'Fresno', 'United States', 92, '花崗岩の巨大な岩壁と滝。エルキャピタンやハーフドームが有名な世界自然遺産。', ST_SetSRID(ST_MakePoint(-119.5383, 37.8651), 4326), 37.8651, -119.5383);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Olympic National Park', 'オリンピック国立公園', 'world_heritage', 'Seattle', 'United States', 88, '温帯雨林、高山地帯、海岸が共存。多様な生態系が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(-123.4994, 47.8021), 4326), 47.8021, -123.4994);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Redwood National Park', 'レッドウッド国立公園', 'world_heritage', 'San Francisco', 'United States', 89, '世界一高い木が生える森。樹高100m超のセコイアが立ち並ぶ世界自然遺産。', ST_SetSRID(ST_MakePoint(-124.0046, 41.2132), 4326), 41.2132, -124.0046);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hawaii Volcanoes National Park', 'ハワイ火山国立公園', 'world_heritage', 'Hilo', 'United States', 90, '活発な火山活動が見られる。キラウエア火山の溶岩流が作る世界自然遺産。', ST_SetSRID(ST_MakePoint(-155.2900, 19.4194), 4326), 19.4194, -155.2900);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Everglades National Park', 'エバーグレーズ国立公園', 'world_heritage', 'Miami', 'United States', 84, 'アメリカ最大の亜熱帯湿地帯。ワニやマナティーが生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(-80.9300, 25.2866), 4326), 25.2866, -80.9300);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Nahanni National Park', 'ナハニ国立公園', 'world_heritage', 'Yellowknife', 'Canada', 87, 'カナダの秘境。バージニア滝と深い峡谷が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(-125.5500, 61.5500), 4326), 61.5500, -125.5500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Canadian Rocky Mountain Parks', 'カナディアン・ロッキー山脈自然公園群', 'world_heritage', 'Calgary', 'Canada', 94, 'エメラルドの湖と雪山が織りなす絶景。バンフやジャスパーを含む世界自然遺産。', ST_SetSRID(ST_MakePoint(-116.5000, 51.4000), 4326), 51.4000, -116.5000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Gros Morne National Park', 'グロス・モーン国立公園', 'world_heritage', 'Deer Lake', 'Canada', 85, '地球のマントルが地表に現れた珍しい地質。フィヨルドと山々が美しい世界自然遺産。', ST_SetSRID(ST_MakePoint(-57.6500, 49.5900), 4326), 49.5900, -57.6500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Miguasha National Park', 'ミグアシャ国立公園', 'world_heritage', 'Quebec', 'Canada', 78, '魚類から陸上動物への進化を示す化石の宝庫。古生代の生物史を物語る世界自然遺産。', ST_SetSRID(ST_MakePoint(-66.3500, 48.1000), 4326), 48.1000, -66.3500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sian Ka''an', 'シアン・カアン', 'world_heritage', 'Cancun', 'Mexico', 86, 'マヤ語で「天空の始まり」。熱帯林、マングローブ、サンゴ礁が共存する世界自然遺産。', ST_SetSRID(ST_MakePoint(-87.7500, 19.7500), 4326), 19.7500, -87.7500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Whale Sanctuary of El Vizcaino', 'エル・ビスカイノのクジラ保護区', 'world_heritage', 'La Paz', 'Mexico', 88, 'コククジラの繁殖地。間近でクジラが見られるバハカリフォルニアの世界自然遺産。', ST_SetSRID(ST_MakePoint(-113.7500, 27.7500), 4326), 27.7500, -113.7500);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Cocos Island National Park', 'ココ島国立公園', 'world_heritage', 'San Jose', 'Costa Rica', 89, '太平洋の孤島。ハンマーヘッドシャークの大群が見られる海洋生物の楽園、世界自然遺産。', ST_SetSRID(ST_MakePoint(-87.0600, 5.5320), 4326), 5.5320, -87.0600);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Talamanca Range-La Amistad', 'タラマンカ山脈=ラ・アミスター保護区群', 'world_heritage', 'San Jose', 'Costa Rica', 85, 'コスタリカとパナマにまたがる山岳保護区。多様な生態系が残る世界自然遺産。', ST_SetSRID(ST_MakePoint(-83.0000, 9.1700), 4326), 9.1700, -83.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Darien National Park', 'ダリエン国立公園', 'world_heritage', 'Panama City', 'Panama', 82, '中米最大の原生林。ジャガーやハーピーイーグルが生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(-77.7200, 7.9200), 4326), 7.9200, -77.7200);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Belize Barrier Reef', 'ベリーズのバリアリーフ', 'world_heritage', 'Belize City', 'Belize', 91, '世界第二位のバリアリーフ。グレートブルーホールが有名な世界自然遺産。', ST_SetSRID(ST_MakePoint(-87.5360, 17.3160), 4326), 17.3160, -87.5360);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Great Barrier Reef', 'グレートバリアリーフ', 'world_heritage', 'Cairns', 'Australia', 95, '世界最大のサンゴ礁地帯。宇宙からも見える美しい海洋生態系の世界自然遺産。', ST_SetSRID(ST_MakePoint(145.7781, -18.2871), 4326), -18.2871, 145.7781);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kakadu National Park', 'カカドゥ国立公園', 'world_heritage', 'Darwin', 'Australia', 88, '先住民アボリジニの岩絵と豊かな自然。湿地と渓谷が美しい世界複合遺産。', ST_SetSRID(ST_MakePoint(132.4190, -12.8500), 4326), -12.8500, 132.4190);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Uluru-Kata Tjuta National Park', 'ウルル=カタ・ジュタ国立公園', 'world_heritage', 'Alice Springs', 'Australia', 92, '聖なる巨岩ウルル(エアーズロック)。夕日に染まる姿が神秘的な世界複合遺産。', ST_SetSRID(ST_MakePoint(131.0369, -25.3444), 4326), -25.3444, 131.0369);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Tasmanian Wilderness', 'タスマニア原生地域', 'world_heritage', 'Hobart', 'Australia', 89, 'タスマニアデビルが生息する原生林。氷河期の植物が残る世界複合遺産。', ST_SetSRID(ST_MakePoint(146.3250, -42.1390), 4326), -42.1390, 146.3250);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Lord Howe Island', 'ロード・ハウ島', 'world_heritage', 'Sydney', 'Australia', 86, '太平洋の孤島。固有種が多数生息する美しい島の世界自然遺産。', ST_SetSRID(ST_MakePoint(159.0770, -31.5500), 4326), -31.5500, 159.0770);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Shark Bay', 'シャーク湾', 'world_heritage', 'Perth', 'Australia', 84, '世界最大の海草藻場。ジュゴンやイルカが生息する世界自然遺産。', ST_SetSRID(ST_MakePoint(113.7270, -25.8950), 4326), -25.8950, 113.7270);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ningaloo Coast', 'ニンガルー・コースト', 'world_heritage', 'Perth', 'Australia', 87, 'ジンベエザメと泳げる海。美しいサンゴ礁が広がる世界自然遺産。', ST_SetSRID(ST_MakePoint(113.8550, -22.3070), 4326), -22.3070, 113.8550);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Te Wahipounamu', 'テ・ワヒポウナム', 'world_heritage', 'Queenstown', 'New Zealand', 93, 'ミルフォード・サウンドなどフィヨルドと氷河が美しい。南島の原生自然地域の世界自然遺産。', ST_SetSRID(ST_MakePoint(167.9230, -44.6720), 4326), -44.6720, 167.9230);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Tongariro National Park', 'トンガリロ国立公園', 'world_heritage', 'Auckland', 'New Zealand', 88, '活火山と美しいエメラルドの湖。マオリの聖地である世界複合遺産。', ST_SetSRID(ST_MakePoint(175.5800, -39.2000), 4326), -39.2000, 175.5800);

-- Cultural Heritage Sites (30 sites)

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Angkor', 'アンコール', 'world_heritage', 'Siem Reap', 'Cambodia', 95, 'クメール王朝の巨大寺院群。アンコールワットを始めとする壮大な遺跡の世界文化遺産。', ST_SetSRID(ST_MakePoint(103.8670, 13.4125), 4326), 13.4125, 103.8670);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Borobudur Temple', 'ボロブドゥール寺院', 'world_heritage', 'Yogyakarta', 'Indonesia', 90, '世界最大級の仏教遺跡。72基の仏塔が並ぶ壮大な世界文化遺産。', ST_SetSRID(ST_MakePoint(110.2040, -7.6080), 4326), -7.6080, 110.2040);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Bagan', 'バガン', 'world_heritage', 'Bagan', 'Myanmar', 92, '広大な平原に3000以上の仏塔が立ち並ぶ。朝日に染まる景観が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(94.8580, 21.1717), 4326), 21.1717, 94.8580);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Ayutthaya', 'アユタヤ', 'world_heritage', 'Bangkok', 'Thailand', 85, 'タイ王朝の古都。象徴的な仏塔と仏像が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(100.5608, 14.3532), 4326), 14.3532, 100.5608);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sukhothai', 'スコタイ', 'world_heritage', 'Phitsanulok', 'Thailand', 83, 'タイ最初の王朝の都。静謐な雰囲気の仏像群が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(99.7040, 17.0200), 4326), 17.0200, 99.7040);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Luang Prabang', 'ルアンパバーン', 'world_heritage', 'Luang Prabang', 'Laos', 88, 'メコン川沿いの古都。托鉢の僧侶と寺院が織りなす世界文化遺産。', ST_SetSRID(ST_MakePoint(102.1350, 19.8850), 4326), 19.8850, 102.1350);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hoi An', 'ホイアン', 'world_heritage', 'Da Nang', 'Vietnam', 86, 'ランタンが灯る古い港町。ノスタルジックな街並みが美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(108.3380, 15.8801), 4326), 15.8801, 108.3380);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Hue Monuments', 'フエの建造物群', 'world_heritage', 'Hue', 'Vietnam', 82, 'ベトナム最後の王朝の都。皇帝陵と宮殿が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(107.5830, 16.4637), 4326), 16.4637, 107.5830);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sigiriya', 'シーギリヤ', 'world_heritage', 'Colombo', 'Sri Lanka', 90, '巨大な岩山の頂上に築かれた宮殿跡。天空の要塞とも呼ばれる世界文化遺産。', ST_SetSRID(ST_MakePoint(80.7597, 7.9569), 4326), 7.9569, 80.7597);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Petra', 'ペトラ', 'world_heritage', 'Amman', 'Jordan', 94, '岩を削って作られた薔薇色の古代都市。シークを抜けた先の神殿が圧巻の世界文化遺産。', ST_SetSRID(ST_MakePoint(35.4444, 30.3285), 4326), 30.3285, 35.4444);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Persepolis', 'ペルセポリス', 'world_heritage', 'Shiraz', 'Iran', 88, 'ペルシャ帝国の都。壮大な列柱と浮彫が残る古代遺跡の世界文化遺産。', ST_SetSRID(ST_MakePoint(52.8910, 29.9342), 4326), 29.9342, 52.8910);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Machu Picchu', 'マチュ・ピチュ', 'world_heritage', 'Cusco', 'Peru', 95, 'アンデスの山頂に築かれたインカの空中都市。雲海に浮かぶ神秘的な世界複合遺産。', ST_SetSRID(ST_MakePoint(-72.5450, -13.1631), 4326), -13.1631, -72.5450);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Historic Sanctuary of Machu Picchu', 'マチュ・ピチュの歴史保護区', 'world_heritage', 'Cusco', 'Peru', 94, 'インカ帝国の失われた都市と周辺の自然。アンデスの壮大な景観の世界複合遺産。', ST_SetSRID(ST_MakePoint(-72.5450, -13.1631), 4326), -13.1631, -72.5450);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Nazca Lines', 'ナスカの地上絵', 'world_heritage', 'Nazca', 'Peru', 89, '巨大な動物や幾何学模様の地上絵。上空から見る謎の古代アートの世界文化遺産。', ST_SetSRID(ST_MakePoint(-75.1200, -14.7390), 4326), -14.7390, -75.1200);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Tikal National Park', 'ティカル国立公園', 'world_heritage', 'Flores', 'Guatemala', 90, 'ジャングルに聳える巨大なマヤのピラミッド群。密林に囲まれた世界複合遺産。', ST_SetSRID(ST_MakePoint(-89.6233, 17.2221), 4326), 17.2221, -89.6233);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Chichen Itza', 'チチェン・イッツァ', 'world_heritage', 'Cancun', 'Mexico', 91, 'マヤ文明最大の都市遺跡。ククルカンのピラミッドが有名な世界文化遺産。', ST_SetSRID(ST_MakePoint(-88.5692, 20.6843), 4326), 20.6843, -88.5692);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Palenque', 'パレンケ', 'world_heritage', 'Villahermosa', 'Mexico', 87, 'ジャングルの中のマヤ遺跡。美しい浮彫と建築が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(-92.0460, 17.4848), 4326), 17.4848, -92.0460);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Teotihuacan', 'テオティワカン', 'world_heritage', 'Mexico City', 'Mexico', 89, '太陽と月のピラミッドがそびえる古代都市。メソアメリカ最大の遺跡の世界文化遺産。', ST_SetSRID(ST_MakePoint(-98.8438, 19.6925), 4326), 19.6925, -98.8438);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Cartagena', 'カルタヘナ', 'world_heritage', 'Cartagena', 'Colombia', 84, 'カリブ海に面した要塞都市。カラフルな植民地時代の建築が残る世界文化遺産。', ST_SetSRID(ST_MakePoint(-75.5144, 10.3910), 4326), 10.3910, -75.5144);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Easter Island', 'イースター島', 'world_heritage', 'Easter Island', 'Chile', 93, '太平洋の孤島に並ぶモアイ像。謎に包まれたラパ・ヌイの世界文化遺産。', ST_SetSRID(ST_MakePoint(-109.3497, -27.1127), 4326), -27.1127, -109.3497);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Salzburg', 'ザルツブルク', 'world_heritage', 'Salzburg', 'Austria', 85, 'モーツァルトの生まれた音楽の都。バロック建築と美しい旧市街の世界文化遺産。', ST_SetSRID(ST_MakePoint(13.0550, 47.8095), 4326), 47.8095, 13.0550);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Prague', 'プラハ', 'world_heritage', 'Prague', 'Czech Republic', 88, '百塔の街と呼ばれる美しい都。中世の街並みが残る世界文化遺産。', ST_SetSRID(ST_MakePoint(14.4378, 50.0755), 4326), 50.0755, 14.4378);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Cinque Terre', 'チンクエ・テッレ', 'world_heritage', 'Genoa', 'Italy', 89, '断崖に築かれた5つのカラフルな漁村。地中海を望む絶景の世界文化遺産。', ST_SetSRID(ST_MakePoint(9.7100, 44.1200), 4326), 44.1200, 9.7100);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Amalfi Coast', 'アマルフィ海岸', 'world_heritage', 'Naples', 'Italy', 90, '断崖絶壁に広がる美しい海岸線。レモンの香り漂う世界文化遺産。', ST_SetSRID(ST_MakePoint(14.6030, 40.6340), 4326), 40.6340, 14.6030);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mont-Saint-Michel', 'モン・サン=ミシェル', 'world_heritage', 'Rennes', 'France', 93, '干潟に浮かぶ修道院の島。満潮時に海に浮かぶ幻想的な世界文化遺産。', ST_SetSRID(ST_MakePoint(-1.5114, 48.6361), 4326), 48.6361, -1.5114);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Alhambra', 'アルハンブラ宮殿', 'world_heritage', 'Granada', 'Spain', 92, 'イスラム建築の最高傑作。繊細な装飾と水の庭園が美しい世界文化遺産。', ST_SetSRID(ST_MakePoint(-3.5880, 37.1760), 4326), 37.1760, -3.5880);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Sagrada Familia', 'サグラダ・ファミリア', 'world_heritage', 'Barcelona', 'Spain', 91, 'ガウディの未完の大聖堂。有機的な形と光が織りなす世界文化遺産。', ST_SetSRID(ST_MakePoint(2.1744, 41.4036), 4326), 41.4036, 2.1744);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Stonehenge', 'ストーンヘンジ', 'world_heritage', 'London', 'United Kingdom', 86, '紀元前の巨石遺跡。謎に包まれた環状列石の世界文化遺産。', ST_SetSRID(ST_MakePoint(-1.8262, 51.1789), 4326), 51.1789, -1.8262);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Acropolis', 'アクロポリス', 'world_heritage', 'Athens', 'Greece', 90, '古代ギリシャの聖域。パルテノン神殿が建つ丘の世界文化遺産。', ST_SetSRID(ST_MakePoint(23.7260, 37.9715), 4326), 37.9715, 23.7260);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Meteora', 'メテオラ', 'world_heritage', 'Thessaloniki', 'Greece', 91, '奇岩の上に建つ修道院群。天空に浮かぶような景観が神秘的な世界複合遺産。', ST_SetSRID(ST_MakePoint(21.6310, 39.7217), 4326), 39.7217, 21.6310);

-- Mixed Heritage Sites (10 sites)

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mount Fuji', '富士山', 'world_heritage', 'Tokyo', 'Japan', 90, '日本の象徴である霊峰。信仰の対象と芸術の源泉である世界文化遺産。', ST_SetSRID(ST_MakePoint(138.7274, 35.3606), 4326), 35.3606, 138.7274);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mount Taishan', '泰山', 'world_heritage', 'Jinan', 'China', 86, '中国五岳の筆頭。皇帝が封禅の儀を行った聖なる山の世界複合遺産。', ST_SetSRID(ST_MakePoint(117.1000, 36.2550), 4326), 36.2550, 117.1000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mount Huangshan', '黄山', 'world_heritage', 'Huangshan', 'China', 92, '水墨画のような奇岩と松の山。雲海に浮かぶ絶景の世界複合遺産。', ST_SetSRID(ST_MakePoint(118.1670, 30.1330), 4326), 30.1330, 118.1670);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mount Emei', '峨眉山', 'world_heritage', 'Chengdu', 'China', 85, '中国四大仏教名山の一つ。金頂から見る雲海が美しい世界複合遺産。', ST_SetSRID(ST_MakePoint(103.3370, 29.5990), 4326), 29.5990, 103.3370);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Wulingyuan', '武陵源', 'world_heritage', 'Zhangjiajie', 'China', 93, '映画アバターのモデルとなった奇岩群。3000本を超える石柱が立ち並ぶ世界自然遺産。', ST_SetSRID(ST_MakePoint(110.4790, 29.3450), 4326), 29.3450, 110.4790);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Cappadocia', 'カッパドキア', 'world_heritage', 'Kayseri', 'Turkey', 94, '奇岩群と洞窟住居。気球から見る朝日が幻想的な世界複合遺産。', ST_SetSRID(ST_MakePoint(34.8400, 38.6500), 4326), 38.6500, 34.8400);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Mount Athos', 'アトス山', 'world_heritage', 'Thessaloniki', 'Greece', 83, '修道院共和国の聖なる山。ビザンチン文化が残る世界複合遺産。', ST_SetSRID(ST_MakePoint(24.3260, 40.1570), 4326), 40.1570, 24.3260);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Laponian Area', 'ラポニア地域', 'world_heritage', 'Kiruna', 'Sweden', 85, 'サーミ人の文化と原生自然。オーロラが見られる北極圏の世界複合遺産。', ST_SetSRID(ST_MakePoint(19.0000, 67.3500), 4326), 67.3500, 19.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Kluane / Wrangell-St. Elias / Glacier Bay / Tatshenshini-Alsek', 'クルアーニー/ランゲル=セント・イライアス/グレーシャー・ベイ/タッチェンシニー=アルセク', 'world_heritage', 'Whitehorse', 'Canada', 91, '北米最大の氷河地帯。アラスカとカナダにまたがる壮大な世界自然遺産。', ST_SetSRID(ST_MakePoint(-138.0000, 60.7000), 4326), 60.7000, -138.0000);

INSERT INTO attractions (name, name_ja, category, city, country, impressed_points, description, location, latitude, longitude)
VALUES
('Rapa Nui National Park', 'ラパ・ヌイ国立公園', 'world_heritage', 'Easter Island', 'Chile', 93, 'イースター島のモアイ像群。ポリネシア文化の謎を秘めた世界文化遺産。', ST_SetSRID(ST_MakePoint(-109.3497, -27.1127), 4326), -27.1127, -109.3497);
