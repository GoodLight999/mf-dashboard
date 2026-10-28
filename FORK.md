# FORK.md — GoodLight999/mf-dashboard（フォーク適応）

上流: https://github.com/hiroppy/mf-dashboard （MIT）。**改変は最小・新規ファイル追加優先。**

## 追加した設定（環境変数）

| 変数 | 既定 | 意味 |
|---|---|---|
| `MF_BASE_HOST` | `moneyforward.com` | ME本体の接続先ホスト。`mizuho.x.moneyforward.com` 等に切替可能。実装: `packages/meta/src/urls.ts` |
| `MF_ID_BASE_HOST` | `id.<MF_BASE_HOST>` | MFIDログインのホスト（みずほ版の実際のURL構造は実クロール時に要確認） |
| `MF_ENABLE_WRITES` | 無効 | `1` の時だけカテゴリ反映などの書き込み系を許可。ガード実装: `packages/meta/src/writes.ts`、適用箇所: `apps/crawler/src/category-decision/apply.ts` |
| `AI_BASE_URL` | 未設定 | LLMをOpenAI互換エンドポイントへ向ける（既存サブスク利用で課金0にする場合） |

URLは `packages/meta/src/urls.ts` の1ファイルに集約されているため、接続先の改修はそこだけで完結する。

## 運用（このリポジトリ外・/root/ops/moneyforward/）

- `bin/upstream-sync.sh` — 週次cronが `git fetch upstream` → 差分通知（Telegram）→ `--merge`で `merge --no-ff` + push。コンフリクト時は中断して通知。
- `bin/run-mf.sh <label> <cmd...>` — クロール実行ラッパー。**2回連続失敗でTelegram通知**（12時間スロットル）。TSUKUMO側のクロールcronはこれ経由で呼ぶ。
- `bin/mf-notify.sh` — Telegram通知（`hermes -p default send` 経由・トークンは置かない）。

## 静的配信構成（VPSは見せるだけ）

- 静的書き出しは上流内蔵の `build:demo`（`DEMO_MODE=true` → `output:"export"`、APIルート無効）を使用。
- ビルドはTSUKUMO側で実施し、生成物 `apps/web/out/` をSCP（`*.tmp` 経由で `mv` 原子置換）→ VPS nginxで配信。
- 鮮度表示: `scripts/stamp-freshness.mjs`（ビルド後に `out/index.html` へ「最終更新」バナーを差し込み）。
- 公開は Cloudflare Tunnel + Access（本人Googleアカウントのみ許可）。

## 課金ポリシー

LLMは `AI_PROVIDER`/`AI_MODEL`/`AI_API_KEY`（+本フォークの `AI_BASE_URL`）で指定。
既存のサブスク互換エンドポイントへ向ければ追加課金0。従量課金の直接利用はしない。
