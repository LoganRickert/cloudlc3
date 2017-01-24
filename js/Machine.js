
var instructionSet = {
    "add": 0x1,
    "and": 0x5,
    "br": 0x0,
    "brz": 0x0,
    "brn": 0x0,
    "brp": 0x0,
    "brnz": 0x0,
    "brzp": 0x0,
    "brnp": 0x0,
    "brnzp": 0x0,
    "jmp": 0xc,
    "jsp": 0x4,
    "jsrr": 0x4,
    "ld": 0x2,
    "ldi": 0xa,
    "ldr": 0x6,
    "lea": 0xe,
    "not": 0x9,
    "st": 0x3,
    "sti": 0xb,
    "str": 0x7,
    "trap": 0xf,
}

class Machine {
    constructor() {
        this.memory = new Memory(0xffff);
        this.cpu = new CPU(8, 0xffff);
        this.cpu.setIR(this.getMemoryCell(this.cpu.getPC()).getHex());
    }
    
    newCPU() {
        this.cpu = null;
        this.cpu = new CPU(8, 0xffff);
        var instruction = this.getMemoryCell(this.cpu.getPC()).getHex();
        this.cpu.setIR(instruction);
    }
    
    step() {
        this.cpu.exec(this.memory);
        var instruction = this.getMemoryCell(this.cpu.getPC()).getHex();
        this.cpu.setIR(instruction);
        
        refreshView(1);
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
    
    getRegister(i) {
        return this.cpu.getRegister(i);
    }
    
    getPC() {
        return this.cpu.getPC();
    }
    
    getIR() {
        return this.cpu.getIR();
    }
    
    getPSR() {
        return this.cpu.getPSR();
    }
    
    getCC() {
        return this.cpu.getCC();
    }
    
    setPC(v) {
        this.cpu.setPC(v);
        var instruction = this.getMemoryCell(this.cpu.getPC()).getHex();
        this.cpu.setIR(instruction);
    }
    
    keyPressed(k) {
        this.memory.keyPressed(k);
    }
    
    loadAsm(program) {
        var a = new AsmParser();
        var fb = a.parse(program);
        
        if (!fb.errors) {
            for (var inst in fb.instructions) {
                var instruction = fb.instructions[inst]
                if (instruction.hex.error) {
                    console.log(instruction.hex.error);
                } else {
                    this.memory.setMemoryCell(inst, new MemoryCell(instruction.label, instruction.hex));
                }
            }
            
            console.log(this.memory);
            
            this.cpu.setPC(fb.orig);
            
            var instruction = this.getMemoryCell(this.cpu.getPC()).getHex();
            this.cpu.setIR(instruction);
            
            refreshView();
        } else {
            console.log(fb.errors);
        }
    }
    
    getMemory() {
        return this.memory;
    }
    
    getCPU() {
        return this.cpu;
    }
    
}
