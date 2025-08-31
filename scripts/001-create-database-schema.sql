-- FlowTravel Insurance Database Schema
-- Based on the comprehensive implementation guide

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) UNIQUE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'verified', 'rejected')),
  kyc_documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Pools table
CREATE TABLE IF NOT EXISTS public.insurance_pools (
  pool_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_name VARCHAR(255) NOT NULL,
  pool_address VARCHAR(42),
  total_premiums_received DECIMAL(18,8) DEFAULT 0,
  total_payouts_made DECIMAL(18,8) DEFAULT 0,
  reserved_payouts DECIMAL(18,8) DEFAULT 0,
  current_balance_onchain DECIMAL(18,8) DEFAULT 0,
  yield_earned DECIMAL(18,8) DEFAULT 0,
  reinsurance_coverage DECIMAL(18,8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies table (NFT metadata + off-chain record)
CREATE TABLE IF NOT EXISTS public.policies (
  policy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
  policy_number VARCHAR(50) UNIQUE NOT NULL,
  nft_token_id BIGINT,
  premium_amount DECIMAL(18,8) NOT NULL,
  coverage_amount DECIMAL(18,8) NOT NULL,
  flight_info JSONB NOT NULL, -- airline, flight_number, departure_date, airports
  trigger_conditions JSONB NOT NULL, -- delay thresholds, cancellation rules
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed', 'paid', 'rejected')),
  purchase_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata_cid VARCHAR(255), -- IPFS hash for NFT metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy Transactions table (blockchain transaction tracking)
CREATE TABLE IF NOT EXISTS public.policy_transactions (
  tx_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID REFERENCES public.policies(policy_id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('mint', 'payout', 'premium')),
  tx_hash VARCHAR(66) NOT NULL,
  block_number BIGINT,
  gas_used BIGINT,
  gas_price DECIMAL(18,8),
  transaction_fee DECIMAL(18,8),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS public.claims (
  claim_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID REFERENCES public.policies(policy_id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('delay', 'cancellation', 'baggage_loss')),
  claim_amount DECIMAL(18,8) NOT NULL,
  oracle_source VARCHAR(100),
  oracle_timestamp TIMESTAMP WITH TIME ZONE,
  evidence_urls TEXT[],
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  rejection_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  payout_tx_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oracle Events table (audit trail)
CREATE TABLE IF NOT EXISTS public.oracle_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oracle_name VARCHAR(100) NOT NULL,
  flight_number VARCHAR(20) NOT NULL,
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status_payload JSONB NOT NULL, -- flight status, delay info, etc.
  signature_hash VARCHAR(128),
  signed_by VARCHAR(42), -- oracle wallet address
  contract_tx_hash VARCHAR(66),
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for policies table
CREATE POLICY "Users can view their own policies" ON public.policies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own policies" ON public.policies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for claims table
CREATE POLICY "Users can view their own claims" ON public.claims
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.policies WHERE policy_id = claims.policy_id
    )
  );

CREATE POLICY "Users can insert their own claims" ON public.claims
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.policies WHERE policy_id = claims.policy_id
    )
  );

-- RLS Policies for policy_transactions table
CREATE POLICY "Users can view their own transactions" ON public.policy_transactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.policies WHERE policy_id = policy_transactions.policy_id
    )
  );

-- Public tables (no RLS needed)
-- insurance_pools and oracle_events are publicly readable for transparency

-- Indexes for performance
CREATE INDEX idx_policies_user_id ON public.policies(user_id);
CREATE INDEX idx_policies_status ON public.policies(status);
CREATE INDEX idx_policies_flight_number ON public.policies USING GIN ((flight_info->>'flight_number'));
CREATE INDEX idx_claims_policy_id ON public.claims(policy_id);
CREATE INDEX idx_claims_status ON public.claims(status);
CREATE INDEX idx_oracle_events_flight ON public.oracle_events(flight_number);
CREATE INDEX idx_oracle_events_timestamp ON public.oracle_events(event_timestamp);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pools_updated_at BEFORE UPDATE ON public.insurance_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
