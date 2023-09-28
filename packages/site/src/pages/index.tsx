import { useContext } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  Button,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { getClient, getRpc } from '../utils/client';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const getAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'getAccounts',
            params: { paths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100] },
          },
        },
      });
      dispatch({
        type: MetamaskActions.UpdateState,
        payload: { publicKeys: accounts },
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const getAccount = async (path: number, publicKey: string) => {
    const { rpc } = getRpc();
    const { accounts } = await rpc.get_accounts_by_authorizers([], [publicKey]);
    const account = accounts[0];
    if (account) {
      const info = await rpc.get_account(account.account_name);
      dispatch({
        type: MetamaskActions.UpdateState,
        payload: { account: info, path },
      });
    } else {
      dispatch({
        type: MetamaskActions.UpdateState,
        payload: { account: undefined, path: undefined },
      });
    }
    console.log(accounts);
  };

  const transfer = async () => {
    const { rpcUrl } = getRpc();
    const actions = [
      {
        account: 'amax.token',
        name: 'transfer',
        data: {
          from: 'testuser1121',
          to: 'testuser2222',
          quantity: '0.00100000 AMAX',
          memo: '',
        },
        authorization: [
          {
            actor: 'testuser1121',
            permission: 'active',
          },
        ],
      },
    ];

    const { api } = await getClient();
    // const transaction = await api.transact(
    //   {
    //     actions,
    //   },
    //   {
    //     blocksBehind: 3,
    //     expireSeconds: 30,
    //     broadcast: false,
    //     sign: false,
    //   },
    // );

    // console.log('transaction', transaction, api.cachedAbis);

    const result: any = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'signTransaction',
          params: {
            actions,
            network: rpcUrl,
            path: state.path,
          },
        },
      },
    });

    // 只能传常规数组，Uint8Array将被转为伪数组，所以此处要返转回来
    // sign.serializedTransaction = Uint8Array.from(
    //   Object.values(sign.serializedTransaction),
    // );
    dispatch({
      type: MetamaskActions.UpdateState,
      payload: { result },
    });
    console.log('result', result);
    // const a = await api.pushSignedTransaction(sign);
    // console.log(a);
  };

  const signMessage = async () => {
    const sign: any = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'signMessage',
          params: {
            message: '签名内容，这就是一个字符串',
            path: state.path,
          },
        },
      },
    });
    console.log('sign', sign);
  };
  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: '获取帐户',
            description: '根据path获取公钥',
            button: (
              <Button onClick={getAccounts} disabled={!state.installedSnap}>
                getAccounts
              </Button>
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Notice>
          <div>
            {state.publicKeys &&
              Object.entries(state.publicKeys).map(([path, publicKey]) => (
                <div
                  key={publicKey}
                  style={{ margin: '10px', cursor: 'pointer' }}
                  onClick={() => getAccount(path, publicKey)}
                >
                  {path} : {publicKey}
                </div>
              ))}
          </div>
        </Notice>
        <Notice>
          <Button onClick={transfer} style={{ float: 'left' }}>
            Transfer
          </Button>
          <Button onClick={signMessage}>Sign Message</Button>
          {state.result ? (
            <pre>
              <pre>{JSON.stringify(state.result, null, 4)}</pre>
            </pre>
          ) : null}
          <pre>
            {state.account ? (
              JSON.stringify(state.account, null, 4)
            ) : (
              <p style={{ color: 'red' }}>未激活</p>
            )}
          </pre>
        </Notice>
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
