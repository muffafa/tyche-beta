import PropTypes from "prop-types";
import goLinkIcon from "./../../assets/images/icons/goLinkIcon.svg";

function DAppCard({ dapp }) {
  const dappLink = dapp.link || "#"; // Fallback to "#" if the link is undefined

  return (
    <div className="flex items-center bg-white rounded-[20px] p-4 shadow-md">
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
      <a href={dappLink}>
        <div className="flex flex-row items-center gap-[8px]">
          <p className="text-tycheBlue font-bold text-[12px]">Go</p>
          <img src={goLinkIcon} alt="Go Link" className="w-[12px] h-[12px]" />
        </div>
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
