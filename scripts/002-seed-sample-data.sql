-- Sample data for FlowTravel Insurance dApp

-- Insert sample insurance pool
INSERT INTO public.insurance_pools (
  pool_name,
  pool_address,
  total_premiums_received,
  total_payouts_made,
  reserved_payouts,
  current_balance_onchain,
  yield_earned
) VALUES (
  'FlowTravel Main Pool',
  '0x1234567890abcdef1234567890abcdef12345678',
  15750.50,
  3200.00,
  1500.00,
  12550.50,
  450.25
);

-- Insert sample oracle events
INSERT INTO public.oracle_events (
  oracle_name,
  flight_number,
  event_timestamp,
  status_payload,
  signature_hash,
  signed_by,
  processed
) VALUES 
(
  'FlightAware Oracle',
  '6E234',
  NOW() - INTERVAL '2 hours',
  '{"status": "delayed", "delay_minutes": 180, "reason": "weather", "departure_time": "2025-01-15T14:30:00Z", "arrival_time": "2025-01-15T17:45:00Z"}',
  'abc123def456789',
  '0xoracle1234567890abcdef1234567890abcdef',
  true
),
(
  'FlightAware Oracle',
  'AI101',
  NOW() - INTERVAL '1 day',
  '{"status": "cancelled", "reason": "technical", "departure_time": "2025-01-14T09:00:00Z"}',
  'def456ghi789012',
  '0xoracle1234567890abcdef1234567890abcdef',
  true
),
(
  'FlightAware Oracle',
  'UK955',
  NOW() - INTERVAL '30 minutes',
  '{"status": "on_time", "departure_time": "2025-01-15T16:00:00Z", "arrival_time": "2025-01-15T20:30:00Z"}',
  'ghi789jkl012345',
  '0xoracle1234567890abcdef1234567890abcdef',
  false
);

-- Note: User-specific data (users, policies, claims, transactions) will be created
-- when users sign up and interact with the application due to RLS policies
