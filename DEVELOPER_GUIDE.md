# SoftPay - Developer Guide

## 🎯 项目概述

SoftPay 是一个 Web3 创作者打赏工具的模拟器，使用 React + TypeScript 构建。

**核心特性**:
- Phantom 钱包模拟器
- 确定性交易哈希生成
- LocalStorage 持久化邮箱

---

## 🏗️ 架构设计

### 状态管理架构

```typescript
// 钱包状态
const [walletConnected, setWalletConnected] = useState<boolean>(false);
const [walletAddress, setWalletAddress] = useState<string>("");
const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
const [walletModalMode, setWalletModalMode] = useState<"connect" | "approve" | "view">("connect");

// 表单状态
const [fanName, setFanName] = useState<string>("");
const [fanMessage, setFanMessage] = useState<string>("");
const [selectedTier, setSelectedTier] = useState<number | "custom">(3);
const [customValue, setCustomValue] = useState<number>(10);

// 明信片状态
const [showPostcard, setShowPostcard] = useState<boolean>(false);
const [activePostcard, setActivePostcard] = useState<ActivePostcardData | null>(null);

// 邮箱状态
const [mailbox, setMailbox] = useState<MailboxItem[]>([]);
```

---

## 🔧 核心函数详解

### 1. 确定性哈希生成

```typescript
const getDeterministicHash = (name: string, message: string, amount: number) => {
  // 标准化输入
  const normalizedName = (name || "Warm Supporter").trim();
  const normalizedMsg = (message || "A simple thank you for the warm energy.").trim();
  const combined = `${normalizedName}|${normalizedMsg}|${amount.toFixed(2)}`;
  
  // 生成哈希码
  let hashCode = 0;
  for (let i = 0; i < combined.length; i++) {
    // 使用位移操作确保确定性
    hashCode = (hashCode << (i % 7 ? 5 : 7)) - hashCode + combined.charCodeAt(i);
    hashCode |= 0; // 转换为 32 位整数
  }
  const absHash = Math.abs(hashCode);
  
  // 转换为 Base58 格式（Solana 兼容）
  const base58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let sigResult = "Tx: 5Hzp"; // 可识别的前缀
  let movingSeed = absHash;
  
  for (let i = 0; i < 22; i++) {
    // 线性同余生成器（确保确定性）
    movingSeed = (movingSeed * 1664525 + 1013904223) % 4294967296;
    sigResult += base58Alphabet.charAt(movingSeed % base58Alphabet.length);
  }
  
  sigResult += "3k9w"; // 固定后缀
  return { txSig: sigResult, seedVal: absHash };
};
```

**关键点**:
- ✅ 完全确定性（相同输入 → 相同输出）
- ✅ 使用位移操作而非 Math.random()
- ✅ Base58 编码（Solana 标准）
- ✅ 可识别的前缀/后缀

---

### 2. 钱包连接流程

```typescript
const handleConnectWalletBtn = () => {
  if (walletConnected) {
    // 已连接 → 显示账户信息
    setWalletModalMode("view");
  } else {
    // 未连接 → 显示连接提示
    setWalletModalMode("connect");
  }
  setShowWalletModal(true);
};

const executeConnect = () => {
  setWalletIsLoading(true);
  setTimeout(() => {
    setWalletConnected(true);
    setWalletAddress("SoFtJn_6zRxF3X8yQwPqL");
    setWalletIsLoading(false);
    setShowWalletModal(false);
    triggerNotification("👛 Simulating: Phantom Connected successfully!");
  }, 1000); // 1 秒延迟模拟真实连接
};
```

---

### 3. 交易流程

```typescript
const handleSendTip = (e: React.FormEvent) => {
  e.preventDefault();
  const finalVal = getSelectedAmount();

  // 检查模式
  if (simulationMode === "live") {
    triggerNotification("💡 Switch to Simulate Mode to try the on-chain sketch signature generator.");
    return;
  }

  // 检查钱包连接
  if (!walletConnected) {
    setWalletModalMode("connect");
    setShowWalletModal(true);
    triggerNotification("👛 Please authorize connection to your Phantom wallet first!");
    return;
  }

  // 触发交易批准
  setWalletModalMode("approve");
  setShowWalletModal(true);
};
```

---

### 4. 明信片生成与保存

```typescript
const finalizeTipPostcardMint = () => {
  const finalAmount = getSelectedAmount();
  setIsBrewing(true);

  setTimeout(() => {
    // 生成确定性哈希
    const { txSig, seedVal } = getDeterministicHash(fanName, fanMessage, finalAmount);
    
    // 选择主题（基于哈希）
    const themeIndex = seedVal % themesList.length;
    const themeObj = themesList[themeIndex];

    // 选择治愈消息（基于哈希）
    const healingMessageIndex = seedVal % healingMessages.length;
    const chosenMsg = healingMessages[healingMessageIndex];

    const formattedTimestamp = new Date().toLocaleString();

    // 创建明信片数据
    const newPostcard: ActivePostcardData = {
      theme: themeObj,
      txHash: txSig,
      fanName: fanName.trim() || "Warm Supporter",
      fanMessage: fanMessage.trim(),
      healingWord: chosenMsg,
      amount: finalAmount,
      timestamp: formattedTimestamp
    };

    setActivePostcard(newPostcard);

    // 保存到 LocalStorage
    const newMailboxItem: MailboxItem = {
      id: txSig,
      name: fanName.trim() || "Warm Supporter",
      message: fanMessage.trim(),
      amount: finalAmount,
      txHash: txSig,
      themeIndex: themeIndex,
      healingWord: chosenMsg,
      timestamp: formattedTimestamp
    };

    const updatedMailbox = [newMailboxItem, ...mailbox];
    setMailbox(updatedMailbox);
    localStorage.setItem("cozy_mailbox", JSON.stringify(updatedMailbox));

    setIsBrewing(false);
    setShowPostcard(true);
    triggerNotification("📓 On-chain receipt postcard minted in local collection!");
  }, 1200);
};
```

---

### 5. LocalStorage 管理

```typescript
// 加载邮箱数据
useEffect(() => {
  const saved = localStorage.getItem("cozy_mailbox");
  if (saved) {
    try {
      setMailbox(JSON.parse(saved));
    } catch (e) {
      setMailbox([]);
    }
  } else {
    // 预填充演示数据
    const initialItem: MailboxItem = {
      id: "Tx: 5HzpjK8uN7mR9yPqWv2b3k9w",
      name: "InkSketcher✏️",
      message: "Your line work is incredibly inspiring. Keep drawing!",
      amount: 3.00,
      txHash: "Tx: 5HzpjK8uN7mR9yPqWv2b3k9w",
      themeIndex: 0,
      healingWord: "A simple thank you for the warm energy. You've made this space cozier. 🍵",
      timestamp: "5/25/2026, 4:11 AM"
    };
    setMailbox([initialItem]);
    localStorage.setItem("cozy_mailbox", JSON.stringify([initialItem]));
  }
}, []);

// 查看历史明信片
const viewHistoricPostcard = (item: MailboxItem) => {
  const historicalPostcard: ActivePostcardData = {
    theme: themesList[item.themeIndex],
    txHash: item.txHash,
    fanName: item.name,
    fanMessage: item.message,
    healingWord: item.healingWord,
    amount: item.amount,
    timestamp: item.timestamp
  };
  setActivePostcard(historicalPostcard);
  setShowPostcard(true);
  triggerNotification("📁 Re-opened historical receipt postcard.");
};
```

---

## 🎨 UI 组件结构

### 钱包模拟器模态框

```tsx
{showWalletModal && (
  <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* 背景遮罩 */}
    <div className="absolute inset-0 bg-black/60" onClick={() => setShowWalletModal(false)} />
    
    {/* 模态框内容 */}
    <div className="relative bg-[#1A1A22] rounded-2xl border-2 border-[#404048]">
      {/* 三种模式 */}
      {walletModalMode === "connect" && <ConnectMode />}
      {walletModalMode === "approve" && <ApproveMode />}
      {walletModalMode === "view" && <ViewMode />}
    </div>
  </motion.div>
)}
```

### 邮箱网格

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {mailbox.map((item) => {
    const matchingTheme = themesList[item.themeIndex] || themesList[0];
    return (
      <button
        key={item.id}
        onClick={() => viewHistoricPostcard(item)}
        className={`p-4 rounded-xl border-2 border-black ${matchingTheme.bgTexture}`}
      >
        <div className="text-xs font-bold">{item.name}</div>
        <div className="text-lg font-black">${item.amount.toFixed(2)}</div>
        <div className="text-[9px] text-gray-600">{item.timestamp}</div>
      </button>
    );
  })}
</div>
```

---

## 🔄 数据流图

```
用户操作
   ↓
1. 点击 "Connect Wallet"
   ↓
2. setShowWalletModal(true)
   ↓
3. setWalletModalMode("connect")
   ↓
4. 用户点击 "Approve"
   ↓
5. executeConnect()
   ↓
6. setWalletConnected(true)
   ↓
7. 显示钱包地址
   ↓
8. 用户填写表单
   ↓
9. 点击 "Simulate cozy tea break"
   ↓
10. handleSendTip()
   ↓
11. setWalletModalMode("approve")
   ↓
12. 用户批准交易
   ↓
13. finalizeTipPostcardMint()
   ↓
14. getDeterministicHash() → 生成 TxHash
   ↓
15. 创建 MailboxItem
   ↓
16. localStorage.setItem()
   ↓
17. setMailbox([newItem, ...mailbox])
   ↓
18. UI 自动更新
```

---

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run lint

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 清理构建文件
npm run clean
```

---

## 📦 依赖说明

### 核心依赖
- **react**: UI 框架
- **react-dom**: DOM 渲染
- **typescript**: 类型安全
- **vite**: 构建工具

### UI 依赖
- **tailwindcss**: CSS 框架
- **motion**: 动画库
- **lucide-react**: 图标库

### 开发依赖
- **@vitejs/plugin-react**: React 插件
- **@types/node**: Node 类型定义

---

## 🎯 代码优化建议

### 1. 提取自定义 Hooks

```typescript
// useWallet.ts
export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  
  const connect = async () => {
    // 连接逻辑
  };
  
  const disconnect = () => {
    // 断开逻辑
  };
  
  return { connected, address, connect, disconnect };
};
```

### 2. 提取 LocalStorage 逻辑

```typescript
// useMailbox.ts
export const useMailbox = () => {
  const [mailbox, setMailbox] = useState<MailboxItem[]>([]);
  
  useEffect(() => {
    loadMailbox();
  }, []);
  
  const loadMailbox = () => {
    const saved = localStorage.getItem("cozy_mailbox");
    if (saved) {
      setMailbox(JSON.parse(saved));
    }
  };
  
  const saveItem = (item: MailboxItem) => {
    const updated = [item, ...mailbox];
    setMailbox(updated);
    localStorage.setItem("cozy_mailbox", JSON.stringify(updated));
  };
  
  return { mailbox, saveItem };
};
```

### 3. 组件拆分

```typescript
// components/WalletModal.tsx
export const WalletModal = ({ mode, onClose, onApprove }) => {
  // 钱包模态框逻辑
};

// components/PostcardModal.tsx
export const PostcardModal = ({ postcard, onClose }) => {
  // 明信片模态框逻辑
};

// components/MailboxGrid.tsx
export const MailboxGrid = ({ items, onItemClick }) => {
  // 邮箱网格逻辑
};
```

---

## 🧪 测试策略

### 单元测试示例

```typescript
// getDeterministicHash.test.ts
describe('getDeterministicHash', () => {
  it('should generate consistent hash for same inputs', () => {
    const hash1 = getDeterministicHash('Alice', 'Hello', 3);
    const hash2 = getDeterministicHash('Alice', 'Hello', 3);
    expect(hash1.txSig).toBe(hash2.txSig);
  });
  
  it('should generate different hash for different inputs', () => {
    const hash1 = getDeterministicHash('Alice', 'Hello', 3);
    const hash2 = getDeterministicHash('Bob', 'Hello', 3);
    expect(hash1.txSig).not.toBe(hash2.txSig);
  });
  
  it('should start with "Tx: 5Hzp"', () => {
    const hash = getDeterministicHash('Test', 'Message', 5);
    expect(hash.txSig).toMatch(/^Tx: 5Hzp/);
  });
});
```

---

## 🚀 部署指南

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产部署
vercel --prod
```

### Netlify 部署

```bash
# 构建
npm run build

# 上传 dist 目录到 Netlify
```

### GitHub Pages 部署

```bash
# 修改 vite.config.ts
export default defineConfig({
  base: '/softpay/',
  // ...
});

# 构建
npm run build

# 推送到 gh-pages 分支
```

---

## 📚 参考资源

- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Solana 文档](https://docs.solana.com)
- [Phantom 钱包文档](https://docs.phantom.app)

---

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

---

## 📄 许可证

Apache-2.0 License

---

**Happy Coding!** 🎉
