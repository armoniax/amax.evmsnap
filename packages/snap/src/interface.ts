export type GetAccounts = {
  method: 'getAccounts';
  params: GetAccountsParams;
};

export type SignMessage = {
  method: 'signMessage';
  params: SignMessageParams;
};

export type SignTransaction = {
  method: 'signTransaction';
  params: SignTransactionParams;
};

export type Snap = {
  registerRpcMessageHandler: (fn: MethodCallback) => unknown;
  request<T>(options: {
    method: string;
    params?: unknown[] | Record<string, any>;
  }): Promise<T>;
};

export type MethodCallback = (
  originString: string,
  requestObject: MetamaskRpcRequest,
) => Promise<unknown>;

export type MetamaskRpcRequest = GetAccounts | SignTransaction | SignMessage;
