import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";
import { convertTimestampToTimezone } from "../../utils/convertTimestampToTimezone";
import { useSelector } from "react-redux";

const ETH_TO_USD = 3402.5; // Replace with the current ETH/USD rate
const USD_TO_TRY = 32.81; // Replace with the current USD/TRY rate

function TxCard({ tx, currentAddress }) {
  const settings = useSelector((state) => state.settings);
  const formattedTime = convertTimestampToTimezone(
    tx.transactionTime,
    settings.timezone
  );

  // console.log(tx);

  const formatEthValue = (value) => {
    const ethValue = parseFloat(value) / 10 ** 18;
    return ethValue.toFixed(6);
  };

  const calculateTryValue = (ethValue) => {
    const ethAmount = parseFloat(ethValue) / 10 ** 18;
    const usdValue = ethAmount * ETH_TO_USD;
    const tryValue = usdValue * USD_TO_TRY;
    return tryValue.toFixed(2);
  };

  return (
    <div
      className={`grid grid-cols-3 items-center bg-white rounded p-4 shadow-md ${
        tx.to === currentAddress ? "bg-tycheGreen" : "bg-tycheRed"
      }`}
    >
      <div>
        <p className="text-lg font-semibold">
          {formattedTime.split(" ").slice(0, 3).join(" ")}
        </p>
        <p className="text-sm text-tycheGray">{formattedTime.split(" ")[3]}</p>
        <p className="text-tycheBlue">{shortenAddress(tx.txId)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm">
          From:{" "}
          <span className="text-tycheBlue">{shortenAddress(tx.from)}</span>
        </p>
        <p className="text-sm">
          To: <span className="text-tycheBlue">{shortenAddress(tx.to)}</span>
        </p>
      </div>
      <div className="text-right p-2 rounded h-full flex flex-col justify-center">
        <p className="font-semibold">Amount: {formatEthValue(tx.amount)} ETH</p>
        <p>Value: {calculateTryValue(tx.amount)} TRY</p>
      </div>
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
  currentNetwork: PropTypes.string.isRequired,
  currentAddress: PropTypes.string.isRequired,
};

export default TxCard;
