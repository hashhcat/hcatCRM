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
  useTable(newTable: Hashtable): void {
    throw new Error('Method not implemented.');
  }

  public getHash(input: string, options?: Options): string {
    return this.transformBinary(this.getBitwise(input), options);
  }

  public getBitwise(str: string): number {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }

    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      hash = (hash << 5) - hash + ch;
      hash = hash & hash;
    }
    return hash;
  }

  public transformBinary(input: number, options?: Options): string {
    const stack: string[] = [];
    const sign = input < 0 ? this.table['0x0000'] : '';
    const { base, length } = { ...this.defaultopt, ...options };
    let num: number;
    let result = '';
    let expectedLen = 0;
    let shouldUseLen = false;

    if (length !== undefined && !Number.isNaN(length)) {
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
      stack.push(this.table[`0x${num.toString(16).toUpperCase().padStart(4, '0')}`]);
    }
    if (input > 0 && input < base) {
      if (!shouldUseLen || (shouldUseLen && stack.length < expectedLen)) {
        stack.push(this.table[`0x${input.toString(16).toUpperCase().padStart(4, '0')}`]);
      }
    }

    for (let i = stack.length - 1; i >= 0; i--) {
      result += stack[i];
    }
    return sign + result;
  }
}

const instance = new HashcatProcess()