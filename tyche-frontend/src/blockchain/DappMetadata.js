// src/blockchain/DappMetadata.js
import uniswapImg from "../assets/images/uniswap.png";
import aaveImg from "../assets/images/aave.png";
import pangolinImg from "../assets/images/ethereum.png";
import benqiImg from "../assets/images/ethereum.png";
import pancakeswapImg from "../assets/images/ethereum.png";

export const DappMetadata = {
  ethereum: [
    {
      id: 1,
      name: "Uniswap",
      description: "Decentralized exchange",
      image: uniswapImg,
    },
    {
      id: 2,
      name: "Aave",
      description: "Lending and borrowing platform",
      image: aaveImg,
    },
  ],
  avalanche: [
    {
      id: 3,
      name: "Pangolin",
      description: "Decentralized exchange on Avalanche",
      image: pangolinImg,
    },
    {
      id: 4,
      name: "Benqi",
      description: "Lending and borrowing on Avalanche",
      image: benqiImg,
    },
  ],
  bsc: [
    {
      id: 5,
      name: "PancakeSwap",
      description: "Decentralized exchange on BSC",
      image: pancakeswapImg,
    },
  ],
  // Add other networks or dApps as needed
};
