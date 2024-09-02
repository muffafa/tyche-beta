// src/components/Content/DAppCard.jsx
import PropTypes from "prop-types";

function DAppCard({ dapp }) {
  return (
    <div className="dapp-card border p-4 rounded-lg shadow-md">
      <img
        src={dapp.image}
        alt={dapp.name}
        className="h-16 w-16 object-contain mb-4"
      />
      <h3 className="text-lg font-bold">{dapp.name}</h3>
      <p className="text-sm text-gray-600">{dapp.description}</p>
    </div>
  );
}

DAppCard.propTypes = {
  dapp: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default DAppCard;
