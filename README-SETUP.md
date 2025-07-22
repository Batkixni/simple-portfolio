# Bax Portfolio Website

一個使用 HTMX、GSAP 和 Markdown 構建的極簡個人作品集網站。

## 功能特色

- 🎨 **極簡設計**: 純黑白配色，現代簡潔風格
- ⚡ **動態效果**: 使用 GSAP 實現流暢的動畫效果
- 🖱️ **自定義游標**: 特殊的游標設計提升互動體驗
- 📝 **Markdown 驅動**: 使用 Markdown 文件管理作品內容
- 🔄 **動態載入**: 使用 HTMX 實現無頁面刷新的內容載入
- 📱 **響應式設計**: 適配各種螢幕尺寸
- 🚀 **輕量級**: 純前端實現，易於部署

## 快速開始

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 準備作品內容

將您的作品圖片放入 `src/images/` 目錄：

```
src/images/
├── motion-work-1.jpg
├── motion-work-2.jpg
├── graphic-work-1.jpg
├── graphic-work-2.jpg
└── placeholder.jpg
```

推薦圖片尺寸：800x450 (16:9 比例)

### 3. 啟動開發伺服器

```bash
pnpm run dev
```

伺服器將在 http://localhost:3000 啟動

### 4. 啟動生產伺服器

```bash
pnpm start
```

## 目錄結構

```
simple-personal-website/
├── index.html              # 主頁面
├── server.js               # Express 伺服器
├── package.json            # 專案設定
├── build.js               # 建構腳本
├── src/
│   ├── css/
│   │   └── style.css      # 主樣式文件
│   ├── js/
│   │   └── app.js         # 主 JavaScript 文件
│   └── images/            # 作品圖片目錄
└── works/                 # 作品 Markdown 文件
    ├── motion-design/     # 動態設計作品
    └── graphic-design/    # 平面設計作品
```

## 添加新作品

### 1. 創建 Markdown 文件

在 `works/motion-design/` 或 `works/graphic-design/` 目錄中創建新的 `.md` 文件：

```markdown
---
title: "作品標題"
description: "作品簡述"
image: "/src/images/your-image.jpg"
order: 1
date: "2023-12-01"
tags: ["標籤1", "標籤2"]
---

# 作品詳細內容

這裡是作品的詳細描述，支援完整的 Markdown 語法。

## 設計概念

...

## 技術實現

...
```

### 2. 添加作品圖片

將對應的圖片文件放入 `src/images/` 目錄。

### 3. 自動載入

重新啟動伺服器，新作品將自動出現在網站上。

## Front Matter 欄位說明

- `title`: 作品標題 (必需)
- `description`: 作品簡短描述 (必需)
- `image`: 作品預覽圖片路徑 (必需)
- `order`: 顯示順序，數字越小越靠前 (選填)
- `date`: 作品創建日期 (選填)
- `tags`: 作品標籤陣列 (選填)

## 自定義設計

### 修改配色

編輯 `src/css/style.css` 中的 CSS 變數：

```css
body {
    background-color: #000;  /* 背景色 */
    color: #fff;             /* 文字色 */
}
```

### 調整動畫

編輯 `src/js/app.js` 中的 GSAP 動畫參數：

```javascript
gsap.to('.hero-title', {
    duration: 1,        // 動畫持續時間
    ease: 'power2.out'  // 緩動函數
});
```

### 修改游標樣式

在 `src/css/style.css` 中調整 `.cursor` 和 `.cursor-follower` 樣式。

## API 端點

- `GET /api/works/:category` - 獲取指定分類的作品列表
- `GET /api/work/:path` - 獲取單個作品詳情

## 部署建議

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 中導入專案
3. 設定建構指令：`pnpm install && pnpm run build`
4. 設定啟動指令：`pnpm start`

### Netlify 部署

1. 將專案推送到 GitHub
2. 在 Netlify 中導入專案
3. 設定建構指令：`pnpm install && pnpm run build`
4. 設定發佈目錄：`./`

## 瀏覽器支援

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 技術棧

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **動畫**: GSAP 3.12.2
- **互動**: HTMX 1.9.10
- **後端**: Node.js + Express
- **內容**: Markdown + Front Matter
- **包管理**: pnpm

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- Email: your-email@example.com
- GitHub: [@your-username](https://github.com/your-username)

---

Made with ❤️ by Bax