/* eslint-disable consistent-return */
/* eslint-disable jsdoc/match-description */
// eslint-disable-next-line jsdoc/require-returns
import { heading, panel } from '@metamask/snaps-ui';
import {
  PushTransactionArgs,
  ReadOnlyTransactResult,
} from '@amax/amaxjs-v2/dist/eosjs-rpc-interfaces';
import { TransactResult } from '@amax/amaxjs-v2/dist/eosjs-api-interfaces';
import confirm from '../utils/confirm';
import { getLocale } from '../i18n';
import { USER_CANCELED } from '../utils/error';
import { actionsUI } from '../utils/actionsUI';
import {
  signMessage as walletSignMessage,
  signTransaction as walletSignTransaction,
} from '../wallet/sign';
import getPublicKeys from '../wallet/getPublicKeys';

/**
 * getAccounts
 *
 * @param origin - string
 * @param params - GetAccountsParams
 * @returns PublicKeys
 */
export async function getAccounts(
  origin: string,
  params: GetAccountsParams,
): Promise<PublicKeys> {
  const locale = await getLocale();
  const isConfirm = await confirm({
    title: locale('getPublickey'),
    texts: [`**${origin}** ${locale('getPublickeyTips')}`],
  });
  if (isConfirm) {
    const { paths } = params;
    const publicKeys = await getPublicKeys(paths);
    return publicKeys;
  }
  throw new Error(USER_CANCELED);
}

/**
 * signTransaction
 *
 * @param params - SignTransactionParams
 * @returns PushTransactionArgs | TransactResult | ReadOnlyTransactResult
 */
export async function signTransaction(
  params: SignTransactionParams,
): Promise<PushTransactionArgs | TransactResult | ReadOnlyTransactResult> {
  const locale = await getLocale();
  const { actions, network, path, transactConfig } = params;
  const isConfirm = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(locale('transactionSignature')),
        ...actionsUI(actions, locale),
      ]),
    },
  });
  if (isConfirm) {
    return await walletSignTransaction(
      actions,
      network,
      Number(path),
      transactConfig,
    );
  }
  throw new Error(USER_CANCELED);
}

/**
 * signMessage
 *
 * @param params - SignMessageParams
 * @returns string
 */
export async function signMessage(params: SignMessageParams): Promise<string> {
  const locale = await getLocale();
  const { message, path } = params;
  const isConfirm = await confirm({
    title: locale('signatureContent'),
    texts: [
      { value: message, markdown: false },
      'divider',
      `_${locale('signatureContentTips')}_`,
    ],
  });
  if (isConfirm) {
    return await walletSignMessage(message, Number(path));
  }
  throw new Error(USER_CANCELED);
}
