// ゲーム用定数定義

// 移動距離の換算率
export const DISTANCE_CONVERSION = {
  AIRPORT_KM_PER_SPACE: 500, // 飛行機: 500km = 1マス
  PORT_KM_PER_SPACE: 100, // 船: 100km = 1マス
} as const;

// 滞在日数の基準
export const STAY_DAYS = {
  SHORT_DISTANCE: 2, // 5000km以下
  LONG_DISTANCE: 3, // 5000km超
  THRESHOLD_KM: 5000, // 閾値
} as const;

// イベント発生確率（%）
export const EVENT_PROBABILITY = {
  ATTRACTION: 70, // 名所訪問
  STAR: 30, // スター遭遇
  ART: 40, // アート鑑賞
  GOURMET: 60, // グルメ体験
  TROUBLE: 20, // トラブル発生
  GIVER: 50, // 喜び提供機会
} as const;

// ポイント範囲
export const POINTS_RANGE = {
  IMPRESSED: {
    MIN: 10,
    MAX: 100,
  },
  GIVER: {
    MIN: 5,
    MAX: 50,
  },
} as const;

// ゲーム画面タイプ
export const SCREEN_TYPE = {
  MAP: 'map',
  MOVEMENT: 'movement',
  ROULETTE: 'roulette',
  EVENT: 'event',
  RESULT: 'result',
} as const;

// イベントタイプ
export const EVENT_TYPE = {
  ATTRACTION: 'attraction',
  STAR: 'star',
  ART: 'art',
  GOURMET: 'gourmet',
  TROUBLE: 'trouble',
  TROUBLE_RESOLUTION: 'trouble_resolution',
  GIVER: 'giver',
} as const;

// 移動タイプ
export const TRANSPORT_TYPE = {
  FLIGHT: 'flight',
  SHIP: 'ship',
} as const;

// ゲームステータス
export const GAME_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const;

// 場所タイプ
export const LOCATION_TYPE = {
  AIRPORT: 'airport',
  PORT: 'port',
  FLIGHT: 'flight',
  SHIP: 'ship',
} as const;

// アトラクションカテゴリ
export const ATTRACTION_CATEGORY = {
  WORLD_HERITAGE: 'world_heritage',
  SCENIC_SPOT: 'scenic_spot',
  LANDMARK: 'landmark',
} as const;

// スターカテゴリ
export const STAR_CATEGORY = {
  MUSICIAN: 'musician',
  ARTIST: 'artist',
  MOVIE_STAR: 'movie_star',
  ATHLETE: 'athlete',
} as const;

// アートカテゴリ
export const ART_CATEGORY = {
  CONCERT: 'concert',
  MUSICAL: 'musical',
  PERFORMANCE: 'performance',
  STREET_ART: 'street_art',
} as const;

// トラブルカテゴリ
export const TROUBLE_CATEGORY = {
  THEFT: 'theft',
  ROBBERY: 'robbery',
  FLIGHT_DELAY: 'flight_delay',
  HIJACK: 'hijack',
  ENGINE_FAILURE: 'engine_failure',
  SHIPWRECK: 'shipwreck',
  PIRATE: 'pirate',
  FIRE: 'fire',
} as const;

// ヘルパータイプ（トラブル解消者）
export const HELPER_TYPE = {
  LOCAL_PERSON: 'local_person',
  TOUR_GUIDE: 'tour_guide',
  FIREFIGHTER: 'firefighter',
  PARAMEDIC: 'paramedic',
  POLICE: 'police',
  COAST_GUARD: 'coast_guard',
  DETECTIVE: 'detective',
  DOCTOR: 'doctor',
  JAPANESE_TRAVELER: 'japanese_traveler',
} as const;

// BGM/効果音タイプ
export const AUDIO_TYPE = {
  AIRPLANE_ENGINE: 'airplane_engine',
  SHIP_SAILING: 'ship_sailing',
  CHEERFUL: 'cheerful',
  HEALING: 'healing',
  DARK: 'dark',
  TROUBLE: 'trouble',
} as const;

// BGM URL定義
export const BGM_URLS = {
  // ゲーム開始時のBGM（プレイヤーが選択）
  GAME_START: [
    '/audio/bgm/maou_game_field01.mp3',
    '/audio/bgm/maou_game_town03.mp3',
    '/audio/bgm/maou_game_field04.mp3',
  ],
  // 目的地決定ルーレット
  DESTINATION_ROULETTE: [
    '/audio/bgm/maou_game_vehicle03.mp3',
  ],
  // マスルーレット（サイコロ）
  DICE_ROULETTE: [
    '/audio/bgm/maou_game_casino01.mp3',
  ],
  // 飛行機がマスを進む
  FLYING: [
    '/audio/bgm/maou_game_vehicle01.mp3',
  ],
  // トラブル発生
  TROUBLE: [
    '/audio/bgm/ms/maou_game_theme08.mp3',
    '/audio/bgm/ms/maou_game_village08.mp3',
    '/audio/bgm/ms/maou_game_town08.mp3',
    '/audio/bgm/ms/maou_game_dangeon19.mp3',
  ],
  // 悲しい場面
  SAD: [
    '/audio/bgm/ms/maou_game_theme12.mp3',
    '/audio/bgm/ms/maou_game_dangeon03.mp3',
  ],
  // 温かい場面
  WARM: [
    '/audio/bgm/me/maou_game_village10.mp3',
    '/audio/bgm/me/maou_game_village04.mp3',
  ],
  // 明るい場面
  BRIGHT: [
    '/audio/bgm/me/maou_game_village03b.mp3',
    '/audio/bgm/me/maou_game_town13.mp3',
    '/audio/bgm/me/maou_game_town01.mp3',
    '/audio/bgm/me/maou_game_town24.mp3',
  ],
} as const;

// ゲーム期間設定（5パターン固定）- 非推奨：目的地数設定を使用してください
export const GAME_PERIODS = [
  { value: '1week', label: '1週間', days: 7 },
  { value: '2weeks', label: '2週間', days: 14 },
  { value: '1month', label: '1か月', days: 30 },
  { value: '3months', label: '3か月', days: 90 },
  { value: '6months', label: '6か月', days: 180 },
] as const;

// 目的地数設定（5パターン）
export const DESTINATION_COUNTS = [
  { value: '3destinations', label: '3箇所', count: 3 },
  { value: '5destinations', label: '5箇所', count: 5 },
  { value: '10destinations', label: '10箇所', count: 10 },
  { value: '20destinations', label: '20箇所', count: 20 },
  { value: '50destinations', label: '50箇所', count: 50 },
] as const;

// アニメーション時間（ミリ秒）
export const ANIMATION_DURATION = {
  ROULETTE_SPIN: 3000,
  SCREEN_TRANSITION: 400,
  EVENT_REVEAL: 500,
  MOVEMENT: 2000,
} as const;

// ローカルストレージキー
export const STORAGE_KEY = {
  GAME_SESSION: 'game_session_id',
  SETTINGS: 'game_settings',
  AUDIO_ENABLED: 'audio_enabled',
} as const;
