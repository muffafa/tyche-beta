import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";

function TxCard({ tx }) {
  return (
    <div className="tx-card bg-white p-4 mb-2 rounded shadow">
      <p>
        <strong>Date:</strong> {tx.date}
      </p>
      <p>
        <strong>Tx Hash:</strong> {shortenAddress(tx.hash)}
      </p>
      <p>
        <strong>From:</strong> {shortenAddress(tx.from)}
      </p>
      <p>
        <strong>To:</strong> {shortenAddress(tx.to)}
      </p>
      <p>
        <strong>Amount:</strong> {tx.amount} {tx.symbol}
      </p>
    </div>
  );
}

TxCard.propTypes = {
  tx: PropTypes.shape({
    date: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
  }).isRequired,
};

export default TxCard;
