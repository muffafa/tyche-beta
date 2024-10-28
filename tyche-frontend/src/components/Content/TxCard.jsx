import shortenAddress from "../../utils/shortenAddress";
import { convertTimestampToTimezone } from "../../utils/convertTimestampToTimezone";
import { useSelector } from "react-redux";
import outgoingIcon from "./../../assets/images/icons/outgoingIcon.svg";
import incomingIcon from "./../../assets/images/icons/incomingIcon.svg";
import { useNavigate } from "react-router-dom";
import { convertWalletToTag } from "../../utils/convertWalletToTag";

const ETH_TO_USD = 3402.5; // Replace with the current ETH/USD rate

function TxCard({ tx, currentAddress }) {
  const settings = useSelector((state) => state.settings);
  const addresses = useSelector((state) => state.wallet.addresses);
  const navigate = useNavigate();

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

  const selectedNetwork = useSelector((state) => state.global.selectedNetwork);

  const handleHashClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/${selectedNetwork}/tx/${tx.attributes.hash}`);
  };

  return (
    <div className="flex flex-row items-center justify-between bg-white p-4 rounded-[20px]">
      <div className="flex flex-col gap-[2px] text-[12px]">
        <p className="font-bold">
          {formattedTime.split(" ")[0]} {formattedTime.split(" ")[1]}{" "}
          {formattedTime.split(" ")[2]}
        </p>
        <p className="text-[12px] text-black">{formattedTime.split(" ")[3]}</p>
        <p 
          className="text-tycheBlue text-[16px] font-semibold cursor-pointer hover:underline"
          onClick={handleHashClick}
        >
          {shortenAddress(tx.attributes.hash)}
        </p>
      </div>
      <div className="text-center gap-[26px] h-full flex flex-col">
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">From:</p>
          <span className="text-tycheBlue text-[12px]">
            {convertWalletToTag(tx.attributes.sent_from,addresses)}
          </span>
        </div>
        <div className="flex flex-row gap-[5px]">
          <p className="text-[12px] font-bold">To:</p>
          <span className="text-tycheBlue text-[12px]">
            {convertWalletToTag(tx.attributes.sent_to,addresses)}
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

export default TxCard;
