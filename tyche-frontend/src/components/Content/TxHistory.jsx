import TxCard from "./TxCard";
import filterIcon from "./../../assets/images/icons/filterIcon.svg";

function TxHistory({ transactions, currentNetwork, currentAddress }) {
  return (
    <div className="flex flex-col gap-[8px] h-full">
      <p className="text-[24px] tracking-wide font-[350] text-tychePrimary">
        Transaction History
      </p>
      <div className="p-6 bg-tycheLightGray shadow rounded-[20px] flex flex-col h-full">
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
        <div className="flex-grow overflow-y-auto min-h-[420px] max-h-[420px]">
          <div className="space-y-4">
            {transactions.map((tx, index) => {
              const txId = tx.attributes?.hash || `tx-${index}`;
              const transactionTime = tx.attributes?.mined_at || null;
              return (
                <TxCard
                  key={txId}
                  tx={{
                    ...tx,
                    transactionTime,
                    txId,
                  }}
                  currentNetwork={currentNetwork}
                  currentAddress={currentAddress}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TxHistory;
