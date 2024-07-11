import fucktable from "./hashprocess/fucktable";
import type { Options, Hashcat, Hashtable } from "./dist";

class HashcatProcess implements Hashcat {
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
}

const HashcatInstance = new HashcatProcess(fucktable);