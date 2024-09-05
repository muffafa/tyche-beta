import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TxHistory from "../components/Content/TxHistory";
import Portfolio from "../components/Content/Portfolio";
import DAppList from "../components/Content/DAppList";
import shortenAddress from "../utils/shortenAddress";
import {
  getAddressTransactions2,
  getAddressTokens,
  getAddressNFTs,
} from "../utils/api";
import { setNetwork, setWalletAddress } from "../redux/slices/globalSlice";
import { getSupportedNetworks } from "../utils/NetworkManager";
import NotFound from "./NotFound"; // Import the 404 component

function WalletDetailsPage() {
  const { network, address } = useParams();
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = useSelector((state) => state.settings);

  // Check if the network is supported
  const supportedNetworks = getSupportedNetworks();
  const isNetworkSupported = supportedNetworks.includes(network.toLowerCase());

  useEffect(() => {
    if (!isNetworkSupported) {
      return; // Early exit if network is not supported
    }

    // Initialize global state with URL params
    dispatch(setNetwork(network));
    dispatch(setWalletAddress(address));

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch transactions, tokens, and NFTs data concurrently
        const [txData, tokenData, nftData] = await Promise.all([
          getAddressTransactions2(network, address),
          getAddressTokens(network, address),
          getAddressNFTs(network, address),
        ]);

        setTransactions(txData.data? txData.data : []);
        console.log("txData", txData.data);
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
  }, [network, address, dispatch, isNetworkSupported]);

  // Render 404 page if network is not supported
  if (!isNetworkSupported) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white text-center">
        <h1 className="text-2xl font-semibold">
          Wallet Details for {shortenAddress(address)} on {network}
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
              <TxHistory
                transactions={transactions}
                currentNetwork={network}
                currentAddress={address}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WalletDetailsPage;
