#!/usr/bin/env node
// [fork] 静的書き出し(out/)のトップページへ「最終更新」バナーを差し込む post-build スクリプト。
// 使い方: node scripts/stamp-freshness.mjs [outDir] [dbPath]
//   outDir : Next.js static export の出力先 (既定: apps/web/out)
//   dbPath : SQLite (既定: data/mf.db) — 最新スナップショット日を表示に使う
// 上流ファイルは一切改変しない（ビルド後に生成物へ差し込む新規スクリプト）。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const outDir = process.argv[2] ?? "apps/web/out";
const dbPath = process.argv[3] ?? "data/mf.db";
const pad = (n) => String(n).padStart(2, "0");
const stampJST = new Date(Date.now() + 9 * 3600e3).toISOString().replace("T", " ").slice(0, 16);

let dataDate = "";
try {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const row = db.prepare("SELECT MAX(date) AS d FROM daily_snapshots").get();
  dataDate = row?.d ?? "";
  db.close();
} catch {
  // DBが読めなくても生成日時だけは表示する
}

const banner =
  '<div id="fork-freshness" style="position:fixed;bottom:8px;right:8px;z-index:9999;' +
  "background:rgba(20,20,20,.82);color:#fff;font:12px/1.6 sans-serif;padding:6px 10px;" +
  'border-radius:6px;">最終更新: ' + stampJST + " JST" +
  (dataDate ? "（データ日: " + dataDate + "）" : "") + "</div>";

const indexHtml = join(outDir, "index.html");
if (!existsSync(indexHtml)) {
  console.error("index.html not found under " + outDir);
  process.exit(1);
}
let html = readFileSync(indexHtml, "utf8");
html = html.replace(/<div id="fork-freshness"[\s\S]*?<\/div>/, ""); // 二重挿入防止
html = html.replace("</body>", banner + "</body>");
writeFileSync(indexHtml, html);
console.log("freshness stamped:", stampJST, "data:", dataDate || "n/a");
