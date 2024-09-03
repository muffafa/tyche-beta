import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TxHistory from "../components/Content/TxHistory";
import Portfolio from "../components/Content/Portfolio";
import DAppList from "../components/Content/DAppList";
import {
  getAddressTransactions,
  getAddressTokens,
  getAddressNFTs,
} from "../utils/api";

function WalletDetailsPage() {
  const { network, address } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);

  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    async function fetchData() {
      try {
        const txData = await getAddressTransactions(network, address);
        const tokenData = await getAddressTokens(network, address);
        const nftData = await getAddressNFTs(network, address);

        setTransactions(txData.data);
        setTokens(tokenData.data);
        setNfts(nftData.data);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    }

    fetchData();
  }, [network, address]);

  return (
    <div className="wallet-details-page p-6">
      <div className="wallet-details-page">
        <h1>
          Wallet Details for {address} on {network}
        </h1>
        <div>
          <p>Current Currency: {settings.currency}</p>
          <p>Current Timezone: {settings.timezone}</p>
        </div>
      </div>
      <Portfolio tokens={tokens} nfts={nfts} />
      <TxHistory transactions={transactions} />
      <DAppList network={network} />
    </div>
  );
}

export default WalletDetailsPage;
