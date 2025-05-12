# Energy Trading Platform

A Web3 application for trading energy using smart contracts on the Ethereum blockchain.

## Overview

This dApp allows users to:
- List energy for sale in Watt-hours (Wh)
- Set prices in milliETH per kWh
- Buy energy from other users
- Update prices of their own energy listings
- View their energy usage and ETH balance
- Track their transactions

## Prerequisites

- MetaMask browser extension installed
- Sepolia test network configured in MetaMask
- Some Sepolia ETH in your MetaMask wallet

## Setup Instructions

1. **Deploy the Smart Contract**:
   - Open Remix IDE (https://remix.ethereum.org/)
   - Create a new file named `EnergyTrading.sol` and paste the smart contract code
   - Compile the contract (Solidity compiler >=0.8.0)
   - Deploy the contract to the Sepolia testnet using the "Injected Provider - MetaMask" environment
   - Copy the deployed contract address

2. **Update Contract Address**:
   - Open `src/contractABI.js`
   - Replace the empty string in `const contractAddress = "";` with your deployed contract address

3. **Run the Application**:
   - Host the application on a local or web server
   - For local testing, you can use any simple HTTP server, for example:
     - With Python: `python -m http.server`
     - With Node.js: `npx http-server`

## Usage

1. **Connect Wallet**:
   - Click "Connect Wallet" to connect your MetaMask account
   - Ensure you're connected to the Sepolia test network

2. **Claim Test ETH** (Optional):
   - If you're testing in a local environment or with a newly deployed contract, click "Claim Test ETH" to get 1 ETH for testing

3. **List Energy for Sale**:
   - Enter the amount of energy in Wh
   - Enter the price per kWh in milliETH (1 ETH = 1000 milliETH)
   - Click "List Energy"

4. **Buy Energy**:
   - Browse available energy listings
   - Click "Buy Energy" on the listing you want to purchase

5. **Update Price**:
   - For your own listings, enter a new price and click "Update Price"

6. **View Transactions**:
   - Your transactions will appear in the "Your Transactions" section

## Smart Contract

The smart contract `EnergyTrading.sol` handles:
- Energy listings management
- User balances and energy usage tracking
- Purchase transactions
- Price updates

## Notes

- This is a test application and should not be used in production
- The contract includes a function `claimTestETH()` that is for testing purposes only
- All transactions use Sepolia ETH, which has no real-world value

## Troubleshooting

1. **MetaMask Not Connecting**:
   - Ensure MetaMask is installed and unlocked
   - Make sure you have the Sepolia network configured

2. **Transaction Errors**:
   - Check the console for detailed error messages
   - Ensure you have enough Sepolia ETH to cover gas fees
   - You cannot buy your own energy listings 