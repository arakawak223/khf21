-- 不登校関連のイベントを削除
-- ユーザーリクエストにより、不登校の子供たちへの配慮のため削除

-- 不登校関連のイベントを削除
DELETE FROM encouragement_gratitude_scenarios
WHERE subcategory LIKE '%不登校%'
   OR travel_situation LIKE '%不登校%'
   OR background_story LIKE '%不登校%'
   OR message_text LIKE '%不登校%'
   OR location_context LIKE '%不登校%';
