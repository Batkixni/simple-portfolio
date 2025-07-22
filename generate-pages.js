#!/usr/bin/env node

const PageGenerator = require("./utils/page-generator");
const path = require("path");

async function main() {
  console.log("🚀 開始生成作品頁面...");

  try {
    const pageGenerator = new PageGenerator(
      __dirname,
      path.join(__dirname, "templates"),
      __dirname,
    );

    // 生成所有頁面
    const generatedPages = await pageGenerator.generateAllPages();

    console.log(`\n✅ 成功生成 ${generatedPages.length} 個頁面:`);
    generatedPages.forEach(({ work, path }) => {
      console.log(`   📄 ${work.title} -> ${path}`);
    });

    console.log("\n🎉 頁面生成完成！");
  } catch (error) {
    console.error("❌ 頁面生成失敗:", error);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = main;
