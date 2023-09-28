import { OnRpcRequestHandler } from '@metamask/snaps-types';
import getPublicKeys from './wallet/getPublicKeys';
import confirm from './utils/confirm';
import { signMessage, signTransaction } from './wallet/sign';

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
    case 'getAccounts': {
      if (
        await confirm({
          title: '获取帐户',
          texts: [`${origin}想获取帐户`, '是否允许？'],
        })
      ) {
        const { paths } = request.params as any;
        const publicKeys = await getPublicKeys(paths);
        console.log('publicKeys', publicKeys);
        return publicKeys;
      }
      throw new Error('User Canceled!');
    }

    case 'signTransaction': {
      const { actions, network, path, transactConfig } = request.params as any;
      if (
        await confirm({
          title: '交易签名',
          texts: [JSON.stringify(actions, null, 4)],
        })
      ) {
        return await signTransaction(
          actions,
          network,
          Number(path),
          transactConfig,
        );
      }
      throw new Error('User Canceled!');
    }

    case 'signMessage': {
      const { message, path } = request.params as any;
      if (
        await confirm({
          title: '签名',
          texts: [message],
        })
      ) {
        return await signMessage(message, Number(path));
      }
      throw new Error('User Canceled!');
    }

    default:
      throw new Error('Method not found.');
  }
};
