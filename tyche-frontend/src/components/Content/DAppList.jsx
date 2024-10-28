import DAppCard from "./DAppCard";
import { DappMetadata } from "../../blockchain/DappMetadata";
import { getDappsByNetwork } from "../../utils/NetworkManager";

function DAppList({ network }) {
  const dApps = getDappsByNetwork(network, DappMetadata);

  if (dApps.length === 0) {
    return (
      <div className="p-4 bg-tycheLightGray shadow rounded">
        <h2 className="text-lg font-semibold mb-4">No dApps Available</h2>
        <p className="text-center text-tycheGray">
          There are no dApps available for this network.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">
        Decentralized Apps
      </p>
      <div className="px-[23px] py-[43px] bg-tycheLightGray shadow rounded-[20px]">
        <div className={`space-y-4 overflow-y-auto max-h-[290px]`}>
          {dApps.map((dapp, index) => (
            <DAppCard key={index} dapp={dapp} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DAppList;
