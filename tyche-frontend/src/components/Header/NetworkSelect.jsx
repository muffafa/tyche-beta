import { getSupportedNetworks } from "../../utils/NetworkManager";

function NetworkSelect({ selectedNetwork, onSelectNetwork }) {
  const networks = getSupportedNetworks();

  return (
    <select
      value={selectedNetwork}
      onChange={(e) => onSelectNetwork(e.target.value)}
      className="flex items-center bg-tycheDarkGray text-[20px] px-4 py-1 h-[54px] text-ellipsis w-[150px] rounded-r-full focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary text-black"
    >
      {networks.map((network) => (
        <option key={network} value={network}>
          {network}
        </option>
      ))}
    </select>
  );
}

export default NetworkSelect;
