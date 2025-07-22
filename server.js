const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const marked = require("marked");
const fm = require("front-matter");
const PageGenerator = require("./utils/page-generator");

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化頁面生成器
const pageGenerator = new PageGenerator(
  __dirname,
  path.join(__dirname, "templates"),
  __dirname,
);

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Serve static files
app.use("/src", express.static(path.join(__dirname, "src")));
app.use("/images", express.static(path.join(__dirname, "src/images")));

// Serve generated work pages
app.use("/work", express.static(path.join(__dirname, "work")));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve individual work pages
app.get("/work/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const workPagePath = path.join(__dirname, "work", category, `${id}.html`);

  if (fs.existsSync(workPagePath)) {
    res.sendFile(workPagePath);
  } else {
    res.status(404).send("作品頁面不存在");
  }
});

// API endpoint to get works by category
app.get("/api/works/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const worksDir = path.join(__dirname, "works", category);

    if (!(await fs.pathExists(worksDir))) {
      return res.json([]);
    }

    const files = await fs.readdir(worksDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const works = [];

    for (const file of mdFiles) {
      const filePath = path.join(worksDir, file);
      const content = await fs.readFile(filePath, "utf8");
      const parsed = fm(content);

      const work = {
        id: path.parse(file).name,
        title: parsed.attributes.title || "未命名作品",
        description: parsed.attributes.description || "",
        image: parsed.attributes.image || "/src/images/placeholder.svg",
        category: category,
        path: `${category}/${path.parse(file).name}`,
        order: parsed.attributes.order,
        date: parsed.attributes.date || "",
      };

      works.push(work);
    }

    // Sort by order if specified, otherwise by title
    works.sort((a, b) => {
      const orderA = a.order || 999;
      const orderB = b.order || 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.title.localeCompare(b.title);
    });

    // Generate HTML for portfolio items
    const html = works
      .map(
        (work) => `
            <a href="/work/${work.path}" class="portfolio-item" data-work="${work.path}">
                <div class="portfolio-image">
                    <img src="${work.image}" alt="${work.title}" loading="lazy">
                </div>
                <div class="portfolio-content">
                    <h3 class="portfolio-title">${work.title}</h3>
                    <span class="portfolio-year">${work.date ? new Date(work.date).getFullYear() : ""}</span>
                </div>
            </a>
        `,
      )
      .join("");

    res.send(html);
  } catch (error) {
    console.error("Error loading works:", error);
    res.status(500).send('<div class="loading">載入作品時發生錯誤</div>');
  }
});

// API endpoint to get individual work details
app.get("/api/work/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    const filePath = path.join(__dirname, "works", category, `${id}.md`);

    if (!(await fs.pathExists(filePath))) {
      return res.status(404).send("<p>作品不存在</p>");
    }

    const content = await fs.readFile(filePath, "utf8");
    const parsed = fm(content);
    const html = marked.parse(parsed.body);

    const workHtml = `
            <div class="work-detail">
                <h1>${parsed.attributes.title || "未命名作品"}</h1>
                ${parsed.attributes.image ? `<img src="${parsed.attributes.image}" alt="${parsed.attributes.title}" class="work-main-image">` : ""}
                <div class="work-content">
                    ${html}
                </div>
            </div>
        `;

    res.send(workHtml);
  } catch (error) {
    console.error("Error loading work detail:", error);
    res.status(500).send("<p>載入作品詳情時發生錯誤</p>");
  }
});

// Handle work path with single parameter (for modal links)
app.get("/api/work/:path", async (req, res) => {
  try {
    const workPath = req.params.path;
    const [category, id] = workPath.split("/");

    if (!category || !id) {
      return res.status(400).send("<p>無效的作品路徑</p>");
    }

    // Redirect to the proper endpoint
    const filePath = path.join(__dirname, "works", category, `${id}.md`);

    if (!(await fs.pathExists(filePath))) {
      return res.status(404).send("<p>作品不存在</p>");
    }

    const content = await fs.readFile(filePath, "utf8");
    const parsed = fm(content);
    const html = marked.parse(parsed.body);

    const workHtml = `
            <div class="work-detail">
                <h1>${parsed.attributes.title || "未命名作品"}</h1>
                ${parsed.attributes.image ? `<img src="${parsed.attributes.image}" alt="${parsed.attributes.title}" class="work-main-image">` : ""}
                <div class="work-content">
                    ${html}
                </div>
            </div>
        `;

    res.send(workHtml);
  } catch (error) {
    console.error("Error loading work detail:", error);
    res.status(500).send("<p>載入作品詳情時發生錯誤</p>");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("伺服器錯誤");
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// 伺服器啟動時重新生成所有頁面
async function startServer() {
  try {
    console.log("正在重新生成所有作品頁面...");
    await pageGenerator.generateAllPages();
    console.log("頁面生成完成！");

    app.listen(PORT, () => {
      console.log(`伺服器運行在 http://localhost:${PORT}`);
      console.log("按 Ctrl+C 停止伺服器");
    });
  } catch (error) {
    console.error("伺服器啟動失敗:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
