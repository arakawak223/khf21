# 世界旅行すごろくゲーム

ルーレットを回して飛行機と豪華客船で世界を旅するすごろくゲーム

## ゲーム概要

### ゲームの目的
- 世界中を旅しながら、感動体験（Impressed）ポイントと喜び提供（Giver）ポイントを獲得
- 期間終了時に最も高いポイントを目指す

### ゲームの特徴
1. **感動体験システム**
   - 世界遺産や絶景ポイントを訪問
   - 憧れのスターやアーティストと出会う
   - コンサートやミュージカルを鑑賞
   - ご当地グルメを体験
   - トラブルから救われる感動

2. **喜び提供システム**
   - 旅先で困っている人を助ける
   - 悩みを聞いて相談に乗る
   - 落ち込んでいる人を励ます
   - 小さな親切や感謝の行動

3. **期間設定**
   - 1週間（7日）
   - 2週間（14日）
   - 1か月（30日）
   - 2か月（60日）
   - 3か月（90日）
   - 6か月（180日）
   - 1年（365日）

4. **移動システム**
   - 飛行機：500km = 1マス
   - 船：100km = 1マス
   - 移動距離による滞在日数：5000km以下=2日、5000km超=3日

## 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### バックエンド
- **Supabase** (PostgreSQL)
  - 認証
  - データベース
  - Row Level Security (RLS)

### PWA
- Progressive Web App対応
- スマホアプリのように動作
- オフライン対応準備

## プロジェクト構造

```
khf21/
├── app/
│   ├── game/page.tsx              # ゲームメイン画面
│   ├── page.tsx                   # ホーム画面
│   ├── layout.tsx                 # ルートレイアウト
│   └── globals.css                # グローバルスタイル
├── components/
│   ├── game/
│   │   ├── EventModal.tsx         # イベントベースコンポーネント
│   │   ├── Roulette.tsx          # ルーレット
│   │   ├── PointsDisplay.tsx     # ポイント表示
│   │   ├── GameProgress.tsx      # 進行状況
│   │   ├── WorldMap.tsx          # 世界地図
│   │   ├── GameSetup.tsx         # ゲーム開始画面
│   │   └── events/               # イベントコンポーネント
│   │       ├── AttractionEvent.tsx   # 名所訪問
│   │       ├── StarEvent.tsx         # スター遭遇
│   │       ├── ArtEvent.tsx          # アート鑑賞
│   │       ├── GourmetEvent.tsx      # グルメ体験
│   │       ├── TroubleEvent.tsx      # トラブル/解消
│   │       └── GiverEvent.tsx        # 喜び提供
│   └── ui/                       # shadcn/ui コンポーネント
├── lib/
│   ├── game/
│   │   ├── GameContext.tsx       # ゲーム状態管理
│   │   ├── eventManager.ts       # イベント発生管理
│   │   ├── utils.ts              # ユーティリティ関数
│   │   ├── api.ts                # Supabase API
│   │   └── constants.ts          # 定数定義
│   └── supabase/                 # Supabaseクライアント
├── types/
│   └── database.types.ts         # データベース型定義
├── supabase/
│   └── migrations/
│       └── 20251213000001_initial_schema.sql  # DBスキーマ
└── public/
    └── manifest.json             # PWAマニフェスト
```

## データベーススキーマ

### マスタテーブル
- `airports` - 世界主要100空港
- `airlines` - 主要航空会社10社
- `airline_routes` - 航空ルート
- `ports` - 港
- `ship_routes` - 船ルート
- `attractions` - 名所（世界遺産、絶景、ランドマーク）
- `stars` - スター（ミュージシャン、アーティスト、映画スター、アスリート）
- `arts` - アート（コンサート、ミュージカル、パフォーマンス、大道芸）
- `gourmet` - グルメ
- `troubles` - トラブル
- `trouble_resolutions` - トラブル解消
- `impressed_scenarios` - 感動体験シナリオ
- `giver_scenarios` - 喜び提供シナリオ
- `game_period_settings` - ゲーム期間設定

### ゲームデータテーブル
- `game_sessions` - ゲームセッション
- `game_progress` - ゲーム進行履歴
- `event_history` - イベント発生履歴

## セットアップ

### 1. 環境変数の設定

`.env.local`ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. データベースのセットアップ

Supabaseプロジェクトで、`supabase/migrations/20251213000001_initial_schema.sql`を実行

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリが起動します

## ゲームの流れ

1. **ゲーム開始**
   - 期間を選択（1週間〜1年）
   - 出発空港を選択

2. **ルーレットを回す**
   - 1-6のマスを進む

3. **イベント発生**
   - 移動中のイベント（トラブル、喜び提供）
   - 到着地のイベント（名所、スター、アート、グルメ）

4. **ポイント獲得**
   - 感動体験（Impressed）ポイント
   - 喜び提供（Giver）ポイント

5. **期間終了**
   - 合計ポイントを表示
   - 新しい旅を始める

## 開発状況

### 完了したフェーズ

✅ **フェーズ1: 技術基盤の構築**
- データベース設計
- TypeScript型定義
- PWA設定
- レスポンシブデザイン基盤

✅ **フェーズ2: コアゲームロジック実装**
- ルーレット機能
- マップ移動システム
- ポイントシステム
- ゲームセッション管理

✅ **フェーズ3: イベントシステム実装**
- 名所訪問イベント
- スター遭遇イベント
- アート鑑賞イベント
- グルメイベント
- トラブル/解消イベント
- 喜び提供イベント

✅ **フェーズ4: UI/UX実装とゲームフロー統合**
- イベント発生ロジック
- 画面自動遷移
- ゲームフロー統合

### 今後の開発予定

🔄 **フェーズ5: メディア実装**
- 世界地図の実装
- BGM/効果音の追加
- 画像素材の追加

🔄 **フェーズ6: コンテンツ充実**
- 実際の空港データ投入
- 名所・スター・アート・グルメデータの充実
- シナリオの洗練

🔄 **フェーズ7: 機能拡張**
- セーブ/ロード機能
- 旅の履歴表示
- 統計情報

🔄 **フェーズ8: マルチプレイヤー対応**
- 複数人プレイ機能
- ランキング機能

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！

---

🎮 **世界旅行すごろくゲーム v1.0**
