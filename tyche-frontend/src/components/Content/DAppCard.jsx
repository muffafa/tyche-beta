import PropTypes from "prop-types";

function DAppCard({ dapp }) {
  return (
    <div className="flex items-center bg-tycheWhite rounded p-4 shadow-md">
      <div className="flex-shrink-0">
        <img
          src={dapp.image}
          alt={dapp.name}
          className="h-8 w-8 object-contain"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="text-md font-semibold">{dapp.name}</h3>
        <p className="text-sm text-tycheGray">{dapp.description}</p>
      </div>
      <a href={dapp.link} className="text-tycheBlue ml-4">
        Visit
      </a>
    </div>
  );
}

DAppCard.propTypes = {
  dapp: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired, // Ensure link is passed
  }).isRequired,
};

export default DAppCard;
