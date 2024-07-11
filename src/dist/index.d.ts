export interface Hashtable {
  [key: string]: string;
}

export interface Options {
  base: number;
  length?: number;
}
  
export interface Hashcat {
  table: Hashtable;
  defaultopt: Options;
  maxbase: number;
  getHash(input: string, options?: Options): string;
  getBitwise(str: string): number;
  transformBinary(input: number, options?: Options): string;
  useTable(newTable: Hashtable): void;
}
