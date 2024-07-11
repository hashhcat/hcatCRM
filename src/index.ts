import fucktable from "./hashprocess/fucktable";
import type { Options, Hashcat, Hashtable } from "./dist";

class HashcatProcess {
    public table: Hashtable;
    private maxbase: number;
    private defaultopt: Options;
    constructor(table: Hashtable) {
        if (!table ||typeof table != 'object' || !Object.keys(table).length) {
            throw new Error('table must contain a dictionary');
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
}

const HashcatInstance = new HashcatProcess(fucktable);