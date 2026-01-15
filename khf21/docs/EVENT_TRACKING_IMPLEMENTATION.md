# イベントマス色分け機能の実装ガイド

## 概要

各プレイヤーの経路上で発生したイベントをマスの色で視覚的に表示する機能の実装方法を説明します。

## 完了した実装

### 1. RouteSpace型の拡張

`types/multiplayer.types.ts` でRouteSpace型に`eventType`フィールドを追加しました。

```typescript
export interface RouteSpace {
  lat: number;
  lng: number;
  spaceNumber: number;
  eventType?: 'star' | 'trouble' | 'giver' | 'encouragement_gratitude' | null;
}
```

### 2. WorldMapコンポーネントの修正

`components/game/WorldMap.tsx` で以下の機能を実装しました：

#### イベントマスの色分け

- ⭐ **感動体験**（star, encouragement_gratitude）: 緑色
- 🎁 **喜び提供**（giver）: 黄色
- ⚠️ **トラブル**（trouble）: 赤色

#### 凡例の追加

マップ左下の凡例にイベントマスの説明を追加しました。

#### ツールチップの強化

マスをホバーすると、イベント発生情報が表示されます。

## 今後の実装が必要な部分

### イベント発生時のeventType記録

現在、`eventType`は設定されていません。イベント発生時に該当マスに`eventType`を記録する必要があります。

#### 実装箇所

`app/game/page.tsx` のイベント処理部分で、以下のように修正します：

```typescript
// イベント発生後、現在のマスにeventTypeを記録
const handleEventComplete = (eventType: EventType) => {
  setPlayers((prevPlayers) => {
    return prevPlayers.map((p) => {
      if (p.id === currentTurnPlayer.id && p.route_spaces) {
        // 現在のマス番号を取得
        const currentSpaceNumber = p.current_space_number;

        // route_spacesを更新してeventTypeを設定
        const updatedRouteSpaces = p.route_spaces.map((space) => {
          if (space.spaceNumber === currentSpaceNumber) {
            return {
              ...space,
              eventType: eventType === 'attraction' || eventType === 'art' || eventType === 'gourmet'
                ? 'star' // 名所・アート・グルメは星扱い
                : eventType,
            };
          }
          return space;
        });

        return {
          ...p,
          route_spaces: updatedRouteSpaces,
        };
      }
      return p;
    });
  });
};
```

#### 修正が必要な関数

1. **handleEventComplete** (イベント完了時)
   - イベント終了後に現在のマスにeventTypeを記録

2. **移動中のイベント処理** (generateTravelEvents)
   - イベント発生したマス番号を記録
   - プレイヤーのroute_spacesを更新

3. **到着時のイベント処理** (generateArrivalEvents)
   - 到着マス（最終マス）にeventTypeを記録

### 実装例（詳細）

#### 1. イベント発生時の記録

```typescript
// イベント処理完了後
const markEventOnSpace = (
  playerId: string,
  spaceNumber: number,
  eventType: EventType
) => {
  setPlayers((prevPlayers) => {
    return prevPlayers.map((p) => {
      if (p.id === playerId && p.route_spaces) {
        const updatedRouteSpaces = p.route_spaces.map((space) => {
          if (space.spaceNumber === spaceNumber) {
            // イベントタイプをマッピング（名所・アート・グルメは星扱い）
            let mappedEventType: RouteSpace['eventType'] = null;

            switch (eventType) {
              case 'star':
              case 'attraction':
              case 'art':
              case 'gourmet':
                mappedEventType = 'star';
                break;
              case 'trouble':
                mappedEventType = 'trouble';
                break;
              case 'giver':
                mappedEventType = 'giver';
                break;
              case 'encouragement_gratitude':
                mappedEventType = 'encouragement_gratitude';
                break;
            }

            return {
              ...space,
              eventType: mappedEventType,
            };
          }
          return space;
        });

        return {
          ...p,
          route_spaces: updatedRouteSpaces,
        };
      }
      return p;
    });
  });
};
```

#### 2. handleContinueNextEventの修正

```typescript
const handleContinueNextEvent = async () => {
  if (queuedEvents.length > 0) {
    const nextEvent = queuedEvents[0];
    setQueuedEvents(queuedEvents.slice(1));

    // イベントを表示前に記録
    if (currentTurnPlayer) {
      markEventOnSpace(
        currentTurnPlayer.id,
        currentTurnPlayer.current_space_number,
        nextEvent.type
      );
    }

    setCurrentEvent(nextEvent);
    setShowEventModal(true);
  } else {
    setShowEventModal(false);
    setCurrentEvent(null);

    // 次のターンへ...
  }
};
```

## テスト方法

1. ゲームを開始して移動する
2. イベントが発生したマスが色分けされることを確認
3. マスをホバーしてツールチップでイベント情報が表示されることを確認
4. 凡例でイベントマスの色が正しく表示されることを確認

## 注意事項

- イベントタイプの記録は移動完了後に行う
- 同じマスで複数のイベントが発生する場合、最後のイベントで上書きされる
- フリーマンのイベントも同様に記録される
- データベースには保存されないため、ページリロード時に情報は失われる（必要に応じて保存機能を追加）

## データベース保存（オプション）

将来的にイベント履歴をデータベースに保存する場合：

### テーブル設計案

```sql
CREATE TABLE player_event_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_session_id UUID REFERENCES game_sessions(id),
  player_id UUID REFERENCES game_players(id),
  space_number INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMP DEFAULT NOW()
);
```

### RouteSpaceの復元

ゲームロード時に、event_historyテーブルから各マスのeventTypeを復元します。

## まとめ

この機能により、プレイヤーは：
- 過去に発生したイベントを視覚的に確認できる
- 旅の軌跡をカラフルに振り返ることができる
- どのマスで何が起きたかを一目で把握できる

実装を完了すれば、より直感的でエンゲージメントの高いゲーム体験を提供できます。
