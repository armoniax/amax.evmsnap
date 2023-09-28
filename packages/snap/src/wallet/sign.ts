/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/match-description */
import {
  PushTransactionArgs,
  ReadOnlyTransactResult,
} from '@amax/amaxjs-v2/dist/eosjs-rpc-interfaces';
import {
  TransactConfig,
  TransactResult,
} from '@amax/amaxjs-v2/dist/eosjs-api-interfaces';
import { PrivateKey } from '@amax/amaxjs-v2/dist/PrivateKey';
import getKeyPairByPath from './getKeyPairByPath';
import getClient from './getClient';

/**
 * sign transaction
 *
 * @param path - derive path last number
 * @param network - rpc url
 * @param actions - network id
 * @param transactConfig - config
 * @returns signature string
 */
export async function signTransaction(
  actions: any,
  network: string,
  path: number,
  transactConfig: TransactConfig,
): Promise<PushTransactionArgs | TransactResult | ReadOnlyTransactResult> {
  const keyPair = await getKeyPairByPath(path);
  const { api } = await getClient(network, keyPair.privateKey);
  const transaction = await api.transact(
    {
      actions,
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
      sign: true,
      ...transactConfig,
      broadcast: !transactConfig?.broadcast,
    },
  );
  return transaction;
}

/**
 * sign message
 *
 * @param path - derive path last number
 * @param message - sign content
 * @returns signature string
 */
export async function signMessage(
  message: string,
  path: number,
): Promise<string> {
  const keyPair = await getKeyPairByPath(path);
  const KPriv = PrivateKey.fromString(keyPair.privateKey);
  return KPriv.sign(message, true).toString();
}
