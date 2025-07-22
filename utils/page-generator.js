const fs = require("fs-extra");
const path = require("path");
const marked = require("marked");
const fm = require("front-matter");

class PageGenerator {
  constructor(baseDir, templateDir, outputDir) {
    this.baseDir = baseDir;
    this.templateDir = templateDir;
    this.outputDir = outputDir;
    this.worksDir = path.join(baseDir, "works");
    this.template = null;
  }

  async initialize() {
    // 載入模板
    const templatePath = path.join(this.templateDir, "work-template.html");
    this.template = await fs.readFile(templatePath, "utf8");

    // 確保輸出目錄存在
    await fs.ensureDir(this.outputDir);
    await fs.ensureDir(path.join(this.outputDir, "work"));
  }

  // 簡單的模板替換函數
  replaceTemplate(template, data) {
    let result = template;

    // 基本替換
    Object.keys(data).forEach((key) => {
      const value = data[key] || "";
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, value);
    });

    // 條件性內容處理 (簡化版)
    // 處理 {{#image}} ... {{/image}} 這樣的條件塊
    if (data.image) {
      result = result.replace(/{{#image}}([\s\S]*?){{\/image}}/g, "$1");
    } else {
      result = result.replace(/{{#image}}([\s\S]*?){{\/image}}/g, "");
    }

    if (data.date) {
      result = result.replace(/{{#date}}([\s\S]*?){{\/date}}/g, "$1");
    } else {
      result = result.replace(/{{#date}}([\s\S]*?){{\/date}}/g, "");
    }

    // 處理標籤
    if (data.tags && data.tags.length > 0) {
      const tagsHtml = data.tags
        .map((tag) => `<span class="work-tag">${tag}</span>`)
        .join("");
      result = result.replace(
        /{{#tags}}([\s\S]*?){{\/tags}}/g,
        `<div class="work-tags">${tagsHtml}</div>`,
      );
    } else {
      result = result.replace(/{{#tags}}([\s\S]*?){{\/tags}}/g, "");
    }

    // 處理導航 (暫時移除前後作品導航)
    result = result.replace(/{{#prevWork}}([\s\S]*?){{\/prevWork}}/g, "");
    result = result.replace(/{{#nextWork}}([\s\S]*?){{\/nextWork}}/g, "");

    return result;
  }

  async getAllWorks() {
    const allWorks = [];
    const categories = await fs.readdir(this.worksDir);

    for (const category of categories) {
      const categoryPath = path.join(this.worksDir, category);
      const stat = await fs.stat(categoryPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);
        const mdFiles = files.filter((file) => file.endsWith(".md"));

        for (const file of mdFiles) {
          const filePath = path.join(categoryPath, file);
          const content = await fs.readFile(filePath, "utf8");
          const parsed = fm(content);

          const work = {
            id: path.parse(file).name,
            title: parsed.attributes.title || "未命名作品",
            description: parsed.attributes.description || "",
            image: parsed.attributes.image || "/src/images/placeholder.svg",
            category: category,
            categoryDisplay: this.getCategoryDisplay(category),
            path: `${category}/${path.parse(file).name}`,
            order: parsed.attributes.order || 999,
            date: parsed.attributes.date || "",
            tags: parsed.attributes.tags || [],
            content: marked.parse(parsed.body),
            filePath: filePath,
          };

          allWorks.push(work);
        }
      }
    }

    return allWorks;
  }

  getCategoryDisplay(category) {
    const categoryMap = {
      "graphic-design": "Visual Designs",
      "motion-design": "Motion Designs",
    };
    return categoryMap[category] || category;
  }

  async generateWorkPage(work) {
    const data = {
      title: work.title,
      description: work.description,
      image: work.image,
      category: work.categoryDisplay,
      date: work.date ? new Date(work.date).toLocaleDateString("zh-TW") : "",
      tags: work.tags,
      content: work.content,
    };

    const html = this.replaceTemplate(this.template, data);

    // 建立輸出路徑
    const outputPath = path.join(this.outputDir, "work", `${work.path}.html`);
    await fs.ensureDir(path.dirname(outputPath));

    // 寫入檔案
    await fs.writeFile(outputPath, html, "utf8");

    return outputPath;
  }

  async generateAllPages() {
    if (!this.template) {
      await this.initialize();
    }

    const works = await this.getAllWorks();
    const generatedPages = [];

    console.log(`找到 ${works.length} 個作品，開始生成頁面...`);

    for (const work of works) {
      try {
        const outputPath = await this.generateWorkPage(work);
        generatedPages.push({
          work: work,
          path: outputPath,
        });
        console.log(`✓ 已生成: ${work.title} -> ${outputPath}`);
      } catch (error) {
        console.error(`✗ 生成失敗: ${work.title}`, error);
      }
    }

    return generatedPages;
  }

  async checkMissingPages() {
    const works = await this.getAllWorks();
    const missingPages = [];

    for (const work of works) {
      const expectedPath = path.join(
        this.outputDir,
        "work",
        `${work.path}.html`,
      );
      const exists = await fs.pathExists(expectedPath);

      if (!exists) {
        missingPages.push(work);
      } else {
        // 檢查檔案是否比 markdown 檔案舊
        const htmlStat = await fs.stat(expectedPath);
        const mdStat = await fs.stat(work.filePath);

        if (mdStat.mtime > htmlStat.mtime) {
          missingPages.push(work);
        }
      }
    }

    return missingPages;
  }

  async generateMissingPages() {
    if (!this.template) {
      await this.initialize();
    }

    const missingPages = await this.checkMissingPages();

    if (missingPages.length === 0) {
      console.log("所有作品頁面都是最新的");
      return [];
    }

    console.log(`需要生成/更新 ${missingPages.length} 個頁面`);

    const generatedPages = [];

    for (const work of missingPages) {
      try {
        const outputPath = await this.generateWorkPage(work);
        generatedPages.push({
          work: work,
          path: outputPath,
        });
        console.log(`✓ 已生成/更新: ${work.title}`);
      } catch (error) {
        console.error(`✗ 生成失敗: ${work.title}`, error);
      }
    }

    return generatedPages;
  }
}

module.exports = PageGenerator;
