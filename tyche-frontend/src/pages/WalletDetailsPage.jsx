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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [txData, tokenData, nftData] = await Promise.all([
          getAddressTransactions(network, address),
          getAddressTokens(network, address),
          getAddressNFTs(network, address),
        ]);

        setTransactions(txData.data?.[0]?.transactionList || []);
        setTokens(tokenData.data?.[0]?.tokens || []);
        setNfts(nftData.data?.[0]?.nfts || []);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        setError("Failed to fetch blockchain data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [network, address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
