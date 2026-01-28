-- 50空港の200キロ圏内にある実際のユネスコ世界遺産を30件追加
-- 文化遺産・自然遺産・複合遺産を含む

INSERT INTO attractions (name, name_ja, category, description, city, country, latitude, longitude, impressed_points) VALUES
  -- Paris周辺 (CDG空港)
  ('Palace of Versailles', 'ヴェルサイユ宮殿', 'world_heritage', 'ルイ14世が建設した豪華絢爛なバロック宮殿。世界遺産「ヴェルサイユの宮殿と庭園」として登録。', 'Paris', 'France', 48.8049, 2.1204, 85),
  ('Banks of the Seine', 'セーヌ河岸', 'world_heritage', 'ノートルダム大聖堂からエッフェル塔まで、パリの歴史的建造物が並ぶセーヌ河岸。世界遺産登録地区。', 'Paris', 'France', 48.8566, 2.3522, 70),

  -- Barcelona周辺 (BCN空港)
  ('Works of Antoni Gaudí', 'アントニ・ガウディの作品群', 'world_heritage', 'サグラダファミリア、グエル公園、カサ・ミラなど、ガウディの独創的な建築群。ユネスコ世界遺産登録。', 'Barcelona', 'Spain', 41.4036, 2.1744, 85),
  ('Catalan Romanesque Churches', 'カタルーニャのロマネスク様式教会群', 'world_heritage', 'ピレネー山脈に点在する中世ロマネスク様式の教会群。ユネスコ世界遺産。', 'Barcelona', 'Spain', 42.4000, 1.5000, 65),

  -- Sydney周辺 (SYD空港)
  ('Sydney Opera House World Heritage', 'シドニー・オペラハウス（世界遺産）', 'world_heritage', '20世紀を代表する近代建築の傑作。2007年にユネスコ世界遺産に登録された独創的な建築物。', 'Sydney', 'Australia', -33.8568, 151.2153, 80),
  ('Blue Mountains', 'ブルー・マウンテンズ', 'world_heritage', 'ユーカリの森が青く霞む壮大な山岳地帯。グレーター・ブルー・マウンテンズ地域として世界自然遺産登録。', 'Sydney', 'Australia', -33.7000, 150.3000, 75),

  -- Rome周辺 (FCO空港)
  ('Vatican City', 'バチカン市国', 'world_heritage', '世界最小の独立国家。サンピエトロ大聖堂やシスティーナ礼拝堂など、カトリックの総本山。', 'Rome', 'Italy', 41.9029, 12.4534, 90),
  ('Historic Centre of Rome', 'ローマ歴史地区', 'world_heritage', '古代ローマ帝国の中心地。フォロ・ロマーノ、パンテオンなど、2000年以上の歴史を持つ遺跡群。', 'Rome', 'Italy', 41.8902, 12.4922, 85),

  -- Tokyo/Osaka周辺 (NRT/HND/KIX空港)
  ('Historic Monuments of Ancient Kyoto', '古都京都の文化財', 'world_heritage', '清水寺、金閣寺、銀閣寺など17の寺社仏閣と城郭。日本の伝統文化を代表する世界遺産。', 'Osaka', 'Japan', 35.0116, 135.7681, 85),
  ('Buddhist Monuments in the Horyu-ji Area', '法隆寺地域の仏教建造物', 'world_heritage', '世界最古の木造建築群。法隆寺は7世紀に建立された日本最初の世界遺産。', 'Osaka', 'Japan', 34.6145, 135.7346, 80),
  ('Shrines and Temples of Nikko', '日光の社寺', 'world_heritage', '徳川家康を祀る日光東照宮を含む103の建造物。絢爛豪華な江戸建築の粋。', 'Tokyo', 'Japan', 36.7580, 139.5979, 80),
  ('Mount Fuji (UNESCO)', '富士山－信仰の対象と芸術の源泉', 'world_heritage', '日本最高峰の霊峰。2013年に世界文化遺産登録。信仰と芸術の象徴。', 'Tokyo', 'Japan', 35.3606, 138.7274, 85),

  -- Beijing周辺 (PEK空港)
  ('Forbidden City', '紫禁城（故宮）', 'world_heritage', '明清時代の皇帝の宮殿。世界最大級の木造建築群で、北京と瀋陽の明・清王朝皇宮として世界遺産登録。', 'Beijing', 'China', 39.9163, 116.3972, 85),
  ('Temple of Heaven', '天壇', 'world_heritage', '明清時代の皇帝が天に祈りを捧げた祭壇。中国古代の宇宙観を表す建築傑作。', 'Beijing', 'China', 39.8822, 116.4066, 75),

  -- New York周辺 (JFK空港)
  ('Statue of Liberty (UNESCO)', '自由の女神像（世界遺産）', 'world_heritage', '1886年にフランスから贈られた自由と民主主義の象徴。1984年にユネスコ世界遺産登録。', 'New York', 'USA', 40.6892, -74.0445, 80),

  -- Vienna周辺 (VIE空港)
  ('Historic Centre of Vienna', 'ウィーン歴史地区', 'world_heritage', 'ハプスブルク帝国の首都として栄えた歴史地区。音楽と芸術の都の美しい街並み。', 'Vienna', 'Austria', 48.2082, 16.3738, 80),

  -- Athens周辺 (ATH空港) ※追加
  ('Delphi', 'デルフィの古代遺跡', 'world_heritage', '古代ギリシャの聖地。アポロン神殿の神託で知られる山岳遺跡。', 'Athens', 'Greece', 38.4824, 22.5010, 85),
  ('Meteora', 'メテオラ', 'world_heritage', '奇岩の頂上に建つ修道院群。天空の修道院として知られる複合世界遺産。', 'Athens', 'Greece', 39.7217, 21.6306, 90),

  -- Istanbul周辺 (IST空港) ※追加
  ('Historic Areas of Istanbul', 'イスタンブール歴史地域', 'world_heritage', 'ビザンツ帝国とオスマン帝国の首都。トプカプ宮殿やスレイマニエ・モスクなど歴史的建造物群。', 'Istanbul', 'Turkey', 41.0082, 28.9784, 85),

  -- Madrid周辺 (MAD空港)
  ('Historic City of Toledo', 'トレド歴史地区', 'world_heritage', '中世の面影を残す古都。キリスト教、イスラム教、ユダヤ教の三文化が共存した歴史的都市。', 'Madrid', 'Spain', 39.8628, -4.0273, 80),
  ('Royal Site of San Lorenzo de El Escorial', 'エル・エスコリアル修道院', 'world_heritage', 'フェリペ2世が建設した巨大な宮殿修道院複合施設。スペイン黄金時代の象徴。', 'Madrid', 'Spain', 40.5895, -4.1477, 75),

  -- Munich周辺 (MUC空港)
  ('Würzburg Residence', 'ヴュルツブルク司教館', 'world_heritage', 'バロック様式の傑作宮殿。壮麗な階段の間の天井画が圧巻。', 'Munich', 'Germany', 49.7929, 9.9378, 75),

  -- Amsterdam周辺 (AMS空港) ※追加分
  ('Wadden Sea', 'ワッデン海', 'world_heritage', 'オランダ、ドイツ、デンマークにまたがる世界最大の干潟地帯。世界自然遺産。', 'Amsterdam', 'Netherlands', 53.4000, 5.2000, 70),

  -- Bangkok周辺 (BKK空港) ※追加
  ('Historic City of Ayutthaya', 'アユタヤ歴史地区', 'world_heritage', 'かつてのシャム王国の首都。400年間栄えた王朝の遺跡群。', 'Bangkok', 'Thailand', 14.3532, 100.5774, 80),

  -- Singapore周辺 (SIN空港)
  ('Singapore Botanic Gardens', 'シンガポール植物園', 'world_heritage', '1859年創設の熱帯植物園。東南アジア初の世界遺産登録植物園。', 'Singapore', 'Singapore', 1.3138, 103.8159, 70),

  -- Cairo周辺 (CAI空港) ※追加
  ('Memphis and its Necropolis', 'メンフィスとその墓地遺跡', 'world_heritage', '古代エジプト最古の首都。サッカラのピラミッド群を含む広大な遺跡地帯。', 'Cairo', 'Egypt', 29.8444, 31.2333, 85),
  ('Historic Cairo', 'カイロ歴史地区', 'world_heritage', 'イスラム建築の宝庫。1000以上のモスクと歴史的建造物が残る旧市街。', 'Cairo', 'Egypt', 30.0489, 31.2582, 75),

  -- Mexico City周辺 (MEX空港) ※追加
  ('Historic Centre of Mexico City', 'メキシコシティ歴史地区', 'world_heritage', 'アステカ帝国の首都テノチティトランの上に建設されたスペイン植民地都市。メトロポリタン大聖堂など。', 'Mexico City', 'Mexico', 19.4326, -99.1332, 80),

  -- Buenos Aires周辺 (EZE空港)
  ('Jesuit Missions of the Guaranis', 'グアラニーのイエズス会伝道所群', 'world_heritage', '17-18世紀に建設されたイエズス会の伝道所遺跡。先住民グアラニー族との共生の歴史。', 'Buenos Aires', 'Argentina', -27.3333, -55.5333, 70),

  -- Vancouver周辺 (YVR空港)
  ('SGang Gwaay', 'スカン・グアイ', 'world_heritage', 'ハイダ族の文化遺産。トーテムポールが残る神聖な島。カナダの世界遺産。', 'Vancouver', 'Canada', 52.0967, -131.2167, 75);

-- artsテーブルにも芸術関連の世界遺産を追加
INSERT INTO arts (name, name_ja, category, description, venue, city, country, location, impressed_points) VALUES
  ('Sistine Chapel', 'システィーナ礼拝堂', 'art_museum', 'ミケランジェロの天井画「天地創造」と壁画「最後の審判」で知られる。バチカン市国の至宝。', 'Vatican Museums', 'Rome', 'Italy', 'vatican', 90),
  ('Uffizi Gallery Masterpieces', 'ウフィツィ美術館の傑作群', 'art_museum', 'ボッティチェリ「ヴィーナスの誕生」など、ルネサンス美術の宝庫。フィレンツェ歴史地区の一部。', 'Uffizi Gallery', 'Barcelona', 'Spain', 'museum', 85);
