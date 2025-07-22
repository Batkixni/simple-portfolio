# Bax Portfolio - 個人作品集網站

一個現代化的響應式個人作品集網站，專為創意設計師打造，結合了流暢的動畫效果和優雅的使用者體驗。

![Portfolio Preview](src/images/header.jpg)

## ✨ 功能特色

### 🎨 **視覺設計**
- **炫酷載入動畫** - 自定義SVG logo with路徑描繪效果
- **響應式設計** - 適配所有裝置尺寸
- **暗黑/明亮主題** - 一鍵切換主題模式
- **粒子背景** - 動態互動粒子系統
- **自定義游標** - 跟隨滑鼠的動態游標效果

### 🚀 **動畫效果**
- **GSAP驅動** - 流暢的進場動畫和過場效果
- **滾動觸發** - ScrollTrigger實現的滾動動畫
- **頁面轉場** - 無縫的頁面切換體驗
- **載入進度** - 帶發光效果的進度條動畫

### 🛠 **技術特色**
- **HTMX整合** - 動態內容載入，無需重新整理頁面
- **Markdown支援** - 作品內容使用Markdown撰寫
- **靜態生成** - 自動生成作品詳情頁面
- **模組化架構** - 易於維護和擴展的程式碼結構

## 🏗 技術架構

### **前端技術**
- **HTML5** - 語意化標記
- **CSS3** - 現代CSS特性與CSS變數
- **JavaScript ES6+** - 模組化JavaScript
- **GSAP 3.12** - 動畫引擎
- **P5.js** - 粒子系統
- **HTMX** - 動態內容載入

### **後端技術**
- **Node.js** - 伺服器環境
- **Express.js** - Web框架
- **Marked** - Markdown解析器
- **Front-Matter** - 元數據處理

### **建構工具**
- **靜態生成器** - 自動生成作品頁面
- **開發伺服器** - 熱重載開發環境
- **模板引擎** - Handlebars模板系統

## 📂 專案結構

```
simple-personal-website/
├── src/                    # 前端資源
│   ├── css/               # 樣式表
│   │   └── style.css      # 主要樣式
│   ├── js/                # JavaScript模組
│   │   ├── animations.js  # 動畫控制器
│   │   ├── app.js         # 主應用邏輯
│   │   ├── particles.js   # 粒子系統
│   │   └── transition-manager.js # 頁面轉場管理
│   └── images/            # 圖片資源
│       └── logo.svg       # SVG Logo
├── templates/             # 頁面模板
│   └── work-template.html # 作品頁面模板
├── works/                 # 作品Markdown文件
│   ├── motion-design/     # 動態設計作品
│   └── graphic-design/    # 平面設計作品
├── work/                  # 生成的作品HTML頁面
├── utils/                 # 工具模組
│   └── page-generator.js  # 頁面生成器
├── server.js              # Express伺服器
├── build.js               # 建構腳本
├── generate-pages.js      # 頁面生成腳本
└── package.json           # 依賴配置
```

## 🚀 快速開始

### **環境需求**
- Node.js 16.0+
- pnpm (推薦) 或 npm

### **安裝步驟**

1. **複製專案**
```bash
git clone <repository-url>
cd simple-personal-website
```

2. **安裝依賴**
```bash
pnpm install
# 或
npm install
```

3. **生成作品頁面**
```bash
pnpm run generate
# 或
npm run generate
```

4. **啟動開發伺服器**
```bash
pnpm run dev
# 或
npm run dev
```

5. **開啟瀏覽器**
訪問 `http://localhost:3000`

## 📝 使用說明

### **新增作品**

1. **建立Markdown文件**
在 `works/motion-design/` 或 `works/graphic-design/` 目錄下建立新的 `.md` 檔案：

```markdown
---
title: "作品標題"
description: "作品描述"
image: "/src/images/work-cover.jpg"
date: "2024"
tags: ["tag1", "tag2"]
category: "motion-design"
---

# 作品內容

這裡撰寫作品的詳細說明...

![作品圖片](/src/images/work-detail.jpg)
```

2. **重新生成頁面**
```bash
pnpm run generate
```

3. **重啟伺服器**
```bash
pnpm run dev
```

### **自定義主題**

修改 `src/css/style.css` 中的CSS變數：

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #007bff;
  /* 更多變數... */
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  /* 暗黑主題變數... */
}
```

### **修改Logo**

替換 `src/images/logo.svg` 並更新HTML中的SVG路徑即可。

## 🎯 核心功能詳解

### **載入動畫系統**
- SVG路徑描繪動畫
- 進度條同步更新
- 發光效果隨進度增強
- 優雅的完成轉場

### **頁面轉場管理**
- 智能檢測導航來源
- 首頁來源跳過載入動畫
- 直接訪問顯示完整動畫
- 流暢的進場動畫序列

### **響應式粒子系統**
- 滑鼠互動效果
- 效能優化的渲染
- 主題色彩同步
- 載入完成後啟動

### **動態內容載入**
- HTMX實現無重載更新
- 作品列表動態載入
- 漸進式增強體驗

## 🛠 開發指令

```bash
# 開發模式 (熱重載)
pnpm run dev

# 生產模式
pnpm start

# 生成所有作品頁面
pnpm run generate

# 強制重新生成 (覆蓋現有)
pnpm run generate:force

# 建構靜態檔案
pnpm run build
```

## 🎨 自定義指南

### **動畫效果調整**
編輯 `src/js/animations.js` 中的動畫參數：
- 動畫持續時間
- 緩動函數
- 延遲時間
- 動畫序列

### **樣式客製化**
修改 `src/css/style.css`：
- CSS變數調整顏色
- 響應式斷點
- 動畫過渡效果
- 排版樣式

### **功能擴展**
- 在 `src/js/` 添加新的模組
- 使用 `utils/` 目錄放置工具函數
- 擴展 `page-generator.js` 支援更多內容類型

## 📱 瀏覽器支援

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 🤝 貢獻指南

1. Fork專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 👨‍💻 作者

**Bax**