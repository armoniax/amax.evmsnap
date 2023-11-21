import { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { notification, Spin, Space, Alert } from 'antd';
import { GetAccountResult } from '@amax/amaxjs-v2/dist/eosjs-rpc-interfaces';
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
import { getClient, getRpc, network } from '../utils/client';

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
  const [api, contextHolder] = notification.useNotification();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;
  const [loading, setLoading] = useState(false);
  const [getAccountLoading, setGetAccountLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<GetAccountResult>();
  const [publicKeys, setPublicKeys] = useState<{ [path: number]: string }>();
  const [currentPath, setCurrentPath] = useState<number>();
  const [result, setResult] = useState<any>();
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
      setLoading(true);
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
      setPublicKeys(accounts as { [path: number]: string });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getAccount = async (path: number, publicKey: string) => {
    try {
      setGetAccountLoading(true);
      const { rpc } = getRpc();
      setCurrentPath(path);
      const { accounts } = await rpc.get_accounts_by_authorizers(
        [],
        [publicKey],
      );
      const account = accounts[0];
      if (account) {
        const info = await rpc.get_account(account.account_name);
        setAccountInfo(info);
        api.success({
          message: `帐号信息`,
          description: <pre>{JSON.stringify(info, null, 4)}</pre>,
        });
      } else {
        setAccountInfo(undefined);
        api.error({
          message: `Error`,
          description: '帐号未激活',
        });
      }
    } catch (e) {
      throw e;
    } finally {
      setGetAccountLoading(false);
    }
  };

  const transfer = async () => {
    if (!accountInfo) {
      return api.error({
        message: `Error`,
        description: '帐号未激活',
      });
    }

    const actions = [
      {
        account: 'amax.token',
        name: 'transfer',
        data: {
          from: accountInfo?.account_name,
          to: 'testuser2222',
          quantity: '0.00100000 AMAX',
          memo: '',
        },
        authorization: [
          {
            actor: accountInfo?.account_name,
            permission: 'active',
          },
        ],
      },
      {
        account: 'amax.token',
        name: 'transfer',
        data: {
          from: accountInfo?.account_name,
          to: 'testuser2222',
          quantity: '0.00100000 AMAX',
          memo: '',
        },
        authorization: [
          {
            actor: accountInfo?.account_name,
            permission: 'active',
          },
        ],
      },
    ];

    // const { api } = await getClient();
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

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const result: any = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'signTransaction',
          params: {
            actions,
            network,
            path: currentPath,
          },
        },
      },
    });

    // 只能传常规数组，Uint8Array将被转为伪数组，所以此处要返转回来
    // sign.serializedTransaction = Uint8Array.from(
    //   Object.values(sign.serializedTransaction),
    // );
    setResult(result);
    // console.log('result', result);
    // const a = await api.pushSignedTransaction(sign);
    // console.log(a);
  };

  const signMessage = async () => {
    if (!accountInfo) {
      return api.error({
        message: `Error`,
        description: '帐号未激活',
      });
    }
    const sign: any = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'signMessage',
          params: {
            message: 'displayed message! [hidden messages]() extra message',
            path: currentPath,
          },
        },
      },
    });
    setResult(sign);
  };
  return (
    <Container>
      {contextHolder}
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
        <Spin spinning={loading}>
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
        </Spin>
        {publicKeys ? (
          <Spin spinning={getAccountLoading}>
            <Notice>
              {publicKeys ? (
                <div>
                  <div style={{ margin: '20px 0' }}>选择一个publicKey</div>
                  {Object.entries(publicKeys).map(([path, publicKey]) => (
                    <div
                      key={publicKey}
                      style={{
                        margin: '10px',
                        cursor: 'pointer',
                        color:
                          currentPath === Number(path) ? '#FFF' : '#24272A',
                        background:
                          currentPath === Number(path) ? '#1677ff' : '#FFF',
                        border: '1px solid #CCC',
                        padding: '10px',
                        borderRadius: '6px',
                      }}
                      onClick={() => getAccount(Number(path), publicKey)}
                    >
                      <div>路径：{path}</div>
                      <div>公钥：{publicKey}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Notice>
          </Spin>
        ) : null}
        {currentPath !== undefined && accountInfo ? (
          <Notice>
            <Space direction="vertical">
              <Alert
                message={
                  <div>
                    <div>当前选择的帐号: {accountInfo.account_name}</div>
                    <div>当前广播的网络: {network}</div>
                  </div>
                }
                type="success"
              />
              <Space>
                <Button onClick={transfer} style={{ float: 'left' }}>
                  Transfer
                </Button>
                <Button onClick={signMessage}>Sign Message</Button>
              </Space>
              <Alert
                message="Transfer: 用当前选中的帐号向testuser2222划转0.00100000 AMAX"
                type="info"
              />
              <Alert
                message="Sign Message: 签名[签名内容，这就是一个字符串]这个字符串"
                type="info"
              />
            </Space>
          </Notice>
        ) : null}

        {result && currentPath !== undefined && accountInfo ? (
          <Notice>
            <pre>{JSON.stringify(result, null, 4)}</pre>
          </Notice>
        ) : null}
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
