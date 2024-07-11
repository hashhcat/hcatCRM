import fucktable from "./hashprocess/fucktable";
import type { Options, Hashtable, Hashcat } from "./dist";

class HashcatProcess implements Hashcat {
  public table: Hashtable;
  private maxbase: number;
  private defaultopt: Options;

  constructor(table: Hashtable) {
    if (!table || typeof table !== "object" || !Object.keys(table).length) {
      throw new Error("table must contain a dictionary");
    }
    this.table = table;
    this.maxbase = Object.keys(this.table).length;
    this.defaultopt = { base: this.maxbase };
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
    const sign = input < 0 ? this.table[0] : "";
    const { base, length } = { ...this.defaultopt, ...options };
    let num: number;
    let result = "";
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

  public useTable(newTable: Hashtable): void {
    if (!newTable || typeof newTable !== "object" || !Object.keys(newTable).length) {
      throw new Error("newTable must contain a dictionary");
    }
    this.table = newTable;
    this.maxbase = Object.keys(this.table).length;
    this.defaultopt.base = this.maxbase;
  }
}

const HashcatInstance = new HashcatProcess(fucktable);

export { HashcatInstance, HashcatProcess };
export const getHash = HashcatInstance.getHash.bind(HashcatInstance);
export const useTable = HashcatInstance.useTable.bind(HashcatInstance);
export const getBitwise = HashcatInstance.getBitwise.bind(HashcatInstance);
export const transformBinary = HashcatInstance.transformBinary.bind(HashcatInstance);
export default HashcatInstance;
