/* eslint-disable jsdoc/match-description */
import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { amaxCoinType } from '../config';
import getAmaxKeyPair from './getAmaxKeyPair';

/**
 * get public keys from derive path
 *
 * @param paths - derive path last number
 * @returns publicKeys
 */
export default async function getPublicKeys(
  paths?: number[],
): Promise<{ [key: number]: string }> {
  const node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: amaxCoinType,
    },
  });
  const deriveAddress = await getBIP44AddressKeyDeriver(node);

  if (!Array.isArray(paths)) {
    // eslint-disable-next-line no-param-reassign
    paths = [0];
  }
  const accounts: [number, BIP44Node][] = await Promise.all(
    paths.map(async (index) => [index, await deriveAddress(index)]),
  );

  const publicKeys = accounts.map(([path, account]) => {
    const keyPair = getAmaxKeyPair(account.privateKey as string);
    return [path, keyPair.publicKey];
  });

  return Object.fromEntries(publicKeys);
}
