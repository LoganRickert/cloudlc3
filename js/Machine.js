
class Machine {
    constructor() {
        this.memory = new Memory(0xffff);
        this.cpu = new CPU(8, 0xffff);
    }
    
    step() {
        var instruction = this.getMemoryCell(this.cpu.getPC()).getHex();
        this.cpu.exec(instruction);
    }
    
    next() {
        
    }
    
    finish() {
        
    }
    
    run() {
        
    }
    
    getMemoryCell(i) {
        return this.memory.getMemoryCell(i);
    }
}
