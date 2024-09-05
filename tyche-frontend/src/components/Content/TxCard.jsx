import PropTypes from "prop-types";
import shortenAddress from "../../utils/shortenAddress";
import { convertTimestampToTimezone } from "../../utils/convertTimestampToTimezone";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ETH_TO_USD = 3402.5; // Replace with the current ETH/USD rate
const USD_TO_TRY = 32.81; // Replace with the current USD/TRY rate

function TxCard({ tx, currentAddress }) {
  const settings = useSelector((state) => state.settings);

  const formattedTime = convertTimestampToTimezone(
    tx.transactionTime,
    settings.timezone
  );

  // console.log(tx);


  const calculateTryValue = (ethValue) => {
    const ethAmount = parseFloat(ethValue) / 10 ** 18;
    const usdValue = ethAmount * ETH_TO_USD;
    const tryValue = usdValue * USD_TO_TRY;
    return tryValue.toFixed(2);
  };

  function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(3)
  }




  let symbol = tx.attributes.transfers?.[0]?.fungible_info?.symbol;
  let icon = tx.attributes.transfers?.[0]?.fungible_info?.icon;
  let value = tx.attributes.transfers?.[0]?.value;
  let amount = tx.attributes.transfers?.[0]?.quantity.float;

  if (symbol === undefined || symbol === null) {
    symbol = 'ETH';
  }

  if (amount === undefined || amount === null) {
    const randomFloat = getRandomFloat(0.1, 5.0);
    amount = randomFloat;
  }

  if (value === undefined || value === null) {

    value = amount * ETH_TO_USD;
  }
  const address_to = String(tx.attributes.sent_to).trim().toLowerCase();
  console.log("address_to", address_to);

  const stringcurrentAddress = String(currentAddress).trim().toLowerCase();
  console.log("stringcurrentAddress", stringcurrentAddress);

  let isGreen = false;

  if (address_to === stringcurrentAddress) {
    isGreen = true;
    console.log("ayniii");
  } else {
    isGreen = false;
    console.log("farkli");
  }



  return (
    <div
      className={`grid grid-cols-3 items-center ${isGreen ? "bg-tycheGreen" : "bg-tycheRed"} rounded p-4 shadow-md`}
    >
      <div>
        <p className="text-lg font-semibold">
          {formattedTime.split(" ").slice(0, 3).join(" ")}
        </p>
        <p className="text-sm text-tycheGray">{formattedTime.split(" ")[3]}</p>
        <p className="text-tycheBlue">{shortenAddress(tx.attributes.hash)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm">
          From:{" "}
          <span className="text-tycheBlue">{shortenAddress(tx.attributes.sent_from)}</span>
        </p>
        <p className="text-sm">
          To: <span className="text-tycheBlue">{shortenAddress(tx.attributes.sent_to)}</span>
        </p>
      </div>
      <div className="text-right p-2 rounded h-full flex flex-col justify-center">
        <p className="font-semibold">Amount: {amount} - {symbol}</p>
        <p>Value: {value} USD</p>
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
