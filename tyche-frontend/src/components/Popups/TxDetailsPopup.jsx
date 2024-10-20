import shortenAddress from "../../utils/shortenAddress";

function TxDetailsPopup({ tx, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container bg-tycheBeige p-6 rounded shadow-lg">
        <h2 className="text-tycheBlue font-bold mb-4">Transaction Details</h2>
        <div className="tx-details">
          <p>
            <strong>Date:</strong> {tx.date}
          </p>
          <p>
            <strong>Tx Hash:</strong> {tx.hash}
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
        <button
          className="mt-4 bg-tycheBlue text-white p-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TxDetailsPopup;
