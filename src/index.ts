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

    public transformBinary(input: number, options?: Options): string {
        const stack = [];
        const sign = input < 0 ? this.table[0] : '';
        const { base, length } = { ...this.defaultopt, ...options };
        let num;
        let result = '';
        let expectedLen = 0;
        let shouldUseLen = false;

        if (length != undefined && !Number.isNaN(length)) {
            if (length <= 0) {
                throw new Error("length must be greater than 0");
            }
            shouldUseLen = true;
            expectedLen = length - (sign ? 1 : 0);
        }

    }
}

const HashcatInstance = new HashcatProcess(fucktable);