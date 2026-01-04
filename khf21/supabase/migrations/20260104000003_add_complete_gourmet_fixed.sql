-- 50都市すべてのグルメデータを追加（各都市3件、計150件）

INSERT INTO gourmet (name, name_ja, type, description, city, country, latitude, longitude, impressed_points) VALUES

-- Toronto (3 gourmet)
('St. Lawrence Market', 'セント・ローレンス・マーケット', 'market', '1803年創業の歴史的市場。ピーミールベーコンサンドイッチは必食。世界最高の食品市場の一つ。', 'Toronto', 'Canada', 43.6487, -79.3716, 70),
('Canoe Restaurant - Canadian Cuisine', 'カヌー - カナダ料理', 'restaurant', '54階からの絶景とともに味わう現代カナダ料理。カナダ産食材を使った革新的な料理。', 'Toronto', 'Canada', 43.6474, -79.3813, 80),
('Pai Northern Thai Kitchen', 'パイ タイ料理', 'restaurant', 'トロントで最も人気のタイ料理店。北部タイの伝統料理を本格的に再現。', 'Toronto', 'Canada', 43.6472, -79.4002, 70),

-- Tokyo (3 gourmet)
('Tsukiji Outer Market', '築地場外市場', 'market', '新鮮な海鮮丼、玉子焼き、マグロの解体ショー。東京の食文化の中心地。', 'Tokyo', 'Japan', 35.6654, 139.7707, 85),
('Sukiyabashi Jiro', 'すきやばし次郎', 'restaurant', '三つ星の鮨店。小野二郎の匠の技が光る江戸前鮨の最高峰。', 'Tokyo', 'Japan', 35.6718, 139.7633, 90),
('Ichiran Ramen Shibuya', '一蘭 渋谷店', 'restaurant', '個室ブースで味わう濃厚豚骨ラーメン。自分好みにカスタマイズできる独自システム。', 'Tokyo', 'Japan', 35.6595, 139.7004, 75),

-- Cairo (3 gourmet)
('Abou El Sid', 'アブー・エル・シッド', 'restaurant', '伝統的エジプト料理の名店。コシャリ、モロヘイヤスープ、ピジョン料理を優雅な空間で。', 'Cairo', 'Egypt', 30.0626, 31.2200, 75),
('Khan el-Khalili Food Stalls', 'ハン・ハリーリ 屋台街', 'street_food', '揚げパン「ターメイヤ」、ハト料理、ミントティー。中世から続く市場の味。', 'Cairo', 'Egypt', 30.0475, 31.2625, 70),
('Zooba', 'ズーバ', 'restaurant', 'モダンなエジプト・ストリートフード。伝統料理を現代的にアレンジした人気店。', 'Cairo', 'Egypt', 30.0571, 31.2272, 70),

-- Istanbul (3 gourmet)
('Çiya Sofrası', 'チヤ・ソフラス', 'restaurant', 'トルコ各地の郷土料理。失われつつある伝統レシピを発掘し提供する文化的な店。', 'Istanbul', 'Turkey', 40.9952, 29.0280, 80),
('Grand Bazaar Food Court', 'グランドバザール フードコート', 'street_food', 'ドネルケバブ、バクラヴァ、トルコアイス。市場の中で味わう本場の味。', 'Istanbul', 'Turkey', 41.0108, 28.9680, 70),
('Mikla Restaurant', 'ミクラ・レストラン', 'restaurant', 'ボスポラス海峡の絶景。アナトリア料理を北欧技法で昇華させた革新的トルコ料理。', 'Istanbul', 'Turkey', 41.0287, 28.9783, 85),

-- Sydney (3 gourmet)
('Sydney Fish Market', 'シドニー・フィッシュマーケット', 'market', '南半球最大の魚市場。新鮮なオイスター、ロブスター、サーモンを堪能。', 'Sydney', 'Australia', -33.8740, 151.1959, 80),
('Quay Restaurant', 'キー・レストラン', 'restaurant', 'オペラハウスを望む三つ星レストラン。オーストラリア食材を使った芸術的な料理。', 'Sydney', 'Australia', -33.8565, 151.2109, 90),
('Harry''s Cafe de Wheels', 'ハリーズ・カフェ・ド・ホイールズ', 'street_food', '1938年創業の伝説的パイ屋台。タイガーパイ（ミートパイ+マッシュポテト+グレービー）が名物。', 'Sydney', 'Australia', -33.8670, 151.2243, 65),

-- New York (3 gourmet)
('Katz''s Delicatessen', 'カッツ・デリカテッセン', 'restaurant', '1888年創業のユダヤ系デリ。分厚いパストラミサンドイッチはニューヨークの象徴。', 'New York', 'USA', 40.7223, -73.9873, 80),
('Eleven Madison Park', 'イレブン・マディソン・パーク', 'restaurant', '世界ベストレストラン1位獲得。完全植物ベースの革新的ファインダイニング。', 'New York', 'USA', 40.7415, -73.9874, 90),
('Joe''s Pizza', 'ジョーズ・ピザ', 'street_food', 'ニューヨークスタイルピザの名店。薄くてパリッとした生地に濃厚なチーズ。', 'New York', 'USA', 40.7307, -74.0024, 70),

-- London (3 gourmet)
('Dishoom', 'ディショーム', 'restaurant', 'ボンベイスタイルのカフェ。英国インド料理を再定義した人気店。朝食のベーコンナンが絶品。', 'London', 'UK', 51.5153, -0.1239, 75),
('Borough Market', 'バラ・マーケット', 'market', '千年の歴史を持つ食品市場。世界中の食材と英国の伝統料理が集まる。', 'London', 'UK', 51.5055, -0.0910, 80),
('The Fat Duck', 'ザ・ファット・ダック', 'restaurant', 'ヘストン・ブルメンタールの三つ星。科学と芸術が融合した分子ガストロノミーの殿堂。', 'London', 'UK', 51.4867, -0.6446, 90),

-- Paris (3 gourmet)
('L''Arpège', 'ラルページュ', 'restaurant', 'アラン・パッサールの三つ星。野菜が主役の革新的フレンチ。自家菜園の食材使用。', 'Paris', 'France', 48.8558, 2.3135, 90),
('Du Pain et des Idées', 'デュ・パン・エ・デ・ジデ', 'bakery', 'パリ最高峰のブーランジェリー。エスカルゴ・ピスターシュとパン・デ・ザミは必食。', 'Paris', 'France', 48.8709, 2.3638, 75),
('Le Comptoir du Relais', 'ル・コントワール・デュ・ルレ', 'restaurant', 'サンジェルマンの人気ビストロ。伝統的フレンチを気軽に楽しめる。予約困難な名店。', 'Paris', 'France', 48.8514, 2.3396, 80),

-- Beijing (3 gourmet)
('Peking Duck at Quanjude', '全聚德 北京ダック', 'restaurant', '1864年創業の北京ダックの老舗。パリパリの皮と柔らかい肉を薄餅に包んで。', 'Beijing', 'China', 40.7539, 116.4045, 85),
('Donghuamen Night Market', '東華門夜市', 'street_food', 'サソリ、ヒトデ、羊の串焼き。北京の伝統的屋台料理とゲテモノ料理の宝庫。', 'Beijing', 'China', 39.9185, 116.4085, 75),
('TRB Hutong', 'TRB胡同', 'restaurant', '四合院を改装した高級レストラン。フレンチ技法で昇華させた中国料理。', 'Beijing', 'China', 39.9289, 116.3893, 85),

-- Mumbai (3 gourmet)
('Trishna Restaurant', 'トリシュナ', 'restaurant', 'ムンバイ最高のシーフード。バターガーリッククラブは世界的に有名な一品。', 'Mumbai', 'India', 18.9496, 72.8206, 80),
('Mohammed Ali Road Food Street', 'モハメド・アリ・ロード 屋台街', 'street_food', 'ラマダン期間中に輝く屋台街。ケバブ、ビリヤニ、ハリームなどイスラム料理の饗宴。', 'Mumbai', 'India', 18.9564, 72.8322, 75),
('Britannia & Co.', 'ブリタニア', 'restaurant', '1923年創業のパールシー料理店。ベリープルラオは90年以上愛される名物料理。', 'Mumbai', 'India', 18.9551, 72.8321, 70),

-- Los Angeles (3 gourmet)
('Grand Central Market', 'グランド・セントラル・マーケット', 'market', '1917年創業の歴史的市場。タコス、エッグサンド、オイスターなど多様な食文化。', 'Los Angeles', 'USA', 34.0508, -118.2489, 75),
('n/naka', 'エヌ・ナカ', 'restaurant', '二つ星の日本料理店。懐石の伝統とカリフォルニア食材の融合。13品の芸術的コース。', 'Los Angeles', 'USA', 34.0681, -118.3610, 90),
('In-N-Out Burger', 'イン・アンド・アウト・バーガー', 'fast_food', '西海岸を代表するバーガーチェーン。シンプルだが新鮮な食材で作る完璧なハンバーガー。', 'Los Angeles', 'USA', 34.0522, -118.2437, 65),

-- Moscow (3 gourmet)
('White Rabbit', 'ホワイト・ラビット', 'restaurant', '世界ベストレストラン常連。モスクワの眺望とともに楽しむモダンロシア料理。', 'Moscow', 'Russia', 55.7558, 37.5821, 90),
('Cafe Pushkin', 'カフェ・プーシキン', 'restaurant', '帝政ロシアの雰囲気。ボルシチ、ビーフストロガノフなど伝統料理を優雅に味わう。', 'Moscow', 'Russia', 55.7647, 37.6066, 80),
('Danilovsky Market', 'ダニーロフスキー市場', 'market', 'モスクワ最高の食品市場。キャビア、黒パン、ピロシキなどロシア料理の宝庫。', 'Moscow', 'Russia', 55.7136, 37.6288, 70),

-- Dubai (3 gourmet)
('Al Mahara at Burj Al Arab', 'アル・マハラ (ブルジュ・アル・アラブ)', 'restaurant', '水族館を眺めながらシーフード。世界一豪華なホテルの中の夢のレストラン。', 'Dubai', 'UAE', 25.1413, 55.1853, 90),
('Al Mallah', 'アル・マラ', 'street_food', '24時間営業のレバノン料理店。シャワルマ、ファラフェルが絶品で地元民にも人気。', 'Dubai', 'UAE', 25.2288, 55.2799, 65),
('Arabian Tea House', 'アラビアン・ティーハウス', 'restaurant', 'オールド・ドバイの伝統家屋。エミラティ料理とアラビアコーヒーで中東の味を体験。', 'Dubai', 'UAE', 25.2644, 55.2976, 70),

-- Sao Paulo (3 gourmet)
('D.O.M.', 'ドン', 'restaurant', 'アレックス・アタラの二つ星。アマゾンの食材を使った革新的ブラジル料理。', 'Sao Paulo', 'Brazil', -23.5614, -46.6630, 90),
('Mercado Municipal', 'ムニシパル市場', 'market', '1933年創業の中央市場。モルタデッラサンド、パステル、トロピカルフルーツが名物。', 'Sao Paulo', 'Brazil', -23.5406, -46.6297, 75),
('Mocotó', 'モコト', 'restaurant', 'ブラジル北東部料理の名店。フェイジョアーダ、カルネ・デ・ソルなど家庭の味。', 'Sao Paulo', 'Brazil', -23.5456, -46.5808, 80),

-- Mexico City (3 gourmet)
('Pujol', 'プホル', 'restaurant', 'エンリケ・オルベラの世界的名店。2000日熟成のモレソースは究極の一品。', 'Mexico City', 'Mexico', 19.4284, -99.1959, 90),
('Mercado de San Juan', 'サン・ファン市場', 'market', 'エキゾチックな食材市場。イグアナ、ワニ、昆虫から高級食材まで何でも揃う。', 'Mexico City', 'Mexico', 19.4324, -99.1422, 75),
('El Cardenal', 'エル・カルデナル', 'restaurant', 'メキシコ伝統朝食の名店。チラキレス、タマレス、ホットチョコレートが絶品。', 'Mexico City', 'Mexico', 19.4341, -99.1376, 75),

-- Seoul (3 gourmet)
('Gwangjang Market', '広蔵市場', 'market', '100年の歴史を持つ市場。ビビンバ、マッコリ、チヂミ、ユッケなど韓国の味が集結。', 'Seoul', 'South Korea', 37.5701, 126.9998, 80),
('Jungsik', 'チョンシク', 'restaurant', '二つ星のモダンコリアン。伝統料理を革新的な技法で再解釈した芸術的料理。', 'Seoul', 'South Korea', 37.5218, 127.0209, 90),
('Myeongdong Kyoja', '明洞餃子', 'restaurant', '1966年創業の名店。シンプルなカルグクス（手打ち麺）とマンドゥ（餃子）が絶品。', 'Seoul', 'South Korea', 37.5636, 126.9850, 70),

-- Jakarta (3 gourmet)
('Lara Djonggrang', 'ララ・ジョングラン', 'restaurant', 'ジャワの宮殿のような空間。インドネシア全土の伝統料理を現代的に提供。', 'Jakarta', 'Indonesia', -6.2251, 106.8099, 80),
('Jalan Sabang Food Street', 'サバン通り 屋台街', 'street_food', 'ジャカルタの胃袋。ナシゴレン、サテ、ソトアヤムなど24時間賑わう屋台街。', 'Jakarta', 'Indonesia', -6.1844, 106.8343, 70),
('Namaaz Dining', 'ナマーズ・ダイニング', 'restaurant', '東南アジア初の分子ガストロノミー。インドネシア食材を使った16品の革新的コース。', 'Jakarta', 'Indonesia', -6.2088, 106.8456, 85),

-- Lagos (3 gourmet)
('Nkoyo', 'ンコヨ', 'restaurant', 'ナイジェリア料理の高級店。ジョロフライス、エグシスープ、スヤなど西アフリカの味。', 'Lagos', 'Nigeria', 6.4308, 3.4201, 75),
('Buka', 'ブカ', 'restaurant', 'モダンなナイジェリア料理。伝統の「ブカ」（簡易食堂）スタイルを洗練された空間で。', 'Lagos', 'Nigeria', 6.4281, 3.4219, 70),
('Terra Kulture Restaurant', 'テラ・カルチャー・レストラン', 'restaurant', '文化センター内のレストラン。ナイジェリア各地の郷土料理を芸術とともに味わう。', 'Lagos', 'Nigeria', 6.4390, 3.4213, 70),

-- Bangkok (3 gourmet)
('Gaggan Anand', 'ガガン・アナンド', 'restaurant', '世界ベストレストラン常連。インド料理を分子ガストロノミーで昇華させた革新的料理。', 'Bangkok', 'Thailand', 13.7366, 100.5442, 90),
('Jay Fai', 'ジェイ・ファイ', 'street_food', 'ミシュラン一つ星の屋台。カニオムレツ、トムヤムクン、パッタイが絶品。', 'Bangkok', 'Thailand', 13.7585, 100.5026, 85),
('Chatuchak Weekend Market Food Section', 'チャトゥチャック市場 食品エリア', 'market', '世界最大級の市場。マンゴー餅米、パッタイ、タイティー、ココナッツアイスなど。', 'Bangkok', 'Thailand', 13.7997, 100.5495, 75),

-- Tehran (3 gourmet)
('Divan Restaurant', 'ディーヴァン', 'restaurant', 'ペルシャ宮廷料理の伝統。チェロウ・キャバーブ、フェセンジャーンなど王室の味。', 'Tehran', 'Iran', 35.7580, 51.4180, 80),
('Grand Bazaar Food Court', 'グランドバザール フードコート', 'street_food', 'バザールの食堂。アーブグーシュト、クービデ、ペルシャ風アイスクリーム。', 'Tehran', 'Iran', 35.6737, 51.4208, 70),
('Moslem Restaurant', 'モスレム', 'restaurant', '1952年創業の庶民派食堂。豆とハーブの煮込み「バグラ」は絶品の国民食。', 'Tehran', 'Iran', 35.6719, 51.4258, 65),

-- Buenos Aires (3 gourmet)
('Don Julio', 'ドン・フリオ', 'restaurant', 'ブエノスアイレス最高のパリージャ（炭火焼き肉）。熟成アルゼンチンビーフが絶品。', 'Buenos Aires', 'Argentina', -34.5889, -58.4260, 85),
('La Cabrera', 'ラ・カブレラ', 'restaurant', '巨大なステーキとボリュームたっぷりの付け合わせ。アルゼンチン肉料理の真髄。', 'Buenos Aires', 'Argentina', -34.5868, -58.4255, 80),
('San Telmo Market', 'サン・テルモ市場', 'market', '日曜のアンティーク市では屋台も。エンパナーダ、チョリパン、マテ茶を楽しめる。', 'Buenos Aires', 'Argentina', -34.6212, -58.3723, 70),

-- Osaka (3 gourmet)
('Dotonbori Street Food', '道頓堀 屋台街', 'street_food', 'たこ焼き、お好み焼き、串カツ。「天下の台所」大阪の食文化を一度に体験。', 'Osaka', 'Japan', 34.6686, 135.5023, 80),
('Hajime', 'ハジメ', 'restaurant', '三つ星の革新的フレンチ。大阪の食材を使った科学と芸術が融合した料理。', 'Osaka', 'Japan', 34.6790, 135.4962, 90),
('Kuromon Ichiba Market', '黒門市場', 'market', '「大阪の台所」。新鮮なフグ、神戸牛、寿司、フルーツを食べ歩きできる。', 'Osaka', 'Japan', 34.6660, 135.5055, 75),

-- Rio de Janeiro (3 gourmet)
('Confeitaria Colombo', 'コンフェイタリア・コロンボ', 'cafe', '1894年創業の歴史的カフェ。ベルエポック様式の内装でブラジルスイーツを。', 'Rio de Janeiro', 'Brazil', -22.9033, -43.1765, 75),
('Churrascaria Palace', 'シュラスカリア・パラス', 'restaurant', 'リオ最高のシュラスコ。20種類以上の肉をロデジオスタイルで味わい尽くす。', 'Rio de Janeiro', 'Brazil', -22.9668, -43.1882, 80),
('Copacabana Beach Kiosks', 'コパカバーナビーチ 屋台', 'street_food', 'ビーチ沿いの屋台。カイピリーニャ、アサイーボウル、パステルを海を見ながら。', 'Rio de Janeiro', 'Brazil', -22.9711, -43.1822, 65),

-- Karachi (3 gourmet)
('Kolachi', 'コラチ', 'restaurant', '海沿いのレストラン。BBQとパキスタン料理を夕日と共に。ビリヤニが絶品。', 'Karachi', 'Pakistan', 24.8076, 67.0293, 75),
('Burns Road Food Street', 'バーンズ・ロード 屋台街', 'street_food', 'カラチの胃袋。ニハリ、ハリーム、ラブリ、ビリヤニなど伝統料理が集まる聖地。', 'Karachi', 'Pakistan', 24.8620, 67.0143, 80),
('Café Flo', 'カフェ・フロー', 'cafe', 'パキスタンのカフェ文化。チャイ、サモサ、ケバブロールを若者が集う空間で。', 'Karachi', 'Pakistan', 24.8607, 67.0011, 65),

-- Manila (3 gourmet)
('Toyo Eatery', 'トヨ・イータリー', 'restaurant', 'フィリピン料理の革新。バロット、シシグなど伝統料理を現代的に再解釈。', 'Manila', 'Philippines', 14.5547, 121.0244, 85),
('Quiapo Market', 'キアポ市場', 'market', 'マニラ最大の市場。バロット、ハロハロ、レチョンなどフィリピン料理の宝庫。', 'Manila', 'Philippines', 14.5988, 120.9831, 70),
('Jollibee', 'ジョリビー', 'fast_food', 'フィリピン国民食。チキンジョイとスパゲッティは甘めの味付けが特徴。', 'Manila', 'Philippines', 14.5995, 120.9842, 60),

-- Shanghai (3 gourmet)
('Ultraviolet by Paul Pairet', 'ウルトラバイオレット', 'restaurant', '世界初の感覚没入型レストラン。三つ星の革新的体験型ダイニング。', 'Shanghai', 'China', 31.2304, 121.4737, 90),
('Yang''s Fry-Dumpling', '小杨生煎', 'street_food', '上海名物・生煎包（焼き小籠包）の名店。外はカリッ、中はジューシー。', 'Shanghai', 'China', 31.2252, 121.4737, 70),
('Yuyuan Bazaar Food Street', '豫園 美食街', 'market', '南翔饅頭店の小籠包、五香豆、梨膏糖。上海の伝統的スナックが集まる。', 'Shanghai', 'China', 31.2274, 121.4916, 75),

-- Guangzhou (3 gourmet)
('Bing Sheng Mansion', '炳胜', 'restaurant', '広州の高級飲茶。伝統的な点心から創作点心まで種類豊富。', 'Guangzhou', 'China', 23.1291, 113.2644, 80),
('Shangxiajiu Pedestrian Street', '上下九路 歩行街', 'street_food', '広東料理の屋台天国。腸粉、叉焼包、エッグタルトなど広州の味が集結。', 'Guangzhou', 'China', 23.1189, 113.2479, 75),
('Guangzhou Restaurant', '広州酒家', 'restaurant', '1935年創業の老舗。広東料理の伝統を守り続ける格式高い名店。', 'Guangzhou', 'China', 23.1255, 113.2559, 80),

-- Delhi (3 gourmet)
('Indian Accent', 'インディアン・アクセント', 'restaurant', 'インド料理の革新。伝統のスパイスと現代技法の融合。世界的に評価される名店。', 'Delhi', 'India', 28.5932, 77.2312, 90),
('Chandni Chowk Food Tour', 'チャンドニー・チョーク 食べ歩き', 'street_food', 'オールドデリーの食の中心地。パラータ、チャート、ジャレビなど200年の味。', 'Delhi', 'India', 28.6507, 77.2334, 80),
('Karim''s', 'カリームズ', 'restaurant', '1913年創業のムガル料理店。マトンコルマ、バターチキンはデリー必食の一品。', 'Delhi', 'India', 28.6507, 77.2300, 75),

-- Shenzhen (3 gourmet)
('Laurel Restaurant', '桂园', 'restaurant', '広東料理の高級店。新鮮な海鮮と伝統的な点心が自慢。深圳湾の景色も美しい。', 'Shenzhen', 'China', 22.5264, 113.9345, 80),
('Dongmen Food Street', '東門美食街', 'street_food', '深圳の若者の胃袋。広東料理から世界各国の屋台料理まで24時間賑わう。', 'Shenzhen', 'China', 22.5485, 114.1189, 70),
('Hai Di Lao Hot Pot', '海底撈火鍋', 'restaurant', '中国全土で人気の火鍋チェーン。手厚いサービスとエンターテイメントも楽しめる。', 'Shenzhen', 'China', 22.5429, 114.1094, 75),

-- Bogota (3 gourmet)
('Leo Cocina y Cava', 'レオ', 'restaurant', 'コロンビア料理の革新。地元食材を使った洗練された料理とワインペアリング。', 'Bogota', 'Colombia', 4.6486, -74.0594, 85),
('La Puerta Falsa', 'ラ・プエルタ・ファルサ', 'restaurant', '1816年創業の最古の食堂。アヒアコ、タマレス、ホットチョコレートが名物。', 'Bogota', 'Colombia', 4.5988, -74.0744, 75),
('Andrés Carne de Res', 'アンドレス・カルネ・デ・レス', 'restaurant', 'コロンビアの饗宴。巨大な空間で肉料理、音楽、ダンスを楽しむ総合エンターテイメント。', 'Bogota', 'Colombia', 4.7110, -74.0721, 80),

-- Lima (3 gourmet)
('Central', 'セントラル', 'restaurant', '世界ベストレストラン1位。ペルー全土の標高別食材を使った革新的料理。', 'Lima', 'Peru', -12.1000, -77.0301, 90),
('La Mar Cebichería', 'ラ・マル', 'restaurant', 'リマ最高のセビーチェ。新鮮な魚介をライムと唐辛子でマリネしたペルーの国民食。', 'Lima', 'Peru', -12.1137, -77.0293, 85),
('Surquillo Market', 'スルキージョ市場', 'market', '地元民の市場。新鮮なフルーツジュース、アンティクーチョ（牛心臓串焼き）が絶品。', 'Lima', 'Peru', -12.1104, -77.0178, 70),

-- Chennai (3 gourmet)
('Murugan Idli Shop', 'ムルガン・イドゥリ店', 'restaurant', '南インド朝食の名店。ふわふわのイドゥリとサンバル、チャトニーの完璧な組み合わせ。', 'Chennai', 'India', 13.0569, 80.2574, 70),
('Dakshin at ITC Grand Chola', 'ダクシン', 'restaurant', '南インド4州の伝統料理。バナナの葉の上で供される本格的タミル料理。', 'Chennai', 'India', 13.0102, 80.2206, 85),
('Marina Beach Food Stalls', 'マリーナビーチ 屋台', 'street_food', 'インド最長のビーチ沿い。スンダル、バジ、フライドフィッシュを夕日と共に。', 'Chennai', 'India', 13.0499, 80.2824, 65),

-- Hong Kong (3 gourmet)
('Tim Ho Wan', '添好運', 'restaurant', 'ミシュラン一つ星の点心店。BBQポークバンは世界一安い星付き料理と評判。', 'Hong Kong', 'China', 22.3320, 114.1918, 80),
('Temple Street Night Market', '廟街夜市', 'street_food', '香港の夜市。焼き魚、貝類、麺料理、デザートが並ぶ食のワンダーランド。', 'Hong Kong', 'China', 22.3112, 114.1711, 75),
('Bo Innovation', '厨魔', 'restaurant', '三つ星の分子中華料理。「X-treme Chinese Cuisine」をコンセプトに伝統を破壊と創造。', 'Hong Kong', 'China', 22.2793, 114.1558, 90),

-- Santiago (3 gourmet)
('Boragó', 'ボラゴ', 'restaurant', '二つ星のチリ料理。パタゴニアの食材を使った革新的な「エンデミック料理」。', 'Santiago', 'Chile', -33.4112, -70.5746, 90),
('La Vega Central', 'ラ・ベガ・セントラル市場', 'market', 'サンティアゴの台所。新鮮なシーフード、果物、野菜。市場内の食堂で魚介スープを。', 'Santiago', 'Chile', -33.4321, -70.6418, 70),
('Peumayen Ancestral Food', 'ペウマイェン', 'restaurant', 'チリ先住民の料理。マプチェ、アイマラ、ラパヌイの伝統レシピを現代的に。', 'Santiago', 'Chile', -33.4368, -70.6507, 80),

-- Madrid (3 gourmet)
('DiverXO', 'ディベルソ', 'restaurant', 'マドリード唯一の三つ星。中華とスペイン料理が融合した奇想天外な料理。', 'Madrid', 'Spain', 40.4468, -3.6773, 90),
('Mercado de San Miguel', 'サン・ミゲル市場', 'market', 'マドリードのグルメ市場。生ハム、チーズ、オリーブ、タパスを立ち食いスタイルで。', 'Madrid', 'Spain', 40.4154, -3.7087, 80),
('Casa Botín', 'カサ・ボティン', 'restaurant', '1725年創業の世界最古のレストラン。名物の子豚の丸焼きは300年変わらぬ味。', 'Madrid', 'Spain', 40.4143, -3.7088, 85),

-- Kuala Lumpur (3 gourmet)
('Jalan Alor Food Street', 'ジャラン・アロール 屋台街', 'street_food', 'クアラルンプールの夜を彩る屋台街。中華、マレー、タイ料理が一堂に会する。', 'Kuala Lumpur', 'Malaysia', 3.1459, 101.7049, 80),
('Dewakan', 'デワカン', 'restaurant', 'マレーシア初の世界ベストレストラン入り。地元食材にこだわった革新的料理。', 'Kuala Lumpur', 'Malaysia', 3.1524, 101.7138, 85),
('Nasi Kandar Pelita', 'ナシ・カンダール・ペリタ', 'restaurant', '24時間営業のマレー料理店。カレーとご飯の組み合わせ「ナシ・カンダール」が絶品。', 'Kuala Lumpur', 'Malaysia', 3.1319, 101.6841, 70),

-- Singapore (3 gourmet)
('Odette', 'オデット', 'restaurant', '三つ星のモダンフレンチ。シンガポールのファインダイニングの頂点。', 'Singapore', 'Singapore', 1.2904, 103.8510, 90),
('Maxwell Food Centre', 'マックスウェル・フードセンター', 'hawker', '天天海南鶏飯のチキンライスが有名。ホーカーセンターでローカルフードを。', 'Singapore', 'Singapore', 1.2808, 103.8447, 75),
('Lau Pa Sat', 'ラオパサ', 'hawker', '歴史的建築のホーカーセンター。サテー、ラクサ、チリクラブなど多民族料理の宝庫。', 'Singapore', 'Singapore', 1.2802, 103.8506, 75),

-- Barcelona (3 gourmet)
('Tickets Bar', 'チケッツ・バー', 'restaurant', 'アルベルト・アドリアのタパスバー。分子ガストロノミーの技法で再創造したタパス。', 'Barcelona', 'Spain', 41.3756, 2.1499, 85),
('La Boqueria Market', 'ラ・ボケリア市場', 'market', 'ランブラス通りの市場。生ハム、チーズ、フレッシュジュース、海鮮が所狭しと並ぶ。', 'Barcelona', 'Spain', 41.3817, 2.1714, 80),
('Els Quatre Gats', '4匹の猫', 'cafe', 'ピカソも通った1897年創業のカフェ。モデルニスモ建築とカタルーニャ料理。', 'Barcelona', 'Spain', 41.3857, 2.1750, 75),

-- Milan (3 gourmet)
('Trattoria Milanese', 'トラットリア・ミラネーゼ', 'restaurant', '1933年創業の老舗。ミラノ風リゾット、オッソブーコなど伝統的なミラノ料理。', 'Milan', 'Italy', 45.4625, 9.1863, 80),
('Luini Panzerotti', 'ルイーニ', 'street_food', '1949年創業のパンツェロッティ専門店。揚げピザのような名物を立ち食いで。', 'Milan', 'Italy', 45.4643, 9.1918, 70),
('Cracco', 'クラッコ', 'restaurant', '二つ星のイタリア料理。カルロ・クラッコによる伝統と革新の融合。', 'Milan', 'Italy', 45.4667, 9.1900, 90),

-- Rome (3 gourmet)
('Roscioli', 'ロショーリ', 'restaurant', 'ローマ最高のカルボナーラ。パン屋、デリ、レストランが一体の食の殿堂。', 'Rome', 'Italy', 41.8939, 12.4734, 85),
('Campo de'' Fiori Market', 'カンポ・デ・フィオーリ市場', 'market', 'ローマ中心部の青空市場。新鮮な野菜、フルーツ、チーズ、生ハムが並ぶ。', 'Rome', 'Italy', 41.8956, 12.4724, 75),
('La Pergola', 'ラ・ペルゴラ', 'restaurant', 'ローマ唯一の三つ星。ローマの夜景を一望する最高峰のイタリア料理。', 'Rome', 'Italy', 41.9201, 12.4541, 90),

-- Berlin (3 gourmet)
('Tim Raue', 'ティム・ラウエ', 'restaurant', '二つ星のアジアン・フュージョン。和と中華をドイツで昇華させた革新的料理。', 'Berlin', 'Germany', 51.5033, 13.3921, 90),
('Curry 36', 'カリーヴルスト 36', 'street_food', 'ベルリン名物カリーヴルスト（カレーソーセージ）の人気店。B級グルメの王様。', 'Berlin', 'Germany', 52.4952, 13.3884, 65),
('Markthalle Neun', 'マルクトハレ・ノイン', 'market', '19世紀の市場建築。木曜夜のストリートフードサーズデーは世界各国の屋台が集結。', 'Berlin', 'Germany', 52.4992, 13.4331, 75),

-- Johannesburg (3 gourmet)
('The Test Kitchen', 'ザ・テスト・キッチン', 'restaurant', '南アフリカ料理の革新。世界ベストレストラン常連の実験的なダイニング。', 'Johannesburg', 'South Africa', -33.9249, 18.4241, 90),
('Neighbourgoods Market', 'ネイバーグッズ・マーケット', 'market', '週末の食品市場。南アフリカのストリートフードとクラフトビールを楽しめる。', 'Johannesburg', 'South Africa', -26.1863, 28.0750, 75),
('Carnivore Restaurant', 'カーニボア', 'restaurant', '肉食獣のための店。ワニ、ダチョウ、クドゥなど南アフリカの野生動物の肉を食べ放題。', 'Johannesburg', 'South Africa', -26.1071, 28.0567, 70),

-- San Francisco (3 gourmet)
('Atelier Crenn', 'アトリエ・クレン', 'restaurant', 'ドミニク・クレンの三つ星。詩的なメニュー表現と芸術的な料理。', 'San Francisco', 'USA', 37.7920, -122.4356, 90),
('Tartine Bakery', 'タルティーン・ベーカリー', 'bakery', 'サンフランシスコ最高峰のベーカリー。クロワッサンとサワードウブレッドは絶品。', 'San Francisco', 'USA', 37.7611, -122.4194, 80),
('Ferry Building Marketplace', 'フェリー・ビルディング・マーケットプレイス', 'market', 'ベイブリッジのたもとの市場。カリフォルニア産オーガニック食材とアルチザンフード。', 'San Francisco', 'USA', 37.7955, -122.3937, 80),

-- Washington (3 gourmet)
('The Inn at Little Washington', 'イン・アット・リトル・ワシントン', 'restaurant', 'バージニアの三つ星。完璧なサービスと芸術的なアメリカ料理。', 'Washington', 'USA', 38.8168, -78.1617, 90),
('Ben''s Chili Bowl', 'ベンズ・チリボウル', 'restaurant', '1958年創業の魂の食堂。ハーフスモークとチリは公民権運動の時代から愛される味。', 'Washington', 'USA', 38.9165, -77.0287, 70),
('Eastern Market', 'イースタン・マーケット', 'market', '1873年創業の歴史的市場。地元農家の野菜、チーズ、パンが並ぶコミュニティの中心。', 'Washington', 'USA', 38.8848, -76.9961, 75),

-- Chicago (3 gourmet)
('Alinea', 'アリネア', 'restaurant', '三つ星の分子ガストロノミー。食べられるヘリウム風船など革新的な体験型料理。', 'Chicago', 'USA', 41.9122, -87.6562, 90),
('Lou Malnati''s Pizzeria', 'ルー・マルナティーズ', 'restaurant', 'シカゴ・ディープディッシュピザの名店。分厚い生地にたっぷりのチーズとトマトソース。', 'Chicago', 'USA', 41.8906, -87.6341, 75),
('Portillo''s Hot Dogs', 'ポーティロズ', 'fast_food', 'シカゴスタイル・ホットドッグの殿堂。イタリアンビーフサンドイッチも絶品。', 'Chicago', 'USA', 41.8781, -87.6298, 65),

-- Taipei (3 gourmet)
('Din Tai Fung', '鼎泰豊', 'restaurant', 'ミシュラン一つ星の小籠包。18枚のひだを持つ完璧な小籠包は世界中で愛される。', 'Taipei', 'Taiwan', 25.0418, 121.5430, 85),
('Shilin Night Market', '士林夜市', 'night_market', '台北最大の夜市。臭豆腐、大鶏排（フライドチキン）、牡蠣オムレツなど台湾小吃の宝庫。', 'Taipei', 'Taiwan', 25.0877, 121.5240, 80),
('Mume', 'ムメ', 'restaurant', '北欧技法と台湾食材の融合。ミシュラン星付きのニューノルディック・台湾料理。', 'Taipei', 'Taiwan', 25.0417, 121.5313, 85),

-- Stockholm (3 gourmet)
('Frantzén', 'フランツェン', 'restaurant', 'ストックホルム唯一の三つ星。北欧料理の最高峰。23席だけの特別な空間。', 'Stockholm', 'Sweden', 59.3248, 18.0717, 90),
('Östermalms Saluhall', 'エステルマルム市場', 'market', '1888年創業の屋内市場。スモークサーモン、ミートボール、シナモンロールなど北欧の味。', 'Stockholm', 'Sweden', 59.3350, 18.0745, 80),
('Tradition', 'トラディション', 'restaurant', 'スウェーデン家庭料理の名店。ミートボール、ニシンの酢漬け、プリンセスケーキ。', 'Stockholm', 'Sweden', 59.3260, 18.0640, 75),

-- Vienna (3 gourmet)
('Steirereck', 'シュタイラーエック', 'restaurant', 'ウィーンの二つ星。オーストリア食材を使った現代的なアルペン料理。', 'Vienna', 'Austria', 48.2050, 16.3796, 90),
('Naschmarkt', 'ナッシュマルクト', 'market', 'ウィーン最大の市場。新鮮な食材、チーズ、スパイス、中東料理の屋台が並ぶ。', 'Vienna', 'Austria', 48.1986, 16.3609, 80),
('Café Central', 'カフェ・ツェントラル', 'cafe', '1876年創業の歴史的カフェ。ザッハトルテとメランジェでウィーンのカフェ文化を体験。', 'Vienna', 'Austria', 48.2104, 16.3659, 80),

-- Athens (3 gourmet)
('Funky Gourmet', 'ファンキー・グルメ', 'restaurant', 'アテネの二つ星。ギリシャ料理を分子ガストロノミーで再解釈。', 'Athens', 'Greece', 37.9838, 23.7275, 90),
('Varvakios Agora', 'バルバキオス市場', 'market', 'アテネ中央市場。新鮮な魚介、オリーブ、フェタチーズ。市場内の食堂で魚介スープを。', 'Athens', 'Greece', 37.9810, 23.7272, 75),
('Kostas Souvlaki', 'コスタス・スブラキ', 'street_food', '1950年創業のスブラキ専門店。アテネ市民が愛する究極のファストフード。', 'Athens', 'Greece', 37.9755, 23.7347, 65),

-- Amsterdam (3 gourmet)
('De Librije', 'デ・リブレイエ', 'restaurant', 'オランダの三つ星（ズヴォレ）。オランダ料理の最高峰。アムステルダムからも訪れる価値あり。', 'Amsterdam', 'Netherlands', 52.5079, 6.0959, 90),
('Albert Cuyp Market', 'アルバート・カイプ市場', 'market', 'アムステルダム最大の屋外市場。ストロープワッフル、ニシンのパン、チーズが名物。', 'Amsterdam', 'Netherlands', 52.3568, 4.8919, 75),
('Café de Prins', 'カフェ・デ・プリンス', 'cafe', '運河沿いのブラウンカフェ。アップルパイとビールでアムステルダムの日常を体験。', 'Amsterdam', 'Netherlands', 52.3748, 4.8841, 70);
