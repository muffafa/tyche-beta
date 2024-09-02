import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";

function useWalletConnect() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (address) {
      setIsConnected(true);
    }
  }, [address]);

  const connectWallet = () => {
    connect(connectors[0]);
  };

  return { isConnected, connectWallet, address };
}

export default useWalletConnect;
