import PropTypes from "prop-types";
import { getSupportedNetworks } from "../../utils/NetworkManager";

function NetworkSelect({ selectedNetwork, onSelectNetwork }) {
  const networks = getSupportedNetworks();

  return (
    <select
      value={selectedNetwork}
      onChange={(e) => onSelectNetwork(e.target.value)}
      className="network-select p-2 border rounded"
    >
      {networks.map((network) => (
        <option key={network} value={network}>
          {network}
        </option>
      ))}
    </select>
  );
}

NetworkSelect.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.string),
  selectedNetwork: PropTypes.string.isRequired,
  onSelectNetwork: PropTypes.func.isRequired,
};

export default NetworkSelect;
