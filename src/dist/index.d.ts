export interface Hashtable {
    [key: number]: string;
  }
  
  export interface Options {
    base: number;
    length?: number;
  }
  
  export interface Hashcat {
    table: Hashtable;
    getHash(input: string, options?: Options): string;
    getBitwise(str: string): number;
    transformBinary(input: number, options?: Options): string;
    useTable(newTable: Hashtable): void;
  }
  