# 🛡️ FlowTravel Insurance dApp

*A comprehensive decentralized travel insurance platform built on Flow blockchain*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/apna-codings-projects/v0-travel-insurance-d-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/X4LnV9m82Vi)
[![Flow Blockchain](https://img.shields.io/badge/Flow-Blockchain-00EF8B?style=for-the-badge&logo=flow)](https://flow.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🌟 Overview

FlowTravel is a revolutionary decentralized travel insurance platform that leverages blockchain technology to provide transparent, automated, and trustless insurance coverage for travelers worldwide. Built on Flow blockchain with support for both EVM and Cadence smart contracts.

### ✨ Key Features

- **🎫 NFT-Based Policies**: Each insurance policy is minted as an NFT for true ownership
- **🤖 Automated Claims**: Smart contract-powered automatic claim processing
- **💰 Liquidity Pools**: Decentralized insurance pools with yield generation
- **🔮 Oracle Integration**: Real-time data feeds for flight delays, weather, and more
- **📊 Analytics Dashboard**: Comprehensive admin interface for pool management
- **🔐 Multi-Network Support**: Deploy on Flow EVM or Cadence networks
- **⚡ Real-time Updates**: Live data synchronization with Supabase

## 🏗️ Architecture

### Smart Contracts

#### Flow EVM (Solidity)
- **Contract Address (Testnet)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Contract Address (Mainnet)**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

#### Flow Cadence
- **Contract Address (Testnet)**: `0x045a1763c93006ca`
- **Contract Address (Mainnet)**: `0x1d7e57aa55817448`

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Blockchain**: Flow EVM & Cadence smart contracts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Wallet Integration**: Flow FCL (Flow Client Library)
- **Charts**: Recharts for analytics visualization
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Flow CLI (for Cadence deployment)
- Hardhat (for EVM deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/flowtravel-insurance.git
   cd flowtravel-insurance
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   bun install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure environment variables**
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Flow Network Configuration
   NEXT_PUBLIC_FLOW_NETWORK=testnet
   NEXT_PUBLIC_FLOW_CONTRACT_TYPE=evm
   NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

   # Contract Addresses
   NEXT_PUBLIC_FLOW_EVM_TESTNET_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
   NEXT_PUBLIC_FLOW_EVM_MAINNET_CONTRACT=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
   NEXT_PUBLIC_FLOW_CADENCE_TESTNET_CONTRACT=0x045a1763c93006ca
   NEXT_PUBLIC_FLOW_CADENCE_MAINNET_CONTRACT=0x1d7e57aa55817448
   \`\`\`

5. **Database Setup**
   \`\`\`bash
   # Run database migrations
   npm run db:setup
   \`\`\`

6. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to see the application.

## 📋 Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication
- **policies**: Insurance policy records
- **claims**: Claim submissions and processing
- **pools**: Insurance pool management
- **oracles**: Oracle data feeds and status
- **transactions**: Blockchain transaction records

## 🔧 Smart Contract Deployment

### Flow EVM Deployment

1. **Configure Hardhat**
   \`\`\`bash
   # Install Hardhat dependencies
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   \`\`\`

2. **Deploy to testnet**
   \`\`\`bash
   npm run deploy:evm:testnet
   \`\`\`

3. **Deploy to mainnet**
   \`\`\`bash
   npm run deploy:evm:mainnet
   \`\`\`

### Flow Cadence Deployment

1. **Install Flow CLI**
   \`\`\`bash
   # macOS
   brew install flow-cli
   
   # Linux
   sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"
   \`\`\`

2. **Deploy to emulator**
   \`\`\`bash
   npm run deploy:cadence:emulator
   \`\`\`

3. **Deploy to testnet**
   \`\`\`bash
   npm run deploy:cadence:testnet
   \`\`\`

## 📊 Features Overview

### 🏠 Dashboard
- Real-time policy metrics
- Pool performance analytics
- Claims processing status
- Oracle health monitoring

### 🎫 Policy Management
- Create new travel insurance policies
- View active and expired policies
- NFT-based policy ownership
- Automated premium calculations

### 💰 Pool Management
- Liquidity pool creation and management
- Yield farming opportunities
- Risk assessment and pricing
- Pool performance tracking

### 🔍 Claims Processing
- Automated claim validation
- Oracle-based verification
- Smart contract payouts
- Claims history and analytics

### 🔮 Oracle Integration
- Flight delay monitoring
- Weather condition tracking
- Real-time data feeds
- Oracle reliability scoring

## 🛠️ Development

### Project Structure

\`\`\`
flowtravel-insurance/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── components/            # React components
├── contracts/             # Smart contracts
│   ├── FlowTravelInsurance.cdc    # Cadence contract
│   └── FlowTravelInsuranceEVM.sol # Solidity contract
├── lib/                   # Utility libraries
│   ├── contracts/         # Contract configurations
│   ├── supabase/         # Database client
│   └── flow/             # Flow blockchain utilities
├── scripts/              # Deployment and utility scripts
└── public/               # Static assets
\`\`\`

### Available Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:setup        # Setup database schema
npm run db:seed         # Seed sample data
npm run db:reset        # Reset database

# Smart Contracts
npm run deploy:evm:testnet     # Deploy EVM contract to testnet
npm run deploy:evm:mainnet     # Deploy EVM contract to mainnet
npm run deploy:cadence:emulator # Deploy Cadence to emulator
npm run deploy:cadence:testnet  # Deploy Cadence to testnet

# Utilities
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
\`\`\`

## 🌐 API Endpoints

### Policies
- `GET /api/policies` - List all policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/[id]` - Get policy details
- `PUT /api/policies/[id]` - Update policy

### Claims
- `GET /api/claims` - List all claims
- `POST /api/claims` - Submit new claim
- `PUT /api/claims/[id]` - Update claim status

### Pools
- `GET /api/pools` - List insurance pools
- `POST /api/pools` - Create new pool
- `GET /api/pools/[id]/performance` - Pool analytics

## 🔐 Security

- **Smart Contract Auditing**: Contracts follow best practices and security patterns
- **Access Control**: Role-based permissions for admin functions
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Oracle Security**: Multiple oracle sources for data verification
- **Wallet Security**: Non-custodial wallet integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Flow Documentation](https://docs.onflow.org)
- **Discord**: [Flow Discord Community](https://discord.gg/flow)
- **Issues**: [GitHub Issues](https://github.com/your-username/flowtravel-insurance/issues)

## 🚀 Deployment

Your project is live at:

**[https://vercel.com/apna-codings-projects/v0-travel-insurance-d-app](https://vercel.com/apna-codings-projects/v0-travel-insurance-d-app)**

Continue building your app on:

**[https://v0.app/chat/projects/X4LnV9m82Vi](https://v0.app/chat/projects/X4LnV9m82Vi)**

---

Built with ❤️ using [v0.app](https://v0.app) and Flow blockchain technology.
