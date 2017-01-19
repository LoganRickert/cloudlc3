
class MemoryCell {
    constructor(label, hex) {
        this.label = label;
        this.hex = hex;
    }
    
    getLabel() {
        return this.label;
    }
    
    getHex() {
        return this.hex;
    }
}

class Memory {
    constructor(memLength ) {
        this.memLength = memLength;
        this.memory = {
            0x3003: new MemoryCell("", 0x000f)
        };
    }
    
    getLabel(m) {
        return this.memory[m] ?
            this.memory[m].getLabel() : "";
    }
     
    getHex(m) {
        return this.memory[m] ?
            this.memory[m].getHex() : 0xffff;
    }
}
