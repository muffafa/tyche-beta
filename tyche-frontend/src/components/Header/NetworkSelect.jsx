import PropTypes from "prop-types";

function NetworkSelect({ networks = [], selectedNetwork, onSelectNetwork }) {
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
