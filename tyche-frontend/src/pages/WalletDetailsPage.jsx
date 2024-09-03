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

        // Fetch transactions, tokens, and NFTs data concurrently
        const [txData, tokenData, nftData] = await Promise.all([
          getAddressTransactions(network, address),
          getAddressTokens(network, address),
          getAddressNFTs(network, address),
        ]);

        setTransactions(txData.data?.[0]?.transactionList || []);
        setTokens(tokenData.data?.[0]?.tokenList || []);
        setNfts(nftData.data?.[0]?.tokenList || []);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        setError("Failed to fetch blockchain data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [network, address]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white text-center">
        <h1 className="text-2xl font-semibold">
          Wallet Details for {address} on {network}
        </h1>
      </header>

      <main className="flex-grow container mx-auto p-4 grid grid-cols-12 gap-4">
        {loading ? (
          <div className="col-span-12 text-center">
            <p className="text-lg font-semibold mb-4">Loading...</p>
          </div>
        ) : error ? (
          <div className="col-span-12 text-center">
            <p className="text-lg font-semibold text-red-500 mb-4">{error}</p>
          </div>
        ) : (
          <>
            <div className="lg:col-span-4 col-span-12 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold">Account Details</h2>
                <p>Current Currency: {settings.currency}</p>
                <p>Current Timezone: {settings.timezone}</p>
              </div>
              <Portfolio tokens={tokens} nfts={nfts} network={network} />
              <DAppList network={network} />
            </div>
            <div className="lg:col-span-8 col-span-12">
              <TxHistory transactions={transactions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WalletDetailsPage;
