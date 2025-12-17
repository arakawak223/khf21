// ゲームデータ取得用API関数

import { createClient } from '@/lib/supabase/client';
import type {
  Airport,
  Airline,
  AirlineRoute,
  Attraction,
  Star,
  Art,
  Gourmet,
  Trouble,
  TroubleResolution,
  GamePeriodSetting,
  GameSession,
  EncouragementGratitudeScenario,
} from '@/types/database.types';

const supabase = createClient();

// 空港データ取得
export async function getAirports() {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .order('code');

  if (error) throw error;
  return data as Airport[];
}

export async function getAirportByCode(code: string) {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .eq('code', code)
    .single();

  if (error) throw error;
  return data as Airport;
}

// 航空会社データ取得
export async function getAirlines() {
  const { data, error } = await supabase
    .from('airlines')
    .select('*')
    .order('code');

  if (error) throw error;
  return data as Airline[];
}

// 航空ルート取得
export async function getAirlineRoutes(originId: string) {
  const { data, error } = await supabase
    .from('airline_routes')
    .select(`
      *,
      origin:origin_airport_id(code, name, name_ja, city, country),
      destination:destination_airport_id(code, name, name_ja, city, country),
      airline:airline_id(code, name, name_ja)
    `)
    .eq('origin_airport_id', originId);

  if (error) throw error;
  return data as AirlineRoute[];
}

// 名所データ取得
export async function getAttractionsByCountry(country: string) {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .eq('country', country)
    .order('impressed_points', { ascending: false });

  if (error) throw error;
  return data as Attraction[];
}

export async function getRandomAttraction() {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .limit(100);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Attraction;
}

// スターデータ取得
export async function getRandomStar() {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .limit(100);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Star;
}

// アートデータ取得
export async function getArtsByCity(city: string) {
  const { data, error } = await supabase
    .from('arts')
    .select('*')
    .eq('city', city)
    .order('impressed_points', { ascending: false });

  if (error) throw error;
  return data as Art[];
}

export async function getRandomArt() {
  const { data, error } = await supabase
    .from('arts')
    .select('*')
    .limit(100);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Art;
}

// グルメデータ取得
export async function getGourmetByCountry(country: string) {
  const { data, error } = await supabase
    .from('gourmet')
    .select('*')
    .eq('country', country)
    .order('impressed_points', { ascending: false });

  if (error) throw error;
  return data as Gourmet[];
}

export async function getRandomGourmet() {
  const { data, error } = await supabase
    .from('gourmet')
    .select('*')
    .limit(100);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Gourmet;
}

// トラブルデータ取得
export async function getRandomTrouble() {
  const { data, error } = await supabase
    .from('troubles')
    .select('*')
    .limit(50);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as Trouble;
}

// トラブル解消データ取得
export async function getTroubleResolution(troubleId: string) {
  const { data, error } = await supabase
    .from('trouble_resolutions')
    .select('*')
    .eq('trouble_id', troubleId)
    .limit(10);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as TroubleResolution;
}

// ゲーム期間設定取得
export async function getGamePeriodSettings() {
  const { data, error } = await supabase
    .from('game_period_settings')
    .select('*')
    .order('total_days');

  if (error) throw error;
  return data as GamePeriodSetting[];
}

// ゲームセッション作成
export async function createGameSession(
  userId: string,
  periodSettingId: string | null,
  totalDays: number,
  startingAirportId: string,
  playerNickname?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      user_id: userId,
      period_setting_id: periodSettingId,
      total_days: totalDays,
      current_airport_id: startingAirportId,
      current_location_type: 'airport',
      player_nickname: playerNickname || 'プレイヤー1',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating game session:', error);
    throw error;
  }
  return data as GameSession;
}

// ゲームセッション取得
export async function getGameSession(sessionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      *,
      current_airport:current_airport_id(code, name, name_ja, city, country, latitude, longitude, region),
      period_setting:period_setting_id(period_name, period_name_ja, total_days)
    `)
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}

// ユーザーのアクティブなゲームセッション取得
export async function getUserActiveGameSession(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      *,
      current_airport:current_airport_id(code, name, name_ja, city, country, latitude, longitude, region),
      period_setting:period_setting_id(period_name, period_name_ja, total_days)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ゲームセッション更新
export async function updateGameSession(
  sessionId: string,
  updates: {
    elapsed_days?: number;
    current_location_type?: 'airport' | 'port' | 'flight' | 'ship';
    current_airport_id?: string | null;
    current_port_id?: string | null;
    impressed_points?: number;
    giver_points?: number;
    status?: 'active' | 'completed' | 'abandoned';
    completed_at?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('game_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as GameSession;
}

// ゲーム進行記録作成
export async function createGameProgress(
  sessionId: string,
  sequenceNumber: number,
  destinationType: 'airport' | 'port',
  destinationId: string,
  distanceKm: number,
  stayDays: number,
  arrivalDate: string
) {
  const { data, error } = await supabase
    .from('game_progress')
    .insert({
      game_session_id: sessionId,
      sequence_number: sequenceNumber,
      destination_type: destinationType,
      [destinationType === 'airport' ? 'destination_airport_id' : 'destination_port_id']: destinationId,
      distance_km: distanceKm,
      stay_days: stayDays,
      arrival_date: arrivalDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// イベント履歴作成
export async function createEventHistory(
  sessionId: string,
  progressId: string,
  eventType: string,
  relatedTable: string | null,
  relatedId: string | null,
  eventText: string | null,
  impressedPoints: number,
  giverPoints: number
) {
  const { data, error } = await supabase
    .from('event_history')
    .insert({
      game_session_id: sessionId,
      game_progress_id: progressId,
      event_type: eventType,
      related_table: relatedTable,
      related_id: relatedId,
      event_text: eventText,
      impressed_points: impressedPoints,
      giver_points: giverPoints,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 元気づけ/感謝シナリオデータ取得
export async function getRandomEncouragementGratitudeScenario(
  category?: 'gratitude_happy' | 'gratitude_help' | 'encouragement'
) {
  let query = supabase
    .from('encouragement_gratitude_scenarios')
    .select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.limit(100);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as EncouragementGratitudeScenario;
}

// カテゴリー別の元気づけ/感謝シナリオ取得
export async function getEncouragementGratitudeScenariosByCategory(
  category: 'gratitude_happy' | 'gratitude_help' | 'encouragement'
) {
  const { data, error } = await supabase
    .from('encouragement_gratitude_scenarios')
    .select('*')
    .eq('category', category);

  if (error) throw error;
  return data as EncouragementGratitudeScenario[];
}

// サブカテゴリー別の元気づけ/感謝シナリオ取得
export async function getEncouragementGratitudeScenariosBySubcategory(
  subcategory: string
) {
  const { data, error } = await supabase
    .from('encouragement_gratitude_scenarios')
    .select('*')
    .eq('subcategory', subcategory);

  if (error) throw error;
  return data as EncouragementGratitudeScenario[];
}
