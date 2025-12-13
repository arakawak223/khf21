-- サンプルデータ投入

-- 空港データ（世界主要20空港）
INSERT INTO airports (code, name, name_ja, city, country, latitude, longitude, region) VALUES
  ('NRT', 'Narita International Airport', '成田国際空港', 'Tokyo', 'Japan', 35.7647, 140.3864, 'Asia'),
  ('HND', 'Tokyo Haneda Airport', '東京国際空港（羽田）', 'Tokyo', 'Japan', 35.5494, 139.7798, 'Asia'),
  ('JFK', 'John F. Kennedy International Airport', 'ジョン・F・ケネディ国際空港', 'New York', 'USA', 40.6413, -73.7781, 'North America'),
  ('LAX', 'Los Angeles International Airport', 'ロサンゼルス国際空港', 'Los Angeles', 'USA', 33.9416, -118.4085, 'North America'),
  ('LHR', 'London Heathrow Airport', 'ロンドン・ヒースロー空港', 'London', 'UK', 51.4700, -0.4543, 'Europe'),
  ('CDG', 'Charles de Gaulle Airport', 'シャルル・ド・ゴール空港', 'Paris', 'France', 49.0097, 2.5479, 'Europe'),
  ('DXB', 'Dubai International Airport', 'ドバイ国際空港', 'Dubai', 'UAE', 25.2532, 55.3657, 'Middle East'),
  ('SIN', 'Singapore Changi Airport', 'シンガポール・チャンギ国際空港', 'Singapore', 'Singapore', 1.3644, 103.9915, 'Asia'),
  ('ICN', 'Incheon International Airport', '仁川国際空港', 'Seoul', 'South Korea', 37.4602, 126.4407, 'Asia'),
  ('HKG', 'Hong Kong International Airport', '香港国際空港', 'Hong Kong', 'Hong Kong', 22.3080, 113.9185, 'Asia'),
  ('SYD', 'Sydney Kingsford Smith Airport', 'シドニー国際空港', 'Sydney', 'Australia', -33.9399, 151.1753, 'Oceania'),
  ('FCO', 'Leonardo da Vinci Airport', 'レオナルド・ダ・ヴィンチ国際空港', 'Rome', 'Italy', 41.8003, 12.2389, 'Europe'),
  ('BCN', 'Barcelona El Prat Airport', 'バルセロナ・エル・プラット空港', 'Barcelona', 'Spain', 41.2974, 2.0833, 'Europe'),
  ('BKK', 'Suvarnabhumi Airport', 'スワンナプーム国際空港', 'Bangkok', 'Thailand', 13.6900, 100.7501, 'Asia'),
  ('SFO', 'San Francisco International Airport', 'サンフランシスコ国際空港', 'San Francisco', 'USA', 37.6213, -122.3790, 'North America'),
  ('FRA', 'Frankfurt Airport', 'フランクフルト空港', 'Frankfurt', 'Germany', 50.0379, 8.5622, 'Europe'),
  ('AMS', 'Amsterdam Schiphol Airport', 'アムステルダム・スキポール空港', 'Amsterdam', 'Netherlands', 52.3105, 4.7683, 'Europe'),
  ('GRU', 'São Paulo-Guarulhos International Airport', 'サンパウロ国際空港', 'São Paulo', 'Brazil', -23.4356, -46.4731, 'South America'),
  ('YYZ', 'Toronto Pearson International Airport', 'トロント・ピアソン国際空港', 'Toronto', 'Canada', 43.6777, -79.6248, 'North America'),
  ('MEX', 'Mexico City International Airport', 'メキシコシティ国際空港', 'Mexico City', 'Mexico', 19.4363, -99.0721, 'North America');

-- 航空会社データ
INSERT INTO airlines (code, name, name_ja, country) VALUES
  ('JAL', 'Japan Airlines', '日本航空', 'Japan'),
  ('ANA', 'All Nippon Airways', '全日本空輸', 'Japan'),
  ('UAL', 'United Airlines', 'ユナイテッド航空', 'USA'),
  ('AAL', 'American Airlines', 'アメリカン航空', 'USA'),
  ('BAW', 'British Airways', 'ブリティッシュ・エアウェイズ', 'UK'),
  ('AFR', 'Air France', 'エールフランス', 'France'),
  ('DLH', 'Lufthansa', 'ルフトハンザ ドイツ航空', 'Germany'),
  ('SIA', 'Singapore Airlines', 'シンガポール航空', 'Singapore'),
  ('EK', 'Emirates', 'エミレーツ航空', 'UAE'),
  ('QFA', 'Qantas', 'カンタス航空', 'Australia');

-- 名所データ
INSERT INTO attractions (name, name_ja, category, description, city, country, latitude, longitude, impressed_points) VALUES
  ('Eiffel Tower', 'エッフェル塔', 'landmark', 'パリの象徴として知られる鉄塔。1889年の万国博覧会のために建設され、今では世界で最も訪問者の多い有料モニュメントの一つ。', 'Paris', 'France', 48.8584, 2.2945, 50),
  ('Statue of Liberty', '自由の女神像', 'landmark', 'ニューヨーク港に立つ巨大な銅像。アメリカ合衆国の自由と民主主義の象徴として世界中に知られている。', 'New York', 'USA', 40.6892, -74.0445, 55),
  ('Great Wall of China', '万里の長城', 'world_heritage', '中国北部に築かれた長大な城壁。人類史上最大の建造物の一つで、宇宙からも見えると言われている。', 'Beijing', 'China', 40.4319, 116.5704, 70),
  ('Taj Mahal', 'タージ・マハル', 'world_heritage', 'インドを代表する白大理石の霊廟。ムガル帝国第5代皇帝シャー・ジャハーンが愛妃のために建設した。', 'Agra', 'India', 27.1751, 78.0421, 65),
  ('Machu Picchu', 'マチュ・ピチュ', 'world_heritage', 'ペルーのアンデス山脈に位置する古代インカ帝国の遺跡。「空中都市」として知られる神秘的な遺跡。', 'Cusco', 'Peru', -13.1631, -72.5450, 80),
  ('Colosseum', 'コロッセオ', 'world_heritage', 'ローマ帝国時代の円形闘技場。古代ローマ建築の傑作として知られ、5万人を収容できた。', 'Rome', 'Italy', 41.8902, 12.4922, 60),
  ('Sydney Opera House', 'シドニー・オペラハウス', 'landmark', 'シドニーのシンボルとなっている貝殻のような独特な形の建築物。20世紀を代表する近代建築。', 'Sydney', 'Australia', -33.8568, 151.2153, 55),
  ('Sagrada Familia', 'サグラダ・ファミリア', 'landmark', 'バルセロナにあるガウディ設計の未完成の教会。1882年に着工され、今も建設が続いている。', 'Barcelona', 'Spain', 41.4036, 2.1744, 65),
  ('Grand Canyon', 'グランドキャニオン', 'scenic_spot', 'アリゾナ州北部の巨大な峡谷。地球の歴史が刻まれた壮大な自然の造形美。', 'Arizona', 'USA', 36.1069, -112.1129, 75),
  ('Mount Fuji', '富士山', 'scenic_spot', '日本最高峰の霊峰。その優美な姿は古来より日本のシンボルとして親しまれている。', 'Shizuoka', 'Japan', 35.3606, 138.7274, 70);

-- スターデータ
INSERT INTO stars (name, name_ja, category, description, nationality, impressed_points) VALUES
  ('Freddie Mercury', 'フレディ・マーキュリー', 'musician', '伝説的ロックバンド「クイーン」のボーカリスト。圧倒的な歌唱力とステージパフォーマンスで知られる。', 'UK', 70),
  ('Michael Jackson', 'マイケル・ジャクソン', 'musician', 'キング・オブ・ポップと称される世界的スーパースター。「スリラー」は史上最も売れたアルバム。', 'USA', 80),
  ('Leonardo DiCaprio', 'レオナルド・ディカプリオ', 'movie_star', 'アカデミー賞受賞俳優。「タイタニック」「インセプション」などの名作に出演。', 'USA', 65),
  ('Pablo Picasso', 'パブロ・ピカソ', 'artist', '20世紀を代表する画家。キュビスムの創始者として美術史に革命をもたらした。', 'Spain', 75),
  ('Cristiano Ronaldo', 'クリスティアーノ・ロナウド', 'athlete', '世界最高峰のサッカー選手の一人。数々の記録を打ち立てた現代サッカー界のレジェンド。', 'Portugal', 70),
  ('Beyoncé', 'ビヨンセ', 'musician', '世界的に影響力のある歌手・女優。パワフルな歌声とパフォーマンスで多くのファンを魅了。', 'USA', 65),
  ('Tom Hanks', 'トム・ハンクス', 'movie_star', '名優として知られるハリウッドスター。「フォレスト・ガンプ」で2度目のアカデミー賞を受賞。', 'USA', 60),
  ('Serena Williams', 'セリーナ・ウィリアムズ', 'athlete', 'テニス界のレジェンド。グランドスラム23勝の記録を持つ女子テニス界の女王。', 'USA', 65),
  ('Ed Sheeran', 'エド・シーラン', 'musician', '現代を代表するシンガーソングライター。心に響く歌詞とメロディーで世界中にファンを持つ。', 'UK', 55),
  ('Banksy', 'バンクシー', 'artist', '正体不明の覆面アーティスト。社会風刺的なストリートアートで世界的に知られる。', 'UK', 70);

-- アートデータ
INSERT INTO arts (name, name_ja, category, description, venue, city, country, impressed_points) VALUES
  ('Cirque du Soleil', 'シルク・ドゥ・ソレイユ', 'performance', '世界最高峰のエンターテイメント集団。アクロバット、音楽、照明が融合した幻想的なショー。', 'Various Venues', 'Las Vegas', 'USA', 75),
  ('La Bohème', 'ラ・ボエーム', 'musical', 'プッチーニの名作オペラ。パリの若者たちの愛と青春を描いた感動的な物語。', 'Metropolitan Opera', 'New York', 'USA', 70),
  ('Swan Lake', '白鳥の湖', 'performance', 'チャイコフスキーのバレエ音楽の最高傑作。優雅で美しいバレエの代名詞。', 'Bolshoi Theatre', 'Moscow', 'Russia', 65),
  ('The Beatles: Love', 'ザ・ビートルズ：ラブ', 'concert', 'ビートルズの音楽とシルク・ドゥ・ソレイユのコラボレーション。音楽史に残る名曲の数々。', 'The Mirage', 'Las Vegas', 'USA', 80),
  ('Street Performance', '大道芸', 'street_art', '路上で繰り広げられる驚きのパフォーマンス。ジャグリング、マジック、アクロバットなど。', 'Covent Garden', 'London', 'UK', 40),
  ('Flamenco Show', 'フラメンコショー', 'performance', '情熱的なスペインの伝統舞踊。激しいリズムと魂のこもった踊りが観客を魅了。', 'Tablao Cordobes', 'Barcelona', 'Spain', 55),
  ('Jazz Night', 'ジャズナイト', 'concert', '本場のジャズクラブで聴く生演奏。即興演奏が織りなす至高の音楽体験。', 'Blue Note', 'New York', 'USA', 50),
  ('Kabuki Performance', '歌舞伎', 'performance', '日本の伝統芸能。華やかな衣装と独特の演技で江戸時代から続く文化を体験。', 'Kabukiza Theatre', 'Tokyo', 'Japan', 60),
  ('Broadway Musical', 'ブロードウェイミュージカル', 'musical', '世界最高峰のミュージカルの本場。感動的なストーリーと圧倒的な歌唱力。', 'Broadway Theatre', 'New York', 'USA', 75),
  ('Louvre Museum', 'ルーヴル美術館', 'performance', '世界最大級の美術館。モナ・リザをはじめ人類の至宝が集結。', 'Louvre Museum', 'Paris', 'France', 70);

-- グルメデータ
INSERT INTO gourmet (name, name_ja, description, city, country, cuisine_type, impressed_points) VALUES
  ('Sushi', '寿司', '新鮮な魚介を使った日本を代表する料理。職人の技が光る繊細な味わい。', 'Tokyo', 'Japan', '日本料理', 60),
  ('Croissant', 'クロワッサン', 'バターの香り豊かなフランスの伝統的なパン。サクサクの食感が絶品。', 'Paris', 'France', 'フランス料理', 45),
  ('Pizza Napoletana', 'ナポリピッツァ', '本場ナポリの窯焼きピッツァ。モチモチの生地とシンプルな素材が織りなす至福の味。', 'Naples', 'Italy', 'イタリア料理', 55),
  ('Peking Duck', '北京ダック', '皮がパリパリの中国の名物料理。薄いクレープで包んで食べる伝統的なスタイル。', 'Beijing', 'China', '中国料理', 65),
  ('Tacos', 'タコス', 'メキシコの国民食。トルティーヤに様々な具材を包んだストリートフード。', 'Mexico City', 'Mexico', 'メキシコ料理', 50),
  ('Fish and Chips', 'フィッシュアンドチップス', 'イギリスの代表的な料理。サクサクの衣の魚とホクホクのポテト。', 'London', 'UK', 'イギリス料理', 45),
  ('Paella', 'パエリア', 'スペインのバレンシア地方発祥の米料理。サフランの香りと海の幸が絶妙。', 'Barcelona', 'Spain', 'スペイン料理', 60),
  ('Pho', 'フォー', 'ベトナムの麺料理。あっさりしたスープと米麺が絶妙にマッチ。', 'Hanoi', 'Vietnam', 'ベトナム料理', 50),
  ('BBQ Ribs', 'BBQリブ', 'アメリカ南部の名物料理。スモークの香りと甘辛いソースが食欲をそそる。', 'Texas', 'USA', 'アメリカ料理', 55),
  ('Pad Thai', 'パッタイ', 'タイの代表的な焼きそば。甘酸っぱいタレとピーナッツの食感が特徴。', 'Bangkok', 'Thailand', 'タイ料理', 50);

-- トラブルデータ
INSERT INTO troubles (name, name_ja, category, description, severity, impressed_points_loss) VALUES
  ('Pickpocket', 'スリ被害', 'theft', '人混みの中で財布をすられてしまいました。貴重品の管理には十分注意が必要です。', 2, -20),
  ('Flight Delay', '飛行機の遅延', 'flight_delay', '悪天候により飛行機が大幅に遅延。予定が大きく狂ってしまいました。', 2, -15),
  ('Lost Luggage', '荷物の紛失', 'robbery', '空港で預けた荷物が行方不明に。旅の必需品がなくなってしまい困っています。', 3, -25),
  ('Food Poisoning', '食中毒', 'fire', 'レストランで食べた料理にあたってしまいました。体調が悪化しています。', 3, -30),
  ('Hotel Overbooking', 'ホテルのオーバーブッキング', 'flight_delay', '予約したホテルが満室で泊まれません。深夜に宿を探す羽目に。', 2, -20),
  ('Scam', '詐欺被害', 'robbery', '親切そうな人に声をかけられ、気づいたら高額な料金を請求されました。', 3, -35),
  ('Natural Disaster', '自然災害', 'fire', '突然の地震により一時的に避難が必要に。旅程が大きく変更を余儀なくされました。', 4, -40),
  ('Transportation Strike', '交通機関のストライキ', 'flight_delay', '予定していた電車やバスがストライキで運休。移動手段を失ってしまいました。', 2, -15);

-- トラブル解消データ
INSERT INTO trouble_resolutions (trouble_id, helper_type, resolution_text, encouragement_text, impressed_points)
SELECT
  id,
  CASE
    WHEN name_ja = 'スリ被害' THEN 'police'
    WHEN name_ja = '飛行機の遅延' THEN 'tour_guide'
    WHEN name_ja = '荷物の紛失' THEN 'local_person'
    WHEN name_ja = '食中毒' THEN 'doctor'
    WHEN name_ja = 'ホテルのオーバーブッキング' THEN 'tour_guide'
    WHEN name_ja = '詐欺被害' THEN 'police'
    WHEN name_ja = '自然災害' THEN 'local_person'
    WHEN name_ja = '交通機関のストライキ' THEN 'japanese_traveler'
  END,
  CASE
    WHEN name_ja = 'スリ被害' THEN '警察が迅速に対応し、被害届の手続きを手伝ってくれました。現地の日本大使館への連絡もサポートしてもらえました。'
    WHEN name_ja = '飛行機の遅延' THEN 'ツアーガイドが代替便を手配してくれ、待ち時間を有効に使える観光プランを提案してくれました。'
    WHEN name_ja = '荷物の紛失' THEN '地元の親切な人が、必要最低限の日用品を購入できるお店を案内してくれました。言葉の壁も乗り越えて助けてくれました。'
    WHEN name_ja = '食中毒' THEN '医者がすぐに診察してくれ、適切な処置と薬を処方してくれました。数日で回復することができました。'
    WHEN name_ja = 'ホテルのオーバーブッキング' THEN 'ツアーガイドが近隣のより良いホテルを緊急で手配してくれ、差額も補償してもらえました。'
    WHEN name_ja = '詐欺被害' THEN '警察と地元の刑事が協力して、詐欺師を捕まえてくれました。被害金額も取り戻すことができました。'
    WHEN name_ja = '自然災害' THEN '地元の人々が避難所まで案内してくれ、食事や毛布を分けてくれました。危機的状況でも温かい心に触れました。'
    WHEN name_ja = '交通機関のストライキ' THEN '偶然出会った日本人旅行者が、レンタカーで目的地まで同乗させてくれました。同じ境遇の仲間に助けられました。'
  END,
  CASE
    WHEN name_ja = 'スリ被害' THEN '大変でしたね。でも、これも旅の経験です。次はもっと気をつけて楽しんでください。'
    WHEN name_ja = '飛行機の遅延' THEN '遅延は残念ですが、こういう時こそ新しい発見があります。前向きに行きましょう。'
    WHEN name_ja = '荷物の紛失' THEN '荷物は後で見つかるはずです。今は旅を楽しむことに集中しましょう。'
    WHEN name_ja = '食中毒' THEN 'しっかり休んでください。体調が戻ったら、また美味しいものを食べに行きましょう。'
    WHEN name_ja = 'ホテルのオーバーブッキング' THEN '結果的により良いホテルに泊まれて良かったですね。災い転じて福となすです。'
    WHEN name_ja = '詐欺被害' THEN '無事に解決できて何よりです。これからは十分気をつけてくださいね。'
    WHEN name_ja = '自然災害' THEN '命が無事で何よりです。人々の優しさに触れられたのも貴重な経験でした。'
    WHEN name_ja = '交通機関のストライキ' THEN '旅先での出会いは特別ですね。困った時に助け合えるのが旅の醍醐味です。'
  END,
  CASE
    WHEN name_ja = 'スリ被害' THEN 45
    WHEN name_ja = '飛行機の遅延' THEN 35
    WHEN name_ja = '荷物の紛失' THEN 40
    WHEN name_ja = '食中毒' THEN 50
    WHEN name_ja = 'ホテルのオーバーブッキング' THEN 35
    WHEN name_ja = '詐欺被害' THEN 55
    WHEN name_ja = '自然災害' THEN 60
    WHEN name_ja = '交通機関のストライキ' THEN 40
  END
FROM troubles;
