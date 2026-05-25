# SoftPay - 温馨的 Web3 创作者打赏工具

<div align="center">

![SoftPay Banner](https://img.shields.io/badge/SoftPay-USDC%20Widget-8CA381?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite)

**一个优雅的 Solana USDC 稳定币打赏模拟器**

[English](./README.md) | 简体中文

</div>

---

## 📖 项目简介

SoftPay 是一个为创作者设计的 Web3 打赏工具模拟器，采用极简的 Notion 风格设计。它完整模拟了 Phantom 钱包的交互流程，并使用确定性算法生成交易签名，所有数据通过浏览器 LocalStorage 持久化保存。

### ✨ 核心特性

- 🎨 **Notion 极简风格** - 清爽的黑白配色，手绘风格图标
- 👛 **Phantom 钱包模拟器** - 完整模拟真实钱包交互流程
- 🔐 **确定性哈希生成** - 基于输入生成可复现的交易签名
- 💾 **LocalStorage 持久化** - 浏览器本地保存所有交易记录
- 🎁 **生成式明信片** - 每笔交易生成独特的水彩风格收据
- 📬 **历史记录邮箱** - 可查看和重新打开所有历史交易

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/jencyfei/softpay.git
cd softpay

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器打开
# http://localhost:3000
```

---

## 🎯 三大核心功能

### Pillar A: Phantom 钱包模拟器

完整模拟 Phantom 钱包浏览器扩展的交互流程：

- ✅ 连接钱包弹窗
- ✅ 显示模拟余额（14.5 SOL + 50.0 USDC）
- ✅ Solana Devnet 徽章
- ✅ 交易批准流程（1.5 秒加载动画）
- ✅ 断开连接功能

**演示**:
1. 点击右上角 "Connect Wallet" 按钮
2. 在弹出的钱包模拟器中点击 "Approve"
3. 等待 1 秒连接动画
4. 钱包地址显示在页面右上角

---

### Pillar B: 确定性交易哈希

使用确定性算法生成 Solana 风格的交易签名：

- ✅ 基于用户输入（名字 + 消息 + 金额）
- ✅ 相同输入 → 相同哈希（100% 可复现）
- ✅ Base58 编码（Solana 标准）
- ✅ 格式：`Tx: 5Hzp...3k9w`

**算法原理**:
```typescript
// 1. 组合输入
const combined = `${name}|${message}|${amount}`;

// 2. 位移哈希（确保确定性）
let hashCode = 0;
for (let i = 0; i < combined.length; i++) {
  hashCode = (hashCode << (i % 7 ? 5 : 7)) - hashCode + combined.charCodeAt(i);
  hashCode |= 0;
}

// 3. Base58 编码
const base58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
// ... 转换逻辑
```

**验证方法**:
1. 输入：Name=`TestUser`, Message=`Hello`, Amount=`$3`
2. 记录生成的 TxHash
3. 刷新页面，输入完全相同的内容
4. 验证生成的 TxHash 完全一致

---

### Pillar C: LocalStorage 邮箱持久化

所有交易记录保存在浏览器 LocalStorage 中：

- ✅ 自动保存每笔交易
- ✅ 页面刷新后数据保留
- ✅ 动态渲染历史卡片网格
- ✅ 点击卡片查看历史明信片
- ✅ 空状态友好提示

**数据结构**:
```typescript
interface MailboxItem {
  id: string;           // 交易哈希
  name: string;         // 打赏者名字
  message: string;      // 留言内容
  amount: number;       // USDC 金额
  txHash: string;       // 交易签名
  themeIndex: number;   // 水彩主题索引
  healingWord: string;  // 生成的治愈消息
  timestamp: string;    // 时间戳
}
```

**使用方法**:
1. 完成一笔交易
2. 滚动到页面底部 "Jency's Cozy Mailbox" 区域
3. 查看新增的交易卡片
4. 点击任意卡片重新打开历史明信片

---

## 🎨 UI 设计

### 设计风格

- **配色方案**: 黑白极简 + 柔和水彩点缀
- **字体**: Sans-serif（标题）+ Mono（代码/数据）
- **图标**: Lucide React 手绘风格
- **动画**: Motion.js 流畅过渡
- **布局**: Notion 风格卡片网格

### 响应式设计

- 📱 **移动端**: 单列布局
- 💻 **平板**: 2-3 列网格
- 🖥️ **桌面**: 4 列网格 + 侧边栏

---

## 📁 项目结构

```
softpay/
├── assets/                    # 静态资源
│   ├── chiffon_cake.png      # $3 tier 图片
│   ├── creator_avatar.png    # CUSTOM tier 图片
│   ├── green_tea_cup.png     # $1 tier 图片
│   └── vinyl_player.png      # $5 tier 图片
├── src/
│   ├── App.tsx               # 主应用组件（所有逻辑）
│   ├── main.tsx              # React 入口
│   └── index.css             # 全局样式
├── index.html                # HTML 模板
├── package.json              # 依赖配置
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── IMPLEMENTATION_STATUS.md  # 实现状态报告
├── QUICK_TEST_GUIDE.md       # 快速测试指南
└── DEVELOPER_GUIDE.md        # 开发者文档
```

---

## 🧪 测试指南

### 快速测试（5 分钟）

```bash
# 1. 启动开发服务器
npm run dev

# 2. 打开浏览器
http://localhost:3000

# 3. 测试钱包连接
点击 "Connect Wallet" → 批准连接

# 4. 测试交易
填写表单 → 选择金额 → 点击 "Simulate cozy tea break"

# 5. 验证持久化
刷新页面 → 检查邮箱区域是否保留数据
```

### 完整测试清单

详见 [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md)

---

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev

# TypeScript 类型检查
npm run lint

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 清理构建文件
npm run clean
```

---

## 📦 技术栈

### 核心框架
- **React** 19.0.1 - UI 框架
- **TypeScript** 5.8.2 - 类型安全
- **Vite** 6.2.3 - 构建工具

### UI 库
- **Tailwind CSS** 4.1.14 - CSS 框架
- **Motion** 12.23.24 - 动画库
- **Lucide React** 0.546.0 - 图标库

### 状态管理
- React Hooks (useState, useEffect)
- Browser LocalStorage API

---

## 🎯 功能演示

### 1. 连接钱包
![Wallet Connection](https://via.placeholder.com/800x400?text=Wallet+Connection+Demo)

### 2. 选择打赏金额
![Tier Selection](https://via.placeholder.com/800x400?text=Tier+Selection+Demo)

### 3. 生成明信片
![Postcard Generation](https://via.placeholder.com/800x400?text=Postcard+Generation+Demo)

### 4. 历史记录邮箱
![Mailbox History](https://via.placeholder.com/800x400?text=Mailbox+History+Demo)

---

## 🔧 配置说明

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
```

### TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true
  }
}
```

---

## 🚀 部署指南

### Vercel 部署（推荐）

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
});

# 构建并推送
npm run build
git subtree push --prefix dist origin gh-pages
```

---

## 📚 文档

- [实现状态报告](./IMPLEMENTATION_STATUS.md) - 详细的功能实现说明
- [快速测试指南](./QUICK_TEST_GUIDE.md) - 5 分钟完整测试流程
- [开发者文档](./DEVELOPER_GUIDE.md) - 架构设计和代码详解

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 Apache-2.0 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 作者

**Jency** - [@lijency76](https://github.com/jencyfei)

---

## 🙏 致谢

- [React](https://react.dev) - UI 框架
- [Vite](https://vitejs.dev) - 构建工具
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [Lucide](https://lucide.dev) - 图标库
- [Phantom Wallet](https://phantom.app) - 钱包设计灵感

---

## 📞 联系方式

- GitHub: [@jencyfei](https://github.com/jencyfei)
- 项目链接: [https://github.com/jencyfei/softpay](https://github.com/jencyfei/softpay)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！**

Made with ❤️ by Jency

</div>
