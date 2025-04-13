const adNetworks = [
  { name: "Adsterra", code: "ADST", description: "Premium ad network with high-paying ads", frequency: 2 },
  { name: "Monetag", code: "MNTG", description: "High-converting video ads", frequency: 3 },
  { name: "Cointzilla", code: "CNTZ", description: "Crypto-focused ad network", frequency: 1 }
];

// Logic to rotate between ad networks
function getNextAdNetwork() {
  currentAdNetworkIndex = (currentAdNetworkIndex + 1) % adNetworks.length;
  return adNetworks[currentAdNetworkIndex];
}
