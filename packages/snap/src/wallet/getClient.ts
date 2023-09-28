/* eslint-disable jsdoc/match-description */
import { Api, JsonRpc } from '@amax/amaxjs-v2';
import { JsSignatureProvider } from '@amax/amaxjs-v2/dist/eosjs-jssig';

/**
 * get client
 *
 * @param network - rpc url
 * @param privateKey - privateKey
 */
export default async function getClient(network: string, privateKey: string) {
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const rpc = new JsonRpc(network, { fetch });
  const api = new Api({ rpc, signatureProvider });
  return { api, signatureProvider, rpc };
}
