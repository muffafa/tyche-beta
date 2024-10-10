import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";
import { convertTimestampToTimezone } from "../../utils/convertTimestampToTimezone";
import { useSelector } from "react-redux";
import outgoingIcon from "./../../assets/images/icons/outgoingIcon.svg";
import incomingIcon from "./../../assets/images/icons/incomingIcon.svg";

const ETH_TO_USD = 3402.5; // Replace with the current ETH/USD rate

function TxCard({ tx, currentAddress }) {
  const settings = useSelector((state) => state.settings);

  const formattedTime = convertTimestampToTimezone(
    tx.transactionTime,
    settings.timezone
  );

  function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(3);
  }

  let symbol = tx.attributes.transfers?.[0]?.fungible_info?.symbol;
  let value = tx.attributes.transfers?.[0]?.value;
  let amount = tx.attributes.transfers?.[0]?.quantity?.float;

  // Ensure icon is a string or provide a fallback value
  let icon = tx.attributes.transfers?.[0]?.fungible_info?.icon;
  if (typeof icon !== "string") {
    icon = "default-icon-url"; // Fallback to a default icon URL if icon is not a string
  }

  if (symbol === undefined || symbol === null) {
    symbol = "ETH";
  }

  if (amount === undefined || amount === null) {
    const randomFloat = getRandomFloat(0.1, 5.0);
    amount = randomFloat;
  }

  if (value === undefined || value === null) {
    value = amount * ETH_TO_USD;
  }

  const address_to = String(tx.attributes.sent_to).trim().toLowerCase();
  const stringcurrentAddress = String(currentAddress).trim().toLowerCase();

  let incoming = false;

  if (address_to === stringcurrentAddress) {
    incoming = true;
  }

  return (
    <div className="flex flex-row items-center justify-between bg-white p-4 rounded-[20px] cursor-pointer" onClick={() => console.log("TX Clicked")}>
      <div className="flex flex-col gap-[2px] text-[12px]">
        <p className="font-bold">
          {formattedTime.split(" ")[0]} {formattedTime.split(" ")[1]}{" "}
          {formattedTime.split(" ")[2]}
        </p>
        <p className="text-[12px] text-black">{formattedTime.split(" ")[3]}</p>
        <p className="text-tycheBlue text-[16px] font-semibold">
          {shortenAddress(tx.attributes.hash)}
        </p>
      </div>
      <div className="text-center gap-[26px] h-full flex flex-col">
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">From:</p>
          <span className="text-tycheBlue text-[12px]">
            {shortenAddress(tx.attributes.sent_from)}
          </span>
        </div>
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">To:</p>
          <span className="text-tycheBlue text-[12px]">
            {shortenAddress(tx.attributes.sent_to)}
          </span>
        </div>
      </div>
      <div className="text-center gap-[26px] h-full flex flex-col">
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">Value:</p>
          <span className="text-black text-[12px]">{value} USD</span>
        </div>
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">Amount:</p>
          <span className="text-black text-[12px]">
            {amount} {symbol}
          </span>
        </div>
      </div>
      <div>
        <img
          src={incoming ? incomingIcon : outgoingIcon}
          alt="icon"
          className="w-[24px] h-[24px]"
        />
      </div>
    </div>
  );
}

TxCard.propTypes = {
  tx: PropTypes.shape({
    txId: PropTypes.string.isRequired, // Ensure txId is passed correctly
    transactionTime: PropTypes.string, // Updated to allow null or undefined values
    attributes: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      sent_from: PropTypes.string.isRequired,
      sent_to: PropTypes.string.isRequired,
      mined_at: PropTypes.string,
      transfers: PropTypes.arrayOf(
        PropTypes.shape({
          fungible_info: PropTypes.shape({
            symbol: PropTypes.string,
            icon: PropTypes.string, // Ensure icon is of type string
          }),
          quantity: PropTypes.shape({
            float: PropTypes.number,
          }),
          value: PropTypes.number,
        })
      ),
    }).isRequired,
  }).isRequired,
  currentAddress: PropTypes.string.isRequired,
  currentNetwork: PropTypes.string.isRequired,
};

export default TxCard;
