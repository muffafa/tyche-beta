import uniswapImg from "../assets/images/uniswap.png";
import aaveImg from "../assets/images/aave.png";
import pangolinImg from "../assets/images/ethereum.png"; // Placeholder image
import pancakeswapImg from "../assets/images/ethereum.png"; // Placeholder image

export const DappMetadata = {
  eth: [
    {
      id: 1,
      name: "Uniswap",
      description: "Decentralized exchange",
      image: uniswapImg,
      link: "https://app.uniswap.org/",
      sponsored: true,
    },
    {
      id: 2,
      name: "SushiSwap",
      description: "Decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://www.sushi.com/swap",
      sponsored: false,
    },
    {
      id: 3,
      name: "Balancer",
      description: "Decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.balancer.fi/#/ethereum",
      sponsored: false,
    },
    {
      id: 4,
      name: "1inch",
      description: "Decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.1inch.io/#/1/simple/swap/ETH",
      sponsored: true,
    },
    {
      id: 5,
      name: "Aave",
      description: "Lending and borrowing platform",
      image: aaveImg,
      link: "https://app.aave.com/",
      sponsored: false,
    },
  ],
  bsc: [
    {
      id: 6,
      name: "Vooi",
      description: "Perpetual decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.vooi.io/",
      sponsored: false,
    },
    {
      id: 7,
      name: "KiloEx",
      description: "Perpetual decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.kiloex.io/trade",
      sponsored: true,
    },
    {
      id: 8,
      name: "PancakeSwap",
      description: "Decentralized exchange",
      image: pancakeswapImg,
      link: "https://pancakeswap.finance/swap",
      sponsored: false,
    },
    {
      id: 9,
      name: "Biswap",
      description: "Perpetual/Spot decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://biswap.org/tr/swap",
      sponsored: false,
    },
    {
      id: 10,
      name: "Radiant Capital",
      description: "Lending and borrowing platform",
      image: pangolinImg, // Placeholder
      link: "https://app.radiant.capital/#/markets",
      sponsored: true,
    },
  ],
  avaxc: [
    {
      id: 11,
      name: "Trader Joe",
      description: "Decentralized exchange on Avalanche",
      image: pangolinImg, // Placeholder
      link: "https://traderjoexyz.com/avalanche",
      sponsored: false
    },
    {
      id: 12,
      name: "Dexalot",
      description: "Decentralized exchange on Avalanche",
      image: pangolinImg, // Placeholder
      link: "https://app.dexalot.com/swap",
      sponsored: false,
    },
    {
      id: 13,
      name: "Contango",
      description: "Perpetual decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.contango.xyz/",
      sponsored: true,
    },
    {
      id: 14,
      name: "BiLira",
      description: "TRY pegged stable coin",
      image: pangolinImg, // Placeholder
      link: "https://www.bilira.co/",
      sponsored: false,
    },
    {
      id: 15,
      name: "Avalaunch",
      description: "Launchpad on Avalanche",
      image: pangolinImg, // Placeholder
      link: "https://avalaunch.app/launchpad",
      sponsored: false,
    },
  ],
  btc: [
    {
      id: 16,
      name: "Magic Eden",
      description: "NFT marketplace",
      image: pangolinImg, // Placeholder
      link: "https://magiceden.io/",
      sponsored: false,
    },
    {
      id: 17,
      name: "UXUY",
      description: "Ordinal decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://uxuy.com/tr/marketplace",
      sponsored: true,
    },
    {
      id: 18,
      name: "THORSwap",
      description: "Decentralized exchange",
      image: pangolinImg, // Placeholder
      link: "https://app.thorswap.finance/swap",
      sponsored: false,
    },
    {
      id: 19,
      name: "Unisat",
      description: "Biggest BTC wallet",
      image: pangolinImg, // Placeholder
      link: "https://unisat.io/",
      sponsored: false,
    },
    {
      id: 20,
      name: "Liquidium",
      description: "Ordinals lending platform",
      image: pangolinImg, // Placeholder
      link: "https://app.liquidium.fi/lend",
      sponsored: true,
    },
  ],
};
