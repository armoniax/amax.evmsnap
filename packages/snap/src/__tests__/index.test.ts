/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jest/no-mocks-import */
import { expect } from '@jest/globals';
import { SnapMock } from '../__mocks__';
import { getAccounts } from '../rpc';
import { onRpcRequest } from '..';

jest.mock('../rpc', () => {
  return {
    getAccounts: jest.fn(),
    signMessage: jest.fn(),
    signTransaction: jest.fn(),
  };
});

const snap = new SnapMock();
const origin = 'https://amaxup.amaxtest.com';

describe('onRpcRequest', () => {
  beforeAll(() => {
    (global as any).snap = snap;
  });

  afterAll(() => {
    delete (global as any).snap;
  });

  describe('rpc methods', function () {
    it('should call snap.getAccounts when method rpc.getAccounts get called', async () => {
      await onRpcRequest({
        origin,
        // @ts-ignore
        request: {
          method: 'getAccounts',
          params: {
            paths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100],
          },
        },
      });
      await expect(getAccounts).toHaveBeenCalled();
    });

    it('should call snap.signTransaction when method rpc.signTransaction get called', async () => {
      const actions = [
        {
          account: 'amax.token',
          name: 'transfer',
          data: {
            from: 'testuser1111',
            to: 'testuser2222',
            quantity: '0.00100000 AMAX',
            memo: '',
          },
          authorization: [
            {
              actor: 'testuser1111',
              permission: 'active',
            },
          ],
        },
      ];
      await onRpcRequest({
        origin: 'origin',
        // @ts-ignore
        request: {
          method: 'signTransaction',
          params: {
            actions,
            network: 'https://chain.amaxtest.com',
            path: 0,
          },
        },
      });
      await expect(getAccounts).toHaveBeenCalled();
    });

    it('should call snap.signMessage when method rpc.signMessage get called', async () => {
      await onRpcRequest({
        origin: 'origin',
        // @ts-ignore
        request: {
          method: 'signMessage',
          params: {
            path: 0,
            message: 'abc',
          },
        },
      });
      await expect(getAccounts).toHaveBeenCalled();
    });
  });
});
