-- 50都市すべてのアートデータを追加（各都市3件、計150件）

INSERT INTO arts (name, name_ja, type, description, city, country, latitude, longitude, impressed_points) VALUES

-- Toronto (3 artworks)
('Art Gallery of Ontario - The Group of Seven Collection', 'オンタリオ美術館 - グループ・オブ・セブン コレクション', 'museum', 'カナダを代表する風景画家グループの作品群。カナダの大自然を独特の視点で描いた名作を鑑賞。', 'Toronto', 'Canada', 43.6536, -79.3925, 70),
('Graffiti Alley', 'グラフィティ・アレイ', 'street_art', 'ファッション地区にある壁画アート通り。世界中のストリートアーティストによる色彩豊かな作品群。', 'Toronto', 'Canada', 43.6478, -79.4003, 55),
('Aga Khan Museum', 'アガ・カーン博物館', 'museum', 'イスラム芸術の至宝を展示。精緻な装飾写本から現代アートまで、千年以上の歴史を物語る。', 'Toronto', 'Canada', 43.7252, -79.3327, 65),

-- Tokyo (3 artworks)
('Mori Art Museum', '森美術館', 'museum', '六本木ヒルズ52階の現代美術館。国際的なアーティストの大規模展覧会と東京の夜景を同時に楽しめる。', 'Tokyo', 'Japan', 35.6606, 139.7295, 75),
('teamLab Borderless', 'チームラボ ボーダレス', 'digital_art', '没入型デジタルアート空間。境界のない作品が部屋から部屋へ移動し、鑑賞者と共に変化する。', 'Tokyo', 'Japan', 35.6258, 139.7753, 85),
('Tokyo National Museum - Japanese Art Collection', '東京国立博物館 - 日本美術コレクション', 'museum', '日本最古の博物館。国宝や重要文化財を含む浮世絵、仏像、刀剣など日本美術の粋を集める。', 'Tokyo', 'Japan', 35.7188, 139.7764, 80),

-- Cairo (3 artworks)
('Egyptian Museum - Tutankhamun Collection', 'エジプト考古学博物館 - ツタンカーメン コレクション', 'museum', '黄金のマスクをはじめとする少年王の副葬品。古代エジプトの最高傑作を間近で鑑賞。', 'Cairo', 'Egypt', 30.0478, 31.2336, 90),
('Khan el-Khalili Calligraphy', 'ハン・ハリーリ アラビア書道', 'calligraphy', '伝統市場で見る美しいアラビア書道。職人が作る装飾文字は芸術作品そのもの。', 'Cairo', 'Egypt', 30.0475, 31.2625, 60),
('Cairo Opera House Contemporary Art', 'カイロ・オペラハウス 現代美術', 'gallery', 'ナイル川沿いの文化センター。中東とアフリカの現代アート作品を展示。', 'Cairo', 'Egypt', 30.0428, 31.2247, 65),

-- Istanbul (3 artworks)
('Hagia Sophia Byzantine Mosaics', 'ハギア・ソフィア ビザンティン モザイク', 'mosaic', '6世紀から続く黄金のモザイク画。キリスト教とイスラム教の芸術が共存する奇跡の空間。', 'Istanbul', 'Turkey', 41.0086, 28.9802, 85),
('Istanbul Modern', 'イスタンブール・モダン', 'museum', 'ボスポラス海峡沿いの現代美術館。トルコの現代アーティストによる革新的な作品を展示。', 'Istanbul', 'Turkey', 41.0287, 28.9747, 70),
('Grand Bazaar - Ottoman Miniature Art', 'グランドバザール - オスマン細密画', 'miniature', '伝統的なオスマン細密画。繊細な筆使いで描かれた宮廷生活や歴史的場面。', 'Istanbul', 'Turkey', 41.0108, 28.9680, 65),

-- Sydney (3 artworks)
('Art Gallery of New South Wales - Indigenous Art', 'ニューサウスウェールズ州立美術館 - 先住民アート', 'museum', 'アボリジニとトレス海峡諸島民の芸術。数万年の歴史を持つドリーミング（夢の時代）の物語。', 'Sydney', 'Australia', -33.8688, 151.2173, 80),
('Sydney Opera House Architecture', 'シドニー・オペラハウス 建築美', 'architecture', 'ヨーン・ウッツォン設計の20世紀建築の傑作。貝殻のような独創的なフォルム。', 'Sydney', 'Australia', -33.8568, 151.2153, 85),
('Bondi Beach Street Art', 'ボンダイビーチ ストリートアート', 'street_art', '海沿いの壁画アート。サーフカルチャーと現代アートが融合した色彩豊かな作品群。', 'Sydney', 'Australia', -33.8908, 151.2743, 60),

-- New York (3 artworks)
('Metropolitan Museum of Art - European Paintings', 'メトロポリタン美術館 - ヨーロッパ絵画', 'museum', 'フェルメール、レンブラント、ゴッホなど巨匠の名画。世界最大級の美術コレクション。', 'New York', 'USA', 40.7794, -73.9632, 90),
('Museum of Modern Art (MoMA)', 'ニューヨーク近代美術館 (MoMA)', 'museum', 'ピカソ、モネ、ウォーホルなど近現代美術の殿堂。「星月夜」「アヴィニョンの娘たち」所蔵。', 'New York', 'USA', 40.7614, -73.9776, 90),
('Brooklyn Street Art - Bushwick Collective', 'ブルックリン ストリートアート - ブッシュウィック・コレクティブ', 'street_art', '世界中のストリートアーティストが集まる聖地。常に進化し続ける巨大な屋外ギャラリー。', 'New York', 'USA', 40.7059, -73.9240, 65),

-- London (3 artworks)
('British Museum - Rosetta Stone', '大英博物館 - ロゼッタストーン', 'museum', '古代エジプトの象形文字解読の鍵となった石碑。人類の知的探求の象徴。', 'London', 'UK', 51.5194, -0.1270, 85),
('Tate Modern', 'テート・モダン', 'museum', '元発電所を改装した現代美術館。ピカソ、ダリ、ウォーホルなど20-21世紀の名作を展示。', 'London', 'UK', 51.5076, -0.0994, 85),
('National Gallery - The Arnolfini Portrait', 'ナショナル・ギャラリー - アルノルフィーニ夫妻像', 'museum', 'ファン・エイクの傑作。15世紀フランドル絵画の最高峰と世界の名画2,300点以上。', 'London', 'UK', 51.5089, -0.1283, 80),

-- Paris (3 artworks)
('Louvre Museum - Mona Lisa', 'ルーヴル美術館 - モナリザ', 'museum', 'ダ・ヴィンチの不朽の名作。世界で最も有名な絵画を所蔵する世界最大級の美術館。', 'Paris', 'France', 48.8606, 2.3376, 90),
('Musée d''Orsay - Impressionist Collection', 'オルセー美術館 - 印象派コレクション', 'museum', 'モネ、ルノワール、ドガなど印象派の至宝。元駅舎の美しい空間で名画を鑑賞。', 'Paris', 'France', 48.8600, 2.3266, 90),
('Centre Pompidou', 'ポンピドゥー・センター', 'museum', '建物自体がアート。カンディンスキー、マティス、シャガールなど20世紀美術の殿堂。', 'Paris', 'France', 48.8606, 2.3522, 80),

-- Beijing (3 artworks)
('Forbidden City - Imperial Art Collection', '故宮博物院 - 皇帝コレクション', 'museum', '明清時代の宮廷美術。皇帝が愛でた書画、陶磁器、玉器など国宝級の芸術品。', 'Beijing', 'China', 39.9163, 116.3972, 85),
('798 Art District', '798芸術区', 'gallery', '旧工場を改装したアート地区。中国の現代アーティストが集まる創造的空間。', 'Beijing', 'China', 39.9844, 116.4962, 75),
('National Museum of China - Ancient Bronze Collection', '中国国家博物館 - 古代青銅器', 'museum', '殷周時代の青銅器。精緻な装飾と銘文が刻まれた儀式用器は中国文明の粋。', 'Beijing', 'China', 39.9042, 116.3978, 80),

-- Mumbai (3 artworks)
('Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'チャトラパティ・シヴァージー・マハーラージ博物館', 'museum', 'インド最古の博物館の一つ。ムガル帝国の細密画からヒンドゥー彫刻まで。', 'Mumbai', 'India', 18.9269, 72.8326, 75),
('Kala Ghoda Art District', 'カーラ・ゴーダ アート地区', 'gallery', 'ムンバイのアートの中心地。現代インド美術のギャラリーが集まるクリエイティブエリア。', 'Mumbai', 'India', 18.9283, 72.8314, 65),
('Elephanta Caves Rock Sculptures', 'エレファンタ石窟寺院 岩窟彫刻', 'sculpture', '6世紀のヒンドゥー彫刻。シヴァ神の巨大な三面像は圧倒的な存在感。', 'Mumbai', 'India', 18.9633, 72.9315, 80),

-- Los Angeles (3 artworks)
('Getty Center', 'ゲティ・センター', 'museum', '丘の上の美術館。ゴッホ、レンブラント、モネなど西洋美術の名作と絶景。', 'Los Angeles', 'USA', 34.0780, -118.4741, 85),
('The Broad', 'ザ・ブロード', 'museum', '現代美術の殿堂。草間彌生の「無限の鏡の部屋」やバスキア、リキテンシュタインの作品。', 'Los Angeles', 'USA', 34.0545, -118.2506, 80),
('Venice Beach Graffiti Walls', 'ベニスビーチ グラフィティ・ウォール', 'street_art', '合法的に描けるストリートアート。カリフォルニアのビーチカルチャーとアートの融合。', 'Los Angeles', 'USA', 33.9850, -118.4695, 60),

-- Moscow (3 artworks)
('State Tretyakov Gallery', '国立トレチャコフ美術館', 'museum', 'ロシア美術の殿堂。イコン画から前衛芸術まで、ロシア芸術千年の歴史。', 'Moscow', 'Russia', 55.7414, 37.6207, 85),
('Moscow Metro Art Stations', 'モスクワ地下鉄 芸術駅', 'architecture', '地下の宮殿と呼ばれる豪華な地下鉄駅。モザイク、彫刻、シャンデリアが装飾。', 'Moscow', 'Russia', 55.7558, 37.6173, 75),
('Pushkin State Museum - European Art', 'プーシキン美術館 - ヨーロッパ美術', 'museum', 'モネ、ルノワール、ピカソなど印象派と後期印象派の傑作コレクション。', 'Moscow', 'Russia', 55.7476, 37.6047, 80),

-- Dubai (3 artworks)
('Louvre Abu Dhabi', 'ルーヴル・アブダビ', 'museum', '中東初のルーヴル別館。古代から現代まで、東西文明の芸術が集結。', 'Dubai', 'UAE', 24.5338, 54.3984, 85),
('Alserkal Avenue', 'アルセルカル・アベニュー', 'gallery', '倉庫街を改装したアート地区。中東の現代アーティストによる革新的な作品展示。', 'Dubai', 'UAE', 25.1380, 55.2416, 70),
('Dubai Fountain Art', 'ドバイ・ファウンテン アート', 'installation', '世界最大級の音楽噴水ショー。水、光、音楽が織りなす壮大なパフォーマンスアート。', 'Dubai', 'UAE', 25.1973, 55.2744, 65),

-- Sao Paulo (3 artworks)
('MASP - São Paulo Museum of Art', 'サンパウロ美術館 (MASP)', 'museum', 'ラテンアメリカ最大の美術館。ゴヤ、レンブラント、ルノワールなど西洋美術の至宝。', 'Sao Paulo', 'Brazil', -23.5614, -46.6558, 85),
('Beco do Batman', 'ベッコ・ド・バットマン', 'street_art', 'サンパウロのストリートアートの聖地。路地全体が色彩豊かな壁画で埋め尽くされる。', 'Sao Paulo', 'Brazil', -23.5600, -46.6879, 70),
('Pinacoteca do Estado', 'ピナコテカ', 'museum', 'ブラジル最古の美術館。19-20世紀のブラジル美術と印象的な新古典様式建築。', 'Sao Paulo', 'Brazil', -23.5341, -46.6336, 75),

-- Mexico City (3 artworks)
('National Museum of Anthropology', '国立人類学博物館', 'museum', 'アステカ文明の太陽の石。メソアメリカ文明の芸術的遺産を世界最大規模で展示。', 'Mexico City', 'Mexico', 19.4260, -99.1860, 85),
('Frida Kahlo Museum (Blue House)', 'フリーダ・カーロ博物館 (青い家)', 'museum', 'メキシコを代表する女性画家の生家。彼女の作品と波乱の人生を感じる空間。', 'Mexico City', 'Mexico', 19.3549, -99.1626, 80),
('Diego Rivera Murals at Palacio Nacional', 'ディエゴ・リベラ壁画 (国立宮殿)', 'mural', 'メキシコの歴史を描いた巨大壁画。社会派芸術家リベラの最高傑作。', 'Mexico City', 'Mexico', 19.4326, -99.1332, 85),

-- Seoul (3 artworks)
('National Museum of Korea', '国立中央博物館', 'museum', '韓国最大の博物館。高麗青磁、朝鮮白磁、仏教美術など韓国文化の粋。', 'Seoul', 'South Korea', 37.5239, 126.9802, 80),
('Leeum Samsung Museum of Art', 'リウム美術館', 'museum', '伝統と現代の融合。李朝の陶磁器からアンディ・ウォーホルまで東西の名作。', 'Seoul', 'South Korea', 37.5376, 127.0049, 85),
('Ihwa Mural Village', '梨花洞壁画村', 'street_art', '階段と路地を彩る壁画アート。庶民の暮らしとアートが共存する美しい村。', 'Seoul', 'South Korea', 37.5815, 127.0054, 65),

-- Jakarta (3 artworks)
('National Museum of Indonesia', 'インドネシア国立博物館', 'museum', 'ジャワとバリの伝統芸術。精緻なバティック、影絵人形、ヒンドゥー彫刻の宝庫。', 'Jakarta', 'Indonesia', -6.1766, 106.8229, 75),
('Museum MACAN', 'ムセウム・マカン', 'museum', '東南アジア初の現代美術館。草間彌生、アニッシュ・カプーアなど国際的アーティストの作品。', 'Jakarta', 'Indonesia', -6.1756, 106.7927, 80),
('Jakarta Street Art - Kemang Area', 'ジャカルタ ストリートアート - クマン地区', 'street_art', 'インドネシアの現代文化を反映した壁画。伝統とポップカルチャーの融合。', 'Jakarta', 'Indonesia', -6.2615, 106.8166, 60),

-- Lagos (3 artworks)
('Nike Art Gallery', 'ナイキ・アートギャラリー', 'gallery', '西アフリカ最大の私設ギャラリー。ナイジェリアの伝統と現代が融合したアート。', 'Lagos', 'Nigeria', 6.4539, 3.3869, 75),
('National Museum Lagos - Benin Bronzes', 'ラゴス国立博物館 - ベナン青銅器', 'museum', '15-16世紀のベナン王国の青銅彫刻。アフリカ芸術の最高峰として世界的に評価。', 'Lagos', 'Nigeria', 6.4547, 3.3869, 80),
('Lekki Arts and Crafts Market', 'レッキ アート&クラフト市場', 'market', '西アフリカの伝統工芸品。色彩豊かな織物、彫刻、仮面がアートとして並ぶ。', 'Lagos', 'Nigeria', 6.4474, 3.4739, 65),

-- Bangkok (3 artworks)
('Grand Palace - Thai Mural Paintings', '王宮 - タイ壁画', 'mural', 'ラーマーヤナ物語を描いた壮大な壁画。金箔と鮮やかな色彩で彩られたタイ芸術の極致。', 'Bangkok', 'Thailand', 13.7500, 100.4913, 85),
('Bangkok Art and Culture Centre (BACC)', 'バンコク芸術文化センター', 'museum', 'タイの現代アート拠点。若手アーティストによる実験的な作品とポップカルチャー。', 'Bangkok', 'Thailand', 13.7465, 100.5305, 75),
('Jim Thompson House - Thai Silk Art', 'ジム・トンプソンの家 - タイシルク芸術', 'museum', '伝統的タイ様式の邸宅。貴重な東南アジア美術コレクションと美しい庭園。', 'Bangkok', 'Thailand', 13.7467, 100.5344, 70),

-- Tehran (3 artworks)
('National Museum of Iran', 'イラン国立博物館', 'museum', 'ペルシャ文明の至宝。エラム文明から現代まで、イランの芸術史を網羅。', 'Tehran', 'Iran', 35.6889, 51.4170, 80),
('Tehran Museum of Contemporary Art', 'テヘラン現代美術館', 'museum', '西洋近現代美術の隠れた宝庫。ピカソ、ウォーホル、ポロックなど貴重なコレクション。', 'Tehran', 'Iran', 35.7253, 51.4009, 85),
('Sa''dabad Palace - Persian Miniatures', 'サアダーバード宮殿 - ペルシャ細密画', 'museum', '王室の芸術コレクション。繊細な筆致で描かれたペルシャ細密画の傑作群。', 'Tehran', 'Iran', 35.7906, 51.4368, 75),

-- Buenos Aires (3 artworks)
('MALBA - Latin American Art Museum', 'ラテンアメリカ美術館 (MALBA)', 'museum', 'フリーダ・カーロ、ディエゴ・リベラなど20世紀ラテンアメリカ美術の至宝。', 'Buenos Aires', 'Argentina', -34.5770, -58.4045, 85),
('Teatro Colón Architecture', 'コロン劇場 建築美', 'architecture', '世界三大劇場の一つ。黄金に輝く内装とフレスコ画が美しいボザール様式の傑作。', 'Buenos Aires', 'Argentina', -34.6010, -58.3832, 80),
('Caminito Street Art', 'カミニート ストリートアート', 'street_art', 'ラ・ボカ地区のカラフルな街並み。タンゴと芸術が息づくアート空間。', 'Buenos Aires', 'Argentina', -34.6391, -58.3628, 70),

-- Osaka (3 artworks)
('Osaka Museum of Housing and Living - Edo Art', '大阪くらしの今昔館 - 江戸美術', 'museum', '江戸時代の町並みを再現。浮世絵、看板、装飾品など庶民文化の芸術性を体感。', 'Osaka', 'Japan', 34.7116, 135.5149, 70),
('Nakanoshima Museum of Art', '中之島美術館', 'museum', '近代大阪の美術拠点。モディリアーニ、佐伯祐三など東西の名作コレクション。', 'Osaka', 'Japan', 34.6918, 135.4912, 75),
('Dotonbori Neon Signs', '道頓堀 ネオンサイン', 'installation', '動くカニやグリコサインなど派手なネオン看板。大阪のポップアートとしての広告文化。', 'Osaka', 'Japan', 34.6686, 135.5023, 60),

-- Rio de Janeiro (3 artworks)
('Museum of Tomorrow', '明日の博物館', 'museum', '未来志向の科学とアートの融合施設。サンティアゴ・カラトラバ設計の建築も見どころ。', 'Rio de Janeiro', 'Brazil', -22.8942, -43.1797, 75),
('Escadaria Selarón', 'セラロンの階段', 'mosaic', '世界中のタイルで彩られた215段の階段。チリの芸術家が人生をかけて制作した作品。', 'Rio de Janeiro', 'Brazil', -22.9155, -43.1789, 80),
('Museum of Art of Rio (MAR)', 'リオ美術館 (MAR)', 'museum', 'リオの歴史と現代ブラジル美術。港湾地区再開発のシンボルとなった美術館。', 'Rio de Janeiro', 'Brazil', -22.8950, -43.1802, 70),

-- Karachi (3 artworks)
('National Museum of Pakistan', 'パキスタン国立博物館', 'museum', 'インダス文明からムガル帝国まで。パキスタンの芸術的遺産と細密画コレクション。', 'Karachi', 'Pakistan', 24.8728, 67.0302, 75),
('Mohatta Palace Museum', 'モハッタ宮殿博物館', 'museum', 'ラジャスタン様式の宮殿。パキスタンの伝統工芸と現代美術を展示。', 'Karachi', 'Pakistan', 24.8189, 67.0310, 70),
('Frere Hall Art Gallery', 'フレア・ホール美術館', 'gallery', '英国植民地時代の建築。パキスタンの現代アーティストによる作品展示。', 'Karachi', 'Pakistan', 24.8467, 67.0286, 65),

-- Manila (3 artworks)
('National Museum of Fine Arts', '国立美術館', 'museum', 'フィリピン美術の殿堂。スポリアリウム（闘技場）など国宝級の絵画を所蔵。', 'Manila', 'Philippines', 14.5834, 120.9794, 80),
('Art in Island', 'アート・イン・アイランド', 'museum', '世界最大級のトリックアート美術館。3D錯視絵画の中に入り込む体験型アート。', 'Manila', 'Philippines', 14.6133, 121.0535, 70),
('Intramuros Street Art', 'イントラムロス ストリートアート', 'street_art', 'スペイン統治時代の城壁都市。歴史的建造物と現代壁画の融合。', 'Manila', 'Philippines', 14.5896, 120.9753, 65),

-- Shanghai (3 artworks)
('Shanghai Museum - Ancient Chinese Art', '上海博物館 - 古代中国美術', 'museum', '青銅器、陶磁器、書画など中国美術の至宝。特に明清時代の文人画コレクションが充実。', 'Shanghai', 'China', 31.2278, 121.4753, 85),
('M50 Art District', 'M50芸術区', 'gallery', '旧紡績工場を改装したアートスペース。上海の現代アーティストが集まる創作拠点。', 'Shanghai', 'China', 31.2515, 121.4462, 75),
('Yu Garden - Classical Chinese Architecture', '豫園 - 中国古典建築', 'architecture', '明代の庭園建築の傑作。精緻な彫刻、窓格子、太湖石の配置が織りなす芸術空間。', 'Shanghai', 'China', 31.2274, 121.4916, 80),

-- Guangzhou (3 artworks)
('Guangdong Museum of Art', '広東美術館', 'museum', '嶺南画派の中心地。中国南方の独特な画風と現代アート作品を展示。', 'Guangzhou', 'China', 23.1106, 113.3313, 75),
('Canton Tower Light Show', '広州タワー 光のアート', 'installation', '世界第4位の高さを誇るタワー。夜景と共に楽しむLEDライトアートショー。', 'Guangzhou', 'China', 23.1059, 113.3191, 70),
('Chen Clan Ancestral Hall', '陳氏書院', 'architecture', '清代の祠堂建築。木彫、石彫、レンガ彫刻が施された装飾芸術の宝庫。', 'Guangzhou', 'China', 23.1251, 113.2438, 80),

-- Delhi (3 artworks)
('National Museum - Gandhara Art', '国立博物館 - ガンダーラ美術', 'museum', '仏教美術の源流。ギリシャ彫刻の影響を受けた仏像はインド美術の至宝。', 'Delhi', 'India', 28.6115, 77.2195, 85),
('Humayun''s Tomb Architecture', 'フマーユーン廟 建築美', 'architecture', 'ムガル建築の傑作でタージマハルの原型。幾何学的な美しさと庭園の調和。', 'Delhi', 'India', 28.5933, 77.2507, 80),
('Lodhi Art District', 'ローディー・アート地区', 'street_art', 'インド初の公認ストリートアート地区。世界中のアーティストによる巨大壁画。', 'Delhi', 'India', 28.5921, 77.2197, 70),

-- Shenzhen (3 artworks)
('OCAT Shenzhen', 'OCAT深圳', 'museum', '中国初の独立系現代美術館。実験的な作品と若手アーティストの登竜門。', 'Shenzhen', 'China', 22.5431, 114.1152, 75),
('Dafen Oil Painting Village', '大芬油画村', 'gallery', '世界の油絵の半分を生産する村。職人たちによる名画の複製から創作まで。', 'Shenzhen', 'China', 22.5952, 114.1408, 65),
('Sea World Culture and Arts Center', '海上世界文化芸術中心', 'museum', '安藤忠雄設計の美術館。現代アートと深圳湾の景観が融合した文化空間。', 'Shenzhen', 'China', 22.4892, 113.9145, 80),

-- Bogota (3 artworks)
('Gold Museum', '黄金博物館', 'museum', 'プレコロンビア時代の黄金工芸品。3万4千点の金製品が語る古代文明の技術と美。', 'Bogota', 'Colombia', 4.6017, -74.0723, 85),
('Botero Museum', 'ボテロ美術館', 'museum', 'コロンビアが誇る巨匠ボテロの作品群。独特のふくよかなフォルムの絵画と彫刻。', 'Bogota', 'Colombia', 4.5971, -74.0743, 80),
('Graffiti Tour - La Candelaria', 'グラフィティ・ツアー - ラ・カンデラリア', 'street_art', '社会的メッセージを込めた壁画。コロンビアの歴史と平和への願いを表現。', 'Bogota', 'Colombia', 4.5981, -74.0758, 70),

-- Lima (3 artworks)
('Larco Museum - Pre-Columbian Art', 'ラルコ博物館 - プレコロンビア美術', 'museum', 'モチェ文化、チムー文化の陶器芸術。古代ペルーの高度な技術と豊かな表現力。', 'Lima', 'Peru', -12.0706, -77.0715, 85),
('Barranco Murals', 'バランコ地区 壁画', 'street_art', 'ボヘミアンな芸術地区。カラフルな壁画とストリートアートが街を彩る。', 'Lima', 'Peru', -12.1484, -77.0201, 70),
('MALI - Lima Art Museum', 'リマ美術館 (MALI)', 'museum', '植民地時代から現代までのペルー美術。インカ織物から現代絵画まで3千年の歴史。', 'Lima', 'Peru', -12.0712, -77.0385, 80),

-- Chennai (3 artworks)
('Government Museum - Bronze Gallery', '政府博物館 - 青銅彫刻ギャラリー', 'museum', 'チョーラ朝の青銅彫刻。踊るシヴァ神（ナタラージャ）はインド美術の最高峰。', 'Chennai', 'India', 13.0662, 80.2824, 85),
('DakshinaChitra', 'ダクシナチトラ', 'museum', '南インドの伝統建築と工芸。生きた博物館として職人技を体験できる。', 'Chennai', 'India', 12.7879, 80.2468, 75),
('Kalakshetra Foundation', 'カラクシェートラ財団', 'gallery', 'インド古典舞踊と工芸の中心地。伝統的なカラムカリ染色とバラタナティヤムの芸術。', 'Chennai', 'India', 13.0091, 80.2560, 70),

-- Hong Kong (3 artworks)
('M+ Museum', 'M+美術館', 'museum', 'アジア最大級の現代美術館。草間彌生、アイ・ウェイウェイなど東洋現代美術の拠点。', 'Hong Kong', 'China', 22.3035, 114.1604, 85),
('Hong Kong Museum of Art', '香港芸術館', 'museum', '中国絵画と書道の傑作コレクション。古代から現代まで香港の芸術史を網羅。', 'Hong Kong', 'China', 22.2941, 114.1722, 80),
('PMQ Street Art', 'PMQ ストリートアート', 'street_art', '旧警察宿舎を改装したクリエイティブハブ。若手アーティストによる実験的作品。', 'Hong Kong', 'China', 22.2836, 114.1534, 70),

-- Santiago (3 artworks)
('Chilean Museum of Pre-Columbian Art', 'チリ先コロンブス美術館', 'museum', 'アンデス文明の至宝。マプチェ文化、インカ文明の織物、陶器、金工品。', 'Santiago', 'Chile', -33.4372, -70.6506, 80),
('Museo Nacional de Bellas Artes', '国立美術館', 'museum', 'チリとラテンアメリカの美術。新古典様式の美しい建築も見どころ。', 'Santiago', 'Chile', -33.4357, -70.6397, 75),
('Barrio Bellavista Street Art', 'ベジャビスタ地区 ストリートアート', 'street_art', 'サンティアゴのボヘミアン地区。詩人ネルーダゆかりの地に広がる壁画アート。', 'Santiago', 'Chile', -33.4294, -70.6333, 70),

-- Madrid (3 artworks)
('Prado Museum', 'プラド美術館', 'museum', 'スペイン王室コレクション。ベラスケス、ゴヤ、エル・グレコなどスペイン絵画の至宝。', 'Madrid', 'Spain', 40.4138, -3.6921, 90),
('Reina Sofia Museum - Guernica', 'ソフィア王妃芸術センター - ゲルニカ', 'museum', 'ピカソの「ゲルニカ」を所蔵。20世紀スペイン美術の殿堂。', 'Madrid', 'Spain', 40.4080, -3.6942, 90),
('Thyssen-Bornemisza Museum', 'ティッセン=ボルネミッサ美術館', 'museum', '個人コレクションから始まった美術館。中世から現代まで西洋美術史を網羅。', 'Madrid', 'Spain', 40.4162, -3.6947, 85),

-- Kuala Lumpur (3 artworks)
('Islamic Arts Museum Malaysia', 'イスラム美術館', 'museum', '東南アジア最大のイスラム美術館。クルアーンの装飾写本、ペルシャ絨毯、建築模型。', 'Kuala Lumpur', 'Malaysia', 3.1412, 101.6910, 80),
('National Visual Arts Gallery', '国立美術館', 'gallery', 'マレーシア現代美術の拠点。多民族国家ならではの多様なアート表現。', 'Kuala Lumpur', 'Malaysia', 3.1459, 101.7049, 75),
('Batu Caves Temple Art', 'バトゥ洞窟 寺院彫刻', 'sculpture', 'ヒンドゥー教の聖地。巨大なムルガン神像と洞窟内の宗教美術。', 'Kuala Lumpur', 'Malaysia', 3.2379, 101.6840, 70),

-- Singapore (3 artworks)
('National Gallery Singapore', 'ナショナル・ギャラリー・シンガポール', 'museum', '東南アジア最大の美術館。シンガポールと東南アジアの近現代美術コレクション。', 'Singapore', 'Singapore', 1.2904, 103.8510, 85),
('ArtScience Museum', 'アートサイエンス・ミュージアム', 'museum', '蓮の花をイメージした建築。アートと科学技術の融合展示。', 'Singapore', 'Singapore', 1.2865, 103.8594, 80),
('Haji Lane Street Art', 'ハジ・レーン ストリートアート', 'street_art', 'アラブストリートの裏路地。色彩豊かな壁画とブティックが共存する小さな通り。', 'Singapore', 'Singapore', 1.3009, 103.8588, 65),

-- Barcelona (3 artworks)
('Sagrada Familia - Gaudí Architecture', 'サグラダ・ファミリア - ガウディ建築', 'architecture', '未完の最高傑作。自然を模した独創的な建築美と光のステンドグラス。', 'Barcelona', 'Spain', 41.4036, 2.1744, 90),
('Picasso Museum Barcelona', 'ピカソ美術館', 'museum', '若き日のピカソ作品を多数所蔵。青の時代からキュビズムへの変遷を追う。', 'Barcelona', 'Spain', 41.3851, 2.1810, 85),
('MACBA - Contemporary Art Museum', 'バルセロナ現代美術館 (MACBA)', 'museum', '白い近代建築の現代美術館。スペインとカタルーニャの前衛芸術を展示。', 'Barcelona', 'Spain', 41.3830, 2.1668, 80),

-- Milan (3 artworks)
('The Last Supper - Leonardo da Vinci', '最後の晩餐 - レオナルド・ダ・ヴィンチ', 'mural', 'ルネサンスの最高傑作。修道院の壁に描かれた永遠の名画を間近で鑑賞。', 'Milan', 'Italy', 45.4660, 9.1708, 90),
('Pinacoteca di Brera', 'ブレラ絵画館', 'museum', 'イタリア絵画の至宝。ラファエロ、カラヴァッジョ、マンテーニャの傑作群。', 'Milan', 'Italy', 45.4720, 9.1881, 85),
('Galleria Vittorio Emanuele II', 'ヴィットーリオ・エマヌエーレ2世のガッレリア', 'architecture', '世界最古のショッピングモール。ガラス天井と床のモザイク芸術が美しい。', 'Milan', 'Italy', 45.4654, 9.1897, 75),

-- Rome (3 artworks)
('Sistine Chapel - Michelangelo', 'システィーナ礼拝堂 - ミケランジェロ', 'mural', '天井画「天地創造」と壁画「最後の審判」。ルネサンス美術の頂点。', 'Rome', 'Italy', 41.9029, 12.4545, 90),
('Galleria Borghese', 'ボルゲーゼ美術館', 'museum', 'ベルニーニの彫刻とカラヴァッジョの絵画。バロック美術の宝庫。', 'Rome', 'Italy', 41.9142, 12.4922, 85),
('MAXXI - National Museum of 21st Century Arts', 'MAXXI - 21世紀美術館', 'museum', 'ザハ・ハディド設計の建築が話題。イタリア現代美術と建築の展示。', 'Rome', 'Italy', 41.9272, 12.4712, 80),

-- Berlin (3 artworks)
('Pergamon Museum', 'ペルガモン博物館', 'museum', 'ペルガモンの大祭壇、イシュタル門など古代建築を丸ごと展示。圧巻のスケール。', 'Berlin', 'Germany', 52.5211, 13.3969, 90),
('East Side Gallery', 'イーストサイド・ギャラリー', 'street_art', 'ベルリンの壁に描かれた世界最大の屋外ギャラリー。平和と自由のメッセージ。', 'Berlin', 'Germany', 52.5053, 13.4396, 80),
('Neue Nationalgalerie', '新ナショナルギャラリー', 'museum', 'ミース・ファン・デル・ローエ設計。20世紀ドイツ美術とモダニズム建築の傑作。', 'Berlin', 'Germany', 52.5093, 13.3677, 85),

-- Johannesburg (3 artworks)
('Apartheid Museum', 'アパルトヘイト博物館', 'museum', '南アフリカの歴史を伝える展示。写真、映像、証言が語る人種隔離の記憶と和解。', 'Johannesburg', 'South Africa', -26.2365, 28.0098, 85),
('Maboneng Art District', 'マボネン・アート地区', 'gallery', '旧工業地区を改装したアートスペース。アフリカの現代アーティストの創作拠点。', 'Johannesburg', 'South Africa', -26.2062, 28.0601, 75),
('Newtown Street Art', 'ニュータウン ストリートアート', 'street_art', '文化地区の壁画アート。アフリカの伝統とヒップホップカルチャーの融合。', 'Johannesburg', 'South Africa', -26.2043, 28.0354, 70),

-- San Francisco (3 artworks)
('de Young Museum', 'デ・ヤング美術館', 'museum', 'アメリカ美術と世界の芸術。建築とゴールデンゲートパークの景観も素晴らしい。', 'San Francisco', 'USA', 37.7712, -122.4686, 85),
('SFMOMA - San Francisco Museum of Modern Art', 'サンフランシスコ近代美術館', 'museum', '西海岸最大の近代美術館。マティス、リヒター、カーロなど20-21世紀の名作。', 'San Francisco', 'USA', 37.7857, -122.4011, 85),
('Clarion Alley Mural Project', 'クラリオン・アレー 壁画プロジェクト', 'street_art', 'ミッション地区の路地アート。社会問題を扱う政治的メッセージの壁画群。', 'San Francisco', 'USA', 37.7578, -122.4185, 70),

-- Washington (3 artworks)
('National Gallery of Art', 'ナショナル・ギャラリー', 'museum', 'アメリカ随一の美術館。ダ・ヴィンチ、フェルメール、モネなど西洋美術の至宝。', 'Washington', 'USA', 38.8913, -77.0200, 90),
('Smithsonian American Art Museum', 'スミソニアン・アメリカ美術館', 'museum', 'アメリカ美術の殿堂。植民地時代から現代まで、アメリカ芸術の歴史を網羅。', 'Washington', 'USA', 38.8980, -77.0230, 85),
('Hirshhorn Museum Sculpture Garden', 'ハーシュホーン美術館 彫刻庭園', 'sculpture', 'モール沿いの野外彫刻。ロダン、マティス、ムーアなど近現代彫刻の名作。', 'Washington', 'USA', 38.8881, -77.0231, 80),

-- Chicago (3 artworks)
('Art Institute of Chicago', 'シカゴ美術館', 'museum', 'スーラ「グランド・ジャット島の日曜日の午後」やゴッホの名作を所蔵。印象派の宝庫。', 'Chicago', 'USA', 41.8796, -87.6237, 90),
('Millennium Park - Cloud Gate', 'ミレニアムパーク - クラウドゲート', 'sculpture', '通称「ザ・ビーン」。アニッシュ・カプーアの鏡面彫刻がシカゴの街を映す。', 'Chicago', 'USA', 41.8827, -87.6233, 80),
('Chicago Cultural Center - Tiffany Dome', 'シカゴ文化センター - ティファニードーム', 'architecture', '世界最大のティファニー製ステンドグラス。ルネサンス様式の豪華な内装。', 'Chicago', 'USA', 41.8837, -87.6250, 75),

-- Taipei (3 artworks)
('National Palace Museum', '国立故宮博物院', 'museum', '中国歴代王朝の至宝。翡翠の白菜、肉形石など世界最高峰の中国美術コレクション。', 'Taipei', 'Taiwan', 25.1024, 121.5485, 90),
('Taipei Fine Arts Museum', '台北市立美術館', 'museum', '台湾現代美術の中心地。台湾アーティストによる実験的な作品と国際展。', 'Taipei', 'Taiwan', 25.0724, 121.5246, 75),
('Huashan 1914 Creative Park', '華山1914文化創意産業園区', 'gallery', '旧酒造工場を改装したアートスペース。若手クリエイターによる展示とイベント。', 'Taipei', 'Taiwan', 25.0440, 121.5293, 70),

-- Stockholm (3 artworks)
('Vasa Museum', 'ヴァーサ号博物館', 'museum', '17世紀の軍艦を丸ごと展示。木彫装飾が施された船体は海洋芸術の傑作。', 'Stockholm', 'Sweden', 59.3280, 18.0916, 85),
('Moderna Museet', '国立近代美術館', 'museum', 'ピカソ、ダリ、ウォーホルなど20世紀美術の名作。北欧モダンアートも充実。', 'Stockholm', 'Sweden', 59.3258, 18.0840, 80),
('Stockholm Metro Art', 'ストックホルム地下鉄アート', 'installation', '世界最長の美術館。100駅以上に絵画、彫刻、インスタレーションが展示。', 'Stockholm', 'Sweden', 59.3293, 18.0686, 75),

-- Vienna (3 artworks)
('Kunsthistorisches Museum', '美術史美術館', 'museum', 'ハプスブルク家コレクション。ブリューゲル、フェルメール、ベラスケスなどの至宝。', 'Vienna', 'Austria', 48.2038, 16.3614, 90),
('Belvedere Palace - The Kiss by Klimt', 'ベルヴェデーレ宮殿 - クリムトの接吻', 'museum', 'クリムトの代表作「接吻」を所蔵。ウィーン分離派とオーストリア美術の殿堂。', 'Vienna', 'Austria', 48.1916, 16.3802, 90),
('Hundertwasserhaus', 'フンデルトヴァッサー・ハウス', 'architecture', '芸術家が設計した集合住宅。曲線と色彩の建築アート。自然との調和がテーマ。', 'Vienna', 'Austria', 48.2068, 16.3943, 75),

-- Athens (3 artworks)
('Acropolis Museum', 'アクロポリス博物館', 'museum', 'パルテノン神殿の彫刻群。古代ギリシャ彫刻の最高峰を現代建築の中で鑑賞。', 'Athens', 'Greece', 37.9689, 23.7285, 90),
('National Archaeological Museum', '国立考古学博物館', 'museum', 'ミケーネ文明の黄金マスク。古代ギリシャ美術の世界最大コレクション。', 'Athens', 'Greece', 37.9890, 23.7322, 85),
('Anafiotika Street Art', 'アナフィオティカ ストリートアート', 'street_art', 'アクロポリスの麓の白い迷路のような集落。伝統建築と現代アートの共存。', 'Athens', 'Greece', 37.9726, 23.7280, 70),

-- Amsterdam (3 artworks)
('Rijksmuseum - The Night Watch', '国立美術館 - 夜警', 'museum', 'レンブラントの「夜警」とフェルメールの「牛乳を注ぐ女」。オランダ黄金時代の至宝。', 'Amsterdam', 'Netherlands', 52.3600, 4.8852, 90),
('Van Gogh Museum', 'ファン・ゴッホ美術館', 'museum', '世界最大のゴッホコレクション。「ひまわり」「アーモンドの花咲く枝」など200点以上の油彩。', 'Amsterdam', 'Netherlands', 52.3584, 4.8811, 90),
('Street Art Museum Amsterdam (SAMA)', 'アムステルダム ストリートアート美術館', 'street_art', '旧工業地帯のストリートアート。国際的なアーティストによる巨大壁画群。', 'Amsterdam', 'Netherlands', 52.3874, 4.9447, 70);
