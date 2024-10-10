import DAppList from "../components/Content/DAppList";
import Portfolio from "../components/Content/Portfolio";
import TxHistory from "../components/Content/TxHistory";
import WalletInfo from "../components/Content/WalletInfo";

function WalletDetailsPage() {
  const currentAddress = "0x123777777";
  const transactions = [
    {
      txId: "0x123",
      transactionTime: "2021-09-01T10:00:00Z",
      attributes: {
        hash: "0x12ıjoıjoas3",
        sent_from: "0x12fjbfnjf3",
        sent_to: "0x45assoıjoj6",
        mined_at: "2021-09-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "ETH",
              icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            },
            quantity: {
              float: 0.0001,
            },
            value: 200,
          },
        ],
      },
    },
    {
      txId: "0x456",
      transactionTime: "2021-09-01T10:00:00Z",
      attributes: {
        hash: "0x45ljxoıcjc6",
        sent_from: "0x12asoıjsao3",
        sent_to: "0x45kjncxjxjnjnjn6",
        mined_at: "2021-09-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "ETH",
              icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            },
            quantity: {
              float: 0.0001,
            },
            value: 200,
          },
        ],
      },
    },
    {
      txId: "0x789",
      transactionTime: "2021-09-01T10:00:00Z",
      attributes: {
        hash: "0x78ljndjnc9",
        sent_from: "0x12kdjndcjkn3",
        sent_to: "0x45dndnjknkn6",
        mined_at: "2021-09-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "ETH",
              icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            },
            quantity: {
              float: 0.0001,
            },
            value: 200,
          },
        ],
      },
    },
    {
      txId: "0x101",
      transactionTime: "2021-09-01T10:00:00Z",
      attributes: {
        hash: "0x10dckjnbjksn1",
        sent_from: "0x1cvlnjxcnn23",
        sent_to: "0x456xcjnjn",
        mined_at: "2021-09-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "ETH",
              icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            },
            quantity: {
              float: 0.0001,
            },
            value: 200,
          },
        ],
      },
    },
    {
      txId: "0x101",
      transactionTime: "2021-09-01T10:00:00Z",
      attributes: {
        hash: "0x10jhkhkh1",
        sent_from: "0x12sss3",
        sent_to: currentAddress,
        mined_at: "2021-09-01T10:00:00Z",
        transfers: [
          {
            fungible_info: {
              symbol: "ETH",
              icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            },
            quantity: {
              float: 0.0001,
            },
            value: 200,
          },
        ],
      },
    }
  ];
  

  const tokens = [
    {
      symbol: "ETH",
      tokenContractAddress: "0xkdsjljsdjlsjdjsdj",
      holdingAmount: "0.001",
      priceUsd: "2000",
      valueUsd: "200",
      tokenId: "0xkdsjljsdjlsjdjsdj",
    },
    {
      symbol: "DAI",
      tokenContractAddress: "0xkdsjljsdjlsjdjsdj",
      holdingAmount: "0.0001",
      priceUsd: "1",
      valueUsd: "0.1",
      tokenId: "0xkdsjljsdjlsjdjsdj,",
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
      id: "1641",
      basePrice: "400",
    },
    {
      header: "NFT",
      id: "1642",
      basePrice: "500",
    },
    {
      header: "NFT",
      id: "1643",
      basePrice: "600",
    },
    {
      header: "NFT",
      id: "1644",
      basePrice: "700",
    },
    {
      header: "NFT",
      id: "1645",
      basePrice: "800",
    },
    {
      header: "NFT",
      id: "1646",
      basePrice: "900",
    },
    {
      header: "NFT",
      id: "1647",
      basePrice: "1000",
    },
    {
      header: "NFT",
      id: "1648",
      basePrice: "1100",
    },
    {
      header: "NFT",
      id: "1649",
      basePrice: "1200",
    },
];
  const network = "ethereum";
  return (
    <>
      <div className="flex flex-col h-full justify-center items-center mt-[80px]">
        <div className="flex flex-row justify-center max-w-[915px] w-full h-full gap-[11px]">
          <div className="flex flex-col gap-[16px] h-full">
            <div className="min-w-[300px] min-h-[384px] max-h-[384px] max-w-[300px]">
              <Portfolio tokens={tokens} nfts={nfts} network={network} />
            </div>
            <div className="min-w-[300px] min-h-[384px] max-h-[384px] max-w-[300px]">
              <DAppList network={network} />
            </div>
          </div>
          <div className="flex flex-col w-full gap-[23px]">
            <WalletInfo currentAddress={"address"} currentNetwork={network} />
            <div className="min-w-[300px] min-h-[384px]">
              <TxHistory
                transactions={transactions}
                currentNetwork={network}
                currentAddress={currentAddress}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
















/*
//import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import TxHistory from "../components/Content/TxHistory";
// import Portfolio from "../components/Content/Portfolio";
// import DAppList from "../components/Content/DAppList";
// import shortenAddress from "../utils/shortenAddress";
// import {
//   getAddressTransactions2,
//   getAddressTokens,
//   getAddressNFTs,
//   getAddressInfo,
// } from "../utils/api";
// import { setNetwork, setWalletAddress } from "../redux/slices/globalSlice";
// import { getSupportedNetworks } from "../utils/NetworkManager";
// import NotFound from "./NotFound"; // Import the 404 component
// import {
//   processNativeTokenData,
//   concatNativeTokenWithTokenData,
// } from "../utils/nativeToken";
// import tyche_abi from "../utils/TychePremiumContractABI";
// import { ethers } from "ethers";
// import { useWeb3ModalAccount } from '@web3modal/ethers/react'
// import { useWeb3ModalProvider } from '@web3modal/ethers/react'


// function WalletDetailsPageOLD() {
//   const { network, address } = useParams();
//   const dispatch = useDispatch();
//   const [transactions, setTransactions] = useState([]);
//   const [tokens, setTokens] = useState([]);
//   const [nfts, setNfts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isPremium, setIsPremium] = useState(false);
//   const { isConnected } = useWeb3ModalAccount()

//   const settings = useSelector((state) => state.settings);

//   const { walletProvider } = useWeb3ModalProvider()

//   // Check if the network is supported
//   const supportedNetworks = getSupportedNetworks();
//   const isNetworkSupported = supportedNetworks.includes(network.toLowerCase());

//   useEffect(() => {
//     if (!isNetworkSupported) {
//       return; // Early exit if network is not supported
//     }

//     // Initialize global state with URL params
//     dispatch(setNetwork(network));
//     dispatch(setWalletAddress(address));

//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError(null);
//         // Fetch transactions, tokens, and NFTs data concurrently
//         const [txData, tokenData, nftData] = await Promise.all([
//           getAddressTransactions2(network, address),
//           getAddressTokens(network, address),
//           getAddressNFTs(network, address),
//         ]);
//         setTransactions(txData.data ? txData.data : []);
//         const addressInfo = await getAddressInfo(network, address);
//         const procedNativeTokenData = await processNativeTokenData(
//           addressInfo.data[0],
//           network
//         );
//         concatNativeTokenWithTokenData(procedNativeTokenData, tokenData);
//         setTokens(tokenData.data?.[0]?.tokenList || []);
//         setNfts(nftData.data?.[0]?.tokenList || []);
//         console.log("isConnected:", isConnected);
//         if (isConnected && walletProvider) {
//           try {
//             const signer = await walletProvider.getSigner(); // Use the wallet provider to get the signer
//             const contractAddress = "0x915A0e3211C45Fc0BDF32A4c3a121ddCb0D77583";
//             const contract = new ethers.Contract(contractAddress, tyche_abi, signer);
            
//             const premiumTime = await contract.checkMembershipStatus(address);
//             console.log("Premium Time:", premiumTime);
//             if (premiumTime > 0) {
//               setIsPremium(true);
//             }
//           } catch (error) {
//             console.error("Error fetching blockchain data:", error);
//           }
//         }

//       } catch (error) {
//         console.error("Error fetching blockchain data:", error);
//         setError("Failed to fetch blockchain data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [network, address, dispatch, isNetworkSupported, isPremium, isConnected]);

//   // Render 404 page if network is not supported
//   if (!isNetworkSupported) {
//     return <NotFound />;
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="p-4 bg-gray-800 text-white text-center">
//         <h1 className="text-2xl font-semibold">
//           Wallet Details for {shortenAddress(address)} on {network}
//         </h1>
//       </header>

//       <main className="flex-grow container mx-auto p-4 grid grid-cols-12 gap-4">
//         {loading ? (
//           <div className="col-span-12 text-center">
//             <p className="text-lg font-semibold mb-4">Loading...</p>
//           </div>
//         ) : error ? (
//           <div className="col-span-12 text-center">
//             <p className="text-lg font-semibold text-red-500 mb-4">{error}</p>
//           </div>
//         ) : (
//           <>
//             <div className="lg:col-span-4 col-span-12 space-y-4">
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <h2 className="text-xl font-bold">Account Details</h2>
//                 <p>Current Currency: {settings.currency}</p>
//                 <p>Current Timezone: {settings.timezone}</p>
//                 <p>Is Premium: {isPremium ? "Yes" : "No"}</p>
//               </div>
//               <Portfolio tokens={tokens} nfts={nfts} network={network} />
//               <DAppList network={network} />
//             </div>
//             <div className="lg:col-span-8 col-span-12">
//               <TxHistory
//                 transactions={transactions}
//                 currentNetwork={network}
//                 currentAddress={address}
//               />
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }
*/

export default WalletDetailsPage;
