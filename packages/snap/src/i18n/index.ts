/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/match-description */
export const locales: { [lang: string]: { [key: string]: string } } = {
  en: {
    getPublickey: 'Get public key',
    getPublickeyTips: 'wants to get the wallet public key, is it allowed?',
    transactionSignature: 'Transaction Signature',
    signatureContent: 'Signature content',
    signatureContentTips:
      'This action will not be used to submit transactions, but to confirm that you have ownership of the current account.',
    updateAuthTips:
      'After the permissions are updated, you may lose ownership of the account and assets. Please check carefully and operate with caution!',
  },
  zh_CN: {
    getPublickey: '获取公钥',
    getPublickeyTips: '想获取钱包公钥，是否允许？',
    transactionSignature: '交易签名',
    signatureContent: '签名内容',
    signatureContentTips:
      '此操作不会用于提交交易，而是确认您拥有当前帐户的所有权。',
    updateAuthTips:
      '权限更新后，可能会导致您失去该账户所有权和资产所有权, 请一定仔细核对，并谨慎操作',
  },
};

/**
 * get locale by key
 *
 * @param key
 * @returns string
 */
export async function getLocale() {
  let lang: string;
  try {
    lang = await snap.request({ method: 'snap_getLocale' });
  } catch (e) {
    lang = 'en';
  }

  return (key: string): string => {
    return locales[lang] ? locales[lang][key] : locales.en[key];
  };
}
