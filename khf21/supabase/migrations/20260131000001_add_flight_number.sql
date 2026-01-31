-- airline_routesテーブルにflight_number（便名）カラムを追加

ALTER TABLE airline_routes
ADD COLUMN flight_number VARCHAR(10);

-- flight_numberカラムにインデックスを追加（検索性能向上のため）
CREATE INDEX idx_airline_routes_flight_number ON airline_routes(flight_number);

-- コメントを追加
COMMENT ON COLUMN airline_routes.flight_number IS '便名（例：JAL006、ANA010、UAL881）';
