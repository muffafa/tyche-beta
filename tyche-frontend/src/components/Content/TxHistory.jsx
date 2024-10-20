import TxCard from "./TxCard";
import filterIcon from "./../../assets/images/icons/filterIcon.svg";

function TxHistory({ transactions, currentNetwork, currentAddress }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[24px] tracking-wide font-[350] text-tychePrimary">
        Transaction History
      </p>
      <div className="p-4 bg-tycheLightGray shadow rounded-[20px]">
        <div className="flex flex-row justify-end items-center mb-[25px]">
          <button className="flex flex-row gap-[7px] px-[10px] py-[5px] items-center justify-center text-tycheDarkBlue text-[12px] font-[600] tracking-wide rounded-full border-[2px] border-dashed w-fit border-tycheDarkBlue">
            <img
              src={filterIcon}
              alt="Filter"
              className="max-w-[10px] max-h-[10px] min-w-[10px] min-h-[10px]"
            />
            <p>Filter</p>
          </button>
        </div>
        <div
          className={`space-y-4 ${
            transactions.length > 5
              ? "max-h-[578px] overflow-y-scroll"
              : "min-h-[578px]"
          }`}
        >
          {transactions.map((tx, index) => {
            // Ensure txId is present, use fallback if missing
            const txId = tx.attributes?.hash || `tx-${index}`;
            const transactionTime = tx.attributes?.mined_at || null;
            return (
              <TxCard
                key={txId} // txId is now guaranteed
                tx={{
                  ...tx,
                  transactionTime,
                  txId, // Pass the transaction ID
                }}
                currentNetwork={currentNetwork}
                currentAddress={currentAddress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TxHistory;
