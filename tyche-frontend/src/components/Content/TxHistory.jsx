import PropTypes from "prop-types";
import TxCard from "./TxCard";

function TxHistory({ transactions }) {
  return (
    <div className="tx-history">
      <h2 className="text-xl font-bold text-tycheBlue mb-4">
        Transaction History
      </h2>
      <div>
        {transactions.map((tx, index) => (
          <TxCard key={index} tx={tx} />
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
};

export default TxHistory;
