# Supabaseマイグレーション手動実行手順

## 世界遺産データを追加する方法

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com/dashboard にアクセス
   - プロジェクト「khf21」を選択

2. **SQL Editorを開く**
   - 左サイドバーから「SQL Editor」をクリック

3. **マイグレーションファイルを実行**
   - 以下の2つのファイルの内容をコピー＆ペーストして実行：

   **ファイル1: 30個の世界遺産**
   ```
   supabase/migrations/20260128000001_add_30_world_heritage_sites.sql
   ```

   **ファイル2: 100個の世界遺産**
   ```
   supabase/migrations/20260128000002_add_100_world_heritage_sites.sql
   ```

4. **実行手順**
   - ファイルの内容を全選択してコピー
   - SQL Editorに貼り付け
   - 「Run」ボタンをクリック
   - エラーが出た場合は、すでに実行済みの可能性があります

5. **確認**
   - 以下のSQLで世界遺産の数を確認：
   ```sql
   SELECT COUNT(*) FROM attractions WHERE category = 'world_heritage';
   ```
   - 130個以上あればOKです

## トラブルシューティング

### エラー: "duplicate key value violates unique constraint"
- すでにデータが存在している場合に出るエラーです
- 問題ありません、すでに実行済みです

### 世界遺産がゲームで出ない場合
- データベースに反映されるまで数分かかる場合があります
- ブラウザのキャッシュをクリアしてください（Ctrl+Shift+R または Cmd+Shift+R）
- 新しいゲームを開始してください
