// [fork] MoneyForward への書き込み系操作（カテゴリ変更など）の既定無効化ガード。
// 既定では全ての書き込みを拒否し、MF_ENABLE_WRITES=1 を設定した時だけ許可する。
// 本番データを誤って書き換えないための封じ込め。上流には存在しない新規ファイル。
const forkEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

/** 書き込み系操作が許可されているか（既定: false） */
export function isMfWritesEnabled(): boolean {
  return forkEnv.MF_ENABLE_WRITES === "1";
}

/** 書き込み系操作の実行前ガード。無効時は例外を投げる。 */
export function assertMfWritesEnabled(action: string): void {
  if (!isMfWritesEnabled()) {
    throw new Error(
      `[fork] MF書き込み操作は既定で無効です (action=${action}). ` +
        "許可する場合は環境変数 MF_ENABLE_WRITES=1 を設定してください.",
    );
  }
}
