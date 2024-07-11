export interface Hashtable {
    [key: number]: string;
  }
  
  export interface Options {
    base: number;
    length?: number;
  }
  
  export interface Hashcat {
    table: Hashtable;
    maxbase: number;
    defaultopt: Options;
  
    getHash(input: string, options?: Options): string;
    getBitwise(str: string): number;
    transformBinary(input: number, options?: Options): string;
    useTable(newTable: Hashtable): void;
  }