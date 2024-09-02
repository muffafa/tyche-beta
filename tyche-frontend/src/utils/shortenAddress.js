function shortenAddress(address, chars = 6) {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

export default shortenAddress;
