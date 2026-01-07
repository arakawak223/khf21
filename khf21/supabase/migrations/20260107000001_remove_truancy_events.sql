-- 不登校関連のイベントを削除
-- ユーザーリクエストにより、不登校の子供たちへの配慮のため削除

-- 不登校関連のencouragementイベントを削除
DELETE FROM encouragement_gratitude_scenarios
WHERE subcategory LIKE '%不登校%'
   OR scenario_description LIKE '%不登校%'
   OR background_emotion LIKE '%不登校%'
   OR message_text LIKE '%不登校%';

-- 不登校関連のgratitudeイベントを削除
DELETE FROM encouragement_gratitude_scenarios
WHERE category = 'gratitude_help'
  AND (
    subcategory LIKE '%不登校%'
    OR scenario_description LIKE '%不登校%'
    OR background_emotion LIKE '%不登校%'
  );
