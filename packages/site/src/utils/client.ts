import { Api, JsonRpc } from '@amax/amaxjs-v2';
import { JsSignatureProvider } from '@amax/amaxjs-v2/dist/eosjs-jssig';

export const network = 'https://chain.amaxtest.com';
export function getRpc() {
  const api = new JsonRpc(network, { fetch });
  return { rpc: api, rpcUrl: network };
}

export async function getClient(): Promise<{
  api: Api;
  rpc: JsonRpc;
  signatureProvider: JsSignatureProvider;
}> {
  const { rpc } = await getRpc();
  const signatureProvider = new JsSignatureProvider([]);
  const api = new Api({ rpc, signatureProvider });
  return { api, rpc, signatureProvider };
}
