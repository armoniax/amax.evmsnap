/* eslint-disable jsdoc/match-description */
/* eslint-disable require-unicode-regexp */
/**
 * hex string to buffer
 *
 * @param hex - hex string
 * @returns buffer
 */
export function hexToBuffer(hex: string): Buffer {
  let hexStr = hex;
  if (hex.startsWith('0x')) {
    hexStr = hex.slice(2);
  }
  const arr =
    hexStr.match(/[\da-f]{2}/gi)?.map(function (h) {
      return parseInt(h, 16);
    }) || [];

  return Buffer.from(new Uint8Array(arr).buffer);
}
