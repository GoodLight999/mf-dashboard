// [fork] 接続先ホストを設定可能に（既定は上流と同一の moneyforward.com）。
// MF_BASE_HOST    : ME本体のホスト (例: moneyforward.com / mizuho.x.moneyforward.com)
// MF_ID_BASE_HOST : MFIDログインのホスト (未指定時は id.<MF_BASE_HOST>)
const forkEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const MF_BASE_HOST = forkEnv.MF_BASE_HOST || "moneyforward.com";
const ID_BASE_HOST = forkEnv.MF_ID_BASE_HOST || `id.${MF_BASE_HOST}`;
const BASE_URL = `https://${MF_BASE_HOST}`;
const ID_BASE_URL = `https://${ID_BASE_HOST}`;

export const mfUrls = {
  /** トップページ */
  home: `${BASE_URL}/`,
  /** 家計簿（収支詳細） */
  cashFlow: `${BASE_URL}/cf`,
  /** 家計簿（月次収支） */
  monthlyCashFlow: `${BASE_URL}/cf/monthly`,
  /** 資産推移 */
  assetHistory: `${BASE_URL}/bs/history`,
  /** ポートフォリオ */
  portfolio: `${BASE_URL}/bs/portfolio`,
  /** 負債 */
  liability: `${BASE_URL}/bs/liability`,
  /** 口座一覧 */
  accounts: `${BASE_URL}/accounts`,
  /** 予算 */
  spendingTargets: `${BASE_URL}/spending_targets/edit`,
  /** カテゴリ設定 */
  categoryRules: `${BASE_URL}/profile/rule`,
  /** ME ログイン */
  signIn: `${BASE_URL}/sign_in`,

  auth: {
    /** MFID ログインページ */
    signIn: `${ID_BASE_URL}/sign_in`,
    /** MFID パスワード入力ページ */
    password: `${ID_BASE_URL}/sign_in/password`,
  },

  /** 口座詳細ページURL を生成 */
  accountDetail(mfId: string, type: "show" | "show_manual" = "show"): string {
    return `${BASE_URL}/accounts/${type}/${mfId}`;
  },
} as const;
