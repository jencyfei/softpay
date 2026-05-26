# 盲盒卡片功能 - 实现文档

## 🎴 功能概述

每笔交易都会根据确定性哈希算法生成一个独特的盲盒卡片（1-34 号），显示在明信片模态框的左侧。

---

## ✅ 已实现的功能

### 1. 确定性卡片索引生成

**算法逻辑**:
```typescript
// 在 getDeterministicHash 函数中
const cardIndex = (absHash % 34) + 1; // 生成 1-34 之间的索引
```

**特点**:
- ✅ 完全确定性（相同输入 → 相同卡片）
- ✅ 基于交易哈希值
- ✅ 范围：1-34（对应 34 张卡片）

---

### 2. 数据结构更新

**ActivePostcardData 接口**:
```typescript
interface ActivePostcardData {
  theme: SeededPostcardTheme;
  txHash: string;
  fanName: string;
  fanMessage: string;
  healingWord: string;
  amount: number;
  timestamp: string;
  cardIndex: number; // 新增：盲盒卡片索引
}
```

**MailboxItem 接口**:
```typescript
interface MailboxItem {
  id: string;
  name: string;
  message: string;
  amount: number;
  txHash: string;
  themeIndex: number;
  healingWord: string;
  timestamp: string;
  cardIndex: number; // 新增：盲盒卡片索引
}
```

---

### 3. 明信片模态框 UI 更新

**原始代码（已删除）**:
```tsx
<div className="py-4 flex flex-col items-center justify-center border-2 border-dashed border-black bg-white rounded-lg p-3">
  <span className="text-4xl select-none mb-2">☕</span>
  <span className="text-[10px] font-mono text-black uppercase tracking-wider font-extrabold">
    Stamp No. #{activePostcard.txHash.substring(4, 9).toUpperCase()}
  </span>
</div>
```

**新代码（盲盒卡片）**:
```tsx
<div className="py-4 flex flex-col items-center justify-center border-2 border-dashed border-black bg-white rounded-lg overflow-hidden">
  <img 
    id="blindBoxCard" 
    src={`/assets/card/card_${activePostcard.cardIndex}.jpg`}
    className="w-full h-full object-contain mx-auto" 
    alt="Collectible Blind Box Card Art"
  />
</div>
```

**关键改动**:
- ✅ 移除了所有内部元素（图标、文字）
- ✅ 移除了内边距 `p-3`
- ✅ 添加了 `overflow-hidden` 确保图片不溢出
- ✅ 动态加载卡片图片：`card_${cardIndex}.jpg`
- ✅ 图片完美填充容器：`w-full h-full object-contain`

---

### 4. 持久化逻辑

**保存交易时**:
```typescript
const newMailboxItem: MailboxItem = {
  id: txSig,
  name: fanName.trim() || "Warm Supporter",
  message: fanMessage.trim(),
  amount: finalAmount,
  txHash: txSig,
  themeIndex: themeIndex,
  healingWord: chosenMsg,
  timestamp: formattedTimestamp,
  cardIndex: cardIndex // 保存卡片索引
};
```

**查看历史记录时**:
```typescript
const historicalPostcard: ActivePostcardData = {
  theme: themesList[item.themeIndex],
  txHash: item.txHash,
  fanName: item.name,
  fanMessage: item.message,
  healingWord: item.healingWord,
  amount: item.amount,
  timestamp: item.timestamp,
  cardIndex: item.cardIndex || 1 // 向后兼容旧数据
};
```

---

## 🎯 测试指南

### Test 1: 新交易生成卡片

1. 连接钱包
2. 填写表单：
   - Name: `TestUser`
   - Message: `Hello World`
   - Amount: `$3`
3. 提交交易并批准
4. ✅ 验证明信片左侧显示卡片图片
5. ✅ 记录卡片编号（例如：card_15.jpg）

### Test 2: 确定性验证

1. 刷新页面并重新连接钱包
2. 输入**完全相同**的内容：
   - Name: `TestUser`
   - Message: `Hello World`
   - Amount: `$3`
3. 提交交易
4. ✅ 验证生成的卡片编号**完全相同**

### Test 3: 不同输入生成不同卡片

1. 修改任意一个输入：
   - Name: `TestUser2` (改变名字)
   - Message: `Hello World`
   - Amount: `$3`
2. 提交交易
3. ✅ 验证生成的卡片编号**不同**

### Test 4: 历史记录持久化

1. 完成 3 笔不同的交易
2. 记录每笔交易的卡片编号
3. 刷新页面
4. 滚动到邮箱区域
5. 点击每张历史卡片
6. ✅ 验证每张明信片显示**正确的卡片图片**

### Test 5: 卡片范围验证

1. 完成多笔交易（建议 10+ 笔）
2. 记录所有生成的卡片编号
3. ✅ 验证所有卡片编号在 1-34 范围内
4. ✅ 验证不同输入生成不同卡片

---

## 📁 文件结构

```
assets/
└── card/
    ├── card_1.jpg
    ├── card_2.jpg
    ├── card_3.jpg
    ├── ...
    ├── card_33.jpg
    └── card_34.jpg
```

**总计**: 34 张卡片图片

---

## 🔍 浏览器控制台测试

### 查看当前邮箱数据（包含卡片索引）:
```javascript
const mailbox = JSON.parse(localStorage.getItem('cozy_mailbox'));
console.table(mailbox.map(item => ({
  name: item.name,
  amount: item.amount,
  cardIndex: item.cardIndex,
  txHash: item.txHash.substring(0, 20) + '...'
})));
```

### 手动测试确定性哈希:
```javascript
// 在浏览器控制台运行
function testHash(name, message, amount) {
  const combined = `${name}|${message}|${amount.toFixed(2)}`;
  let hashCode = 0;
  for (let i = 0; i < combined.length; i++) {
    hashCode = (hashCode << (i % 7 ? 5 : 7)) - hashCode + combined.charCodeAt(i);
    hashCode |= 0;
  }
  const absHash = Math.abs(hashCode);
  const cardIndex = (absHash % 34) + 1;
  console.log(`Input: ${combined}`);
  console.log(`Hash: ${absHash}`);
  console.log(`Card Index: ${cardIndex}`);
  return cardIndex;
}

// 测试
testHash('TestUser', 'Hello World', 3);
testHash('TestUser', 'Hello World', 3); // 应该返回相同的卡片索引
testHash('TestUser2', 'Hello World', 3); // 应该返回不同的卡片索引
```

---

## 🎨 UI 效果

### 明信片左侧（盲盒卡片区域）

**布局**:
- 黑色虚线边框容器
- 白色背景
- 卡片图片完美填充
- 保持原有的圆角和阴影效果

**响应式**:
- 移动端：卡片占满容器宽度
- 桌面端：卡片保持纵横比，居中显示

---

## 🔧 技术细节

### 卡片索引计算

```typescript
// 使用模运算确保范围在 1-34
const cardIndex = (absHash % 34) + 1;

// 示例：
// absHash = 123456 → cardIndex = (123456 % 34) + 1 = 15
// absHash = 789012 → cardIndex = (789012 % 34) + 1 = 23
```

### 图片路径动态生成

```typescript
// React 动态路径
src={`/assets/card/card_${activePostcard.cardIndex}.jpg`}

// 示例：
// cardIndex = 1  → /assets/card/card_1.jpg
// cardIndex = 15 → /assets/card/card_15.jpg
// cardIndex = 34 → /assets/card/card_34.jpg
```

### 向后兼容

```typescript
// 如果旧数据没有 cardIndex，默认使用 1
cardIndex: item.cardIndex || 1
```

---

## 📊 卡片分布统计

理论上，如果输入足够随机，34 张卡片应该均匀分布。

**验证方法**:
```javascript
// 统计卡片分布
const mailbox = JSON.parse(localStorage.getItem('cozy_mailbox'));
const distribution = {};
mailbox.forEach(item => {
  const idx = item.cardIndex;
  distribution[idx] = (distribution[idx] || 0) + 1;
});
console.log('Card Distribution:', distribution);
```

---

## 🐛 常见问题

### 问题 1: 卡片图片不显示

**可能原因**:
- 图片文件不存在
- 路径错误

**解决方案**:
```bash
# 检查文件是否存在
ls assets/card/

# 应该看到 card_1.jpg 到 card_34.jpg
```

### 问题 2: 历史记录显示错误的卡片

**可能原因**:
- LocalStorage 中的旧数据没有 cardIndex

**解决方案**:
```javascript
// 清空旧数据
localStorage.removeItem('cozy_mailbox');
// 刷新页面，重新生成数据
```

### 问题 3: 相同输入生成不同卡片

**可能原因**:
- 输入没有完全相同（注意空格、大小写）
- 哈希函数被修改

**解决方案**:
- 确保输入完全一致
- 检查 `getDeterministicHash` 函数是否被修改

---

## ✨ 功能亮点

1. **完全确定性** - 相同输入永远生成相同卡片
2. **盲盒机制** - 用户无法预测会得到哪张卡片
3. **收藏价值** - 34 张独特卡片，增加收藏乐趣
4. **持久化保存** - 每张卡片永久绑定到交易记录
5. **视觉冲击** - 全画幅卡片替代简单图标

---

## 🚀 未来增强建议

1. **卡片稀有度系统**
   - 某些卡片更稀有（出现概率更低）
   - 显示稀有度标签（普通、稀有、史诗、传说）

2. **卡片收藏册**
   - 显示已收集的卡片
   - 显示收集进度（X/34）
   - 高亮未收集的卡片

3. **卡片详情页**
   - 点击卡片查看大图
   - 显示卡片背景故事
   - 显示获得时间和交易详情

4. **卡片交易功能**
   - 允许用户之间交换卡片
   - 卡片市场（如果集成真实区块链）

5. **动画效果**
   - 卡片翻转动画（揭晓盲盒）
   - 稀有卡片特殊光效
   - 收集新卡片时的庆祝动画

---

## 📝 代码变更总结

### 修改的文件
- `src/App.tsx`

### 新增的功能
1. `cardIndex` 字段添加到数据结构
2. `getDeterministicHash` 函数返回 `cardIndex`
3. 明信片模态框显示动态卡片图片
4. 历史记录持久化卡片索引

### 删除的内容
- 虚线容器内的图标（☕）
- 虚线容器内的文字（"Stamp No. #..."）
- 容器内边距

### 新增的内容
- 动态 `<img>` 标签
- 卡片图片路径：`/assets/card/card_${cardIndex}.jpg`

---

**实现完成！盲盒卡片功能已完全集成到 SoftPay 项目中。** 🎉
