/* eslint-disable jsdoc/match-description */
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { amaxCoinType } from '../config';
import getAmaxKeyPair from './getAmaxKeyPair';

/**
 * get public keys from derive path
 *
 * @param index - derive path last number
 * @returns KeyPair
 */
export default async function getKeyPairByPath(
  index: number,
): Promise<KeyPair> {
  const node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: amaxCoinType,
    },
  });
  const deriveAddress = await getBIP44AddressKeyDeriver(node);
  const account = await deriveAddress(index);

  const keyPair = getAmaxKeyPair(account.privateKey as string);

  return keyPair;
}
