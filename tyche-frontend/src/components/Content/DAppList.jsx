import PropTypes from "prop-types";
import DAppCard from "./DAppCard";
import { DappMetadata } from "../../blockchain/DappMetadata";
import { getDappsByNetwork } from "../../utils/NetworkManager";

function DAppList({ network }) {
  const dApps = getDappsByNetwork(network, DappMetadata);

  if (dApps.length === 0) {
    return (
      <div className="p-4 bg-tycheLightGray shadow rounded col-span-4">
        <h2 className="text-lg font-semibold mb-4">No dApps Available</h2>
        <p className="text-center text-tycheGray">
          There are no dApps available for this network.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">Decentralized Apps</p>
      <div className="p-4 bg-tycheLightGray shadow rounded-[20px] col-span-4">
        
        <div
          className={`space-y-4 ${
            dApps.length > 2 ? "max-h-[240px] overflow-y-scroll" : "min-h-[240px]"
          }`}
        >
          {dApps.map((dapp, index) => (
            <DAppCard key={index} dapp={dapp} />
          ))}
        </div>
      </div>
    </div>
  );
}

DAppList.propTypes = {
  network: PropTypes.string.isRequired,
};

export default DAppList;
