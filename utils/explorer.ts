/**
 * Generate blockchain explorer URLs for different networks
 */
export const getExplorerUrl = (hash: string, type: 'solana' | 'ethereum' | 'nym'): string => {
  switch (type) {
    case 'solana':
      return `https://explorer.solana.com/tx/${hash}`;
    case 'ethereum':
      return `https://etherscan.io/tx/${hash}`;
    case 'nym':
      return `https://ping.pub/nyx/tx/${hash}`;
    default:
      return '#';
  }
};

export type ExplorerType = 'solana' | 'ethereum' | 'nym';
