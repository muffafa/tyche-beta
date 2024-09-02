// src/components/Content/DAppList.jsx
import PropTypes from "prop-types";
import DAppCard from "./DAppCard";
import { DappMetadata } from "../../blockchain/DappMetadata";

function DAppList({ network }) {
  const dApps = DappMetadata[network] || [];

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
