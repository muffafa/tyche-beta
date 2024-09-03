import PropTypes from "prop-types";
import DAppCard from "./DAppCard";
import { DappMetadata } from "../../blockchain/DappMetadata";
import { getDappsByNetwork } from "../../utils/NetworkManager";

function DAppList({ network }) {
  // Fetch the dApps for the network using getDappsByNetwork function
  const dApps = getDappsByNetwork(network, DappMetadata);

  if (dApps.length === 0) {
    return <div>No dApps available for this network.</div>;
  }

  return (
    <div className="dapp-list">
      {dApps.map((dapp) => (
        <DAppCard key={dapp.id} dapp={dapp} />
      ))}
    </div>
  );
}

DAppList.propTypes = {
  network: PropTypes.string.isRequired,
};

export default DAppList;
