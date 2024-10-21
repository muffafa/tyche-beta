import { getSupportedNetworks } from "../../utils/NetworkManager";

function NetworkSelect({ selectedNetwork, onSelectNetwork }) {
  const networks = getSupportedNetworks();

  return (
    <div className="relative">
      <select
        value={selectedNetwork}
        onChange={(e) => onSelectNetwork(e.target.value)}
        className="flex items-center bg-tycheDarkGray text-[14px] md:text-[20px] px-2 md:px-4 py-1 h-[40px] md:h-[54px] text-ellipsis w-[100px] md:w-[150px] rounded-r-full focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary text-black appearance-none pr-8"
      >
        {networks.map((network) => (
          <option key={network} value={network}>
            {network}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}

export default NetworkSelect;
