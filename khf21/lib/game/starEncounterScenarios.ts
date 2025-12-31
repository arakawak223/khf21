// 著名人との出会いシチュエーション

export type EncounterLocation = 'flight' | 'airport_lounge' | 'airport_gate' | 'hotel' | 'restaurant';

export interface StarEncounterScenario {
  location: EncounterLocation;
  situation: string;
  interaction: string;
}

/**
 * 機内での著名人との出会いシチュエーション
 */
const flightScenarios: string[] = [
  'ファーストクラスの隣の席に{name}が座っています。',
  'ファーストクラスの前の席から{name}が振り返って微笑みかけてきました。',
  'ファーストクラスの後ろの席に{name}がいることに気づきました。',
  'ファーストクラスのトイレに向かおうとしたら、{name}とすれ違いました。',
  'ファーストクラスのトイレから出たら、{name}が外で待っていました。',
  '機内食のサービス中、客室乗務員と話している{name}を見かけました。',
  '機内で読書をしていたら、隣の{name}が「面白い本ですね」と声をかけてきました。',
  '機内の窓側の席で景色を眺めていたら、通路側の{name}が「素晴らしい眺めですね」と話しかけてきました。',
  'ファーストクラスのラウンジシート で{name}がリラックスしているところに遭遇しました。',
  '機内のバーカウンターで飲み物を注文していたら、{name}が隣に来ました。',
  '機内Wi-Fiの設定で困っていたら、隣の{name}が助けてくれました。',
  '機内で軽い乱気流があり、隣の{name}と目が合って思わず笑顔になりました。',
  '機内の毛布を取ろうとしたら、{name}が先に取ってくれました。',
  '機内で映画を観ていたら、{name}も同じ映画を観ていることに気づきました。',
  '機内でヘッドフォンを落としてしまい、{name}が拾ってくれました。',
  'ファーストクラスのシャンパンサービスで、{name}と乾杯することになりました。',
  '機内で眠っていたら、{name}が優しく起こしてくれました。食事の時間でした。',
  '機内の読書灯がつかず困っていたら、{name}が客室乗務員を呼んでくれました。',
  '着陸前のシートベルト着用サインで、{name}と同時にシートを起こしました。',
  '機内で仕事をしていたら、{name}が「お疲れ様です」と声をかけてくれました。',
  'ファーストクラスのアメニティポーチを見ていたら、{name}が「これいいですよね」と話しかけてきました。',
  '機内のギャレー（調理エリア）で水をもらっていたら、{name}も同じタイミングで来ました。',
  '機内で雑誌を読んでいたら、{name}がその雑誌に載っていることに気づきました。',
  '機内でストレッチをしていたら、{name}も同じようにストレッチを始めました。',
  'ファーストクラスの座席をフラットにしていたら、{name}が「快適ですよね」と話しかけてきました。',
  '機内のエンターテイメントシステムで困っていたら、{name}が使い方を教えてくれました。',
  '離陸時の窓からの景色に感動していたら、{name}も同じように外を眺めていました。',
  '機内でコーヒーをこぼしそうになり、{name}が支えてくれました。',
  'ファーストクラスのウェルカムドリンクで、{name}と目が合いました。',
  '機内のオーダーメイドの食事メニューで、{name}と好みが似ていることが分かりました。',
];

/**
 * 空港ラウンジでの著名人との出会いシチュエーション
 */
const airportLoungeScenarios: string[] = [
  'ファーストクラスラウンジのソファで{name}がくつろいでいます。',
  'ラウンジのビュッフェコーナーで{name}と隣り合わせになりました。',
  'ラウンジのバーカウンターで{name}がカクテルを楽しんでいます。',
  'ラウンジのシャワールームから出たら、{name}が待っていました。',
  'ラウンジの静かなワークスペースで{name}が仕事をしています。',
  'ラウンジの窓際の席で{name}が搭乗を待っています。',
  'ラウンジのマッサージチェアで{name}がリラックスしています。',
  'ラウンジの新聞・雑誌コーナーで{name}と同じ雑誌を手に取りました。',
  'ラウンジのワインセラーで{name}がワインを選んでいます。',
  'ラウンジのシガールームで{name}を見かけました（喫煙者の方のみ）。',
  'ラウンジのテラス席で{name}が外の景色を眺めています。',
  'ラウンジのシェフがいるダイニングエリアで{name}が食事をしています。',
  'ラウンジのスパルームで{name}がトリートメントを待っています。',
  'ラウンジのミーティングルームから{name}が出てきました。',
  'ラウンジの搭乗案内カウンターで{name}と並びました。',
];

/**
 * 搭乗ゲートでの著名人との出会いシチュエーション
 */
const airportGateScenarios: string[] = [
  '搭乗ゲートの優先搭乗列で{name}の後ろに並びました。',
  '搭乗ゲート付近のカフェで{name}がコーヒーを飲んでいます。',
  '搭乗ゲートの待合席で{name}が電話をしています。',
  '搭乗券のチェック時に{name}と一緒になりました。',
  '搭乗ブリッジを歩いていたら{name}が前を歩いていました。',
  '搭乗ゲートのトイレで{name}とすれ違いました。',
  '搭乗待ちの間、{name}がサインを求められているのを見かけました。',
  '搭乗ゲート近くの免税店で{name}が買い物をしています。',
];

/**
 * ホテルでの著名人との出会いシチュエーション
 */
const hotelScenarios: string[] = [
  'ホテルのロビーで{name}がチェックインしています。',
  'ホテルのエレベーターで{name}と一緒になりました。',
  'ホテルの朝食ビュッフェで{name}を見かけました。',
  'ホテルのバーで{name}が一人で飲んでいます。',
  'ホテルのフィットネスジムで{name}がトレーニングしています。',
  'ホテルのプールサイドで{name}がリラックスしています。',
  'ホテルのコンシェルジュデスクで{name}が相談しています。',
  'ホテルのスパで{name}がマッサージを待っています。',
];

/**
 * レストランでの著名人との出会いシチュエーション
 */
const restaurantScenarios: string[] = [
  '高級レストランの隣のテーブルに{name}が座っています。',
  'レストランの入口で{name}と一緒になりました。',
  'レストランのバーカウンターで{name}が食前酒を楽しんでいます。',
  'レストランのワインセラーツアーで{name}と一緒になりました。',
  'レストランのテラス席で{name}が夜景を楽しんでいます。',
  'レストランのシェフズテーブルで{name}と相席になりました。',
  'レストランのトイレで{name}とすれ違いました。',
];

/**
 * 旧友・恩師との再会シチュエーション（機内）
 */
const nostalgiaMeetingsFlightScenarios: string[] = [
  'ファーストクラスの隣の席に、学生時代の親友が座っていました。',
  '機内で偶然、昔付き合っていた恋人と再会しました。お互い驚きながらも、懐かしい会話が弾みます。',
  '機内のトイレから出たら、高校時代の数学の先生とばったり会いました。',
  'ファーストクラスの前の席に、中学時代の国語の先生が座っていました。',
  '機内食のサービス中、大学時代の映画研究会の顧問の先生を見かけました。',
  '機内で読書をしていたら、少年時代のサッカーコーチが声をかけてきました。',
  'ファーストクラスのバーカウンターで、高校時代の野球部の監督と再会しました。',
  '機内の窓側の席で、子供の頃のピアノの先生が座っていることに気づきました。',
  '機内でストレッチをしていたら、学生時代のダンスの師匠が隣でストレッチしていました。',
  'ファーストクラスのラウンジシートで、将棋教室の師匠がリラックスしていました。',
  '機内Wi-Fiの設定を手伝っていたら、それは昔の同級生でした。',
  '機内で映画を観ていたら、大学時代の映画サークルの仲間が隣にいました。',
  '着陸前、隣の席の人が学生時代の部活の先輩だと気づきました。',
  '機内のギャレーで水をもらっていたら、幼馴染と何年かぶりに再会しました。',
  'ファーストクラスのシャンパンサービスで、昔の恋人と気まずく目が合いました。',
  '機内で仕事をしていたら、大学のゼミの教授が「頑張っているね」と声をかけてくれました。',
  '機内のトイレの列で、高校時代の吹奏楽部の顧問の先生と再会しました。',
  '離陸時、窓の外を眺めていたら、小学校の図工の先生が隣に座っていることに気づきました。',
  '機内のエンターテイメントシステムで困っていたら、昔の同僚が助けてくれました。',
  'ファーストクラスのアメニティポーチを見ていたら、中学時代のテニス部の先輩が話しかけてきました。',
];

/**
 * 旧友・恩師との再会シチュエーション（空港ラウンジ）
 */
const nostalgiaMeetingsLoungeScenarios: string[] = [
  'ファーストクラスラウンジのソファで、大学時代の親友がくつろいでいます。',
  'ラウンジのビュッフェコーナーで、高校時代の初恋の人と隣り合わせになりました。',
  'ラウンジのバーカウンターで、昔付き合っていた恋人がカクテルを楽しんでいます。',
  'ラウンジの静かなワークスペースで、大学時代のゼミの教授が仕事をしています。',
  'ラウンジの窓際の席で、小学校時代の担任の先生が搭乗を待っています。',
  'ラウンジのマッサージチェアで、高校の体育の先生がリラックスしています。',
  'ラウンジの新聞・雑誌コーナーで、中学時代の英語の先生と同じ雑誌を手に取りました。',
  'ラウンジのワインセラーで、学生時代のバスケ部の監督がワインを選んでいます。',
  'ラウンジのシェフがいるダイニングエリアで、子供の頃のバイオリンの先生が食事をしています。',
  'ラウンジの搭乗案内カウンターで、昔の同僚と並びました。',
  'ラウンジのシャワールームから出たら、大学時代のサークルの先輩が待っていました。',
  'ラウンジのテラス席で、高校時代の美術の先生が外の景色を眺めています。',
  'ラウンジのスパルームで、学生時代の柔道の師範が待っています。',
  'ラウンジのミーティングルームから、昔の上司が出てきました。',
  'ラウンジのビジネスセンターで、大学の卒論指導教官がプリントアウトしています。',
];

/**
 * 著名人との出会いの反応・交流パターン
 */
const interactionPatterns: string[] = [
  '{name}は気さくに挨拶してくれました。',
  '{name}は笑顔で会釈してくれました。',
  '{name}と少し会話を交わすことができました。',
  '{name}から旅の話を聞くことができました。',
  '{name}と写真を撮らせてもらいました。',
  '{name}からサインをもらいました。',
  '{name}と握手することができました。',
  '{name}から「旅を楽しんでくださいね」と声をかけてもらいました。',
  '{name}と目が合い、ウィンクしてくれました。',
  '{name}は疲れているようでしたが、優しく微笑んでくれました。',
  '{name}と偶然、目的地が同じだということが分かりました。',
  '{name}から旅のおすすめスポットを教えてもらいました。',
  '{name}と短い時間でしたが、心温まる会話ができました。',
  '{name}から「また会いましょう」と言ってもらいました。',
  '{name}の仕事の話を少し聞くことができました。',
];

/**
 * 旧友・恩師との再会の反応・交流パターン
 */
const nostalgiaInteractionPatterns: string[] = [
  '久しぶりの再会に、お互い驚きと喜びで抱き合いました。',
  '最初は気づきませんでしたが、声を聞いて思い出しました。懐かしい思い出話に花が咲きました。',
  '「元気にしてた？」と声をかけると、相手も驚いた様子で「まさか、ここで会うなんて！」と笑顔で答えました。',
  'あの頃の思い出を語り合い、時間を忘れて話し込んでしまいました。',
  '「あなたのことは今でもよく覚えていますよ」と言われ、心が温かくなりました。',
  '当時の写真を見せ合い、お互いの変わった部分と変わらない部分を笑い合いました。',
  '「あの時は本当にお世話になりました」と感謝を伝えることができました。',
  '連絡先を交換し、「今度ゆっくり会いましょう」と約束しました。',
  'お互いの近況を報告し合い、変わらない絆を感じました。',
  '「あの頃が懐かしいね」と言いながら、思い出に浸りました。',
  '別れ際に「また会えて本当に嬉しかった」と言葉を交わしました。',
  '「あなたのおかげで今の自分がいます」と伝えることができました。',
  '気まずい過去もありましたが、今は笑って話せる関係になっていました。',
  '「成長したね」と言われ、少し照れくさくなりました。',
  '「あの時は若かったね」と笑い合い、青春時代を振り返りました。',
  '短い時間でしたが、かけがえのない再会の時間を過ごせました。',
  '「頑張ってるね」と励まされ、勇気をもらいました。',
  'お互いの人生について語り、刺激を受けました。',
  '「また偶然会えるといいね」と言って別れました。',
  '久々の再会に、思わず涙ぐんでしまいました。',
];

/**
 * 出会いの場所に応じたシチュエーションをランダムに取得
 */
export function getStarEncounterScenario(
  location: EncounterLocation,
  starName: string,
  starNameJa: string
): StarEncounterScenario {
  let scenarios: string[];

  switch (location) {
    case 'flight':
      scenarios = flightScenarios;
      break;
    case 'airport_lounge':
      scenarios = airportLoungeScenarios;
      break;
    case 'airport_gate':
      scenarios = airportGateScenarios;
      break;
    case 'hotel':
      scenarios = hotelScenarios;
      break;
    case 'restaurant':
      scenarios = restaurantScenarios;
      break;
    default:
      scenarios = flightScenarios;
  }

  const situation = scenarios[Math.floor(Math.random() * scenarios.length)];
  const interaction = interactionPatterns[Math.floor(Math.random() * interactionPatterns.length)];

  // {name}を著名人の日本語名に置き換え
  const formattedSituation = situation.replace(/\{name\}/g, starNameJa);
  const formattedInteraction = interaction.replace(/\{name\}/g, starNameJa);

  return {
    location,
    situation: formattedSituation,
    interaction: formattedInteraction,
  };
}

/**
 * 移動中（機内）での著名人との出会いシチュエーションを取得
 */
export function getFlightStarEncounter(starName: string, starNameJa: string): StarEncounterScenario {
  return getStarEncounterScenario('flight', starName, starNameJa);
}

/**
 * 到着時（空港ラウンジ）での著名人との出会いシチュエーションを取得
 */
export function getArrivalStarEncounter(starName: string, starNameJa: string): StarEncounterScenario {
  // 到着時は空港ラウンジかゲートのどちらか
  const location = Math.random() < 0.7 ? 'airport_lounge' : 'airport_gate';
  return getStarEncounterScenario(location, starName, starNameJa);
}

/**
 * 旧友・恩師との再会シチュエーションを取得（機内）
 */
export function getNostalgiaFlightEncounter(): StarEncounterScenario {
  const situation = nostalgiaMeetingsFlightScenarios[
    Math.floor(Math.random() * nostalgiaMeetingsFlightScenarios.length)
  ];
  const interaction = nostalgiaInteractionPatterns[
    Math.floor(Math.random() * nostalgiaInteractionPatterns.length)
  ];

  return {
    location: 'flight',
    situation,
    interaction,
  };
}

/**
 * 旧友・恩師との再会シチュエーションを取得（空港ラウンジ）
 */
export function getNostalgiaLoungeEncounter(): StarEncounterScenario {
  const situation = nostalgiaMeetingsLoungeScenarios[
    Math.floor(Math.random() * nostalgiaMeetingsLoungeScenarios.length)
  ];
  const interaction = nostalgiaInteractionPatterns[
    Math.floor(Math.random() * nostalgiaInteractionPatterns.length)
  ];

  return {
    location: 'airport_lounge',
    situation,
    interaction,
  };
}

/**
 * 機内での出会い（著名人 or 旧友・恩師）
 * 70%: 著名人、30%: 旧友・恩師
 */
export function getFlightEncounter(starName: string, starNameJa: string): StarEncounterScenario & { isCelebrity: boolean } {
  const isCelebrity = Math.random() < 0.7;

  if (isCelebrity) {
    return {
      ...getFlightStarEncounter(starName, starNameJa),
      isCelebrity: true,
    };
  } else {
    return {
      ...getNostalgiaFlightEncounter(),
      isCelebrity: false,
    };
  }
}

/**
 * 到着時の出会い（著名人 or 旧友・恩師）
 * 70%: 著名人、30%: 旧友・恩師
 */
export function getArrivalEncounter(starName: string, starNameJa: string): StarEncounterScenario & { isCelebrity: boolean } {
  const isCelebrity = Math.random() < 0.7;

  if (isCelebrity) {
    return {
      ...getArrivalStarEncounter(starName, starNameJa),
      isCelebrity: true,
    };
  } else {
    return {
      ...getNostalgiaLoungeEncounter(),
      isCelebrity: false,
    };
  }
}
