import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
      if (!clientId) return;
      const instance = new Web3Auth({
        clientId,
        web3AuthNetwork: 'cyan',
        chainConfig: { chainNamespace: 'eip155', chainId: '0x1' },
      });
      await instance.initModal();
      setWeb3auth(instance);
      if (instance.provider) {
        const ethProvider = new ethers.BrowserProvider(instance.provider);
        const signer = await ethProvider.getSigner();
        setProvider(ethProvider);
        setAddress(await signer.getAddress());
      }
    };
    init();
  }, []);

  const connect = async () => {
    if (!web3auth) return;
    const web3Provider = await web3auth.connect();
    const ethProvider = new ethers.BrowserProvider(web3Provider);
    const signer = await ethProvider.getSigner();
    setProvider(ethProvider);
    setAddress(await signer.getAddress());
  };

  const disconnect = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setAddress(null);
  };

  const sendTransaction = async (to, amount) => {
    if (!provider) throw new Error('Wallet not connected');
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(String(amount)),
    });
    return tx.hash;
  };

  return (
    <WalletContext.Provider
      value={{ connect, disconnect, address, sendTransaction }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
