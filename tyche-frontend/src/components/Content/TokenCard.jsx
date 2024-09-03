import PropTypes from "prop-types";

function TokenCard({ token }) {
  return (
    <div className="token-card bg-tycheBeige p-4 mb-4 rounded shadow flex justify-between items-center">
      <div className="token-info">
        <h5 className="text-tycheBlue font-bold">{token.symbol}</h5>
        <p className="text-tycheGray">Contract: {token.tokenContractAddress}</p>
      </div>
      <div className="token-amount">
        <span className="text-tycheBlue font-bold">{token.holdingAmount}</span>
        <span className="text-tycheGray"> (${token.valueUsd} USD)</span>
      </div>
    </div>
  );
}

TokenCard.propTypes = {
  token: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    tokenContractAddress: PropTypes.string.isRequired,
    holdingAmount: PropTypes.string.isRequired,
    valueUsd: PropTypes.string.isRequired,
  }).isRequired,
};

export default TokenCard;
