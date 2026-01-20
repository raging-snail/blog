import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import subsetFont from 'subset-font';
import he from 'he';



const CONFIG = {
  fontDir: 'public/fonts',
  outputDir: 'dist/fonts',
};

async function compressFont(fontFile, allText) {
  const fontName = path.basename(fontFile, path.extname(fontFile));
  console.log(`\n📦 处理字体: ${fontName}`);

  let fontBuffer;
  try {
    fontBuffer = await fs.readFile(fontFile);
    console.log(`   原始大小: ${(fontBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (e) {
    console.error(`❌ 读取不到字体文件: ${fontFile}`);
    return;
  }

  console.log('   ⚖️  正在进行 HarfBuzz 智能子集化...');
  const subsetBuffer = await subsetFont(fontBuffer, allText, {
    targetFormat: 'woff2',
  });

  const outputPath = path.join(CONFIG.outputDir, `${fontName}.woff2`);
  await fs.writeFile(outputPath, subsetBuffer);

  const originalSize = fontBuffer.length;
  const newSize = subsetBuffer.length;
  const ratio = ((1 - newSize / originalSize) * 100).toFixed(2);

  console.log(`   🎉 压缩成功 -> ${outputPath}`);
  console.log(`   📉 ${(originalSize / 1024).toFixed(2)}KB -> ${(newSize / 1024).toFixed(2)}KB (节省 ${ratio}%)`);
}

async function main() {
  console.log('🚀 开始批量字体压缩流程...');

  // 1. 扫描所有文章提取文字
  console.log('🔍 正在扫描全站内容...');
  const files = await globby(['src/**/*.{md,mdx,astro,js,ts,tsx,vue}']);

  let allText = '';
  // 预置的基础字符（英文、数字、符号）
  const baseChars = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{};':",./<>?\|` + "`~";
  allText += baseChars;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    // 先去掉 HTML 标签 (只匹配以字母开头的标签，避免 c<10 这种被误删)
    let cleanContent = content
      .replace(/<\/?\s*[a-zA-Z][^>]*>/g, '')
      .replace(/https?:\/\/[^\s]+/g, '');

    // 解码 HTML 实体
    cleanContent = he.decode(cleanContent);
    // 累加文本内容
    allText += cleanContent;
  }

  // 去重
  const uniqueChars = Array.from(new Set(allText)).join('');
  console.log(`📝 内容扫描完成，共 ${uniqueChars.length} 个不重复字符`);

  // 2. 准备输出目录
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // 3. 查找所有字体文件
  const fontFiles = await globby([`${CONFIG.fontDir}/*.{ttf,otf}`]);
  if (fontFiles.length === 0) {
    console.warn('⚠️  未找到任何 .ttf 或 .otf 字体文件');
    return;
  }

  // 4. 遍历压缩
  for (const fontFile of fontFiles) {
    await compressFont(fontFile, uniqueChars);
  }

  console.log('\n✅ 所有字体压缩完成！');
}

main().catch(err => {
  console.error('❌ 运行出错:', err);
  process.exit(1);
});