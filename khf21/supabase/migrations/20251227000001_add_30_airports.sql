-- 空港データを30個追加（合計50空港に）
-- 既に存在する空港コードは無視する

INSERT INTO airports (code, name, name_ja, city, country, latitude, longitude, region) VALUES
  -- アジア (10空港)
  ('PVG', 'Shanghai Pudong International Airport', '上海浦東国際空港', 'Shanghai', 'China', 31.1443, 121.8083, 'asia'),
  ('PEK', 'Beijing Capital International Airport', '北京首都国際空港', 'Beijing', 'China', 40.0799, 116.6031, 'asia'),
  ('DEL', 'Indira Gandhi International Airport', 'インディラ・ガンディー国際空港', 'New Delhi', 'India', 28.5562, 77.1000, 'asia'),
  ('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'チャトラパティ・シヴァージー国際空港', 'Mumbai', 'India', 19.0896, 72.8656, 'asia'),
  ('MNL', 'Ninoy Aquino International Airport', 'ニノイ・アキノ国際空港', 'Manila', 'Philippines', 14.5086, 121.0194, 'asia'),
  ('KUL', 'Kuala Lumpur International Airport', 'クアラルンプール国際空港', 'Kuala Lumpur', 'Malaysia', 2.7456, 101.7072, 'asia'),
  ('CGK', 'Soekarno-Hatta International Airport', 'スカルノ・ハッタ国際空港', 'Jakarta', 'Indonesia', -6.1256, 106.6558, 'asia'),
  ('TPE', 'Taiwan Taoyuan International Airport', '台湾桃園国際空港', 'Taipei', 'Taiwan', 25.0777, 121.2328, 'asia'),
  ('KIX', 'Kansai International Airport', '関西国際空港', 'Osaka', 'Japan', 34.4273, 135.2444, 'asia'),
  ('HAN', 'Noi Bai International Airport', 'ノイバイ国際空港', 'Hanoi', 'Vietnam', 21.2212, 105.8072, 'asia'),

  -- ヨーロッパ (8空港)
  ('MAD', 'Adolfo Suárez Madrid-Barajas Airport', 'アドルフォ・スアレス・マドリード＝バラハス空港', 'Madrid', 'Spain', 40.4983, -3.5676, 'europe'),
  ('MUC', 'Munich Airport', 'ミュンヘン空港', 'Munich', 'Germany', 48.3538, 11.7861, 'europe'),
  ('VIE', 'Vienna International Airport', 'ウィーン国際空港', 'Vienna', 'Austria', 48.1103, 16.5697, 'europe'),
  ('ZRH', 'Zurich Airport', 'チューリッヒ空港', 'Zurich', 'Switzerland', 47.4647, 8.5492, 'europe'),
  ('CPH', 'Copenhagen Airport', 'コペンハーゲン空港', 'Copenhagen', 'Denmark', 55.6180, 12.6508, 'europe'),
  ('ARN', 'Stockholm Arlanda Airport', 'ストックホルム・アーランダ空港', 'Stockholm', 'Sweden', 59.6498, 17.9238, 'europe'),
  ('ATH', 'Athens International Airport', 'アテネ国際空港', 'Athens', 'Greece', 37.9364, 23.9445, 'europe'),
  ('IST', 'Istanbul Airport', 'イスタンブール空港', 'Istanbul', 'Turkey', 41.2753, 28.7519, 'europe'),

  -- 北米 (5空港)
  ('ORD', 'O''Hare International Airport', 'オヘア国際空港', 'Chicago', 'USA', 41.9742, -87.9073, 'north_america'),
  ('DFW', 'Dallas/Fort Worth International Airport', 'ダラス・フォートワース国際空港', 'Dallas', 'USA', 32.8998, -97.0403, 'north_america'),
  ('MIA', 'Miami International Airport', 'マイアミ国際空港', 'Miami', 'USA', 25.7959, -80.2870, 'north_america'),
  ('SEA', 'Seattle-Tacoma International Airport', 'シアトル・タコマ国際空港', 'Seattle', 'USA', 47.4502, -122.3088, 'north_america'),
  ('YVR', 'Vancouver International Airport', 'バンクーバー国際空港', 'Vancouver', 'Canada', 49.1939, -123.1844, 'north_america'),

  -- 南米 (2空港)
  ('EZE', 'Ministro Pistarini International Airport', 'ミニストロ・ピスタリーニ国際空港', 'Buenos Aires', 'Argentina', -34.8222, -58.5358, 'south_america'),
  ('BOG', 'El Dorado International Airport', 'エルドラド国際空港', 'Bogota', 'Colombia', 4.7016, -74.1469, 'south_america'),

  -- アフリカ (2空港)
  ('CAI', 'Cairo International Airport', 'カイロ国際空港', 'Cairo', 'Egypt', 30.1219, 31.4056, 'africa'),
  ('JNB', 'O.R. Tambo International Airport', 'O・R・タンボ国際空港', 'Johannesburg', 'South Africa', -26.1392, 28.2460, 'africa'),

  -- オセアニア (2空港)
  ('MEL', 'Melbourne Airport', 'メルボルン空港', 'Melbourne', 'Australia', -37.6690, 144.8410, 'oceania'),
  ('AKL', 'Auckland Airport', 'オークランド空港', 'Auckland', 'New Zealand', -37.0082, 174.7850, 'oceania'),

  -- 中東 (1空港)
  ('DOH', 'Hamad International Airport', 'ハマド国際空港', 'Doha', 'Qatar', 25.2731, 51.6080, 'middle_east')
ON CONFLICT (code) DO NOTHING;
