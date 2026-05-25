# SoftPay - Quick Test Guide

## 🚀 Start Development Server

```bash
npm run dev
```

访问: **http://localhost:3000**

---

## ✅ 5-Minute Complete Test

### Test 1: Wallet Connection (30 seconds)
1. 点击右上角 **"Connect Wallet"** 按钮
2. ✅ 验证弹出 Phantom 钱包模拟器
3. ✅ 检查显示: `14.5 SOL` 和 `50.0 USDC`
4. ✅ 检查显示: "Solana Devnet" 徽章
5. 点击 **"Approve"** 按钮
6. ✅ 等待 1 秒加载动画
7. ✅ 验证右上角显示钱包地址: `SoFtJn_6z...`
8. ✅ 验证绿色状态指示器出现

**Expected Result**: 钱包成功连接，地址显示在页面右上角

---

### Test 2: 确定性哈希生成 (1 minute)

#### Round 1:
1. 在 "Your Signature / Name" 输入: `TestUser`
2. 在 "Sentiment Memo" 输入: `Hello World`
3. 选择 **$3 Chiffon Cake** 卡片
4. 点击 **"Simulate cozy tea break"** 按钮
5. 在钱包弹窗点击 **"Approve Transaction"**
6. 等待 1.5 秒加载
7. ✅ 记录生成的 TxHash (例如: `Tx: 5HzpjK8uN7mR9yPqWv2b3k9w`)

#### Round 2 (验证确定性):
1. 关闭明信片弹窗
2. 再次输入 **完全相同** 的内容:
   - Name: `TestUser`
   - Message: `Hello World`
   - Amount: `$3`
3. 再次完成交易
4. ✅ **验证 TxHash 完全相同**

**Expected Result**: 相同输入 → 相同哈希值（100% 确定性）

---

### Test 3: LocalStorage 持久化 (2 minutes)

#### 创建多个交易:
1. 完成 3 笔不同的交易:
   - Transaction 1: Name=`Alice`, Message=`Great work!`, Amount=`$1`
   - Transaction 2: Name=`Bob`, Message=`Love it!`, Amount=`$3`
   - Transaction 3: Name=`Charlie`, Message=`Amazing!`, Amount=`$5`

2. 滚动到页面底部 **"Jency's Cozy Mailbox"** 区域
3. ✅ 验证显示 **"4 MINTED STUBS"** (包括预填充的演示项)
4. ✅ 验证看到 4 张卡片（网格布局）

#### 测试持久化:
5. 按 **F5** 刷新页面
6. 重新连接钱包
7. 滚动到邮箱区域
8. ✅ 验证所有 4 张卡片仍然存在
9. ✅ 验证数据没有丢失

#### 测试历史查看:
10. 点击任意一张历史卡片
11. ✅ 验证弹出明信片模态框
12. ✅ 验证显示正确的历史数据:
    - 正确的名字
    - 正确的消息
    - 正确的金额
    - 正确的 TxHash
    - 正确的时间戳

**Expected Result**: 数据完全持久化，刷新后不丢失，历史记录可查看

---

### Test 4: 空状态测试 (30 seconds)

1. 打开浏览器开发者工具 (F12)
2. 切换到 **Console** 标签
3. 运行命令:
   ```javascript
   localStorage.removeItem('cozy_mailbox')
   ```
4. 刷新页面 (F5)
5. 滚动到邮箱区域
6. ✅ 验证显示空状态消息:
   - "Your sketchbook mailbox is quiet and empty."
   - 提示用户完成第一笔交易

7. 完成一笔新交易
8. ✅ 验证卡片立即出现在邮箱中

**Expected Result**: 空状态正确显示，新交易立即更新 UI

---

### Test 5: 图片资源验证 (30 seconds)

1. 打开开发者工具 (F12)
2. 切换到 **Network** 标签
3. 筛选 **Img** 类型
4. 刷新页面
5. ✅ 验证所有图片加载成功 (状态码 200):
   - `green_tea_cup.png` - $1 tier
   - `chiffon_cake.png` - $3 tier
   - `vinyl_player.png` - $5 tier
   - `creator_avatar.png` - CUSTOM tier

**Expected Result**: 所有图片正常显示，无 404 错误

---

## 🔍 浏览器控制台测试命令

### 查看当前邮箱数据:
```javascript
JSON.parse(localStorage.getItem('cozy_mailbox'))
```

### 清空邮箱:
```javascript
localStorage.removeItem('cozy_mailbox')
```

### 手动添加测试数据:
```javascript
const testData = [{
  id: "Tx: TEST123",
  name: "Manual Test",
  message: "This is a test",
  amount: 5,
  txHash: "Tx: TEST123",
  themeIndex: 0,
  healingWord: "Test message",
  timestamp: new Date().toLocaleString()
}];
localStorage.setItem('cozy_mailbox', JSON.stringify(testData));
location.reload();
```

---

## 🎯 核心功能验证清单

### Pillar A: Phantom 钱包模拟器
- [x] 连接钱包弹窗
- [x] 显示模拟余额
- [x] 交易批准流程
- [x] 1.5 秒加载动画
- [x] 断开连接功能

### Pillar B: 确定性哈希
- [x] 基于输入生成哈希
- [x] 相同输入 = 相同哈希
- [x] Solana 格式签名
- [x] Base58 编码
- [x] 前缀 `Tx: 5Hzp...`

### Pillar C: LocalStorage 邮箱
- [x] 保存交易到 localStorage
- [x] 页面刷新后数据保留
- [x] 动态渲染卡片网格
- [x] 点击查看历史明信片
- [x] 空状态处理
- [x] 计数徽章显示

---

## 🐛 常见问题排查

### 问题 1: 图片不显示
**解决方案**:
```bash
# 检查 assets 目录
ls assets/

# 应该看到:
# chiffon_cake.png
# creator_avatar.png
# green_tea_cup.png
# vinyl_player.png
```

### 问题 2: LocalStorage 不工作
**解决方案**:
1. 检查浏览器是否启用 localStorage
2. 打开 DevTools → Application → Local Storage
3. 查看 `http://localhost:3000` 下的数据

### 问题 3: 钱包连接后立即断开
**解决方案**:
- 这是正常的，因为是模拟器
- 每次刷新页面需要重新连接
- 真实 Phantom 钱包会保持连接

---

## 📊 性能指标

- **首次加载**: < 2 秒
- **钱包连接**: 1 秒
- **交易批准**: 1.5 秒
- **明信片生成**: < 0.5 秒
- **LocalStorage 读写**: < 10ms

---

## ✅ 测试完成标准

所有以下项目都应该通过:

1. ✅ 钱包可以连接和断开
2. ✅ 交易批准流程完整
3. ✅ 相同输入生成相同哈希
4. ✅ 交易保存到 localStorage
5. ✅ 刷新页面后数据保留
6. ✅ 历史卡片可以点击查看
7. ✅ 所有图片正常加载
8. ✅ 空状态正确显示
9. ✅ UI 响应流畅无卡顿
10. ✅ 控制台无错误信息

---

**测试完成后，你的 SoftPay 应用已经完全可以演示给评委！** 🎉
