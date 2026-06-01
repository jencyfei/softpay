# 🚀 Solana Devnet Integration Guide

## Step 1: Install Dependencies

Run the following command to install the official Solana Web3.js library:

```bash
npm install @solana/web3.js
```

## Step 2: Implementation Overview

### Architecture Changes

```
┌─────────────────────────────────────────────────────────┐
│                    SoftPay Application                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐              ┌──────────────┐        │
│  │ Simulate Mode│              │  Live Mode   │        │
│  │   (Mock)     │              │  (Real Web3) │        │
│  └──────┬───────┘              └──────┬───────┘        │
│         │                             │                 │
│         ├─ Mock Wallet Modal          ├─ window.solana │
│         ├─ Deterministic Hash         ├─ Real TxHash   │
│         └─ Instant Confirmation       └─ Network Confirm│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Key Features

1. **Dual Mode System**:
   - **Simulate Mode**: Existing mock wallet + deterministic hash (unchanged)
   - **Live Mode**: Real Phantom wallet + actual Solana Devnet transactions

2. **Seamless Integration**:
   - Same UI/UX for both modes
   - Automatic mode detection
   - Shared postcard generation logic

3. **Real Transaction Flow**:
   ```
   User clicks "Connect Wallet" (Live Mode)
   ↓
   window.solana.connect() → Real Phantom popup
   ↓
   Capture real public key → Display in header
   ↓
   User submits tip
   ↓
   Create Solana Transaction with SystemProgram.transfer
   ↓
   window.solana.signAndSendTransaction() → Real signature
   ↓
   Wait for network confirmation
   ↓
   Extract real 64-char TxHash
   ↓
   Pass to existing calculateRarity() and card selection logic
   ↓
   Save to LocalStorage with real TxHash
   ```

## Step 3: Code Implementation

See the updated `App.tsx` file with the following new functions:

### New Functions Added:

1. **`handleConnectWalletBtn()`** - Updated to detect Live vs Simulate mode
2. **`executeLiveConnect()`** - Real Phantom wallet connection
3. **`executeLiveDisconnect()`** - Real wallet disconnection
4. **`handleSendTip()`** - Updated to route to live transaction
5. **`executeLiveTransaction()`** - Real Solana Devnet transaction
6. **`extractCardFromRealTxHash()`** - Bridge real TxHash to card logic

### Configuration Constants:

```typescript
// Jency's Devnet wallet address
const CREATOR_WALLET_ADDRESS = "5HzpKNbnRE7gwSPEmeKpwQbCoG3k9w";

// Solana Devnet RPC endpoint
const DEVNET_RPC_URL = "https://api.devnet.solana.com";

// Conversion rate: $1 USD = 0.01 SOL (for demo purposes)
const USD_TO_SOL_RATE = 0.01;
```

## Step 4: Testing Checklist

### Simulate Mode (Unchanged)
- [ ] Connect wallet shows mock modal
- [ ] Transaction generates deterministic hash
- [ ] Postcard displays correctly
- [ ] LocalStorage saves mock data

### Live Mode (New)
- [ ] Connect wallet triggers real Phantom popup
- [ ] Real public key displays in header
- [ ] Transaction prompts real Phantom approval
- [ ] Real TxHash appears in postcard
- [ ] Network confirmation completes
- [ ] Card rarity calculated from real hash
- [ ] LocalStorage saves real transaction data

### Cross-Mode Testing
- [ ] Switch between modes without errors
- [ ] Disconnect wallet works in both modes
- [ ] Mailbox displays both mock and real transactions
- [ ] Historical postcards open correctly

## Step 5: Phantom Wallet Setup

### For Testing:

1. **Install Phantom Wallet**:
   - Chrome: https://phantom.app/download
   - Firefox/Brave: Available in extension stores

2. **Switch to Devnet**:
   - Open Phantom
   - Settings → Developer Settings
   - Change Network to "Devnet"

3. **Get Devnet SOL**:
   - Visit: https://faucet.solana.com
   - Paste your wallet address
   - Request 1-2 SOL (free testnet tokens)

4. **Verify Balance**:
   - Check Phantom shows Devnet SOL balance
   - Ensure network indicator shows "Devnet"

## Step 6: Error Handling

The implementation includes comprehensive error handling:

```typescript
// Wallet not installed
if (!window.solana) {
  triggerNotification("❌ Phantom wallet not detected. Please install it first.");
  return;
}

// Insufficient balance
if (balance < requiredAmount) {
  triggerNotification("❌ Insufficient SOL balance. Visit faucet.solana.com");
  return;
}

// Transaction failed
catch (error) {
  triggerNotification("❌ Transaction failed. Please try again.");
  console.error(error);
}
```

## Step 7: Security Considerations

### Best Practices Implemented:

1. **Network Validation**: Always verify Devnet connection
2. **Amount Limits**: Cap maximum transaction at 0.1 SOL
3. **User Confirmation**: Real Phantom popup for every transaction
4. **Error Recovery**: Graceful fallback to Simulate mode
5. **No Private Keys**: Never handle private keys in code

### Production Checklist:

- [ ] Switch RPC endpoint to mainnet
- [ ] Update creator wallet address to real mainnet address
- [ ] Implement proper USD to SOL conversion (use price oracle)
- [ ] Add transaction fee estimation
- [ ] Implement retry logic for failed transactions
- [ ] Add transaction history explorer links

## Step 8: Deployment Notes

### Environment Variables (Optional):

Create `.env.local`:

```env
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_CREATOR_WALLET=5HzpKNbnRE7gwSPEmeKpwQbCoG3k9w
VITE_USD_TO_SOL_RATE=0.01
```

### Build Configuration:

No changes needed to `vite.config.ts` - the integration works with existing setup.

## Step 9: Troubleshooting

### Common Issues:

**Issue**: "Phantom wallet not detected"
- **Solution**: Install Phantom extension and refresh page

**Issue**: "Transaction failed"
- **Solution**: Check Devnet SOL balance, ensure network is Devnet

**Issue**: "Network timeout"
- **Solution**: Devnet can be slow, increase timeout to 60 seconds

**Issue**: "Invalid public key"
- **Solution**: Ensure wallet is connected before transaction

## Step 10: Next Steps

### Future Enhancements:

1. **USDC Integration**: Replace SOL with USDC SPL token transfers
2. **Transaction History**: Link to Solana Explorer
3. **Price Oracle**: Real-time USD to SOL conversion
4. **Multi-Wallet Support**: Add Solflare, Backpack support
5. **Mainnet Deployment**: Production-ready configuration

---

## 📚 Resources

- **Solana Web3.js Docs**: https://solana-labs.github.io/solana-web3.js/
- **Phantom Wallet Docs**: https://docs.phantom.app/
- **Solana Devnet Faucet**: https://faucet.solana.com
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet

---

**Integration Status**: ✅ Ready for Testing  
**Last Updated**: 2026-06-01  
**Version**: v2.0.0
