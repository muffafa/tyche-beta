import DAppList from "../components/Content/DAppList";
import Portfolio from "../components/Content/Portfolio";
import TxHistory from "../components/Content/TxHistory";
import WalletInfo from "../components/Content/WalletInfo";

function WalletDetailsPage() {
  const currentAddress = "0x123777777";

  const transactions = [
    {
      txId: "0x123",
      transactionTime: "2023-05-01T10:00:00Z",
      attributes: {
        hash: "0x12ıjoıjoas3",
        sent_from: "0x12fjbfnjf3",
        sent_to: currentAddress, // You are the receiver
        mined_at: "2023-05-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "SOL",
              icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
            },
            quantity: {
              float: 1.5,
            },
            value: (1.5 * 145.59).toFixed(2), // 218.39 USD
          },
        ],
      },
    },
    {
      txId: "0x456",
      transactionTime: "2023-07-01T14:30:00Z",
      attributes: {
        hash: "0x45ljxoıcjc6",
        sent_from: currentAddress, // You are the sender
        sent_to: "0x45kjncxjxjnjnjn6",
        mined_at: "2023-07-01T14:30:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "SOL",
              icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
            },
            quantity: {
              float: 2.3,
            },
            value: (2.3 * 145.59).toFixed(2), // 334.86 USD
          },
        ],
      },
    },
    {
      txId: "0x789",
      transactionTime: "2023-08-10T16:00:00Z",
      attributes: {
        hash: "0x78ljndjnc9",
        sent_from: "0x12kdjndcjkn3",
        sent_to: currentAddress, // You are the receiver
        mined_at: "2023-08-10T16:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "SOL",
              icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
            },
            quantity: {
              float: 0.75,
            },
            value: (0.75 * 145.59).toFixed(2), // 109.19 USD
          },
        ],
      },
    },
    {
      txId: "0x101",
      transactionTime: "2023-08-25T11:00:00Z",
      attributes: {
        hash: "0x10dckjnbjksn1",
        sent_from: currentAddress, // You are the sender
        sent_to: "0x456xcjnjn",
        mined_at: "2023-08-25T11:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "SOL",
              icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
            },
            quantity: {
              float: 1.25,
            },
            value: (1.25 * 145.59).toFixed(2), // 181.99 USD
          },
        ],
      },
    },
    {
      txId: "0x101",
      transactionTime: "2023-09-01T12:00:00Z",
      attributes: {
        hash: "0x10jhkhkh1",
        sent_from: "0x12sss3",
        sent_to: currentAddress, // You are the receiver
        mined_at: "2023-09-01T12:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "SOL",
              icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
            },
            quantity: {
              float: 3.0,
            },
            value: (3.0 * 145.59).toFixed(2), // 436.77 USD
          },
        ],
      },
    },
  ];

  const tokens = [
    {
      symbol: "SOL",
      tokenContractAddress: "0xkdsjljsdjlsjdjsdj",
      holdingAmount: "1",
      priceUsd: "145.59",
      valueUsd: "145.59",
      tokenId: "0xkdsjljsdjlsjdjsdj",
    },
  ];
  const nfts = [
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
  ];
  const network = "solana";

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-0 mt-4 md:mt-[80px]">
      <div className="w-full max-w-[915px] flex flex-col md:flex-row justify-center gap-4 md:gap-[11px]">
        {/* Mobile layout (< md screens) */}
        <div className="md:hidden w-full flex flex-col gap-6">
          <WalletInfo
            currentAddress={currentAddress}
            currentNetwork={network}
          />
          <div className="w-full h-auto">
            <Portfolio tokens={tokens} nfts={nfts} network={network} />
          </div>
          <div className="w-full">
            <TxHistory
              transactions={transactions}
              currentNetwork={network}
              currentAddress={currentAddress}
            />
          </div>
          <div className="w-full h-auto mb-6">
            <DAppList network={network} />
          </div>
        </div>

        {/* Desktop layout (md and larger screens) */}
        <div className="hidden md:flex w-full gap-[11px]">
          {/* Left column */}
          <div className="flex flex-col gap-[16px] w-[300px]">
            <div className="w-[300px] h-[384px]">
              <Portfolio tokens={tokens} nfts={nfts} network={network} />
            </div>
            <div className="w-[300px] h-[384px]">
              <DAppList network={network} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col flex-grow gap-[23px]">
            <WalletInfo
              currentAddress={currentAddress}
              currentNetwork={network}
            />
            <div className="w-full min-h-[384px]">
              <TxHistory
                transactions={transactions}
                currentNetwork={network}
                currentAddress={currentAddress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletDetailsPage;
