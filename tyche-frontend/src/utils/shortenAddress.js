function shortenAddress(address, chars = 6) {
  return `${address.substring(0, chars)}...`;
  // return `${address.substring(0, chars)}...${address.substring(
  //   address.length - 2
  // )}`;
}

export default shortenAddress;
