export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const extractVersionFromTag = (tagName: string): string => {
  // Extract version from tag like "mtm-vpn-android-v1.8.0-mtm-0.1.3"
  const match = tagName.match(/v?(\d+\.\d+\.\d+(?:-mtm-\d+\.\d+\.\d+)?)/);
  return match ? match[1] : tagName;
};