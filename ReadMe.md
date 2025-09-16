# Bax Portfolio - [My personal website](https://bax.sorai.tw) sources code

![Portfolio Preview](src/images/header.jpg)

## ✨ 功能特色

網站以Markdown作為CMS（算是）系統，自主部署的話就是Git-based CMS

為了讓網站簡單一點，後端伺服器實際上只負責在每次伺服器重啟時檢查是否有新的Markdown檔案並生成對應的html

## 🏗 技術架構

使用原生JavaScript與htmx作為主要開發套件
動畫與背景使用了p5.js與GSAP元件

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

3. **啟動開發伺服器**
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

![作品圖片](/src/images/[placeholder].jpg)
```


## 📄 授權條款

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 👨‍💻 作者

**Bax**