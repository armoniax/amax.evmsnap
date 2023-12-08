declare interface KeyPair {
  privateKey: string;
  publicKey: string;
}

declare interface Authorization {
  actor: string;
  permission: string;
}
declare interface Action {
  account: string;
  name: string;
  authorization: Authorization[];
  data: any;
  hex_data?: string;
}

declare interface SignMessageParams {
  message: string;
  path: number;
}
declare interface SignTransactionParams {
  actions: Action[];
  network: string;
  path: number;
  transactConfig: {
    broadcast?: boolean;
    sign?: boolean;
    readOnlyTrx?: boolean;
    returnFailureTraces?: boolean;
    requiredKeys?: string[];
    compression?: boolean;
    blocksBehind?: number;
    useLastIrreversible?: boolean;
    expireSeconds?: number;
  };
}

declare interface GetAccountsParams {
  paths: number[];
}

declare interface PublicKeys {
  [key: number]: string;
}
