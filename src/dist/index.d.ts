export type hashtable = { [key: string]: string };
export type Options = { base: number, len?: number };
export interface Hashcat { table: hashtable, maxbase: number ,defaultopt: Options }
