# SoftPay ☕

> A Web3 creator tipping platform with gamified NFT collection mechanics, built with React + TypeScript + Solana

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://feifeiexplains.online)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-purple)](https://solana.com/)

## 🎯 Overview

SoftPay is an innovative Web3 tipping platform that transforms creator support into an engaging collectible experience. Supporters receive unique watercolor postcards with blind box cards, creating a gamified ecosystem that drives viral growth through social sharing.

### ✨ Key Features

- 🎴 **Blind Box Card System** - 34 unique collectible cards with deterministic rarity
- 🎨 **Scratch-to-Reveal** - Interactive Canvas-based scratch card mechanism
- 🏆 **Achievement System** - Unlock premium themes by collecting 5 unique stamps
- 💳 **Dual Wallet Modes** - Simulate Mode for demos + Live Mode for real Solana transactions
- 📮 **Watercolor Postcards** - Beautiful receipt postcards with deterministic physics
- 📢 **Viral Sharing** - One-click Twitter sharing with auto-generated copy
- 💾 **High-Res Export** - Download postcards as PNG images
- 🎭 **Three Rarity Tiers** - SSR (10%), SR (30%), COMMON (60%)

## 🚀 Live Demo

**Production**: [https://feifeiexplains.online](https://feifeiexplains.online)

Try it now:
1. Connect wallet (or use Simulate Mode)
2. Choose a tip amount ($1, $3, $5, or custom)
3. Scratch the card to reveal your blind box
4. Collect unique stamps and unlock achievements!

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion 12
- **Blockchain**: Solana Web3.js
- **Wallet**: Phantom Integration
- **Icons**: Lucide React
- **Image Export**: html2canvas

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/jencyfei/softpay.git
cd softpay

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

### Simulate Mode (Default)

Perfect for testing and demonstrations without real blockchain transactions:

1. Click "Connect Wallet" → Mock connection
2. Fill in your name and message
3. Select tip amount
4. Submit and approve (simulated)
5. Scratch card to reveal your collectible

### Live Mode

Real Solana Devnet transactions:

1. Switch to "Live Mode" toggle
2. Connect Phantom wallet (Devnet)
3. Ensure you have Devnet SOL ([Get from faucet](https://faucet.solana.com))
4. Submit tip → Real blockchain transaction
5. Receive authentic 64-character signature

## 🎨 Design Philosophy

**Japandi Minimalism** - A fusion of Japanese simplicity and Scandinavian functionality:

- Black & white color palette
- Hard shadow effects (3px-8px)
- 2px solid borders
- Organic paper-like animations
- Stop-motion inspired interactions

## 🎯 Core Mechanics

### Deterministic System

Everything is deterministic based on transaction hash:

```typescript
// Card Assignment
cardIndex = (hashCode % 34) + 1

// Rarity Calculation
rarityScore = hashSegment.charCodeAt() * (i + 1)
if (score < 10) → SSR (10%)
else if (score < 40) → SR (30%)
else → COMMON (60%)

// Postcard Rotation
rotation = (hashSeed % 600) / 100 - 3  // -3° to +3°
```

### Achievement System

- Collect **5 unique stamps** (out of 34) to unlock achievement
- Unlock **premium pastel theme** with gradient backgrounds
- Progress tracked in real-time with visual progress bar
- Data persisted in LocalStorage

## 📊 Project Structure

```
softpay/
├── src/
│   ├── App.tsx                 # Main application logic
│   ├── components/
│   │   └── ScratchCard.tsx     # Canvas scratch card component
│   ├── utils/
│   │   └── solana.ts           # Solana blockchain utilities
│   ├── types/
│   │   └── phantom.d.ts        # Phantom wallet type definitions
│   └── index.css               # Global styles & animations
├── assets/
│   └── card/                   # 34 unique card images
├── public/
│   └── assets/                 # Public assets mirror
└── dist/                       # Production build output
```

## 🔐 Environment Setup

No environment variables required! All configuration is client-side.

Optional: Update creator wallet address in `src/utils/solana.ts`:

```typescript
export const CREATOR_WALLET_ADDRESS = 'YOUR_SOLANA_ADDRESS';
```

## 🧪 Testing

```bash
# Type checking
npm run lint

# Build validation
npm run build

# Preview production build
npm run preview
```

## 📈 Performance

- **Build Time**: ~8 seconds
- **Bundle Size**: 657 kB (gzipped: 201 kB)
- **First Paint**: < 2s
- **Interactive**: < 3s
- **Lighthouse Score**: 90+

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - High-performance blockchain
- [Phantom](https://phantom.app/) - Solana wallet
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icon set

## 📞 Contact

- **Creator**: @lijency76
- **GitHub**: [jencyfei](https://github.com/jencyfei)
- **Live Demo**: [feifeiexplains.online](https://feifeiexplains.online)

## 🗺️ Roadmap

- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] NFT minting on mainnet
- [ ] Real-time price oracle integration
- [ ] Mobile app (React Native)
- [ ] Creator dashboard with analytics
- [ ] Social media integration (beyond Twitter)
- [ ] Collaborative card collections
- [ ] Secondary marketplace

## 📸 Screenshots

### Main Interface
![Main Interface](https://via.placeholder.com/800x450?text=SoftPay+Main+Interface)

### Scratch Card Reveal
![Scratch Card](https://via.placeholder.com/800x450?text=Scratch+Card+Reveal)

### Watercolor Postcard
![Postcard](https://via.placeholder.com/800x450?text=Watercolor+Postcard)

### Achievement Unlock
![Achievement](https://via.placeholder.com/800x450?text=Achievement+Unlocked)

---

<div align="center">

**Built with ❤️ by the SoftPay Team**

[Live Demo](https://feifeiexplains.online) • [Report Bug](https://github.com/jencyfei/softpay/issues) • [Request Feature](https://github.com/jencyfei/softpay/issues)

</div>
