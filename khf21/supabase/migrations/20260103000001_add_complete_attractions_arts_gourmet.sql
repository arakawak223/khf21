-- 全50空港の都市に対して具体的な名所・アート・グルメデータを追加
-- 既存データは保持し、不足している都市のデータを追加

-- 名所データ (Attractions)
-- 既に登録されている都市: Paris, New York, Beijing, Agra, Cusco, Rome, Sydney, Barcelona, Arizona, Shizuoka
-- 追加が必要な都市: Tokyo (NRT/HND), Los Angeles, London, Dubai, Singapore, Seoul, Hong Kong, Bangkok, San Francisco,
--                   Frankfurt, Amsterdam, São Paulo, Toronto, Mexico City, Shanghai, New Delhi, Mumbai, Manila,
--                   Kuala Lumpur, Jakarta, Taipei, Osaka, Hanoi, Madrid, Munich, Vienna, Zurich, Copenhagen,
--                   Stockholm, Athens, Istanbul, Chicago, Dallas, Miami, Seattle, Vancouver, Buenos Aires,
--                   Bogota, Cairo, Johannesburg, Melbourne, Auckland, Doha

INSERT INTO attractions (name, name_ja, category, description, city, country, latitude, longitude, impressed_points) VALUES
  -- Tokyo (既存の成田/羽田空港の都市)
  ('Senso-ji Temple', '浅草寺', 'landmark', '東京最古の寺院。雷門と仲見世通りで有名な、日本を代表する観光名所。', 'Tokyo', 'Japan', 35.7148, 139.7967, 55),
  ('Tokyo Skytree', '東京スカイツリー', 'landmark', '高さ634mの世界一高い自立式電波塔。展望台からは東京の街並みを一望できる。', 'Tokyo', 'Japan', 35.7101, 139.8107, 60),
  ('Meiji Shrine', '明治神宮', 'landmark', '明治天皇と昭憲皇太后を祀る神社。都心にありながら広大な森に囲まれた静寂な空間。', 'Tokyo', 'Japan', 35.6764, 139.6993, 50),

  -- Los Angeles
  ('Hollywood Sign', 'ハリウッドサイン', 'landmark', 'ハリウッドヒルズに立つ巨大な白文字。映画産業の象徴として世界的に有名。', 'Los Angeles', 'USA', 34.1341, -118.3215, 55),
  ('Griffith Observatory', 'グリフィス天文台', 'landmark', 'ロサンゼルスを一望できる丘の上の天文台。プラネタリウムと展示が人気。', 'Los Angeles', 'USA', 34.1184, -118.3004, 50),
  ('Santa Monica Pier', 'サンタモニカピア', 'landmark', '太平洋に面した歴史的な桟橋。遊園地とビーチが融合した人気スポット。', 'Los Angeles', 'USA', 34.0094, -118.4977, 45),

  -- London
  ('Big Ben', 'ビッグベン', 'landmark', 'ロンドンのシンボルとなっている時計塔。正式名称はエリザベス・タワー。', 'London', 'UK', 51.5007, -0.1246, 60),
  ('Tower Bridge', 'タワーブリッジ', 'landmark', 'テムズ川に架かる跳ね橋。ロンドンを代表する壮麗な橋。', 'London', 'UK', 51.5055, -0.0754, 55),
  ('British Museum', '大英博物館', 'world_heritage', '世界最大級の博物館。古代エジプトからギリシャまで人類の至宝が集結。', 'London', 'UK', 51.5194, -0.1270, 65),

  -- Dubai
  ('Burj Khalifa', 'ブルジュ・ハリファ', 'landmark', '世界一高い超高層ビル（828m）。展望台からはドバイの街を一望できる。', 'Dubai', 'UAE', 25.1972, 55.2744, 70),
  ('Dubai Mall', 'ドバイモール', 'landmark', '世界最大級のショッピングモール。水族館やスケートリンクも併設。', 'Dubai', 'UAE', 25.1972, 55.2796, 50),
  ('Palm Jumeirah', 'パーム・ジュメイラ', 'landmark', 'ヤシの木の形をした人工島。高級ホテルやレジデンスが立ち並ぶ。', 'Dubai', 'UAE', 25.1124, 55.1390, 60),

  -- Singapore
  ('Marina Bay Sands', 'マリーナベイ・サンズ', 'landmark', '屋上に船の形をしたインフィニティプールがある象徴的なホテル。', 'Singapore', 'Singapore', 1.2834, 103.8607, 65),
  ('Gardens by the Bay', 'ガーデンズ・バイ・ザ・ベイ', 'landmark', '未来的なスーパーツリーが立ち並ぶ植物園。夜のライトショーが圧巻。', 'Singapore', 'Singapore', 1.2816, 103.8636, 70),
  ('Merlion Park', 'マーライオン公園', 'landmark', 'シンガポールのシンボル、マーライオン像がある公園。マリーナベイの絶景スポット。', 'Singapore', 'Singapore', 1.2868, 103.8545, 50),

  -- Seoul
  ('Gyeongbokgung Palace', '景福宮', 'world_heritage', '朝鮮王朝の正宮。壮麗な王宮建築と衛兵交代式が見どころ。', 'Seoul', 'South Korea', 37.5796, 126.9770, 60),
  ('N Seoul Tower', 'Nソウルタワー', 'landmark', 'ソウル市内を一望できる展望塔。カップルの聖地として有名な愛の南京錠スポット。', 'Seoul', 'South Korea', 37.5512, 126.9882, 55),
  ('Bukchon Hanok Village', '北村韓屋村', 'landmark', '伝統的な韓屋が立ち並ぶ美しい街並み。韓国の歴史と文化を体感できる。', 'Seoul', 'South Korea', 37.5825, 126.9833, 50),

  -- Hong Kong
  ('Victoria Peak', 'ヴィクトリアピーク', 'scenic_spot', '香港島の最高峰。香港の摩天楼と港を一望できる絶景スポット。', 'Hong Kong', 'Hong Kong', 22.2708, 114.1501, 65),
  ('Tian Tan Buddha', '天壇大仏', 'landmark', 'ランタオ島にある巨大な青銅製の大仏。268段の階段を登った先に鎮座。', 'Hong Kong', 'Hong Kong', 22.2541, 113.9048, 60),
  ('Hong Kong Disneyland', '香港ディズニーランド', 'landmark', 'アジア屈指のテーマパーク。独自のアトラクションとショーが楽しめる。', 'Hong Kong', 'Hong Kong', 22.3132, 114.0413, 70),

  -- Bangkok
  ('Grand Palace', '王宮', 'world_heritage', 'タイ王室の宮殿。黄金に輝くエメラルド寺院が圧巻の美しさ。', 'Bangkok', 'Thailand', 13.7500, 100.4915, 70),
  ('Wat Arun', 'ワット・アルン', 'landmark', '暁の寺として知られる美しい寺院。チャオプラヤー川沿いに立つ荘厳な仏塔。', 'Bangkok', 'Thailand', 13.7437, 100.4888, 60),
  ('Chatuchak Weekend Market', 'チャトゥチャック・ウィークエンド・マーケット', 'landmark', '世界最大級の週末市場。1万5千以上の店舗が並ぶショッピング天国。', 'Bangkok', 'Thailand', 13.7998, 100.5501, 50),

  -- San Francisco
  ('Golden Gate Bridge', 'ゴールデンゲートブリッジ', 'landmark', 'サンフランシスコの象徴的な赤い吊り橋。霧に包まれる姿が幻想的。', 'San Francisco', 'USA', 37.8199, -122.4783, 70),
  ('Alcatraz Island', 'アルカトラズ島', 'landmark', 'かつての連邦刑務所がある島。脱獄不可能と言われた監獄の見学ツアーが人気。', 'San Francisco', 'USA', 37.8270, -122.4230, 65),
  ('Fisherman''s Wharf', 'フィッシャーマンズワーフ', 'landmark', '港の活気ある観光エリア。新鮮なシーフードとアシカが名物。', 'San Francisco', 'USA', 37.8080, -122.4177, 55),

  -- Frankfurt
  ('Römer', 'レーマー', 'landmark', 'フランクフルト旧市街の市庁舎。中世の面影を残す美しい建築物。', 'Frankfurt', 'Germany', 50.1106, 8.6821, 50),
  ('Main Tower', 'マインタワー', 'landmark', '展望台からフランクフルトの街を一望。金融街の高層ビル群が圧巻。', 'Frankfurt', 'Germany', 50.1122, 8.6725, 55),
  ('Goethe House', 'ゲーテハウス', 'landmark', 'ドイツの文豪ゲーテの生家。18世紀の裕福な市民の生活を垣間見ることができる。', 'Frankfurt', 'Germany', 50.1108, 8.6808, 45),

  -- Amsterdam
  ('Anne Frank House', 'アンネ・フランクの家', 'world_heritage', 'アンネ・フランクが隠れ家生活を送った家。第二次世界大戦の歴史を学べる。', 'Amsterdam', 'Netherlands', 52.3752, 4.8840, 70),
  ('Van Gogh Museum', 'ゴッホ美術館', 'landmark', 'ゴッホの世界最大のコレクション。「ひまわり」など200点以上の作品を所蔵。', 'Amsterdam', 'Netherlands', 52.3584, 4.8811, 65),
  ('Canal Ring', '運河地区', 'world_heritage', 'アムステルダムの象徴的な運河群。美しい街並みをボートクルーズで楽しめる。', 'Amsterdam', 'Netherlands', 52.3680, 4.8936, 60),

  -- São Paulo
  ('Paulista Avenue', 'パウリスタ大通り', 'landmark', 'サンパウロのメインストリート。高層ビルや美術館が立ち並ぶ文化の中心地。', 'São Paulo', 'Brazil', -23.5613, -46.6565, 50),
  ('Ibirapuera Park', 'イビラプエラ公園', 'scenic_spot', '広大な都市公園。近代建築美術館や日本館もある緑豊かなオアシス。', 'São Paulo', 'Brazil', -23.5875, -46.6577, 55),
  ('São Paulo Cathedral', 'サンパウロ大聖堂', 'landmark', 'ネオゴシック様式の壮麗な大聖堂。サンパウロの宗教的中心地。', 'São Paulo', 'Brazil', -23.5505, -46.6333, 45),

  -- Toronto
  ('CN Tower', 'CNタワー', 'landmark', 'トロントのランドマーク。高さ553mの展望台からオンタリオ湖と街を一望。', 'Toronto', 'Canada', 43.6426, -79.3871, 65),
  ('Royal Ontario Museum', 'ロイヤルオンタリオ博物館', 'landmark', '北米有数の博物館。恐竜の化石から世界の文化財まで600万点以上を所蔵。', 'Toronto', 'Canada', 43.6677, -79.3948, 60),
  ('Toronto Islands', 'トロントアイランド', 'scenic_spot', 'オンタリオ湖に浮かぶ島々。ビーチやピクニックエリアがある都会のオアシス。', 'Toronto', 'Canada', 43.6214, -79.3786, 55),

  -- Mexico City
  ('Teotihuacan', 'テオティワカン', 'world_heritage', '古代メソアメリカ最大の都市遺跡。太陽のピラミッドと月のピラミッドが圧巻。', 'Mexico City', 'Mexico', 19.6925, -98.8438, 80),
  ('Zócalo', 'ソカロ広場', 'landmark', '世界最大級の広場。メキシコシティの歴史的中心地。', 'Mexico City', 'Mexico', 19.4326, -99.1332, 55),
  ('Frida Kahlo Museum', 'フリーダ・カーロ美術館', 'landmark', 'メキシコの画家フリーダ・カーロの生家。青い家として知られる美しい博物館。', 'Mexico City', 'Mexico', 19.3552, -99.1625, 60),

  -- Shanghai
  ('The Bund', '外灘', 'landmark', '黄浦江沿いの歴史的建築群。対岸の近未来的な浦東地区との対比が美しい。', 'Shanghai', 'China', 31.2397, 121.4903, 65),
  ('Oriental Pearl Tower', '東方明珠塔', 'landmark', '上海のシンボルタワー。独特な球体デザインが特徴的な展望塔。', 'Shanghai', 'China', 31.2397, 121.4995, 60),
  ('Yu Garden', '豫園', 'landmark', '明代に造られた古典庭園。中国伝統建築と庭園美を堪能できる。', 'Shanghai', 'China', 31.2276, 121.4923, 55),

  -- New Delhi
  ('India Gate', 'インド門', 'landmark', 'インド独立の象徴となる戦没者慰霊碑。ニューデリーの中心に立つ壮麗な凱旋門。', 'New Delhi', 'India', 28.6129, 77.2295, 55),
  ('Qutub Minar', 'クトゥブ・ミナール', 'world_heritage', '世界一高いレンガ造りの塔。12世紀に建てられた歴史的建造物。', 'New Delhi', 'India', 28.5244, 77.1855, 60),
  ('Lotus Temple', 'ロータス寺院', 'landmark', '蓮の花の形をした美しい礼拝堂。バハーイー教の寺院として世界的に有名。', 'New Delhi', 'India', 28.5535, 77.2588, 50),

  -- Mumbai
  ('Gateway of India', 'インド門', 'landmark', 'ムンバイのランドマーク。アラビア海に面した壮麗なアーチ型記念碑。', 'Mumbai', 'India', 18.9220, 72.8347, 60),
  ('Chhatrapati Shivaji Terminus', 'チャトラパティ・シヴァージー・ターミナス', 'world_heritage', 'ゴシック様式の美しい駅舎。ユネスコ世界遺産に登録された歴史的建造物。', 'Mumbai', 'India', 18.9398, 72.8355, 65),
  ('Marine Drive', 'マリンドライブ', 'scenic_spot', '湾曲した海岸沿いの大通り。夜景が美しく「女王のネックレス」と呼ばれる。', 'Mumbai', 'India', 18.9432, 72.8236, 55),

  -- Manila
  ('Intramuros', 'イントラムロス', 'world_heritage', 'スペイン統治時代の城壁都市。歴史的建造物と石畳の街並みが美しい。', 'Manila', 'Philippines', 14.5907, 120.9751, 60),
  ('Rizal Park', 'リサール公園', 'landmark', 'フィリピン独立の英雄ホセ・リサールを記念する広大な公園。', 'Manila', 'Philippines', 14.5833, 120.9794, 50),
  ('Manila Ocean Park', 'マニラオーシャンパーク', 'landmark', '東南アジア最大級の水族館。熱帯海洋生物の多様性を体験できる。', 'Manila', 'Philippines', 14.5769, 120.9753, 55),

  -- Kuala Lumpur
  ('Petronas Twin Towers', 'ペトロナスツインタワー', 'landmark', '高さ452mのツインタワー。かつて世界一高いビルとして有名だった。', 'Kuala Lumpur', 'Malaysia', 3.1579, 101.7116, 70),
  ('Batu Caves', 'バトゥ洞窟', 'landmark', 'ヒンドゥー教の聖地。272段の階段を登った先に壮大な洞窟寺院がある。', 'Kuala Lumpur', 'Malaysia', 3.2379, 101.6840, 60),
  ('KL Tower', 'KLタワー', 'landmark', '高さ421mの通信塔。展望台からクアラルンプールの街を一望できる。', 'Kuala Lumpur', 'Malaysia', 3.1529, 101.7034, 55),

  -- Jakarta
  ('National Monument (Monas)', '独立記念塔', 'landmark', 'インドネシアの独立を記念する137mの塔。ジャカルタのシンボル。', 'Jakarta', 'Indonesia', -6.1754, 106.8272, 55),
  ('Istiqlal Mosque', 'イスティクラル・モスク', 'landmark', '東南アジア最大のモスク。12万人を収容できる壮大な礼拝堂。', 'Jakarta', 'Indonesia', -6.1702, 106.8297, 60),
  ('Kota Tua', '旧市街', 'landmark', 'オランダ統治時代の建築が残る歴史地区。コロニアル建築が美しい。', 'Jakarta', 'Indonesia', -6.1350, 106.8134, 50),

  -- Taipei
  ('Taipei 101', '台北101', 'landmark', '高さ508mの超高層ビル。かつて世界一高いビルだった台湾のランドマーク。', 'Taipei', 'Taiwan', 25.0340, 121.5645, 70),
  ('National Palace Museum', '故宮博物院', 'landmark', '中国文化の至宝を所蔵する世界有数の博物館。70万点近い収蔵品を誇る。', 'Taipei', 'Taiwan', 25.1023, 121.5485, 65),
  ('Longshan Temple', '龍山寺', 'landmark', '台北最古の寺院。台湾仏教の中心地として参拝客で賑わう。', 'Taipei', 'Taiwan', 25.0366, 121.4999, 55),

  -- Osaka
  ('Osaka Castle', '大阪城', 'landmark', '豊臣秀吉が築いた名城。天守閣からは大阪市街を一望できる。', 'Osaka', 'Japan', 34.6873, 135.5262, 65),
  ('Dotonbori', '道頓堀', 'landmark', '大阪のシンボル的な繁華街。グリコの看板やかに道楽の巨大なカニが有名。', 'Osaka', 'Japan', 34.6686, 135.5017, 60),
  ('Universal Studios Japan', 'ユニバーサル・スタジオ・ジャパン', 'landmark', '大人気のテーマパーク。ハリー・ポッターエリアが大人気。', 'Osaka', 'Japan', 34.6654, 135.4323, 75),

  -- Hanoi
  ('Hoan Kiem Lake', 'ホアンキエム湖', 'landmark', 'ハノイ旧市街の中心にある湖。伝説の亀が棲むとされる神聖な場所。', 'Hanoi', 'Vietnam', 21.0285, 105.8542, 50),
  ('Temple of Literature', '文廟', 'world_heritage', 'ベトナム最初の大学。1070年に創建された儒教の聖地。', 'Hanoi', 'Vietnam', 21.0277, 105.8356, 55),
  ('Ho Chi Minh Mausoleum', 'ホー・チ・ミン廟', 'landmark', 'ベトナム建国の父ホー・チ・ミンが眠る霊廟。厳粛な雰囲気に包まれる。', 'Hanoi', 'Vietnam', 21.0375, 105.8345, 60),

  -- Madrid
  ('Royal Palace of Madrid', 'マドリード王宮', 'landmark', 'ヨーロッパ最大級の王宮。3,418室を誇る壮麗な宮殿。', 'Madrid', 'Spain', 40.4179, -3.7142, 65),
  ('Prado Museum', 'プラド美術館', 'landmark', 'スペイン最大の美術館。ベラスケスやゴヤなどの名画を所蔵。', 'Madrid', 'Spain', 40.4138, -3.6921, 70),
  ('Plaza Mayor', 'マヨール広場', 'landmark', 'マドリードの中心にある歴史的な広場。カフェやレストランが立ち並ぶ。', 'Madrid', 'Spain', 40.4155, -3.7074, 55),

  -- Munich
  ('Marienplatz', 'マリエン広場', 'landmark', 'ミュンヘンの中心広場。新市庁舎の仕掛け時計が有名。', 'Munich', 'Germany', 48.1374, 11.5755, 55),
  ('Neuschwanstein Castle', 'ノイシュヴァンシュタイン城', 'landmark', 'バイエルン王ルートヴィヒ2世が建てた白亜の城。ディズニーの城のモデル。', 'Munich', 'Germany', 47.5576, 10.7498, 80),
  ('English Garden', '英国庭園', 'scenic_spot', '世界最大級の都市公園。ビアガーデンやサーファーが集まる川が有名。', 'Munich', 'Germany', 48.1642, 11.6056, 60),

  -- Vienna
  ('Schönbrunn Palace', 'シェーンブルン宮殿', 'world_heritage', 'ハプスブルク家の夏の離宮。豪華絢爛なバロック建築と美しい庭園。', 'Vienna', 'Austria', 48.1845, 16.3122, 75),
  ('St. Stephen''s Cathedral', '聖シュテファン大聖堂', 'landmark', 'ウィーンのシンボル。ゴシック様式の壮麗な大聖堂。', 'Vienna', 'Austria', 48.2085, 16.3731, 65),
  ('Hofburg Palace', 'ホーフブルク宮殿', 'landmark', 'ハプスブルク家の冬の宮殿。現在はオーストリア大統領府。', 'Vienna', 'Austria', 48.2066, 16.3655, 70),

  -- Zurich
  ('Lake Zurich', 'チューリッヒ湖', 'scenic_spot', '美しいアルプスを背景にした湖。ボートクルーズが人気。', 'Zurich', 'Switzerland', 47.3667, 8.5500, 60),
  ('Grossmünster', 'グロスミュンスター', 'landmark', 'チューリッヒのシンボル的な双塔の教会。ロマネスク様式の傑作。', 'Zurich', 'Switzerland', 47.3707, 8.5440, 55),
  ('Bahnhofstrasse', 'バーンホフ通り', 'landmark', '世界有数の高級ショッピングストリート。高級ブランド店が立ち並ぶ。', 'Zurich', 'Switzerland', 47.3712, 8.5397, 50),

  -- Copenhagen
  ('The Little Mermaid', '人魚姫の像', 'landmark', 'コペンハーゲンの象徴。アンデルセンの童話に基づく有名な像。', 'Copenhagen', 'Denmark', 55.6929, 12.5993, 55),
  ('Tivoli Gardens', 'チボリ公園', 'landmark', '世界最古の遊園地の一つ。1843年開園の歴史ある遊園地。', 'Copenhagen', 'Denmark', 55.6739, 12.5681, 60),
  ('Nyhavn', 'ニューハウン', 'landmark', 'カラフルな建物が立ち並ぶ運河沿いの街並み。レストランやカフェが人気。', 'Copenhagen', 'Denmark', 55.6798, 12.5913, 65),

  -- Stockholm
  ('Vasa Museum', 'ヴァーサ号博物館', 'landmark', '17世紀の戦艦ヴァーサ号を展示する博物館。ほぼ完全な状態で保存されている。', 'Stockholm', 'Sweden', 59.3280, 18.0916, 70),
  ('Gamla Stan', 'ガムラスタン', 'landmark', 'ストックホルムの旧市街。中世の街並みが美しく保存されている。', 'Stockholm', 'Sweden', 59.3258, 18.0717, 65),
  ('ABBA Museum', 'ABBAミュージアム', 'landmark', 'スウェーデンの伝説的バンドABBAの博物館。インタラクティブな展示が楽しい。', 'Stockholm', 'Sweden', 59.3234, 18.1037, 60),

  -- Athens
  ('Acropolis', 'アクロポリス', 'world_heritage', '古代ギリシャの象徴。パルテノン神殿が立つ聖なる丘。', 'Athens', 'Greece', 37.9715, 23.7267, 85),
  ('Parthenon', 'パルテノン神殿', 'world_heritage', '古代ギリシャ建築の最高傑作。女神アテナを祀る神殿。', 'Athens', 'Greece', 37.9715, 23.7266, 80),
  ('Plaka', 'プラカ地区', 'landmark', 'アテネ最古の地区。石畳の道と伝統的な建物が魅力。', 'Athens', 'Greece', 37.9738, 23.7278, 60),

  -- Istanbul
  ('Hagia Sophia', 'アヤソフィア', 'world_heritage', 'ビザンティン建築の傑作。モスクと博物館の歴史を持つ聖なる場所。', 'Istanbul', 'Turkey', 41.0086, 28.9802, 80),
  ('Blue Mosque', 'ブルーモスク', 'landmark', '美しい青いタイルで装飾されたモスク。6本のミナレットが特徴的。', 'Istanbul', 'Turkey', 41.0054, 28.9768, 75),
  ('Grand Bazaar', 'グランドバザール', 'landmark', '世界最大級の屋内市場。4,000以上の店舗が軒を連ねる。', 'Istanbul', 'Turkey', 41.0108, 28.9680, 65),

  -- Chicago
  ('Cloud Gate (The Bean)', 'クラウド・ゲート', 'landmark', 'シカゴのシンボル。鏡面仕上げの巨大な豆型彫刻。', 'Chicago', 'USA', 41.8827, -87.6233, 60),
  ('Willis Tower', 'ウィリスタワー', 'landmark', 'かつて世界一高いビルだった超高層ビル。スカイデッキからの眺めが圧巻。', 'Chicago', 'USA', 41.8789, -87.6359, 65),
  ('Navy Pier', 'ネイビーピア', 'landmark', 'ミシガン湖に突き出た桟橋。遊園地やレストランがある人気スポット。', 'Chicago', 'USA', 41.8917, -87.6050, 55),

  -- Dallas
  ('Reunion Tower', 'リユニオンタワー', 'landmark', 'ダラスのスカイライン。球体展望台からダラスを一望できる。', 'Dallas', 'USA', 32.7755, -96.8089, 55),
  ('Sixth Floor Museum', '第6フロア博物館', 'landmark', 'ケネディ大統領暗殺事件の博物館。歴史的な現場を保存。', 'Dallas', 'USA', 32.7798, -96.8089, 60),
  ('Dallas Arboretum', 'ダラス樹木園', 'scenic_spot', '広大な植物園。四季折々の花々が美しい。', 'Dallas', 'USA', 32.8209, -96.7177, 50),

  -- Miami
  ('South Beach', 'サウスビーチ', 'scenic_spot', 'マイアミビーチの最も有名なエリア。白砂のビーチとアールデコ建築が魅力。', 'Miami', 'USA', 25.7825, -80.1341, 70),
  ('Art Deco District', 'アールデコ地区', 'landmark', '1930年代のアールデコ建築が立ち並ぶ歴史地区。パステルカラーの建物が美しい。', 'Miami', 'USA', 25.7814, -80.1299, 65),
  ('Vizcaya Museum', 'ビスカヤ博物館', 'landmark', 'イタリア・ルネサンス様式の豪華な邸宅。美しい庭園も見どころ。', 'Miami', 'USA', 25.7443, -80.2106, 60),

  -- Seattle
  ('Space Needle', 'スペースニードル', 'landmark', 'シアトルのランドマーク。1962年万博のために建てられた展望塔。', 'Seattle', 'USA', 47.6205, -122.3493, 65),
  ('Pike Place Market', 'パイクプレイスマーケット', 'landmark', '1907年創業の歴史的な市場。新鮮な魚介類と花が並ぶ。', 'Seattle', 'USA', 47.6097, -122.3421, 60),
  ('Chihuly Garden and Glass', 'チフーリ・ガーデン・アンド・グラス', 'landmark', 'ガラスアートの巨匠チフーリの作品を展示する美術館。幻想的なガラス彫刻が圧巻。', 'Seattle', 'USA', 47.6205, -122.3505, 70),

  -- Vancouver
  ('Stanley Park', 'スタンレーパーク', 'scenic_spot', 'バンクーバーの巨大な都市公園。美しい海岸線と森林を楽しめる。', 'Vancouver', 'Canada', 49.3042, -123.1442, 65),
  ('Capilano Suspension Bridge', 'キャピラノ吊り橋', 'landmark', '高さ70m、長さ137mの吊り橋。スリル満点の空中散歩を体験。', 'Vancouver', 'Canada', 49.3429, -123.1149, 70),
  ('Granville Island', 'グランビルアイランド', 'landmark', 'アート、食、音楽が集まる活気あるエリア。パブリックマーケットが人気。', 'Vancouver', 'Canada', 49.2715, -123.1336, 60),

  -- Buenos Aires
  ('Obelisco', 'オベリスコ', 'landmark', 'ブエノスアイレスのシンボル。市の建国400周年を記念して建てられた。', 'Buenos Aires', 'Argentina', -34.6037, -58.3816, 55),
  ('La Boca', 'ラ・ボカ地区', 'landmark', 'カラフルな建物が立ち並ぶアート地区。タンゴ発祥の地として有名。', 'Buenos Aires', 'Argentina', -34.6345, -58.3632, 65),
  ('Teatro Colón', 'コロン劇場', 'landmark', '世界有数のオペラハウス。1908年に開場した壮麗な劇場。', 'Buenos Aires', 'Argentina', -34.6011, -58.3831, 70),

  -- Bogota
  ('Monserrate', 'モンセラーテ', 'landmark', 'ボゴタを見下ろす山頂の教会。ケーブルカーで登れる絶景スポット。', 'Bogota', 'Colombia', 4.6055, -74.0565, 65),
  ('Gold Museum', '黄金博物館', 'landmark', '世界最大の金製品コレクション。プレコロンブス期の金細工が圧巻。', 'Bogota', 'Colombia', 4.6017, -74.0727, 70),
  ('Botero Museum', 'ボテロ美術館', 'landmark', 'コロンビアの巨匠ボテロの作品を展示。ふくよかな人物画が特徴的。', 'Bogota', 'Colombia', 4.5979, -74.0742, 60),

  -- Cairo
  ('Pyramids of Giza', 'ギザのピラミッド', 'world_heritage', '古代エジプトの象徴。クフ王のピラミッドは世界七不思議の一つ。', 'Cairo', 'Egypt', 29.9792, 31.1342, 90),
  ('Sphinx', 'スフィンクス', 'world_heritage', 'ギザの大スフィンクス。人間の頭とライオンの体を持つ神秘的な像。', 'Cairo', 'Egypt', 29.9753, 31.1376, 85),
  ('Egyptian Museum', 'エジプト考古学博物館', 'landmark', '世界最大のエジプト文明コレクション。ツタンカーメンの黄金マスクが有名。', 'Cairo', 'Egypt', 30.0478, 31.2336, 80),

  -- Johannesburg
  ('Apartheid Museum', 'アパルトヘイト博物館', 'landmark', '南アフリカの暗い歴史を学べる博物館。人種差別の歴史を展示。', 'Johannesburg', 'South Africa', -26.2350, 27.9870, 70),
  ('Constitution Hill', '憲法の丘', 'landmark', 'かつての刑務所を改装した人権博物館。マンデラも収監されていた。', 'Johannesburg', 'South Africa', -26.1916, 28.0356, 65),
  ('Gold Reef City', 'ゴールドリーフシティ', 'landmark', '金鉱をテーマにしたテーマパーク。金採掘の歴史を体験できる。', 'Johannesburg', 'South Africa', -26.2348, 27.8538, 60),

  -- Melbourne
  ('Federation Square', 'フェデレーションスクエア', 'landmark', 'メルボルンの文化の中心地。モダン建築と美術館が集まる広場。', 'Melbourne', 'Australia', -37.8180, 144.9685, 55),
  ('Royal Botanic Gardens', '王立植物園', 'scenic_spot', '38ヘクタールの広大な植物園。1万種以上の植物を展示。', 'Melbourne', 'Australia', -37.8304, 144.9796, 60),
  ('Great Ocean Road', 'グレートオーシャンロード', 'scenic_spot', '世界で最も美しい海岸道路の一つ。12使徒の奇岩が有名。', 'Melbourne', 'Australia', -38.6866, 143.1058, 75),

  -- Auckland
  ('Sky Tower', 'スカイタワー', 'landmark', '南半球で最も高い建造物。オークランドのスカイラインを象徴する塔。', 'Auckland', 'New Zealand', -36.8485, 174.7633, 65),
  ('Waiheke Island', 'ワイヘケ島', 'scenic_spot', 'オークランドから35分の美しい島。ワイナリーとビーチが人気。', 'Auckland', 'New Zealand', -36.7917, 175.0889, 70),
  ('Auckland War Memorial Museum', 'オークランド戦争記念博物館', 'landmark', 'ニュージーランドの歴史と文化を学べる博物館。マオリ文化の展示が充実。', 'Auckland', 'New Zealand', -36.8606, 174.7784, 60),

  -- Doha
  ('Museum of Islamic Art', 'イスラム美術館', 'landmark', 'イスラム美術の傑作を集めた美術館。建築も見事。', 'Doha', 'Qatar', 25.2961, 51.5393, 75),
  ('Souq Waqif', 'スーク・ワキーフ', 'landmark', '伝統的なアラブの市場。香辛料、織物、工芸品が並ぶ活気ある場所。', 'Doha', 'Qatar', 25.2867, 51.5333, 65),
  ('The Pearl-Qatar', 'ザ・パール・カタール', 'landmark', '人工島に造られた高級リゾート地区。豪華なマリーナとショッピングエリア。', 'Doha', 'Qatar', 25.3723, 51.5530, 70);
