/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Wallet, 
  Send, 
  Check, 
  Sparkles, 
  Compass, 
  Coffee, 
  MessageSquare, 
  Gift, 
  RefreshCw, 
  X, 
  ArrowUpRight,
  CheckCircle
} from "lucide-react";

// Types for Hand-drawn Doodle Postcard Theme
interface SeededPostcardTheme {
  themeName: string;
  bgTexture: string; // e.g. bg-woodgrain, bg-creamycotton, bg-matchadiary
  textColor: string; 
  badgeBg: string; 
  stampIcon: string; 
  borderColor: string; 
  illustrationPrompt: string; 
}

// 1. ShakyText Component: Fixed-position, perfectly static typography to satisfy OCD and alignment requirements
export function ShakyText({ text }: { text: string; active?: boolean }) {
  return (
    <span className="font-sans text-black tracking-wide font-extrabold">
      {text}
    </span>
  );
}

// 2. TierCardVisual Component: Displays prominent image tags referencing our high-fidelity PNG static assets
interface TierCardVisualProps {
  tierId: number;
}

export function TierCardVisual({ tierId }: TierCardVisualProps) {
  if (tierId === 3) {
    return (
      <div className="w-full flex-grow flex items-center justify-center p-2 relative select-none pointer-events-none">
        <div className="relative flex flex-col items-center">
          <img 
            src="/assets/chiffon_cake.png" 
            alt="Cake" 
            referrerPolicy="no-referrer"
            className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-4 relative z-10" 
          />
        </div>
      </div>
    );
  }
  if (tierId === 5) {
    return (
      <div className="w-full flex-grow flex items-center justify-center p-2 relative select-none pointer-events-none">
        <div className="relative flex flex-col items-center">
          <img 
            src="/assets/vinyl_player.png" 
            alt="Vinyl Player" 
            referrerPolicy="no-referrer"
            className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-4 relative z-10" 
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex-grow flex items-center justify-center p-2 relative select-none pointer-events-none">
      <div className="relative flex flex-col items-center">
        <img 
          src="/assets/green_tea_cup.png" 
          alt="Teacup" 
          referrerPolicy="no-referrer"
          className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-4 relative z-10" 
        />
      </div>
    </div>
  );
}

// 3. StopMotionLoading Component: Rotates tea gears/cups in discrete 90-degree snap intervals
export function StopMotionLoading() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 160);
    return () => clearInterval(interval);
  }, []);

  const rotateDeg = frame * 90;

  return (
    <span 
      className="inline-block relative w-5 h-5" 
      style={{ 
        transform: `rotate(${rotateDeg}deg)`, 
        transition: "none" 
      }}
    >
      <svg viewBox="0 0 100 100" className="w-5 h-5 text-white fill-none stroke-current" strokeWidth="12" strokeLinecap="round">
        <path d="M50 20 L50 10 M50 90 L50 80 M20 50 L10 50 M90 50 L80 50" />
        <circle cx="50" cy="50" r="18" fill="none" />
      </svg>
    </span>
  );
}

export default function App() {
  // Modes: "live" or "simulate"
  const [simulationMode, setSimulationMode] = useState<"live" | "simulate">("simulate");
  const [walletConnected, setWalletConnected] = useState<boolean>(false); // Disconnected initially so judges can play with simulator!
  const [walletAddress, setWalletAddress] = useState<string>("SoFtJn_6zRxF3X8yQwPqL");
  
  // Phantom Wallet Simulator States
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [walletModalMode, setWalletModalMode] = useState<"connect" | "approve" | "view">("connect");
  const [walletIsLoading, setWalletIsLoading] = useState<boolean>(false);

  // Selection presets: $1, $3, $5, or "custom"
  const [selectedTier, setSelectedTier] = useState<number | "custom">(3); 
  const [customValue, setCustomValue] = useState<number>(10);

  // Form states & feedback mechanisms
  const [fanName, setFanName] = useState<string>("");
  const [fanMessage, setFanMessage] = useState<string>("");
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [hoveredTierId, setHoveredTierId] = useState<number | null>(null);
  
  // Postcard Trigger States
  const [showPostcard, setShowPostcard] = useState<boolean>(false);
  
  // Active Postcard Object for rendering inside modal cleanly without affecting temporary form inputs
  interface ActivePostcardData {
    theme: SeededPostcardTheme;
    txHash: string;
    fanName: string;
    fanMessage: string;
    healingWord: string;
    amount: number;
    timestamp: string;
    cardIndex: number; // 盲盒卡片索引 (1-34)
    rarity: "SSR" | "SR" | "COMMON"; // 稀有度等级
  }
  const [activePostcard, setActivePostcard] = useState<ActivePostcardData | null>(null);

  // Feature C: Creator's Sketchbook Inbox (Minted Collection persistent state)
  interface MailboxItem {
    id: string;
    name: string;
    message: string;
    amount: number;
    txHash: string;
    themeIndex: number;
    healingWord: string;
    timestamp: string;
    cardIndex: number; // 盲盒卡片索引 (1-34)
    rarity: "SSR" | "SR" | "COMMON"; // 稀有度等级
  }
  const [mailbox, setMailbox] = useState<MailboxItem[]>([]);

  const healingMessages = [
    "A simple thank you for the warm energy. You've made this space cozier. 🍵",
    "You've made this space cozier. Let your creative mind breathe in peace. 🍰",
    "May warm steam and soft drafts find you in quiet moments. ☁️",
    "A sweet token of gratitude for your supportive presence. 🌻",
    "Take deep breaths. Your creative path is unfolding beautifully. 🕊️",
    "The simplest doodle can seed the quietest peace. Enjoy the tea. 🍮"
  ];

  // Stats / Ecosystem metrics
  const [stats, setStats] = useState({
    cozyPercentage: 99,
    lastSupporter: "DoodleCoder",
    lastAmount: "3.00",
    networkLatency: "9ms"
  });

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Preset predefined monoline sketched drawings
  const tiers = [
    { id: 1, title: "Green Tea Cup", amount: 1, emoji: "🍵" },
    { id: 3, title: "Chiffon Cake", amount: 3, emoji: "🍰" },
    { id: 5, title: "Cozy Tea Pot", amount: 5, emoji: "🪐" }
  ];

  // Predefined watercolor postcard layouts (Feature B)
  const themesList: SeededPostcardTheme[] = [
    {
      themeName: "Matcha green watercolor 🍵",
      bgTexture: "bg-matcha-watercolor",
      textColor: "text-black",
      badgeBg: "bg-[#EAF0E6]",
      stampIcon: "🍵",
      borderColor: "border-black",
      illustrationPrompt: "Matcha green cozy watercolor landscape"
    },
    {
      themeName: "Warm sun yellow watercolor ☀️",
      bgTexture: "bg-sunyellow-watercolor",
      textColor: "text-black",
      badgeBg: "bg-[#FAF6E5]",
      stampIcon: "☀️",
      borderColor: "border-black",
      illustrationPrompt: "Golden sun warm light yellow abstract paint"
    },
    {
      themeName: "Soft blue watercolor 🌊",
      bgTexture: "bg-softblue-watercolor",
      textColor: "text-black",
      badgeBg: "bg-[#E6F0FA]",
      stampIcon: "🌊",
      borderColor: "border-black",
      illustrationPrompt: "Soothing twilight blue quiet watercolor wash"
    }
  ];

  // Load Mailbox from Cache (Feature C)
  useEffect(() => {
    const saved = localStorage.getItem("cozy_mailbox");
    if (saved) {
      try {
        setMailbox(JSON.parse(saved));
      } catch (e) {
        setMailbox([]);
      }
    } else {
      // Prepopulate with a mock historical starter item so the Mailbox isn't dry right away
      const initialItem: MailboxItem = {
        id: "Tx: 5HzpjK8uN7mR9yPqWv2b3k9w",
        name: "InkSketcher✏️",
        message: "Your line work is incredibly inspiring. Keep drawing!",
        amount: 3.00,
        txHash: "Tx: 5HzpjK8uN7mR9yPqWv2b3k9w",
        themeIndex: 0,
        healingWord: "A simple thank you for the warm energy. You've made this space cozier. 🍵",
        timestamp: "5/25/2026, 4:11 AM",
        cardIndex: 7 // 预设卡片索引
      };
      setMailbox([initialItem]);
      localStorage.setItem("cozy_mailbox", JSON.stringify([initialItem]));
    }
  }, []);

  // Connect wallet button trigger
  const handleConnectWalletBtn = () => {
    if (walletConnected) {
      // Show view-disconnect popup
      setWalletModalMode("view");
    } else {
      // Show connect wallet prompt
      setWalletModalMode("connect");
    }
    setShowWalletModal(true);
  };

  const executeDisconnect = () => {
    setWalletConnected(false);
    setShowWalletModal(false);
    triggerNotification("👛 Simulating: Phantom Wallet disconnected.");
  };

  const executeConnect = () => {
    setWalletIsLoading(true);
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress("SoFtJn_6zRxF3X8yQwPqL");
      setWalletIsLoading(false);
      setShowWalletModal(false);
      triggerNotification("👛 Simulating: Phantom Connected successfully!");
    }, 1000); // 1-second connect delay
  };

  const getSelectedAmount = (): number => {
    if (selectedTier === "custom") {
      return customValue;
    }
    return selectedTier;
  };

  // Feature B: Deterministic TxHash Seed Logic (The Web3 Proof)
  const getDeterministicHash = (name: string, message: string, amount: number) => {
    const normalizedName = (name || "Warm Supporter").trim();
    const normalizedMsg = (message || "A simple thank you for the warm energy.").trim();
    const combined = `${normalizedName}|${normalizedMsg}|${amount.toFixed(2)}`;
    
    let hashCode = 0;
    for (let i = 0; i < combined.length; i++) {
      // Apply deterministic shift mapping
      hashCode = (hashCode << (i % 7 ? 5 : 7)) - hashCode + combined.charCodeAt(i);
      hashCode |= 0; // Convert to 32bit integer
    }
    const absHash = Math.abs(hashCode);
    
    // Convert absHash deterministically to mock Solana Base58 signature representation
    const base58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let sigResult = "Tx: 5Hzp";
    let movingSeed = absHash;
    for (let i = 0; i < 22; i++) {
      movingSeed = (movingSeed * 1664525 + 1013904223) % 4294967296;
      sigResult += base58Alphabet.charAt(movingSeed % base58Alphabet.length);
    }
    sigResult += "3k9w"; // Always enforce 3k9w suffix
    
    // Calculate blind box card index (1-34) based on hash
    const cardIndex = (absHash % 34) + 1;
    
    return { txSig: sigResult, seedVal: absHash, cardIndex };
  };

  // Module A: Deterministic Rarity System (TxHash-Driven)
  const calculateRarity = (txHash: string): "SSR" | "SR" | "COMMON" => {
    // Extract last 6 characters before the suffix "3k9w"
    const hashSegment = txHash.slice(-10, -4);
    
    // Calculate deterministic score from character codes
    let rarityScore = 0;
    for (let i = 0; i < hashSegment.length; i++) {
      rarityScore += hashSegment.charCodeAt(i) * (i + 1);
    }
    
    // Normalize to 0-100 range
    const normalizedScore = rarityScore % 100;
    
    // Rarity distribution:
    // SSR: 0-9 (10%)
    // SR: 10-39 (30%)
    // COMMON: 40-99 (60%)
    if (normalizedScore < 10) {
      return "SSR";
    } else if (normalizedScore < 40) {
      return "SR";
    } else {
      return "COMMON";
    }
  };

  // Get rarity badge styling
  const getRarityBadge = (rarity: "SSR" | "SR" | "COMMON") => {
    switch (rarity) {
      case "SSR":
        return {
          text: "✦ SSR - LIMITED",
          bgColor: "bg-gradient-to-r from-amber-100 to-yellow-50",
          textColor: "text-amber-900",
          borderColor: "border-amber-400",
          shadowColor: "shadow-amber-200"
        };
      case "SR":
        return {
          text: "✦ SR - RARE",
          bgColor: "bg-gradient-to-r from-purple-100 to-lavender-50",
          textColor: "text-purple-900",
          borderColor: "border-purple-400",
          shadowColor: "shadow-purple-200"
        };
      case "COMMON":
        return {
          text: "✦ COMMON",
          bgColor: "bg-gradient-to-r from-gray-100 to-slate-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-400",
          shadowColor: "shadow-gray-200"
        };
    }
  };


  // Main Tip Trigger Button Action handler
  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVal = getSelectedAmount();

    if (simulationMode === "live") {
      triggerNotification("💡 Switch to Simulate Mode to try the on-chain sketch signature generator.");
      return;
    }

    // Guard: Must connect wallet first
    if (!walletConnected) {
      setWalletModalMode("connect");
      setShowWalletModal(true);
      triggerNotification("👛 Please authorize connection to your Phantom wallet first!");
      return;
    }

    // Trigger transaction approval simulator modal
    setWalletModalMode("approve");
    setShowWalletModal(true);
  };

  // Successcallback called once Transaction is simulation approved
  const finalizeTipPostcardMint = () => {
    const finalAmount = getSelectedAmount();
    setIsBrewing(true);

    setTimeout(() => {
      // Retrieve 100% deterministic inputs
      const { txSig, seedVal, cardIndex } = getDeterministicHash(fanName, fanMessage, finalAmount);
      
      // Calculate deterministic rarity from TxHash
      const rarity = calculateRarity(txSig);
      
      // Seed theme watercolor directly from user inputs
      const themeIndex = seedVal % themesList.length;
      const themeObj = themesList[themeIndex];

      // Seed healing word directly from user inputs
      const healingMessageIndex = seedVal % healingMessages.length;
      const chosenMsg = healingMessages[healingMessageIndex];

      const formattedTimestamp = new Date().toLocaleString();

      const newPostcard: ActivePostcardData = {
        theme: themeObj,
        txHash: txSig,
        fanName: fanName.trim() || "Warm Supporter",
        fanMessage: fanMessage.trim(),
        healingWord: chosenMsg,
        amount: finalAmount,
        timestamp: formattedTimestamp,
        cardIndex: cardIndex, // 盲盒卡片索引
        rarity: rarity // 稀有度等级
      };

      // Set state to show on screen inside modal
      setActivePostcard(newPostcard);

      // Feature C: Persist inside local sandbox array
      const newMailboxItem: MailboxItem = {
        id: txSig,
        name: fanName.trim() || "Warm Supporter",
        message: fanMessage.trim(),
        amount: finalAmount,
        txHash: txSig,
        themeIndex: themeIndex,
        healingWord: chosenMsg,
        timestamp: formattedTimestamp,
        cardIndex: cardIndex, // 盲盒卡片索引
        rarity: rarity // 稀有度等级
      };

      const updatedMailbox = [newMailboxItem, ...mailbox];
      setMailbox(updatedMailbox);
      localStorage.setItem("cozy_mailbox", JSON.stringify(updatedMailbox));

      setStats(prev => ({
        ...prev,
        cozyPercentage: Math.min(100, Math.floor(Math.random() * 3) + 98),
        lastSupporter: fanName.trim() || "Doodle Supporter",
        lastAmount: finalAmount.toFixed(2)
      }));

      setIsBrewing(false);
      setShowPostcard(true); // Pop up postcard review modal
      triggerNotification("📓 On-chain receipt postcard minted in local collection!");
    }, 1200);
  };

  // Review a historic postcard stub (Feature C)
  const viewHistoricPostcard = (item: MailboxItem) => {
    const historicalPostcard: ActivePostcardData = {
      theme: themesList[item.themeIndex],
      txHash: item.txHash,
      fanName: item.name,
      fanMessage: item.message,
      healingWord: item.healingWord,
      amount: item.amount,
      timestamp: item.timestamp,
      cardIndex: item.cardIndex || 1, // 向后兼容旧数据
      rarity: item.rarity || calculateRarity(item.txHash) // 向后兼容旧数据，重新计算稀有度
    };
    setActivePostcard(historicalPostcard);
    setShowPostcard(true);
    triggerNotification("📁 Re-opened historical receipt postcard.");
  };

  // Module B: HTML2Canvas Postcard Download Feature
  const downloadPostcard = async () => {
    if (!activePostcard) return;
    
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Find the postcard container
      const postcardElement = document.querySelector('.postcard-container') as HTMLElement;
      if (!postcardElement) {
        triggerNotification("❌ Unable to capture postcard. Please try again.");
        return;
      }

      triggerNotification("📸 Capturing postcard...");

      // Workaround: html2canvas doesn't support oklab() colors from Tailwind v4
      // Temporarily convert problematic color functions to hex equivalents
      const elementsWithOklab: Array<{ element: HTMLElement; originalColor: string; property: string }> = [];
      
      postcardElement.querySelectorAll('*').forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);
        
        // Check common color properties for oklab
        ['color', 'backgroundColor', 'borderColor'].forEach((prop) => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value.includes('oklab')) {
            // Store original and convert to computed RGB
            const rgbValue = computedStyle.getPropertyValue(prop);
            elementsWithOklab.push({
              element: htmlEl,
              originalColor: htmlEl.style.getPropertyValue(prop),
              property: prop
            });
            // Force inline style with computed color
            htmlEl.style.setProperty(prop, rgbValue, 'important');
          }
        });
      });

      // Capture the postcard with high quality settings
      const canvas = await html2canvas(postcardElement, {
        scale: 2, // Higher resolution
        useCORS: true, // Handle cross-origin images
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: postcardElement.scrollWidth,
        windowHeight: postcardElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Additional cleanup in cloned document if needed
          const clonedContainer = clonedDoc.querySelector('.postcard-container');
          if (clonedContainer) {
            // Ensure all colors are resolved
            clonedContainer.querySelectorAll('*').forEach((el) => {
              const htmlEl = el as HTMLElement;
              const style = window.getComputedStyle(htmlEl);
              
              // Force computed colors
              if (style.color) htmlEl.style.color = style.color;
              if (style.backgroundColor) htmlEl.style.backgroundColor = style.backgroundColor;
              if (style.borderColor) htmlEl.style.borderColor = style.borderColor;
            });
          }
        }
      });

      // Restore original styles
      elementsWithOklab.forEach(({ element, originalColor, property }) => {
        if (originalColor) {
          element.style.setProperty(property, originalColor);
        } else {
          element.style.removeProperty(property);
        }
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          triggerNotification("❌ Failed to generate image. Please try again.");
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `softpay-postcard-${activePostcard.txHash.slice(4, 15)}.png`;
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        triggerNotification("✅ Postcard saved to your device!");
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Download error:', error);
      triggerNotification("❌ Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans relative flex flex-col justify-between py-12 px-6 md:px-12 selection:bg-black selection:text-white transition-colors duration-200">
      
      {/* Underlay neat minimalist dot grid */}
      <div className="absolute inset-0 [background-image:radial-gradient(#E5E5E5_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none -z-10 opacity-70" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-start">
        
        {/* Rigid Top Header */}
        <header className="flex flex-col gap-6 mb-8 pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="bg-[#F4F4F4] border-2 border-black p-3.5 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000000]">
                <Coffee className="w-7 h-7 text-black stroke-[2.5]" />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold uppercase tracking-wider text-black">SoftPay</h1>
                  <span className="text-[10px] bg-black text-white tracking-widest uppercase font-extrabold px-3 py-1 rounded border border-black">
                    USDC WIDGET
                  </span>
                </div>
                <p className="text-sm font-sans text-gray-600 mt-1 font-medium">Soothing peer-to-peer sketchpad energy exchange</p>
              </div>
            </div>

            {/* Connected wallet visual state button on the Right of Header */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleConnectWalletBtn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_#000000] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-black" />
                {walletConnected ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8CA381]" />
                    <span>{walletAddress.slice(0, 9)}...</span>
                  </span>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </button>
            </div>
          </div>

          {/* CONSOLIDATED ECOSYSTEM METRICS & LIVE WARMTH PANEL */}
          <div className="bg-[#F4F4F4] border-2 border-black rounded-xl py-3 px-5 shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between text-xs text-black w-full gap-4">
            <div className="flex items-center gap-4 sm:gap-5 divide-x divide-black/30">
              <div className="flex items-center gap-2 font-bold font-sans">
                <span className="w-2.5 h-2.5 rounded-full border border-black bg-[#8CA381] inline-block" />
                <span className="text-xs sm:text-sm font-sans font-extrabold text-[#000000]">Live Status</span>
              </div>
   
              {/* Cozy Vibe Stabilizer */}
              <div className="pl-4 sm:pl-5 flex items-center gap-1.5 font-sans font-bold text-[#000000] text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Cozy Vibe:</span>
                <span className="font-extrabold underline decoration-solid text-black">
                  {stats.cozyPercentage}% Stable
                </span>
              </div>
   
              {/* Supporter Metrics */}
              <div className="pl-4 sm:pl-5 hidden md:flex items-center gap-1.5 font-sans font-bold text-[#000000] text-sm">
                <span className="text-gray-600 font-medium">Last Supporter:</span>
                <span className="text-black font-extrabold">
                  {stats.lastSupporter} (${stats.lastAmount} USDC)
                </span>
              </div>
            </div>
   
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-3 font-mono text-xs font-semibold text-gray-600">
                <span>Latency: {stats.networkLatency}</span>
                <span>•</span>
                <span>Fee: 0.00005 SOL</span>
              </div>

              {/* SIMULATE / LIVE MODE toggle in the same horizontal bar */}
              <div className="flex gap-1 border-2 border-black rounded-lg p-0.5 bg-white shadow-[1px_1px_0px_0px_#000000]">
                <button 
                  onClick={() => {
                    setSimulationMode("simulate");
                    triggerNotification("⚙️ Simulated payment mode enabled.");
                  }}
                  className={`py-1 px-2.5 text-[10px] uppercase font-extrabold tracking-wider transition-all rounded-md cursor-pointer ${
                    simulationMode === "simulate" ? "bg-black text-white" : "bg-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  Simulate
                </button>
                <button 
                  onClick={() => {
                    setSimulationMode("live");
                    triggerNotification("🌐 Solana Live Mainnet selected.");
                  }}
                  className={`py-1 px-2.5 text-[10px] uppercase font-extrabold tracking-wider transition-all rounded-md cursor-pointer ${
                    simulationMode === "live" ? "bg-black text-white" : "bg-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  Live Mode
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Thick elegant clean separator line */}
        <div className="w-full border-b-2 border-black mb-8" />

        {/* Floating alerts style in minimal clean popups */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white text-black text-xs py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 max-w-sm"
            >
              <Sparkles className="w-4.5 h-4.5 text-black flex-shrink-0" />
              <span className="font-mono text-xs font-extrabold">{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORE BENTO CONTENT ROW - Double gaps and elegant layout as requested */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* LEFT SECTION (4 Columns wide on desktop) */}
          <div className="md:col-span-4 flex flex-col space-y-8">
            
            {/* Creator Profile Block */}
            <div 
              id="creator-profile" 
              className="notion-card p-6 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest font-mono bg-[#F4F4F4] border border-black text-black px-2.5 py-1 rounded">
                    ✏️ Creator Bio
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <span className="w-2 h-2 rounded-full bg-[#8CA381]" />
                    Live Sketching
                  </span>
                </div>

                {/* Profile Avatar & Details */}
                <div className="flex flex-col items-center text-center py-2">
                  <div className="relative mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" 
                      alt="Jency Profile sketch" 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-2 border-black p-0.5 bg-white relative z-10"
                    />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-black">Jency</h2>
                  <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mt-0.5">@lijency76</p>
                  
                  <p className="text-sm text-gray-700 mt-4 leading-relaxed max-w-[240px] font-medium italic">
                    "Creating minimalist digital sketchy structures, hand-drawn vector interfaces, and Web3 doodles."
                  </p>
                </div>
              </div>

              {/* Connections Grid */}
              <div className="space-y-3 mt-6 pt-4 border-t-2 border-dashed border-black/20">
                <span className="block text-[10px] uppercase tracking-wider font-mono font-bold text-gray-500">Connections</span>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://pinterest.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-black bg-[#F4F4F4] border border-black rounded-lg py-2 hover:bg-white transition-all font-bold"
                  >
                    <Compass className="w-4 h-4 text-black" />
                    <span>Pinterest</span>
                  </a>
                  <a 
                    href="https://linktr.ee" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-black bg-[#F4F4F4] border border-black rounded-lg py-2 hover:bg-white transition-all font-bold"
                  >
                    <Gift className="w-4 h-4 text-black" />
                    <span>Linktree</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Cozy Notepad Segment - Styled beautifully with rigid inset layers and absolute stability */}
            <div 
              id="cozy-notepad" 
              className="notion-card p-6 flex flex-col justify-between"
            >
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3 text-black">
                  <MessageSquare className="w-5 h-5 text-black" />
                  <h3 className="text-lg font-bold uppercase tracking-wider text-black">Cozy Notepad</h3>
                </div>
                <p className="text-xs font-sans text-gray-600 mb-4 font-bold">Write a friendly message seed for on-chain stamp generator.</p>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-black font-mono">
                      Your Signature / Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DoodleCoder"
                      value={fanName}
                      onChange={(e) => setFanName(e.target.value)}
                      maxLength={24}
                      className="w-full h-10 px-3 notion-input text-sm text-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] uppercase font-bold text-black font-mono">
                      Quick Character Seeds
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFanName("InkSketcher✏️")}
                        className="text-xs font-bold bg-[#F4F4F4] hover:bg-white border border-black text-black py-1.5 rounded transition-all cursor-pointer"
                      >
                        ✏️ Ink
                      </button>
                      <button
                        type="button"
                        onClick={() => setFanName("GridLine📓")}
                        className="text-xs font-bold bg-[#F4F4F4] hover:bg-white border border-black text-black py-1.5 rounded transition-all cursor-pointer"
                      >
                        📓 Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => setFanName("BlueDraft📐")}
                        className="text-xs font-bold bg-[#F4F4F4] hover:bg-white border border-black text-black py-1.5 rounded transition-all cursor-pointer"
                      >
                        📐 Draft
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-black font-mono">
                      Sentiment Memo
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Heartfelt cozy greeting sentiment..."
                      maxLength={140}
                      value={fanMessage}
                      onChange={(e) => setFanMessage(e.target.value)}
                      className="w-full p-2.5 notion-input text-xs resize-none leading-relaxed text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Curations */}
            <div id="creator-curations" className="notion-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-black">
                  <span className="text-sm">📂</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold font-mono text-gray-500">Collective Curations</span>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href="#notion-designs"
                    onClick={(e) => { e.preventDefault(); triggerNotification("📓 Loading Notion doodle portfolio..."); }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F4F4] border border-black hover:bg-white transition-all text-xs font-bold text-black"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">📓</span>
                      <span>Notion Style Portfolios</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </a>

                  <a 
                    href="#vector-strokes"
                    onClick={(e) => { e.preventDefault(); triggerNotification("📐 Loading sketch guidelines..."); }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4F4F4] border border-black hover:bg-white transition-all text-xs font-bold text-black"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">📐</span>
                      <span>Strokes & Guidelines</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </a>
                </div>
              </div>

              <div className="border border-black bg-[#F4F4F4] rounded-lg p-3.5 mt-5 text-[11px] font-mono leading-relaxed text-gray-700">
                📓 "Keep your lines precise, your code functional, and your layout stark."
              </div>
            </div>

          </div>

          {/* RIGHT SECTION (8 Columns wide on desktop) */}
          <div className="md:col-span-8 flex flex-col gap-8 h-fit">
            
            {/* select sketch tier Bento Block */}
            <div id="tea-tier-block" className="notion-card p-6 relative flex flex-col">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <h3 className="text-xl font-bold uppercase tracking-wider text-black">Select Sketch Tier</h3>
                  </div>
                  <span className="text-[10px] bg-white border border-black text-black px-2.5 py-1 rounded font-extrabold font-mono tracking-wider">
                    USDC SOLANA DEVNET
                  </span>
                </div>

                {/* 4 Cards Grid - 3 tiers & 1 custom */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {tiers.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    const isHovered = hoveredTierId === tier.id;
                    
                    // Assign beautiful subtle pastel coloring for selected state
                    let selectedBgAndText = "";
                    if (tier.id === 1) {
                      selectedBgAndText = "bg-[#DEEBF7] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]"; 
                    } else if (tier.id === 3) {
                      selectedBgAndText = "bg-[#FCE4D6] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]"; 
                    } else if (tier.id === 5) {
                      selectedBgAndText = "bg-[#E2EFDA] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]"; 
                    }

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier.id)}
                        onMouseEnter={() => setHoveredTierId(tier.id)}
                        onMouseLeave={() => setHoveredTierId(null)}
                        className={`text-left rounded-2xl p-4 border-2 border-black transition-all duration-150 group relative flex flex-col justify-between h-[220px] cursor-pointer ${
                          isSelected 
                          ? selectedBgAndText
                          : "bg-[#F4F4F4] text-black hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 bg-black text-white border border-black rounded-full p-0.5 z-30">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <TierCardVisual tierId={tier.id} />

                        <div>
                          <div className="text-xs font-bold flex items-center gap-1 mb-1 text-black">
                            <span>{tier.emoji}</span>
                            <span className="truncate tracking-wide uppercase font-extrabold text-[10px]">{tier.title}</span>
                          </div>
                          <div className="text-lg font-mono font-black text-black">${tier.amount} USDC</div>
                        </div>
                      </button>
                    );
                  })}

                  {/* CUSTOM TIER BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier("custom")}
                    className={`text-left rounded-2xl p-4 border-2 border-black transition-all duration-150 group relative flex flex-col justify-between h-[220px] cursor-pointer ${
                      selectedTier === "custom" 
                      ? "bg-[#FFF2CC] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]" 
                      : "bg-[#F4F4F4] text-black hover:bg-white"
                    }`}
                  >
                    {selectedTier === "custom" && (
                      <div className="absolute top-2.5 right-2.5 bg-black text-white border border-black rounded-full p-0.5 z-30">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-black font-mono">
                      Custom Amt
                    </div>

                    <div className="w-full flex-grow flex items-center justify-center p-2 relative select-none pointer-events-none">
                      <div className="relative flex flex-col items-center">
                        <img 
                          src="/assets/creator_avatar.png" 
                          alt="Custom Amount" 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-4 relative z-10" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 w-full">
                      {selectedTier === "custom" ? (
                        <div className="flex items-center justify-center gap-1 text-black font-mono text-base font-black relative pb-1" onClick={(e) => e.stopPropagation()}>
                          <span className="text-sm font-semibold">$</span>
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={customValue === 0 ? "" : customValue}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCustomValue(isNaN(val) ? 0 : val);
                            }}
                            className="bg-transparent text-center font-black focus:outline-none focus:ring-0 w-16 text-xl text-black border-none p-0 outline-none"
                          />
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-500 font-extrabold tracking-wide uppercase text-center">
                          Click to tune
                        </div>
                      )}
                      
                      <div className="text-[9px] uppercase tracking-widest font-extrabold block text-center text-black">
                        Custom USDC
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated actions - Rigid clean outline panel with primary solid pill button */}
            <div 
              id="cta-form" 
              className="notion-card p-6 flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-black">
                  <Heart className="w-5.5 h-5.5 text-black" fill="rgba(0,0,0,0.15)" />
                  <h4 className="text-lg font-bold uppercase tracking-wider text-black">Sign Stamp Notebook</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Support Jency by simulating an on-chain USDC doodle tip. This will dynamically generate a beautiful custom-styled receipt postcard seeded directly by the mock transaction signature hash blocks.
                </p>
              </div>

              <form onSubmit={handleSendTip} className="mt-6">
                <button
                  type="submit"
                  disabled={isBrewing}
                  className="w-full notion-btn-primary py-4.5 px-8 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isBrewing ? (
                    <span className="flex items-center gap-3 font-mono font-bold tracking-wide">
                      <StopMotionLoading />
                      <span>Brewing signature...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 font-mono font-bold tracking-wide">
                      <Coffee className="w-4.5 h-4.5" />
                      <span>
                        Simulate cozy tea break ({getSelectedAmount()} USDC)
                      </span>
                      <Send className="w-4 h-4 opacity-80" />
                    </span>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Feature C: Creator's Sketchbook Inbox (Minted Collection persistent bento card) */}
        <div id="sketchbook-mailbox" className="notion-card p-6 mb-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b-2 border-black border-dashed">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-black">Jency's Cozy Mailbox (Minted Collection)</h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">Your historical minted sandbox receipts cached securely in local browser storage.</p>
                </div>
              </div>
              <span className="text-[10px] bg-black text-white px-3 py-1.5 rounded-lg font-mono font-bold">
                {mailbox.length} MINTED STUBS
              </span>
            </div>

            {mailbox.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center bg-[#FDFDFD] border-2 border-dashed border-gray-300 rounded-2xl p-6">
                <span className="text-4xl mb-3 select-none filter grayscale opacity-65">✉️</span>
                <p className="text-sm font-bold text-gray-700">Your sketchbook mailbox is quiet and empty.</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">Submit your first cozy tea break using a simulated Phantom wallet above to mint your first envelope stub stub!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mailbox.map((item, index) => {
                  const matchingTheme = themesList[item.themeIndex] || themesList[0];
                  const itemRarity = item.rarity || calculateRarity(item.txHash);
                  const rarityBadge = getRarityBadge(itemRarity);
                  
                  return (
                    <button
                      key={`${item.id}-${index}`}
                      onClick={() => viewHistoricPostcard(item)}
                      className={`text-left p-4 rounded-xl border-2 transition-all group cursor-pointer flex flex-col justify-between h-[152px] shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] relative overflow-hidden ${matchingTheme.bgTexture} ${
                        itemRarity === 'SSR' ? 'border-amber-400' : 
                        itemRarity === 'SR' ? 'border-purple-400' : 
                        'border-black'
                      }`}
                    >
                      {/* Paper envelope flap lines mock overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10" />
                      
                      {/* Rarity indicator corner badge */}
                      <div className={`absolute top-2 right-2 text-[7px] font-mono font-black uppercase tracking-tight py-0.5 px-1.5 rounded border ${rarityBadge.bgColor} ${rarityBadge.textColor} ${rarityBadge.borderColor}`}>
                        {itemRarity}
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-full border border-black/40 bg-white/70 flex items-center justify-center text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000000]">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-[8px] bg-black text-white py-0.5 px-2 rounded font-mono font-bold uppercase tracking-tight">
                          #{item.txHash.substring(4, 9).toUpperCase()}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-[9px] font-mono uppercase tracking-wider text-gray-500 font-bold">From</p>
                        <h4 className="text-xs font-black truncate max-w-xs text-black">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-700 italic truncate mt-0.5 max-w-xs">
                          "{item.message || "Tea support..."}"
                        </p>
                      </div>

                      <div className="border-t border-black/10 pt-1.5 mt-2 flex justify-between items-center text-[10px] font-mono">
                        <span className="text-gray-500">{item.timestamp.split(",")[0]}</span>
                        <span className="font-extrabold text-black font-sans bg-white border border-black rounded-lg px-2.5 py-1 text-[9px] min-w-[80px] text-center inline-block shadow-[1px_1px_0px_0px_#000000]">
                          ${item.amount.toFixed(2)} USDC
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modern, Stark Editorial Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center border-t border-black/10 pt-8 pb-3 text-xs text-gray-500 font-mono tracking-wide">
        <p>© 2026 SoftPay Studio. Clean, solid, and editorial.</p>
        <p className="mt-1.5 text-black font-extrabold italic">
          "Warmth is the strongest currency."
        </p>
      </footer>

      {/* FEATURE A: Phantom Wallet Simulator Browser Extension Mock popup modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md bg-[#1A1A1E] border-4 border-black text-white rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] relative overflow-hidden flex flex-col justify-between"
              style={{ minHeight: "480px" }}
            >
              
              {/* Phantom Extension Top Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">👻</span>
                  <div>
                    <h3 className="text-sm font-sans font-black tracking-wide text-gray-200">Phantom Wallet</h3>
                    <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-800/30">
                      Solana Devnet ●
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowWalletModal(false)}
                  className="bg-[#2A2A30] hover:bg-[#34343B] text-gray-400 p-1.5 rounded-lg font-black transition-all cursor-pointer border border-[#404048]"
                  title="Close Extension"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* MODE 1: CONNECT TO APP FLOW */}
              {walletModalMode === "connect" && (
                <div className="flex-1 flex flex-col justify-between py-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-505 p-3 flex items-center justify-center text-4xl select-none border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
                      👻
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold">Connect to SoftPay?</h4>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                        This site is requesting access to view your wallet public address and balance. Transactions must still be manually authorized.
                      </p>
                    </div>

                    <div className="bg-[#222228] border border-[#3A3A42] rounded-xl p-3 text-left">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500 block">Select active account</span>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                          <span className="text-xs font-mono font-bold">Wallet 1 (SoFtJn_6z...)</span>
                        </div>
                        <span className="text-xs text-[#9945FF] font-mono font-black">14.5 SOL</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setShowWalletModal(false)}
                      className="py-3 px-4 bg-[#2A2A30] hover:bg-[#3A3A45] rounded-xl text-xs font-bold font-mono transition-all border border-[#40404C] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeConnect}
                      disabled={walletIsLoading}
                      className="py-3 px-4 bg-[#AB92F6] hover:bg-[#BC9FF7] text-black rounded-xl text-xs font-bold font-mono transition-all border border-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {walletIsLoading ? (
                        <>
                          <StopMotionLoading />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 2: APPROVE TRANSACTION FLOW */}
              {walletModalMode === "approve" && (
                <div className="flex-1 flex flex-col justify-between py-6">
                  <div className="text-center space-y-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#AB92F6] bg-purple-950/60 py-1 px-3.5 rounded-full border border-purple-900/40 inline-block">
                      Approve Tip request
                    </span>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-mono font-black text-white">
                        ${getSelectedAmount().toFixed(2)} USDC
                      </div>
                      <p className="text-xs text-gray-400">
                        Recipient: <span className="text-[#AB92F6] underline">@lijency76</span> (Jency)
                      </p>
                    </div>

                    <div className="bg-[#222228] border border-[#3A3A42] rounded-xl p-4 text-left divide-y divide-gray-800 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium">Interact with App</span>
                        <span className="font-bold text-white font-mono">SoftPay Applet</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs pt-2.5">
                        <span className="text-gray-400 font-medium">Estimated Gas Fee</span>
                        <span className="font-bold text-green-400 font-mono">0.00005 SOL</span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5">
                        <span className="text-gray-400 font-medium">Network Speed</span>
                        <span className="text-purple-300 font-bold font-mono">Instant (9ms)</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 italic">
                      "Approved tips directly mint a watercolor generative receipt postcard in Jency's Sandbox Mailbox below."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setShowWalletModal(false)}
                      className="py-3 px-4 bg-[#2A2A30] hover:bg-[#3A3A45] rounded-xl text-xs font-bold font-mono transition-all border border-[#40404C] cursor-pointer"
                    >
                      Decline
                    </button>
                    
                    <button
                      onClick={() => {
                        setWalletIsLoading(true);
                        setTimeout(() => {
                          setWalletIsLoading(false);
                          setShowWalletModal(false);
                          finalizeTipPostcardMint();
                        }, 1500); // 1.5-second loading spinner as requested in Feature A
                      }}
                      disabled={walletIsLoading}
                      className="py-3 px-4 bg-[#AB92F6] hover:bg-[#BC9FF7] text-black rounded-xl text-xs font-bold font-mono transition-all border border-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {walletIsLoading ? (
                        <>
                          <StopMotionLoading />
                          <span>Authorizing...</span>
                        </>
                      ) : (
                        <span>Approve Tip</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 3: VIEW ACCOUNTS / DISCONNECT */}
              {walletModalMode === "view" && (
                <div className="flex-1 flex flex-col justify-between py-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-2 flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#000000]">
                        👻
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-mono text-white">Wallet 1 (Active)</h4>
                        <span className="text-xs text-gray-400 font-mono block tracking-wider select-all">{walletAddress}</span>
                      </div>
                    </div>

                    <div className="bg-[#222228] border border-[#3A3A42] p-4 rounded-xl divide-y divide-gray-800 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold block">Balances</span>
                      
                      <div className="flex justify-between items-center py-2 text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-xs">🪙</span> Solana (SOL)
                        </span>
                        <span className="font-mono font-black text-[#14F195]">14.50 SOL</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-xs">💵</span> USD Coin (USDC)
                        </span>
                        <span className="font-mono font-black text-purple-400">50.00 USDC</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={executeDisconnect}
                      className="w-full py-3 bg-[#E06666]/20 hover:bg-[#E06666]/35 text-[#FA7E7E] rounded-xl text-xs font-bold font-mono transition-all border border-[#7A3636] cursor-pointer text-center"
                    >
                      Disconnect Wallet
                    </button>
                    <button
                      onClick={() => setShowWalletModal(false)}
                      className="w-full py-3 bg-[#2A2A30] hover:bg-[#3A3A45] rounded-xl text-xs font-bold font-mono transition-all border border-[#40404C] cursor-pointer text-center"
                    >
                      Close Wallet View
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLOSED-LOOP SIMULATION: "Generative Receipt Postcard" Overlaid Modal */}
      <AnimatePresence>
        {showPostcard && activePostcard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white border-4 border-black text-black rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_#000000] relative animate-step-bounce overflow-hidden bg-dot-pattern"
            >
              
              {/* Header inside modal */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle className="w-5 h-5 text-black" />
                  <span className="text-xs font-black tracking-widest uppercase font-mono">
                    Generative Receipt Postcard — Minted 🎁
                  </span>
                </div>
                <button 
                  onClick={() => setShowPostcard(false)}
                  className="bg-[#F4F4F4] border border-black text-black hover:bg-white p-1.5 rounded-lg font-black transition-all cursor-pointer"
                  title="Close Postcard"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Physical Postcard Content Body */}
              <div className={`postcard-container rounded-xl border-2 border-black ${activePostcard.theme.bgTexture} p-6 md:p-8 relative overflow-hidden shadow-[4px_4px_0px_0px_#000000]`}>
                
                {/* Vintage Postcard Left/Right divide line */}
                <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 h-full pointer-events-none hidden md:block text-black/50" fill="none" preserveAspectRatio="none" viewBox="0 0 24 600">
                  <path d="M12,0 L12,600" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                </svg>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  
                  {/* LEFT SIDE */}
                  <div className="flex flex-col justify-between text-left space-y-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-mono font-black tracking-wider py-1 px-3 bg-black text-white border border-black">
                          {activePostcard.theme.themeName}
                        </span>
                        {/* Rarity Badge */}
                        <span className={`text-[9px] uppercase font-mono font-black tracking-wider py-1 px-2.5 border-2 ${getRarityBadge(activePostcard.rarity).bgColor} ${getRarityBadge(activePostcard.rarity).textColor} ${getRarityBadge(activePostcard.rarity).borderColor} rounded shadow-sm`}>
                          {getRarityBadge(activePostcard.rarity).text}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-wide mt-3 text-black">
                        A Moment of Soft Peace 🍯
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-bold font-mono mt-1">
                        Dynamic on-chain stamp.
                      </p>
                    </div>

                    <div className="py-4 flex items-center justify-center">
                      <img 
                        id="blindBoxCard" 
                        src={`/assets/card/card_${activePostcard.cardIndex}.jpg`}
                        className="w-full h-auto block border-2 border-dashed border-black bg-white rounded-lg" 
                        alt="Collectible Blind Box Card Art"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-black font-mono">
                        SoftPay Engine v1.1
                      </div>
                      <div className="text-[9px] text-gray-500 font-mono font-bold">
                        Decentralized stamp verified.
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col justify-between text-left pl-0 md:pl-5 space-y-4 font-sans">
                    
                    {/* Stamp details */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase font-mono font-bold block">Developer</span>
                        <span className="text-xs font-black block">Jency (@lijency76)</span>
                        <span className="text-xs font-bold text-black underline">Cozy Tea Minter</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-14 border border-dashed border-black p-1 flex flex-col justify-center items-center text-center rounded bg-white font-mono">
                          <span className="text-sm md:text-xl">{activePostcard.theme.stampIcon}</span>
                          <span className="text-[7px] text-black font-extrabold mt-0.5">STAMP</span>
                        </div>
                      </div>
                    </div>

                    {/* Supporter message */}
                    <div className="bg-white p-3.5 rounded-xl border border-black min-h-[90px] flex flex-col justify-between relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono font-bold text-gray-500 block border-b pb-1 border-dashed border-black/15">
                          Word from {activePostcard.fanName}
                        </span>
                        
                        <p className="text-xs font-sans font-bold text-black italic leading-snug">
                          "{activePostcard.healingWord}"
                        </p>
                        {activePostcard.fanMessage && (
                          <p className="text-[11px] text-gray-600 font-mono mt-1.5 border-t border-dashed border-black/10 pt-1">
                            Memo: "{activePostcard.fanMessage}"
                          </p>
                        )}
                      </div>

                      <div className="text-right text-[10px] font-black font-mono mt-2 underline decoration-solid text-black">
                        +${activePostcard.amount.toFixed(2)} USDC Sent
                      </div>
                    </div>

                    {/* Metadata hash value */}
                    <div className="space-y-1 border-t border-black pt-2 text-[10px] text-black font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Hash Signature:</span>
                        <span className="font-bold tracking-tight truncate w-32 text-right select-all">
                          {activePostcard.txHash}
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-500">Cert Code:</span>
                        <span className="uppercase">
                          #SP-{activePostcard.txHash.substring(4, 11).toUpperCase()}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={downloadPostcard}
                  className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-black text-black hover:bg-gray-50 rounded-xl text-sm tracking-wide uppercase font-black cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000]"
                >
                  <span>💾</span>
                  <span>Save to Journal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostcard(false)}
                  className="notion-btn-primary py-4 hover:bg-gray-900 justify-center text-sm tracking-wide uppercase font-black cursor-pointer"
                >
                  Done & Return
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
