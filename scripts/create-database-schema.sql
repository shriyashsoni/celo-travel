-- FlowTravel Insurance Database Schema
-- This script creates the complete database structure for the travel insurance platform

-- Users table for storing user profiles and KYC information
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    full_name VARCHAR(255),
    kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'verified', 'rejected')),
    kyc_documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies table for storing insurance policy information
CREATE TABLE policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    nft_token_id BIGINT UNIQUE,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    flight_info JSONB NOT NULL, -- Contains airline, flight_number, departure_date, airports, etc.
    premium_amount DECIMAL(10,2) NOT NULL,
    coverage_amount DECIMAL(10,2) NOT NULL,
    trigger_conditions JSONB NOT NULL, -- delay thresholds, cancellation rules, etc.
    purchase_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed', 'cancelled')),
    metadata_cid VARCHAR(255), -- IPFS hash for additional policy documents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table for tracking insurance claims and payouts
CREATE TABLE claims (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(policy_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'delay', 'cancellation', 'baggage_loss', etc.
    oracle_source VARCHAR(100) NOT NULL,
    oracle_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    evidence_urls TEXT[], -- Array of URLs to supporting evidence
    claim_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    processed_at TIMESTAMP WITH TIME ZONE,
    payout_tx_hash VARCHAR(66), -- Blockchain transaction hash for payout
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance pool tracking for liquidity and performance metrics
CREATE TABLE insurance_pools (
    pool_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pool_name VARCHAR(100) NOT NULL,
    total_premiums_received DECIMAL(15,2) DEFAULT 0,
    total_payouts_made DECIMAL(15,2) DEFAULT 0,
    reserved_payouts DECIMAL(15,2) DEFAULT 0,
    current_balance_onchain DECIMAL(15,2) DEFAULT 0,
    yield_earned DECIMAL(15,2) DEFAULT 0,
    reinsurance_coverage DECIMAL(15,2) DEFAULT 0,
    pool_address VARCHAR(42), -- Smart contract address
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oracle events for audit trail and monitoring
CREATE TABLE oracle_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oracle_name VARCHAR(100) NOT NULL,
    flight_number VARCHAR(20),
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status_payload JSONB NOT NULL, -- Raw oracle data
    signed_by VARCHAR(42), -- Oracle wallet address or identifier
    signature_hash VARCHAR(132), -- Cryptographic signature
    contract_tx_hash VARCHAR(66), -- Transaction hash if submitted to blockchain
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy transactions for tracking all policy-related blockchain transactions
CREATE TABLE policy_transactions (
    tx_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(policy_id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'claim', 'payout', 'cancellation'
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    gas_used BIGINT,
    gas_price DECIMAL(20,0),
    transaction_fee DECIMAL(15,8),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_policies_user_id ON policies(user_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_valid_until ON policies(valid_until);
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_oracle_events_flight_number ON oracle_events(flight_number);
CREATE INDEX idx_oracle_events_timestamp ON oracle_events(event_timestamp);
CREATE INDEX idx_policy_transactions_policy_id ON policy_transactions(policy_id);
CREATE INDEX idx_policy_transactions_tx_hash ON policy_transactions(tx_hash);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_pools_updated_at BEFORE UPDATE ON insurance_pools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
