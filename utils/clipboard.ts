/**
 * Copy text to clipboard utility
 */
export const copyToClipboard = async (text: string, label: string = 'Text'): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`${label} copied to clipboard`);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    console.log(`${label} copied to clipboard (fallback method)`);
  }
};
