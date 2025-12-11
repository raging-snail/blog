import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import subsetFont from 'subset-font';
import he from 'he';

// 配置项
const CONFIG = {
  // 原始字体路径 (建议放在 public/fonts/ 下，或者 src/assets/ 下)
  originalFontPath: 'public/fonts/MapleMono-NF-CN-Regular.ttf', 
  // 输出路径 (构建后的 dist 目录)
  outputDir: 'dist/fonts',
  // 输出文件名
  outputName: 'MapleMono-NF-CN-Regular' 
};

async function main() {
  console.log('🚀 开始字体压缩流程...');

  // 1. 读取原始字体文件
  // 注意：subset-font 需要 Buffer 格式
  let fontBuffer;
  try {
    fontBuffer = await fs.readFile(CONFIG.originalFontPath);
    console.log(`📦 已加载原始字体: ${(fontBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (e) {
    console.error(`❌ 找不到原始字体文件: ${CONFIG.originalFontPath}`);
    process.exit(1);
  }

  // 2. 扫描所有文章提取文字
  console.log('🔍 正在扫描全站内容...');
  const files = await globby(['src/**/*.{md,mdx,astro,js,ts,tsx,vue}']);
  
  let allText = '';
  // 预置的基础字符（英文、数字、符号），确保代码块永远正常显示
  const baseChars = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{};':",./<>?\|` + "`~";
  allText += baseChars;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    // 先去掉 HTML 标签
    let cleanContent = content
      .replace(/<[^>]+>/g, '')      
      .replace(/https?:\/\/[^\s]+/g, '');

    // 解码 HTML 实体
    cleanContent = he.decode(cleanContent);
    // 累加文本内容
    allText += cleanContent;
  }

  // 去重，虽然 subset-font 内部也会处理，但这样能让我们看到真实的字符数
  const uniqueChars = Array.from(new Set(allText)).join('');
  console.log(`📝 提取完成，共 ${uniqueChars.length} 个不重复字符`);

  // 3. 执行压缩 (生成 WOFF2)
  console.log('⚖️  正在进行 HarfBuzz 智能子集化...');
  const subsetBuffer = await subsetFont(fontBuffer, uniqueChars, {
    targetFormat: 'woff2',
  });

  // 4. 写入文件
  // 确保输出目录存在
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  
  const outputPath = path.join(CONFIG.outputDir, `${CONFIG.outputName}.woff2`);
  await fs.writeFile(outputPath, subsetBuffer);

  // 计算压缩率
  const originalSize = fontBuffer.length;
  const newSize = subsetBuffer.length;
  const ratio = ((1 - newSize / originalSize) * 100).toFixed(2);

  console.log(`\n🎉 压缩成功！`);
  console.log(`📂 输出文件: ${outputPath}`);
  console.log(`📉 体积变化: ${(originalSize / 1024).toFixed(2)}KB -> ${(newSize / 1024).toFixed(2)}KB`);
  console.log(`🚀 压缩率: ${ratio}%`);
}

main().catch(err => {
  console.error('❌ 运行出错:', err);
  process.exit(1);
});