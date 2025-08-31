-- Sample data for FlowTravel Insurance Analytics Dashboard
-- This script populates the database with realistic test data

-- Insert sample users
INSERT INTO users (user_id, wallet_address, email, full_name, kyc_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '0x1234567890123456789012345678901234567890', 'john.doe@email.com', 'John Doe', 'verified'),
('550e8400-e29b-41d4-a716-446655440002', '0x2345678901234567890123456789012345678901', 'jane.smith@email.com', 'Jane Smith', 'verified'),
('550e8400-e29b-41d4-a716-446655440003', '0x3456789012345678901234567890123456789012', 'bob.wilson@email.com', 'Bob Wilson', 'pending'),
('550e8400-e29b-41d4-a716-446655440004', '0x4567890123456789012345678901234567890123', 'alice.brown@email.com', 'Alice Brown', 'verified'),
('550e8400-e29b-41d4-a716-446655440005', '0x5678901234567890123456789012345678901234', 'charlie.davis@email.com', 'Charlie Davis', 'verified');

-- Insert sample insurance pool
INSERT INTO insurance_pools (pool_id, pool_name, total_premiums_received, total_payouts_made, reserved_payouts, current_balance_onchain, yield_earned, pool_address) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'FlowTravel Main Pool', 847000.00, 223000.00, 224000.00, 623000.00, 18400.00, '0xPoolContractAddress123456789012345678901234');

-- Insert sample policies
INSERT INTO policies (policy_id, user_id, nft_token_id, policy_number, flight_info, premium_amount, coverage_amount, trigger_conditions, valid_from, valid_until, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 1001, 'POL-20250801-0001', 
 '{"airline": "IndiGo", "flight_number": "6E234", "departure_date": "2025-09-10", "departure_airport": "DEL", "arrival_airport": "BOM", "departure_time": "14:30", "arrival_time": "16:45"}',
 15.00, 150.00, '{"delay_threshold_minutes": 180, "cancellation_coverage": true, "weather_coverage": false}',
 '2025-09-01 00:00:00+00', '2025-09-11 23:59:59+00', 'active'),

('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 1002, 'POL-20250801-0002',
 '{"airline": "American Airlines", "flight_number": "AA1234", "departure_date": "2025-09-15", "departure_airport": "JFK", "arrival_airport": "LAX", "departure_time": "08:00", "arrival_time": "11:30"}',
 25.00, 250.00, '{"delay_threshold_minutes": 180, "cancellation_coverage": true, "weather_coverage": true}',
 '2025-09-01 00:00:00+00', '2025-09-16 23:59:59+00', 'active'),

('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 1003, 'POL-20250801-0003',
 '{"airline": "United Airlines", "flight_number": "UA567", "departure_date": "2025-08-25", "departure_airport": "ORD", "arrival_airport": "SFO", "departure_time": "15:45", "arrival_time": "18:20"}',
 20.00, 200.00, '{"delay_threshold_minutes": 180, "cancellation_coverage": true, "weather_coverage": false}',
 '2025-08-20 00:00:00+00', '2025-08-26 23:59:59+00', 'claimed'),

('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 1004, 'POL-20250801-0004',
 '{"airline": "Delta Air Lines", "flight_number": "DL890", "departure_date": "2025-08-20", "departure_airport": "ATL", "arrival_airport": "MIA", "departure_time": "12:15", "arrival_time": "14:30"}',
 12.00, 120.00, '{"delay_threshold_minutes": 180, "cancellation_coverage": true, "weather_coverage": false}',
 '2025-08-15 00:00:00+00', '2025-08-21 23:59:59+00', 'expired'),

('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 1005, 'POL-20250801-0005',
 '{"airline": "British Airways", "flight_number": "BA456", "departure_date": "2025-09-20", "departure_airport": "LHR", "arrival_airport": "CDG", "departure_time": "10:00", "arrival_time": "12:30"}',
 18.00, 180.00, '{"delay_threshold_minutes": 180, "cancellation_coverage": true, "weather_coverage": true}',
 '2025-09-01 00:00:00+00', '2025-09-21 23:59:59+00', 'active');

-- Insert sample claims
INSERT INTO claims (claim_id, policy_id, event_type, oracle_source, oracle_timestamp, claim_amount, status, processed_at, payout_tx_hash) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'delay', 'FlightAware', '2025-08-25 18:45:00+00', 200.00, 'paid', '2025-08-25 19:30:00+00', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),

('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 'cancellation', 'Aviationstack', '2025-09-20 08:30:00+00', 180.00, 'pending', NULL, NULL),

('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'delay', 'FlightAware', '2025-09-10 17:15:00+00', 150.00, 'approved', '2025-09-10 18:00:00+00', NULL);

-- Insert sample oracle events
INSERT INTO oracle_events (oracle_name, flight_number, event_timestamp, status_payload, signed_by, processed) VALUES
('FlightAware', '6E234', '2025-09-10 17:15:00+00', '{"status": "delayed", "delay_minutes": 195, "reason": "weather", "updated_departure": "17:45", "confidence": 0.98}', '0xOracle1Address123456789012345678901234567890', true),

('Aviationstack', 'AA1234', '2025-09-15 08:00:00+00', '{"status": "on_time", "delay_minutes": 0, "gate": "A12", "confidence": 0.95}', '0xOracle2Address123456789012345678901234567890', true),

('FlightAware', 'UA567', '2025-08-25 18:45:00+00', '{"status": "delayed", "delay_minutes": 240, "reason": "mechanical", "updated_departure": "19:45", "confidence": 0.99}', '0xOracle1Address123456789012345678901234567890', true),

('Weather Oracle', 'BA456', '2025-09-20 08:30:00+00', '{"status": "cancelled", "reason": "severe_weather", "rebooking_available": true, "confidence": 0.97}', '0xOracle3Address123456789012345678901234567890', true),

('Airport Status', 'DL890', '2025-08-20 12:15:00+00', '{"status": "departed", "delay_minutes": 15, "actual_departure": "12:30", "confidence": 0.99}', '0xOracle4Address123456789012345678901234567890', true);

-- Insert sample policy transactions
INSERT INTO policy_transactions (policy_id, transaction_type, tx_hash, block_number, gas_used, gas_price, transaction_fee, status, confirmed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'purchase', '0x1111111111111111111111111111111111111111111111111111111111111111', 12345678, 150000, 20000000000, 0.003, 'confirmed', '2025-09-01 10:30:00+00'),

('770e8400-e29b-41d4-a716-446655440002', 'purchase', '0x2222222222222222222222222222222222222222222222222222222222222222', 12345679, 155000, 22000000000, 0.00341, 'confirmed', '2025-09-01 11:15:00+00'),

('770e8400-e29b-41d4-a716-446655440003', 'payout', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 12456789, 95000, 18000000000, 0.00171, 'confirmed', '2025-08-25 19:30:00+00'),

('770e8400-e29b-41d4-a716-446655440004', 'purchase', '0x4444444444444444444444444444444444444444444444444444444444444444', 12234567, 148000, 19000000000, 0.002812, 'confirmed', '2025-08-15 14:20:00+00'),

('770e8400-e29b-41d4-a716-446655440005', 'purchase', '0x5555555555555555555555555555555555555555555555555555555555555555', 12345680, 152000, 21000000000, 0.003192, 'confirmed', '2025-09-01 16:45:00+00');
