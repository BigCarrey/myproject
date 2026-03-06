# 万能营销 Pro 设计规范

本文档描述当前项目采用的品牌视觉规范，供设计与开发团队参考。

---

## 一、核心视觉基调

| 属性 | 说明 |
|------|------|
| **风格名称** | 浅蓝晶透 (Alice Blue Crystal) & 黑金尊享 (Black Gold Premium) |
| **整体感受** | 极致的通透感、科技感、尊贵感。既有 AI 的聪明与轻盈，又有金融理财的稳重与奢华。 |
| **核心材质** | 毛玻璃（Glassmorphism）、微边框内发光、数字噪点纹理、全息径向渐变。 |

---

## 二、颜色系统 (Color System)

### 2.1 主色调

| 用途 | 色值 | 说明 |
|------|------|------|
| **主渐变** | `#3B82F6` → `#1D4ED8` | 科技蓝，用于核心按钮、AI 元素、头部 |
| **次渐变** | `#3B82F6` → `#2563EB` | 科技蓝变体 |
| **品牌文本** | `#1E3A8A` | 深邃的品牌蓝 |
| **极夜黑** | `#0F172A` | 主文本色 |

### 2.2 强调色 (Accent)

| 用途 | 色值 | 应用场景 |
|------|------|----------|
| **香槟金** | `#D4AF37` | VIP 标签、高客特权、顶尖专家标识、待改进提示 |
| **翡翠绿** | `#10B981` | 成功率、正向数据、已完成状态、保障充足 |
| **科技蓝** | `#3B82F6` | 核心交互、链接、进度指示 |

### 2.3 背景渐变

| 主题 | 渐变值 | Tailwind 类 |
|------|--------|-------------|
| **浅色** | `#EBF5FF` → `#E0F2FE` → `#DBEAFE` | `bg-gradient-to-b from-[#EBF5FF] via-[#E0F2FE] to-[#DBEAFE]` |
| **深色/黑金** | `#0F172A` → `#020617` → `#0B1120` | `bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#0B1120]` |

### 2.4 辅助色

| 用途 | 色值 |
|------|------|
| 次要文本 | `#475569` |
| 占位/禁用 | `#64748B`、`#94a3b8` |
| 边框/分割 | `#E2E8F0`、`#F1F5F9` |
| 浅色背景 | `#F8FAFC`、`#EFF6FF` |

---

## 三、质感引擎 (FX System)

### 3.1 高级毛玻璃 (Glass)

```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 8px 30px 0 rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
```

**Tailwind 等价**：`bg-white/70 backdrop-blur-[24px] shadow-[0_8px_30px_0_rgba(37,99,235,0.06)] border border-white/80`

**应用**：输入框、快捷回复按钮、侧边栏、部分卡片

### 3.2 高定晶体 (Crystal / Gem)

```css
.crystal {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%);
  backdrop-filter: blur(40px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 1), 0 10px 40px -10px rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
```

**Tailwind 等价**：`shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_10px_40px_-10px_rgba(37,99,235,0.15)] ring-1 ring-white backdrop-blur-2xl bg-gradient-to-br from-white/90 to-white/50`

**应用**：悬浮卡片、AI 消息气泡、四大支柱卡片、业务卡片

### 3.3 黑金物理卡片 (Black Gold Card)

```css
.black-gold-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.4);
}
```

**Tailwind 等价**：`bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]`

**应用**：深色主题下的 VIP/高客卡片（可选）

### 3.4 噪点纹理 (Noise Overlay)

- **实现**：绝对定位覆盖层 + SVG 噪点背景（`feTurbulence`）
- **浅色主题**：`opacity: 0.2`
- **深色主题**：`opacity: 0.05`（`.noise-overlay.dark`）
- **应用**：主背景、Overview 页

---

## 四、排版与布局 (Typography & Layout)

### 4.1 字体

| 用途 | 字体栈 |
|------|--------|
| **品牌/标题** | `"Noto Serif SC", "Noto Serif CJK SC", "Source Han Serif SC", "PingFang SC", serif` |
| **正文** | 继承 body，同上 |

**引入方式**：Google Fonts `Noto Serif SC`（400/600/700/900）

### 4.2 品牌头部 (Brand Header)

- **文案**：纯文字「万能营销」，无 Logo 图标
- **样式**：`font-black tracking-wider`
- **字体**：衬线字体栈（见上）
- **背景**：科技蓝渐变 `from-[#3B82F6] to-[#1D4ED8]`

### 4.3 布局规范

| 规范 | 说明 |
|------|------|
| **全屏无滚动** | `h-full flex flex-col`，根容器不滚动 |
| **内容区** | `flex-1 overflow-y-auto scrollbar-hide` |
| **悬浮操作岛** | 底部输入区使用半透明渐变蒙层，主按钮 `rounded-[20px]` |
| **大圆角** | 卡片 `rounded-[24px]` 或 `rounded-[32px]` |

### 4.4 圆角规范

| 元素 | 圆角 |
|------|------|
| 卡片 | `24px` ~ `32px` |
| 主按钮 | `20px` |
| 快捷回复/小按钮 | `16px` |
| 输入框 | `20px` |
| 手机框架 | `40px` |

---

## 五、动效与生命力 (Animations)

### 5.1 流式入场 (Staggered Entry)

```css
.animate-stagger-entry {
  animation: staggerEntry 1s ease-out forwards;
}
/* 从 translateY(8px) opacity-0 到 translateY(0) opacity-1 */
```

**应用**：消息气泡、快捷回复、页面元素

### 5.2 AI 呼吸感

- **光晕层**：`animate-pulse` + 科技蓝渐变 blur
- **光轨**：`animate-orbit`（10s 线性旋转）虚线圆环
- **应用**：TypingIndicator 中的 AI 头像

### 5.3 扫光特效 (Shimmer)

- **触发**：`group-hover`
- **效果**：倾斜白光 `translate-x` 滑过
- **应用**：核心按钮、开始演示按钮、快捷回复、VIP 卡片

```css
.shimmer::after {
  /* 105deg 倾斜白光，group-hover 时 translateX(200%) */
}
```

### 5.4 其他动效

| 类名 | 说明 |
|------|------|
| `animate-fade-in-up` | 淡入上移 |
| `animate-pulse-glow` | 脉冲光晕（按钮/语音） |
| `animate-step-item-reveal` | 步骤项逐条显示 |
| `voice-wave` | 语音波形 |
| `voice-pulse` | 语音脉冲 |

---

## 六、图像与多媒体 (Assets)

### 6.1 AI 助理形象

- **来源**：Dicebear Micah 风格
- **URL**：`https://api.dicebear.com/7.x/micah/svg?seed=waneng&backgroundColor=transparent`
- **容器**：`overflow-hidden rounded-full border border-white/50`
- **禁止**：`bg-[url()]` 背景图

### 6.2 图片展示规范

- 使用 `<img>` 标签，不用 `background-image`
- 外层：`overflow-hidden` + 大圆角（如 `rounded-[20px]`）
- 边框：`border border-white/50` 模拟相框边缘

---

## 七、组件规范速查

### 7.1 卡片头部

| 类型 | 样式 |
|------|------|
| 默认 | `bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]` |
| 文本 | 白色 `text-white`，`font-semibold` |

### 7.2 语义色映射

| 语义 | 色值 |
|------|------|
| 成功/正向/充足 | `#10B981` |
| VIP/高客/待改进 | `#D4AF37` |
| 警告/缺口 | `#F59E0B` |
| 错误/缺失 | `#DC2626`、`#EF4444` |

### 7.3 卡片类型选择

| 场景 | 推荐类 |
|------|--------|
| 普通信息卡 | `.crystal` |
| 输入/按钮容器 | `.glass` |
| VIP/高客（深色） | `.black-gold-card` |

---

## 八、文件与实现位置

| 规范项 | 实现位置 |
|--------|----------|
| 颜色变量 | `src/index.css` `:root` |
| FX 类 | `src/index.css` `.glass` `.crystal` `.black-gold-card` |
| 噪点 | `src/index.css` `.noise-overlay` |
| 动画 | `src/index.css` `@keyframes` |
| 字体 | `index.html` Google Fonts |
| 品牌头 | `src/components/Header.tsx` |
| 布局 | `src/App.tsx` |

---

## 九、验收清单

- [ ] 主色为科技蓝 #3B82F6–#1D4ED8，无紫粉
- [ ] 背景为浅蓝渐变 + 噪点纹理
- [ ] 品牌头为纯文字「万能营销」+ 衬线字体
- [ ] 卡片使用 Glass/Crystal/Black Gold，圆角 24–32px
- [ ] 底部输入区为悬浮操作岛，主按钮带扫光
- [ ] TypingIndicator 有 AI 呼吸光晕 + Dicebear 头像
- [ ] 页面元素有流式入场动画
- [ ] VIP/高客使用香槟金，正向数据使用翡翠绿
