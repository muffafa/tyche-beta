import PropTypes from "prop-types";

function TokenCard({ token }) {
  return (
    <div className="token-card bg-tycheBeige p-4 mb-4 rounded shadow flex justify-between items-center">
      <div className="token-info">
        <h5 className="text-tycheBlue font-bold">{token.name}</h5>
        <p className="text-tycheGray">{token.symbol}</p>
      </div>
      <div className="token-amount">
        <span className="text-tycheBlue font-bold">{token.amount}</span>
        <span className="text-tycheGray"> {token.currency}</span>
      </div>
    </div>
  );
}

TokenCard.propTypes = {
  token: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
};

export default TokenCard;
