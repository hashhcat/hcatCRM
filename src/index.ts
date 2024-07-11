import { Hashtable, Options, Hashcat } from './dist';
import bytestables from './hashprocess/fucktable';

class HashcatProcess implements Hashcat {
  table: Hashtable;
  defaultopt: Options;
  maxbase: number;

  constructor() {
    this.table = bytestables as Hashtable;
    const base = Object.keys(this.table).length;
    this.maxbase = base;
    this.defaultopt = {
      base
    };
  }

  getHash(input: string, options?: Options): string {
    return this.transformBinary(this.getBitwise(input), options);
  }

  getBitwise(str: string): number {
    let hash = 0;
    if (str.length == 0) {
      return hash;
    }

    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      hash = (hash << 5) - hash + ch;
      hash = hash & hash; //conv to 32bytes int
    }
    return hash;
  }

  transformBinary(input: number, options?: Options): string {
    const stack = [];
    const sign = input < 0 ? this.table[0] : '';
    const { base, length } = options ?? this.defaultopt;
    let num;
    let result = '';
    let expectedLen = 0;
    let shouldUseLen = false;

    if (length !== null && length !== undefined && !Number.isNaN(length)) {
      if (length <= 0) {
        throw new Error("length must be greater than 0");
      }
      shouldUseLen = true;
      expectedLen = length - (sign ? 1 : 0);
    }
    if (base > this.maxbase) {
      throw new Error(`base must be less than or equal to ${this.maxbase}`);
    }

    input = Math.abs(input);
    while (input >= base) {
      if (shouldUseLen && stack.length >= expectedLen) {
        break;
      }
      num = input % base;
      input = Math.floor(input / base);
      stack.push(this.table[num]);
    }
    if (input > 0 && input < base) {
      if (!shouldUseLen || (shouldUseLen && stack.length < expectedLen)) {
        stack.push(this.table[input]);
      }
    }

    for (let i = stack.length - 1; i >= 0; i--) {
      result += stack[i];
    }
    return sign + result;
  }

  useTable(newTable: Hashtable): void {
    if (!newTable || typeof newTable !== 'object' || !Object.keys(newTable).length) {
      throw new Error('invalid table, must to be contains a dictionary with at least one key-value pair');
    }
    this.table = newTable;
    const base = Object.keys(this.table).length;
    this.maxbase = base;
    this.defaultopt = { ...this.defaultopt, base };
  }
}

const instance = new HashcatProcess();
export const getHash = instance.getHash.bind(instance);
export const getBitwise = instance.getBitwise.bind(instance);
export const transformBinary = instance.transformBinary.bind(instance);
export const useTable = instance.useTable.bind(instance);
export default instance;