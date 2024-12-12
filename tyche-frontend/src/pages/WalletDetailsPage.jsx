import DAppList from "../components/Content/DAppList";
import Portfolio from "../components/Content/Portfolio";
import TxHistory from "../components/Content/TxHistory";
import WalletInfo from "../components/Content/WalletInfo";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useCustomAxios from "../hooks/useCustomAxios";
import { useSelector } from "react-redux";
import axios from "axios";

function WalletDetailsPage() {
  const { address, network } = useParams();
  const location = useLocation();
  const customAxios = useCustomAxios();
  const currentUser = useSelector((state) => state.user);
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();
  // const tokens = [
  //   {
  //     symbol: "SOL",
  //     tokenContractAddress: "0xkdsjljsdjlsjdjsdj",
  //     holdingAmount: "1",
  //     priceUsd: "145.59",
  //     valueUsd: "145.59",
  //     tokenId: "0xkdsjljsdjlsjdjsdj",
  //   }
  // ];
  useEffect(() => {
    //check if user is logged in from backend with useCustomAxios
    customAxios.get("/api/v1/auth/me").then((response) => {
      console.log("response", response);
    }
    );
    console.log(currentUser);
  }, []);

  useEffect(()  => {
    // This effect will run whenever the address parameter or location changes
    // Add your data fetching logic here

    async function fetchData() {
      try {
        const searchNetwork = "solana";
        const result = await axios.get(`/backend/api/v1/wallets/${searchNetwork}/balance?walletAddress=${address}`);
        if (result.status !== 200) {
          console.log("Error fetching wallet info: ", result.data.error);
          return;
        }
        console.log("WALLET INFO: ", result);
        setTokens([{
          symbol: result.data.data.balance.symbol,
          amount: result.data.data.balance.amount,
          valueUsd: result.data.data.equivalents.USD.amount,
        }]);
      } catch (error) {
        alert("Error fetching wallet info: " + error);
        navigate("/404");
      }
    }
    fetchData();

  }, [address, network, location.pathname]);

  const currentAddress = address || "zGmof8SeyvHKnSEWv4i2mVv7MYe85D3zZqsTBjsKXSV";

  const transactions = [
    {
      txId: "0x123",
      transactionTime: "2023-05-01T10:00:00Z",
      attributes: {
        hash: "0x12jojoas3",
        sent_from: "0x1fjbfnjf3",
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
        hash: "0x45ljxojc6",
        sent_from: currentAddress, // You are the sender
        sent_to: "0x45kjncx88jnjn6",
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
      txId: "0x56",
      transactionTime: "2023-07-01T14:30:00Z",
      attributes: {
        hash: "0x45ljxomcjc6",
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
      txId: "0x101",
      transactionTime: "2023-08-25T11:00:00Z",
      attributes: {
        hash: "0x10dckjnbjksn1",
        sent_from: currentAddress, // You are the sender
        sent_to: "0x46xcjnjn",
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
      txId: "0x11",
      transactionTime: "2023-09-01T12:00:00Z",
      attributes: {
        hash: "0x109999kh1",
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

  
  const nfts = [
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
    {
      header: "NFT",
      id: "1640",
      basePrice: "300",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-0 mt-4 md:mt-[49px]">
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
            <div className="w-[300px]">
              <Portfolio tokens={tokens} nfts={nfts} network={network} />
            </div>
            <div className="w-[300px]">
              <DAppList network={network} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col flex-grow gap-[23px]">
            <WalletInfo
              currentAddress={currentAddress}
              currentNetwork={network}
            />
            <div className="w-full">
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
