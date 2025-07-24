// TODO technically this is only 248bits randomness..
export function generateRandomFelt252(): bigint {
  let randomBytes: Uint8Array;

  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment
    randomBytes = new Uint8Array(31);
    window.crypto.getRandomValues(randomBytes);
  } else {
    // Node.js environment
    const crypto = require("node:crypto");
    randomBytes = crypto.randomBytes(31);
  }

  return BigInt(
    `0x${Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}`,
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// takes a "0x000000000000000000" string and turns it into utf8 emoji
export function convertFullHexString(str) {
  // debugger
  const result = str.replace("0x", "").replace(/^0+/, "");
  if (!result.length) return "";
  const r = parseText(result);
  return r;
}

export function parseText(str: string): string {
  if (!str.length) return str;

  // The string now contains hex representing utf8 codepoints
  // Convert hex string to a Uint8Array
  const bytes = new Uint8Array(
    str.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)),
  );

  // Decode the byte array to a string using UTF-8
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

export function convertTextToHex(str: string): string {
  if (!str.length) return str;

  // Encode the string to a Uint8Array using UTF-8
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  // Convert the byte array to a hex string
  return `0x${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function ensureStarkFelt(value: string) {
  if (!value.startsWith("0x")) {
    return value;
  }
  if (value.length < 66) {
    return "0x" + value.replace("0x", "").padStart(64, "0");
  }
  return value;
}

function transliterate(str: string, charMap: Record<string, string> = {}) {
  return str
    .split("")
    .map((char) => charMap[char] || char)
    .join("");
}
const charMap: Record<string, string> = {
  á: "a",
  ú: "u",
  é: "e",
  ä: "a",
  Š: "S",
  Ï: "I",
  š: "s",
  Í: "I",
  í: "i",
  ó: "o",
  ï: "i",
  ë: "e",
  ê: "e",
  â: "a",
  Ó: "O",
  ü: "u",
  Á: "A",
  Ü: "U",
  ô: "o",
  ž: "z",
  Ê: "E",
  ö: "o",
  č: "c",
  Â: "A",
  Ä: "A",
  Ë: "E",
  É: "E",
  Č: "C",
  Ž: "Z",
  Ö: "O",
  Ú: "U",
  Ô: "O",
  "‘": "'",
};

function accentsToAscii(str: string): string {
  // Character map for transliteration to ASCII
  return transliterate(str, charMap);
}

export function toValidAscii(str: string): string {
  const intermediateString = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return accentsToAscii(intermediateString);
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
