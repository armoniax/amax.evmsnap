import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { METHOD_NOT_FOUND } from './utils/error';
import { getAccounts, signTransaction, signMessage } from './rpc';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'getAccounts':
      return getAccounts(
        origin,
        request.params as unknown as GetAccountsParams,
      );
    case 'signTransaction':
      return signTransaction(
        request.params as unknown as SignTransactionParams,
      );

    case 'signMessage':
      return signMessage(request.params as unknown as SignMessageParams);

    default:
      throw new Error(METHOD_NOT_FOUND);
  }
};
