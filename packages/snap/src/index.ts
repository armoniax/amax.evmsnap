import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel } from '@metamask/snaps-ui';
import { actionsUI } from './utils/actionsUI';
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
          title: 'Get public key',
          texts: [
            `**${origin}** wants to get the wallet public key, is it allowed?`,
          ],
        })
      ) {
        const { paths } = request.params as any;
        const publicKeys = await getPublicKeys(paths);
        return publicKeys;
      }
      throw new Error('User Canceled!');
    }

    case 'signTransaction': {
      const { actions, network, path, transactConfig } = request.params as any;
      if (
        await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'confirmation',
            content: panel([
              heading('Transaction Signature'),
              ...actionsUI(actions),
            ]),
          },
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
          title: 'Signature content',
          texts: [
            { value: message, markdown: false },
            'divider',
            '_This action will not be used to submit transactions, but to confirm that you have ownership of the current account._',
          ],
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
