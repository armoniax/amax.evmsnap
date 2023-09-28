import { Api, JsonRpc } from '@amax/amaxjs-v2';
import { JsSignatureProvider } from '@amax/amaxjs-v2/dist/eosjs-jssig';

export function getRpc() {
  const rpc = 'https://test-chain.ambt.art';
  const api = new JsonRpc(rpc, { fetch });
  return { rpc: api, rpcUrl: rpc };
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
