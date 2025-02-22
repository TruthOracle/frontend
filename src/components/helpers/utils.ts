import { hash, byteArray, CallData } from "starknet";
import BN from 'bn.js';

// Define return type as string
function asciiToHex(str: string): string {
    let arr1: string[] = ['0x'];
    for (let n = 0; n < str.length; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}

function toSelector(val: string): string | BN {
    if (!val) {
        return '';
    }
    return toBN(hash.getSelectorFromName(val));
}

function toByteArray(val: string): string {
    if (!val) {
        return '';
    }
    return CallData.compile(byteArray.byteArrayFromString(val)).toString();
}

// Define possible return types
function toBN(val: string | BN): string | BN {
    if (!val) {
        return '';
    }
    if (BN.isBN(val)) {
        return val;
    }
    if (startWith0xAndIsHex(val as string)) {
        return new BN(removeHexPrefix(val as string), 16);
    }
    if (isDecimal(val as string)) {
        return new BN(val as string, 10);
    }
    return new BN(removeHexPrefix(asciiToHex(val as string)), 16);
}

function toHex(val: string): string {
    if (!val) {
        return '';
    }
    if (startWith0xAndIsHex(val)) {
        return val;
    }
    if (isDecimal(val)) {
        const nbn = new BN(val, 10);
        return addHexPrefix(nbn.toString(16));
    }
    return asciiToHex(val);
}

// Define interface for return type
interface To256Result {
    low: string | BN;
    high: string | BN;
}

function to256(val: string | BN): To256Result {
    if (!val) {
        return { low: '', high: '' };
    }
    let mask = new BN(2);
    mask = mask.pow(new BN(128));
    mask = mask.sub(new BN(1));

    const bigIn = toBN(val);

    return { 
        low: (bigIn as BN).and(mask), 
        high: (bigIn as BN).shrn(128) 
    };
}

// Define interface for return type
interface ToBig3Result {
    D0: string | BN;
    D1: string | BN;
    D2: string | BN;
}

function toBig3(val: string | BN): ToBig3Result {
    if (!val) {
        return { D0: '', D1: '', D2: '' };
    }
    let mask = new BN(2);
    mask = mask.pow(new BN(86));
    mask = mask.sub(new BN(1));
    const bigIn = toBN(val);

    const D0 = (bigIn as BN).and(mask);
    const bigInShifted = (bigIn as BN).shrn(86);
    const D1 = bigInShifted.and(mask);
    const D2 = bigInShifted.shrn(86);

    return { D0, D1, D2 };
}

function removeHexPrefix(hex: string): string {
    let hexTrim = hex.replace(/^0x/, '');
    if (hexTrim.length % 2 === 1) {
        hexTrim = '0' + hexTrim;
    }
    return hexTrim;
}

function addHexPrefix(hex: string): string {
    return `0x${removeHexPrefix(hex)}`;
}

function startWith0xAndIsHex(val: string): boolean {
    return val.startsWith('0x') && isHex(val);
}

function isHex(val: string): boolean {
    const cleanedInput = removeHexPrefix(val);
    const regexp = /^[0-9a-fA-F]+$/;
    return regexp.test(cleanedInput);
}

function isDecimal(val: string): boolean {
    const decimalRegex = /^[0-9]+$/;
    return decimalRegex.test(val);
}

function feltToString(felt: string | number): string | null {
    // Convert to hex string if not already
    let hex: string;
    if (typeof felt === 'number') {
        hex = felt.toString(16); // Convert number to hex
    } else {
        hex = felt.startsWith('0x') ? felt.slice(2) : felt; // Remove '0x' prefix if present
    }

    // Ensure hex is valid and not empty
    if (!hex || !isHex(`0x${hex}`)) return null;

    try {
        // Split into byte pairs and convert to characters
        const matches = hex.match(/.{1,2}/g);
        if (!matches) return null;

        const str = matches
            .map(byte => String.fromCharCode(parseInt(byte, 16)))
            .join('');
        return str;
    } catch (e) {
        console.error("Failed to decode felt to string:", e);
        return null;
    }
}

// Define the utils object type
interface Utils {
    toBN: (val: string | BN) => string | BN;
    removeHexPrefix: (hex: string) => string;
    addHexPrefix: (hex: string) => string;
    to256: (val: string | BN) => To256Result;
    toBig3: (val: string | BN) => ToBig3Result;
    isDecimal: (val: string) => boolean;
    toHex: (val: string) => string;
    toByteArray: (val: string) => string;
    toSelector: (val: string) => string | BN;
    startWith0xAndIsHex: (val: string) => boolean;
    feltToString: (input: string) => string | null;
}

export const utils: Utils = {
  toBN,
  removeHexPrefix,
  addHexPrefix,
  to256,
  toBig3,
  isDecimal,
  toHex,
  toByteArray,
  toSelector,
  startWith0xAndIsHex,
  feltToString,
};
