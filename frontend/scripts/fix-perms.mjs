import fs from "node:fs";
import path from "node:path";

const candidates = [
  "node_modules/.bin/vite",
  "node_modules/.bin/esbuild",
  "node_modules/esbuild/bin/esbuild",
  "node_modules/@esbuild/linux-x64/bin/esbuild",
  "node_modules/@esbuild/linux-arm64/bin/esbuild",
];

for (const rel of candidates) {
  const p = path.resolve(process.cwd(), rel);
  try {
    if (fs.existsSync(p)) {
      fs.chmodSync(p, 0o755);
      console.log(`[fix-perms] chmod 755 ${rel}`);
    }
  } catch (e) {
    console.log(`[fix-perms] skip ${rel}: ${e?.message || e}`);
  }
}
