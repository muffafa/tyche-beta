import shortenAddress from "./shortenAddress";

export const convertWalletToTag = (wallet, addresses) => {
    const address = addresses.find((entry) => entry.address === wallet);
    return address?.tag || shortenAddress(wallet);
}
