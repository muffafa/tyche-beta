import TxHistory from "../components/Content/TxHistory";
import Portfolio from "../components/Content/Portfolio";
import DAppList from "../components/Content/DAppList";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function WalletDetailsPage() {
  const { network, address } = useParams();

  // Örnek mock veriler
  const mockTransactions = [
    {
      date: "2024-08-30",
      hash: "0x123456...",
      from: "0xABC...",
      to: "0xDEF...",
      amount: "1.5",
      symbol: "ETH",
    },
    {
      date: "2024-08-31",
      hash: "0x789101...",
      from: "0xABC...",
      to: "0xGHI...",
      amount: "0.8",
      symbol: "ETH",
    },
  ];

  console.log("Network:", network);
  console.log("Address:", address);

  const settings = useSelector((state) => state.settings);

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
      <Portfolio />
      <TxHistory transactions={mockTransactions} />
      <DAppList network={network} />
    </div>
  );
}

export default WalletDetailsPage;
