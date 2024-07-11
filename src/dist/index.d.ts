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
}