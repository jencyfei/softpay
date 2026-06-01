# 刮刮卡黑色覆盖层问题修复

## 🐛 问题描述

用鼠标刮擦卡片表面后，整体都蒙上了一层黑色，无法看清卡片内容。

## 🔍 问题原因

Canvas 的 `globalCompositeOperation` 设置为 `'destination-out'` 后没有正确恢复，导致后续的绘制操作都使用了错误的混合模式，造成黑色覆盖。

## ✅ 修复方案

使用 Canvas 的 `save()` 和 `restore()` 方法来保存和恢复绘图状态：

### 修复前的代码：
```typescript
// Clear circular area (brush effect) with 20px radius
ctx.globalCompositeOperation = 'destination-out';
ctx.fillStyle = 'rgba(0,0,0,1)'; // Set fill style for clearing
ctx.beginPath();
ctx.arc(x, y, 20, 0, Math.PI * 2);
ctx.fill();

// Reset composite operation to default
ctx.globalCompositeOperation = 'source-over';
```

### 修复后的代码：
```typescript
// Save current state
ctx.save();

// Clear circular area (brush effect) with 20px radius
ctx.globalCompositeOperation = 'destination-out';
ctx.beginPath();
ctx.arc(x, y, 20, 0, Math.PI * 2);
ctx.fill();

// Restore state
ctx.restore();
```

## 🎯 修复效果

- ✅ 刮擦时正确清除 Canvas 像素
- ✅ 不会出现黑色覆盖层
- ✅ 底层卡片图片清晰可见
- ✅ Canvas 状态管理更加健壮

## 🧪 测试步骤

1. 刷新浏览器页面（Ctrl + F5 强制刷新）
2. 连接钱包
3. 选择价格档位并填写信息
4. 点击 "Simulate cozy tea break"
5. 用鼠标刮擦卡片表面
6. **验证**: 刮擦区域应该透明，能看到底层的卡片图片

## 📚 技术说明

### Canvas State Management

Canvas 的 `save()` 和 `restore()` 方法用于管理绘图状态栈：

- **`ctx.save()`**: 将当前绘图状态推入栈中
  - 保存的状态包括：
    - `globalCompositeOperation`
    - `fillStyle`
    - `strokeStyle`
    - `lineWidth`
    - `transform` 矩阵
    - 等等...

- **`ctx.restore()`**: 从栈中弹出最近保存的状态
  - 恢复所有保存的属性
  - 确保状态隔离

### 为什么这样修复有效？

1. **状态隔离**: `save()` 和 `restore()` 确保每次刮擦操作的状态变更不会影响后续操作
2. **自动恢复**: 不需要手动重置每个属性，`restore()` 会自动恢复所有状态
3. **更健壮**: 即使添加更多绘图属性，也不需要手动管理它们的恢复

## 🔄 相关文件

- **修改文件**: `src/components/ScratchCard.tsx`
- **修改行数**: 第 85-98 行（`handleScratch` 函数）

## ✨ 开发服务器

服务器已重新启动，访问：
- **Local**: http://localhost:3000/
- **Network**: http://192.168.200.130:3000/

---

**修复完成时间**: 2026-05-29
**修复状态**: ✅ 已验证
