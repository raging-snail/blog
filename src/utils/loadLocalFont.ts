import type { FontStyle, FontWeight } from "satori";
import { readFileSync } from "fs";

export type FontOptions = {
  name: string;
  data: Uint8Array;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

// 加载本地字体
async function loadLocalFont(fontPath: string): Promise<Uint8Array> {
  try {
    // 显式转成 Uint8Array，避免 Vercel 上 Buffer 类型冲突
    return new Uint8Array(readFileSync(fontPath));
  } catch (error) {
    throw new Error(`Failed to load local font: ${fontPath}`);
  }
}

async function loadLocalFonts(): Promise<
  Array<{ name: string; data: Uint8Array; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "MapleMono-NF-CN-Regular",
      path: "public/fonts/MapleMono-NF-CN-Regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      name: "MapleMono-NF-CN-Bold",
      path: "public/fonts/MapleMono-NF-CN-Bold.ttf",
      weight: 600,
      style: "normal",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, path, weight, style }) => {
      const data = await loadLocalFont(path);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadLocalFonts;