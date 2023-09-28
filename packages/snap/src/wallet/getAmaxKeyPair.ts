/* eslint-disable jsdoc/match-description */
import ecc from '@amax/amaxjs-ecc';
import { hexToBuffer } from '../utils';

/**
 * get amax privateKey and publicKey from old privateKey
 *
 * @param privateKeyHex - privateKey hex
 * @returns KeyPair
 */
export default function getAmaxKeyPair(privateKeyHex: string): KeyPair {
  const privateKeyBuf = hexToBuffer(privateKeyHex);
  const privateKey = ecc.PrivateKey(privateKeyBuf).toString();
  const publicKey = ecc.privateToPublic(privateKey);
  return {
    privateKey,
    publicKey,
  };
}
