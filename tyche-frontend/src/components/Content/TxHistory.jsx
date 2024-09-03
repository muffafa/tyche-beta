import PropTypes from "prop-types";
import TxCard from "./TxCard";

function TxHistory({ transactions, currentNetwork, currentAddress }) {
  return (
    <div className="p-4 bg-tycheBeige shadow rounded col-span-8">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
      <div
        className={`space-y-4 ${
          transactions.length > 5
            ? "max-h-[578px] overflow-y-scroll"
            : "min-h-[578px]"
        }`}
      >
        {transactions.map((tx, index) => (
          <TxCard
            key={index}
            tx={tx}
            currentNetwork={currentNetwork}
            currentAddress={currentAddress}
          />
        ))}
      </div>
    </div>
  );
}

TxHistory.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionTime: PropTypes.string.isRequired,
      txId: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentNetwork: PropTypes.string.isRequired,
  currentAddress: PropTypes.string.isRequired,
};

export default TxHistory;
