
class MemoryCell {
    constructor(label, hex) {
        if (label) {
            this.label = label;
        } else {
            this.label = "";
        }
        
        if (hex) {
            this.hex = hex;
        } else {
            this.hex = 0xffff;
        }
    }
    
    getLabel() {
        return this.label;
    }
    
    getHex() {
        return this.hex;
    }
}

class Memory {
    constructor(memLength) {
        this.memLength = memLength;
        this.memory = {
            0x3003: new MemoryCell("", 0x000f),
            0x3000: new MemoryCell("", 0b0001000000100111)
        };
    }
    
    getMemoryCell(i) {
        return this.memory[i] ? this.memory[i] : new MemoryCell();
    }
}
