-- 元気づけ/感謝のメッセージテキストをトーンダウン
-- 暑苦しさやベタな表現を抑えて、より自然で落ち着いた表現に修正

-- A. 嬉しい出来事への感謝（1-10）

-- 1. 仕事・キャリア関連
UPDATE encouragement_gratitude_scenarios
SET message_text = '田中、あの時は本当に助かったよ。一緒に考えてくれたおかげで、プレゼンも昇進もうまくいった。ありがとう。'
WHERE category = 'gratitude_happy' AND subcategory = '仕事・キャリア' AND location_context = 'ロンドン';

-- 2. 学業関連
UPDATE encouragement_gratitude_scenarios
SET message_text = 'パリで昔を思い出しました。あなたが教えてくれなかったら合格できませんでした。今こうして旅行を楽しめているのも、あの時の支えがあったからです。感謝しています。'
WHERE category = 'gratitude_happy' AND subcategory = '学業' AND location_context = 'パリ';

-- 3. 恋愛・人間関係
UPDATE encouragement_gratitude_scenarios
SET message_text = '美咲、背中を押してくれてありがとう。あの時の勇気があったから、今の幸せがあるよ。バルセロナから感謝を込めて。'
WHERE category = 'gratitude_happy' AND subcategory = '恋愛・人間関係' AND location_context = 'バルセロナ';

-- 4. 健康回復
UPDATE encouragement_gratitude_scenarios
SET message_text = '健太、見て！ローマだよ！入院中、毎日来てくれて本当に助かった。おかげで元気になったよ。ありがとう。'
WHERE category = 'gratitude_happy' AND subcategory = '健康' AND location_context = 'ローマ';

-- 5. 夢の実現
UPDATE encouragement_gratitude_scenarios
SET message_text = '先生、今ニューヨークの美術館にいます。先生が信じてくれたから、夢を続けられました。感謝しています。'
WHERE category = 'gratitude_happy' AND subcategory = '夢の実現' AND location_context = 'ニューヨーク';

-- 6. 家族の和解
UPDATE encouragement_gratitude_scenarios
SET message_text = '今、お父さんと京都を旅してるよ。あなたが間に入ってくれて、仲直りできた。ありがとう。'
WHERE category = 'gratitude_happy' AND subcategory = '家族' AND location_context = '京都';

-- 7. 経済的困難からの脱出
UPDATE encouragement_gratitude_scenarios
SET message_text = '部長、お元気ですか。今シンガポールに来ています。あの時仕事を紹介していただいて、本当に助かりました。感謝しています。'
WHERE category = 'gratitude_happy' AND subcategory = '経済・仕事' AND location_context = 'シンガポール';

-- 8. 才能の発見
UPDATE encouragement_gratitude_scenarios
SET message_text = '麻衣、今ウィーンのオペラハウスにいるの。音楽を始めるきっかけをくれてありがとう。楽しく歌えています。'
WHERE category = 'gratitude_happy' AND subcategory = '才能・自己実現' AND location_context = 'ウィーン';

-- 9. 新しい人生の始まり
UPDATE encouragement_gratitude_scenarios
SET message_text = 'エミリー、今は旅行で離れてるけど、メルボルンが好きになったのはあなたのおかげ。最初に声をかけてくれてありがとう。早く帰りたい！'
WHERE category = 'gratitude_happy' AND subcategory = '新生活・移住' AND location_context = 'メルボルン';

-- 10. ペット・大切なものとの再会
UPDATE encouragement_gratitude_scenarios
SET message_text = '太郎、今ポチに会いに帰る途中だよ。あの時は一緒に探してくれてありがとう。おかげで見つかったよ。'
WHERE category = 'gratitude_happy' AND subcategory = 'ペット' AND location_context = '飛行機内（東京→札幌）';

-- B. 自分の辛い時に助けてもらった感謝（11-25）

-- 11. 失恋の慰め
UPDATE encouragement_gratitude_scenarios
SET message_text = '由香、見て、パリだよ。一人旅できるまで回復したよ。あの時は話を聞いてくれてありがとう。'
WHERE category = 'gratitude_help' AND subcategory = '失恋・心の傷' AND location_context = 'パリ';

-- 12. 親の介護の支え
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あの時、手伝いに来てくれて助かったよ。やっと一緒に旅行に来れて嬉しい。ありがとう。'
WHERE category = 'gratitude_help' AND subcategory = '介護' AND location_context = '温泉旅行';

-- 13. いじめ・ハラスメントからの救出
UPDATE encouragement_gratitude_scenarios
SET message_text = '加藤さん、今沖縄の社員旅行に来てます。新しい職場で楽しくやってます。あの時は助けてくれてありがとうございました。'
WHERE category = 'gratitude_help' AND subcategory = 'いじめ・ハラスメント' AND location_context = '沖縄';

-- 14. 借金問題の相談
UPDATE encouragement_gratitude_scenarios
SET message_text = '今、箱根に来てます。元気にやってます。あの時、相談に乗ってくれてありがとう。おかげで立ち直れました。'
WHERE category = 'gratitude_help' AND subcategory = '借金・経済問題' AND location_context = '箱根';

-- 15. 子育ての悩み相談
UPDATE encouragement_gratitude_scenarios
SET message_text = '真理子、こうして旅行を楽しめるようになったよ。あの時の言葉に救われました。今は子供が可愛くて仕方ないよ。ありがとう。'
WHERE category = 'gratitude_help' AND subcategory = '子育て' AND location_context = '夫婦旅行';

-- 16. ペットロス
UPDATE encouragement_gratitude_scenarios
SET message_text = '今、鎌倉でモモの供養をしてきたよ。前を向けるようになったのは、あなたが一緒に思い出を語ってくれたから。ありがとう。'
WHERE category = 'gratitude_help' AND subcategory = 'ペットロス' AND location_context = '鎌倉';

-- 17. 災害時の助け
UPDATE encouragement_gratitude_scenarios
SET message_text = '田村さん、旅行のお土産です。あの時は助けていただきありがとうございました。おかげで立ち直れました。'
WHERE category = 'gratitude_help' AND subcategory = '災害支援' AND location_context = '自宅訪問';

-- 18. 引きこもりからの脱出支援
UPDATE encouragement_gratitude_scenarios
SET message_text = '佐々木さん、タイに着きました。あの時、諦めずに付き合ってくれて感謝しています。おかげで外に出られるようになりました。'
WHERE category = 'gratitude_help' AND subcategory = '引きこもり・精神疾患' AND location_context = 'タイ';

-- 19. DVからの脱出支援
UPDATE encouragement_gratitude_scenarios
SET message_text = '山口さん、今幸せな旅行中です。写真を送ります。あの時は助けてくださり、ありがとうございました。'
WHERE category = 'gratitude_help' AND subcategory = 'DV・虐待' AND location_context = '旅行中';

-- 20. 依存症からの回復支援
UPDATE encouragement_gratitude_scenarios
SET message_text = '大輔、富士山見てるよ。清々しい空気が美味い。あの時は見捨てずにいてくれてありがとう。おかげで回復できた。'
WHERE category = 'gratitude_help' AND subcategory = '依存症' AND location_context = '富士山';

-- 21. 事故後のリハビリ支援
UPDATE encouragement_gratitude_scenarios
SET message_text = 'お前のおかげで、また旅行に来れたよ。毎日付き添ってくれてありがとう。一緒にいような。'
WHERE category = 'gratitude_help' AND subcategory = '事故・リハビリ' AND location_context = '京都';

-- 22. 詐欺被害の相談
UPDATE encouragement_gratitude_scenarios
SET message_text = '今、初めての旅行中です。あの時は相談に乗ってくれてありがとう。おかげで立ち直れました。'
WHERE category = 'gratitude_help' AND subcategory = '詐欺被害' AND location_context = '温泉旅行';

-- 23. 妊娠中のトラブル支援
UPDATE encouragement_gratitude_scenarios
SET message_text = 'お義母さん、この子を見てください。すくすく育っています。あの時は助けていただき、ありがとうございました。'
WHERE category = 'gratitude_help' AND subcategory = '妊娠・出産' AND location_context = '温泉旅行';

-- 24. パワハラ退職後の支援
UPDATE encouragement_gratitude_scenarios
SET message_text = '今、ハワイの社員旅行で楽しんでるよ！あの時は応援してくれてありがとう。おかげで次の仕事が見つかったよ。'
WHERE category = 'gratitude_help' AND subcategory = 'パワハラ・退職' AND location_context = 'ハワイ';

-- 25. 孤独な高齢者への訪問
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたたちの訪問が、私の楽しみになりました。こうして旅行に連れてきてくれてありがとう。富士山が見れて嬉しいです。'
WHERE category = 'gratitude_help' AND subcategory = '高齢者・孤独' AND location_context = '富士山';

-- C. 相手が辛い時の元気づけ（26-50）

-- 26. 就職活動の失敗
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたの価値は、採用結果で決まるものじゃない。努力も人柄も知ってるよ。必ず良い場所が見つかる。帰ったら一緒に探そう。'
WHERE category = 'encouragement' AND subcategory = '就職活動' AND location_context = '新幹線内';

-- 27. 試験の失敗
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたがどれだけ頑張ってきたか、見てきたよ。この努力は無駄じゃない。休んでもいいけど、もう少し頑張れるならもったいない。帰ったらゆっくり話そう。'
WHERE category = 'encouragement' AND subcategory = '試験・受験' AND location_context = '京都';

-- 28. 事業の失敗
UPDATE encouragement_gratitude_scenarios
SET message_text = '失敗は終わりじゃなくて、経験だよ。挑戦したこと自体が立派だ。この経験が次に活きるから。帰国したらすぐ会おう。'
WHERE category = 'encouragement' AND subcategory = '事業・起業' AND location_context = 'シンガポール';

-- 29. 大切な人との別れ
UPDATE encouragement_gratitude_scenarios
SET message_text = '今すぐ帰るから。その悲しみは、それだけ深く愛していた証拠だよね。その愛は心の中に残る。一緒にいるから。'
WHERE category = 'encouragement' AND subcategory = '死別・喪失' AND location_context = '温泉旅館';

-- 30. 子供の不登校
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたは十分頑張ってるよ。子供の不登校は、誰のせいでもない。今は必要なことを一緒に見つけていけばいい。明日帰るから、すぐ会いに行くね。'
WHERE category = 'encouragement' AND subcategory = '子育て・不登校' AND location_context = '大阪';

-- 31. 病気の告知
UPDATE encouragement_gratitude_scenarios
SET message_text = '怖いよね、不安だよね。でも医学は進歩してる。一人で闘うんじゃない。私もいる、家族もいる。一緒に乗り越えよう。旅行から帰ったら、病院に付き添うよ。'
WHERE category = 'encouragement' AND subcategory = '病気・闘病' AND location_context = '北海道';

-- 32. 容姿へのコンプレックス
UPDATE encouragement_gratitude_scenarios
SET message_text = '私にはあなたがとても魅力的に見えるよ。本当の美しさは心にある。あなたの優しさ、思いやりが素敵だよ。外見だけじゃない、心が大事なんだよ。'
WHERE category = 'encouragement' AND subcategory = '容姿・外見' AND location_context = '沖縄';

-- 33. 友人関係の崩壊
UPDATE encouragement_gratitude_scenarios
SET message_text = '辛いよね。でも、これで終わりじゃないよ。時間が経てば、冷静になれるかもしれない。俺もお前の友達だから。一人じゃないよ。帰ったら一緒に遊ぼう。'
WHERE category = 'encouragement' AND subcategory = '友人関係' AND location_context = 'パリ';

-- 34. 親の認知症
UPDATE encouragement_gratitude_scenarios
SET message_text = '本当に辛いよね。でも、お兄ちゃんが向き合ってる姿は立派だよ。完璧じゃなくていい、休んでいいんだよ。明日帰るから、交代するよ。お兄ちゃんも少し休んで。'
WHERE category = 'encouragement' AND subcategory = '介護・認知症' AND location_context = '温泉';

-- 35. いじめの被害
UPDATE encouragement_gratitude_scenarios
SET message_text = '無理して行かなくていいよ。あなたの心と体が一番大事。逃げることは恥じゃない。いじめる方が悪い。あなたは何も悪くない。明日お父さんお母さんと一緒に、これからのこと考えよう。'
WHERE category = 'encouragement' AND subcategory = 'いじめ' AND location_context = '名古屋';

-- 36. 流産・死産
UPDATE encouragement_gratitude_scenarios
SET message_text = '今すぐ帰るから。あなたのせいじゃないよ。誰のせいでもない。悲しんでいい、泣いていい。その小さな命は、あなたのお腹で生きてたんだよ。そばにいるから。'
WHERE category = 'encouragement' AND subcategory = '流産・死産' AND location_context = '箱根';

-- 37. ペットの重病
UPDATE encouragement_gratitude_scenarios
SET message_text = 'どんな選択をしても、あなたがペットを愛してることには変わりない。最後まで一緒にいてあげることが、一番の愛情だよ。正解なんてないから。帰ったらすぐ会いに行くね。'
WHERE category = 'encouragement' AND subcategory = 'ペット・重病' AND location_context = '北海道';

-- 38. 転勤・転校の孤独
UPDATE encouragement_gratitude_scenarios
SET message_text = '新しい環境は怖いよね。でも、あなたは前の場所でも友達作れたんだから、きっとここでもできるよ。時間がかかってもいい。来週帰るから、一緒に飲みに行こう！'
WHERE category = 'encouragement' AND subcategory = '転勤・転校' AND location_context = 'ロンドン';

-- 39. 家族との不和
UPDATE encouragement_gratitude_scenarios
SET message_text = '家族だからって、全部理解し合える必要はないよ。あなたはあなたでいい。距離を取ることも、時には必要だよ。お母さんはあなたの味方だから。明日帰るから、ゆっくり話そう。'
WHERE category = 'encouragement' AND subcategory = '家族不和' AND location_context = '京都';

-- 40. 自己肯定感の低さ
UPDATE encouragement_gratitude_scenarios
SET message_text = '私にとって、あなたはかけがえのない存在だよ。自分では見えなくても、あなたには素晴らしいところがあるよ。帰ったらゆっくり話そう。一人で抱え込まないで。'
WHERE category = 'encouragement' AND subcategory = '自己肯定感' AND location_context = '温泉';

-- 41. 介護離職の後悔
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたは立派なことをしたよ。親孝行できて、最期まで看取れたこと、後悔することじゃない。これからまた、新しいスタートを切ればいい。来週帰るから、一緒に求人見ようか。'
WHERE category = 'encouragement' AND subcategory = '介護離職' AND location_context = '沖縄';

-- 42. 離婚の傷
UPDATE encouragement_gratitude_scenarios
SET message_text = '一つの関係が終わったからって、あなたの価値は変わらないよ。そこから学んだことがある。次はもっと幸せになれるよ。焦らなくていい。必ず良い日が来るよ。'
WHERE category = 'encouragement' AND subcategory = '離婚' AND location_context = 'ハワイ';

-- 43. 夢を諦めた後悔
UPDATE encouragement_gratitude_scenarios
SET message_text = '夢は一つじゃないし、諦めたわけじゃない。形を変えて続ければいい。趣味でもいいじゃない。あなたの音楽への愛は、誰にも奪えないよ。音楽は仕事じゃなくても続けられる。'
WHERE category = 'encouragement' AND subcategory = '夢・キャリア' AND location_context = 'ナッシュビル';

-- 44. SNSでの誹謗中傷
UPDATE encouragement_gratitude_scenarios
SET message_text = '顔も知らない人の言葉に、傷つく必要はないよ。あなたを本当に知ってる人は、あなたの価値を分かってる。画面の向こうの悪意より、今ここにいる私の言葉を信じて。休暇明けに会おうね。'
WHERE category = 'encouragement' AND subcategory = 'SNS・誹謗中傷' AND location_context = 'バリ島';

-- 45. 金銭トラブル
UPDATE encouragement_gratitude_scenarios
SET message_text = '辛い経験だったね。でも、これで人を見る目が養われたんだよ。授業料だと思おう。本当の友人は、お金で関係を壊さない。帰ったらゆっくり話そう。'
WHERE category = 'encouragement' AND subcategory = '金銭トラブル' AND location_context = '京都';

-- 46. 更年期障害の苦しみ
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたは弱くなんかない。更年期は誰にでも来るもの。体が変化してるだけ。辛い時は休んでいいんだよ。今まで十分頑張ってきたんだから。来週戻ったら一緒に考えよう。'
WHERE category = 'encouragement' AND subcategory = '更年期' AND location_context = '温泉';

-- 47. 障害者差別
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたには、あなたにしかできないことがある。障害は個性の一つ。あなたの存在自体に価値がある。できないことより、できることに目を向けよう。今日一日、一緒に楽しもう！'
WHERE category = 'encouragement' AND subcategory = '障害・差別' AND location_context = 'バリアフリーツアー';

-- 48. 不妊治療の苦しみ
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたのせいじゃないよ。辛いのは当然だよ。でも、あなたの価値は子供を産めるかどうかで決まらない。あなたはあなたのままで素晴らしいんだよ。無理しないで。来週帰るから、会おうね。'
WHERE category = 'encouragement' AND subcategory = '不妊治療' AND location_context = 'ハワイ';

-- 49. セクシャルマイノリティの悩み
UPDATE encouragement_gratitude_scenarios
SET message_text = 'あなたはあなたのままでいい。変える必要なんてない。カミングアウトは急がなくていい。でも、ここにはあなたを受け入れる人がいる。一人じゃないよ。帰ったらゆっくり話そう。'
WHERE category = 'encouragement' AND subcategory = 'LGBTQ+' AND location_context = 'サンフランシスコ';

-- 50. 老後の不安
UPDATE encouragement_gratitude_scenarios
SET message_text = '不安だよね。でも、今から備えればいい。そして、家族じゃなくても、繋がりは作れる。地域のコミュニティとか。見て、今こうして私たちも出会ったじゃないですか。明日も一緒に観光しませんか？'
WHERE category = 'encouragement' AND subcategory = '老後・孤独' AND location_context = '温泉宿';

-- パターンベースの一括トーンダウン
-- 過度に感情的なフレーズを削除・置換

-- 「一生忘れません」「一生忘れない」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '一生忘れません。', '')
WHERE message_text LIKE '%一生忘れません。%';

UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '一生忘れない。', '')
WHERE message_text LIKE '%一生忘れない。%';

-- 「本当に、本当に」を「本当に」に置換
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '本当に、本当に', '本当に')
WHERE message_text LIKE '%本当に、本当に%';

-- 「心から感謝しています」を「感謝しています」に簡略化
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '心から感謝しています', '感謝しています')
WHERE message_text LIKE '%心から感謝しています%';

-- 「あなたは私の恩人です」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたは私の恩人です。', '')
WHERE message_text LIKE '%あなたは私の恩人です。%';

UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたは私のキャリアの恩人です。', '')
WHERE message_text LIKE '%あなたは私のキャリアの恩人です。%';

-- 「命の恩人」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたは私の命の恩人です。', '')
WHERE message_text LIKE '%あなたは私の命の恩人です。%';

UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '命の恩人です。', '')
WHERE message_text LIKE '%命の恩人です。%';

-- 「涙が止まりません」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '涙が止まりません。', '')
WHERE message_text LIKE '%涙が止まりません。%';

-- 「心が震えました」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '心が震えました。', '')
WHERE message_text LIKE '%心が震えました。%';

-- 「あなたの存在が私の最高の薬でした」を「あなたの存在に助けられました」に置換
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたの存在が私の最高の薬でした', 'あなたの存在に助けられました')
WHERE message_text LIKE '%あなたの存在が私の最高の薬でした%';

-- 「この成功はあなたのおかげです」を「ありがとうございました」に置換
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'この成功はあなたのおかげです。', 'ありがとうございました。')
WHERE message_text LIKE '%この成功はあなたのおかげです。%';

-- 「あなたの優しさに、心から感謝しています」を「ありがとうございました」に簡略化
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたの優しさに、心から感謝しています。', 'ありがとうございました。')
WHERE message_text LIKE '%あなたの優しさに、心から感謝しています。%';

-- 「あなたは私の人生を変えてくれました」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたは私の人生を変えてくれました。', '')
WHERE message_text LIKE '%あなたは私の人生を変えてくれました。%';

-- 「あなたがいなかったら、今ここにいないと思う」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたがいなかったら、今ここにいないと思う。', '')
WHERE message_text LIKE '%あなたがいなかったら、今ここにいないと思う。%';

-- 「この幸せは全てあなたのおかげです」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'この幸せは全てあなたのおかげです。', '')
WHERE message_text LIKE '%この幸せは全てあなたのおかげです。%';

-- 「全部あなたのおかげ」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '全部あなたのおかげ。', '')
WHERE message_text LIKE '%全部あなたのおかげ。%';

-- 「あなたの恩は一生忘れません」を「ありがとうございました」に置換
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたの恩は一生忘れません。', 'ありがとうございました。')
WHERE message_text LIKE '%あなたの恩は一生忘れません。%';

-- 「あなたの優しさは一生忘れない」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたの優しさは一生忘れない。', '')
WHERE message_text LIKE '%あなたの優しさは一生忘れない。%';

-- 「お前の優しさは一生忘れない」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'お前の優しさは一生忘れない。', '')
WHERE message_text LIKE '%お前の優しさは一生忘れない。%';

-- 「あなたとの出会いが、すべての始まりでした」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたとの出会いが、すべての始まりでした。', '')
WHERE message_text LIKE '%あなたとの出会いが、すべての始まりでした。%';

-- 「必ず恩返しします」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '必ず恩返しします。', '')
WHERE message_text LIKE '%必ず恩返しします。%';

-- 「忘れることのできない恩です」を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '忘れることのできない恩です。', '')
WHERE message_text LIKE '%忘れることのできない恩です。%';

-- 「あなたがいなかったら、今も路上にいたかもしれません」を「おかげで立ち直れました」に簡略化
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなたが声をかけてくださらなかったら、今も路上にいたかもしれません。', 'おかげで立ち直れました。')
WHERE message_text LIKE '%あなたが声をかけてくださらなかったら、今も路上にいたかもしれません。%';

-- 「あなた方の支援が命を救ってくれました」を「ありがとうございました」に簡略化
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, 'あなた方の支援が命を救ってくれました。', 'ありがとうございました。')
WHERE message_text LIKE '%あなた方の支援が命を救ってくれました。%';

-- 連続した句点を整理（「。。」→「。」）
UPDATE encouragement_gratitude_scenarios
SET message_text = REPLACE(message_text, '。。', '。')
WHERE message_text LIKE '%。。%';

-- 文末の余分な空白を削除
UPDATE encouragement_gratitude_scenarios
SET message_text = TRIM(message_text);

-- 複数の空白を1つに統一
UPDATE encouragement_gratitude_scenarios
SET message_text = REGEXP_REPLACE(message_text, ' +', ' ', 'g')
WHERE message_text ~ ' {2,}';
