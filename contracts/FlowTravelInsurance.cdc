// FlowTravel - Cadence Contract Skeleton
// Purpose: MVP skeleton for Travel Insurance on Flow
// NOTE: Replace placeholder addresses with actual deployed contract addresses

import NonFungibleToken from 0xNONFUNGIBLETOKEN
import MetadataViews from 0xMETADATAVIEWS
import FlowToken from 0xFLOWSAFE

// Top-level contract that contains Policy NFT, Insurance Pool, and Payout controller
pub contract FlowTravelInsurance {

    // ------------------------------
    // Events
    // ------------------------------
    pub event PolicyPurchased(policyId: UInt64, holder: Address, premium: UFix64, coverage: UFix64)
    pub event PolicyPaid(policyId: UInt64, holder: Address, amount: UFix64, txHash: String)
    pub event OracleAuthorized(oracleAddress: Address)
    pub event OracleRevoked(oracleAddress: Address)

    // ------------------------------
    // Admin / Config
    // ------------------------------
    // Replace with a proper admin & multisig/DAO in production
    pub var admin: Address

    // Authorized oracle public keys / accounts
    access(self) var authorizedOracles: {Address: Bool}

    // Fee in percentage (e.g., 0.02 for 2%)
    pub var platformFeePercent: UFix64

    // Next policy id counter
    access(self) var nextPolicyID: UInt64

    // ------------------------------
    // Policy NFT (implements minimal NonFungibleToken)
    // ------------------------------
    pub resource PolicyNFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let holder: Address
        // Basic metadata stored on-chain (keep heavy data off-chain & reference via IPFS)
        pub let metadataCID: String
        pub let premium: UFix64
        pub let coverage: UFix64
        pub let trigger: String
        pub let issuedAt: UFix64
        pub let validUntil: UFix64

        init(_id: UInt64, _holder: Address, _metadataCID: String, _premium: UFix64, _coverage: UFix64, _trigger: String, _issuedAt: UFix64, _validUntil: UFix64) {
            self.id = _id
            self.holder = _holder
            self.metadataCID = _metadataCID
            self.premium = _premium
            self.coverage = _coverage
            self.trigger = _trigger
            self.issuedAt = _issuedAt
            self.validUntil = _validUntil
        }
    }

    // NFT Collection resource to hold policy NFTs in user accounts
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Missing NFT")
            return <- token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let nft <- token as! @PolicyNFT
            let id = nft.id
            self.ownedNFTs[id] <-! nft
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // Public resource to create empty collections
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // ------------------------------
    // Insurance Pool - holds premiums and executes payouts
    // ------------------------------
    pub resource InsurancePool {
        // FlowToken vault containing funds
        pub var vault: @FlowToken.Vault

        // Mapping policyId -> reserved payout amount
        pub var reservedPayouts: {UInt64: UFix64}

        init(initialVault: @FlowToken.Vault) {
            self.vault <- initialVault
            self.reservedPayouts = {}
        }

        // Deposit premiums into pool
        pub fun depositPremium(amount: @FlowToken.Vault) {
            let incoming <- amount
            self.vault.deposit(from: <- incoming)
        }

        // Reserve payout for a policy (simple bookkeeping)
        pub fun reservePayout(policyId: UInt64, amount: UFix64) {
            self.reservedPayouts[policyId] = amount
        }

        // Execute payout to recipient (only callable via PayoutController)
        pub fun executePayout(recipient: Address, policyId: UInt64, amount: UFix64): Bool {
            // Ensure reserved amount sufficient
            let reserved = self.reservedPayouts[policyId] ?? 0.0
            if reserved < amount {
                return false
            }

            // Withdraw amount and send to recipient's account
            let payout <- self.vault.withdraw(amount: amount)

            let recipientAcct = getAccount(recipient)
            let receiver = recipientAcct.getCapability(/public/flowTokenReceiver)!.borrow<&{FlowToken.Receiver}>() ?? panic("Cannot borrow recipient receiver")
            receiver.deposit(from: <- payout)

            // reduce reserved
            self.reservedPayouts[policyId] = reserved - amount
            emit PolicyPaid(policyId: policyId, holder: recipient, amount: amount, txHash: "<on-chain-tx-placeholder>")
            return true
        }

        destroy() {
            destroy self.vault
        }
    }

    // ------------------------------
    // Payout Controller - verifies oracle and triggers pool payouts
    // ------------------------------
    pub resource PayoutController {
        pub fun verifyOracleAndPayout(oracleAddress: Address, policyId: UInt64, statusPayloadCID: String, signedPayload: String) {
            // ----- VERIFY ORACLE -----
            // For MVP, we verify that oracleAddress is in authorizedOracles mapping
            if FlowTravelInsurance.authorizedOracles[oracleAddress] != true {
                panic("Unauthorised oracle")
            }

            // In production: verify cryptographic signature over payload (e.g., using ed25519) and check timestamp & nonce
            // Here we assume oracle is trusted for MVP

            // ----- FETCH POLICY -----
            // In Cadence you cannot directly fetch off-chain DB. Policy lookup is expected to be recorded on-chain or via NFT metadataCID.
            // For MVP assume policy metadata contains coverage amount and holder address.

            // Placeholder logic: find policy in owner's collection
            // NOTE: implement proper on-chain registry/index for policies in production

            // Example: execute payout via pool (pool must be stored in contract storage)
            let poolRef = &FlowTravelInsurance.pool as &InsurancePool
            // Placeholder amount - in real code parse statusPayloadCID or verify off-chain and pass computed amount
            let payoutAmount: UFix64 = 100.0

            // Placeholder holder address - should be read from stored policy
            let holderAddress: Address = 0x01

            let success = poolRef.executePayout(recipient: holderAddress, policyId: policyId, amount: payoutAmount)
            if !success {
                panic("Payout failed")
            }
        }
    }

    // Contract-level stored resources
    pub var pool: @InsurancePool?
    pub var payoutController: @PayoutController?

    // ------------------------------
    // Constructor
    // ------------------------------
    init(adminAddress: Address, initialPoolVault: @FlowToken.Vault) {
        self.admin = adminAddress
        self.authorizedOracles = {}
        self.platformFeePercent = 0.02
        self.nextPolicyID = 1

        // Create pool & controller
        self.pool <- create InsurancePool(initialVault: <- initialPoolVault)
        self.payoutController <- create PayoutController()

        // Publish a public capability to create empty collections
        self.account.save(<- self.createEmptyCollection(), to: /storage/FlowTravelPolicyCollection)
        self.account.link<&FlowTravelInsurance.Collection{NonFungibleToken.CollectionPublic}>(/public/FlowTravelPolicyCollection, target: /storage/FlowTravelPolicyCollection)
    }

    // ------------------------------
    // ADMIN / ORACLE MANAGEMENT
    // ------------------------------
    pub fun authorizeOracle(oracleAddress: Address) {
        pre {
            self.admin == signer.address: "Only admin can authorize"
        }
        self.authorizedOracles[oracleAddress] = true
        emit OracleAuthorized(oracleAddress)
    }

    pub fun revokeOracle(oracleAddress: Address) {
        pre {
            self.admin == signer.address: "Only admin can revoke"
        }
        self.authorizedOracles[oracleAddress] = false
        emit OracleRevoked(oracleAddress)
    }

    // ------------------------------
    // BUY POLICY TRANSACTION (off-chain will call this via transaction)
    // ------------------------------
    // Note: actual implementation should be a separate transaction script that:
    // - transfers premium from buyer to contract
    // - mints PolicyNFT and deposits into buyer collection
    // - reserves payout in pool bookkeeping

}

/*
DEVELOPER NOTES / NEXT STEPS:
- Implement a proper on-chain registry that maps policyId -> holderAddress and metadataCID for trustless lookup.
- Implement transaction scripts for buyPolicy, depositPremium, and admin withdraws.
- Implement cryptographic signature verification for oracle payloads (Cadence supports crypto functions via `Crypto`).
- Replace placeholder addresses (0xNONFUNGIBLETOKEN, 0xMETADATAVIEWS, 0xFLOWSAFE) with real addresses when deploying.
- Add reentrancy protections and time-locks for admin operations.
- Add unit tests and a formal audit.
*/
