import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";
import { convertTimestampToTimezone } from "../../utils/convertTimestampToTimezone";
import { useSelector } from "react-redux";

function TxCard({ tx }) {
  const settings = useSelector((state) => state.settings);
  const formattedTime = convertTimestampToTimezone(
    tx.transactionTime,
    settings.timezone
  );

  return (
    <div className="tx-card bg-white p-4 mb-2 rounded shadow">
      <p>
        <strong>Date:</strong> {formattedTime}
      </p>
      <p>
        <strong>Tx Hash:</strong> {shortenAddress(tx.txId)}
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
    transactionTime: PropTypes.string.isRequired,
    txId: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
  }).isRequired,
};

export default TxCard;
