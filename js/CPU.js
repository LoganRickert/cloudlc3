
var instructionSet = {
    "add": 0x1,
    "and": 0x5,
    "br": 0x0,
    "jmp": 0xc,
    "jsp": 0x4,
    "jsrr": 0x4,
    "ld": 0x2,
    "ldi": 0xa,
    "ldr": 0x6,
    "lea": 0xe,
    "not": 0x9,
    "ret": 0xc,
    "rti": 0x8,
    "st": 0x3,
    "sti": 0xb,
    "str": 0x7,
    "trap": 0xf
}

class Register {
    constructor(width) {
        this.value = 0;
        this.width = width;
    }
    
    setValue(value) {
        this.value = value & this.width;
    }
    
    acc() {
        this.setValue(this.value + 1);
    }
    
    getValue() {
        return this.value;
    }
}

class CPU {
    constructor(regCount, width) {
        this.createRegisters(regCount, width);
        // program counter
        this.pc = new Register(width);
        // Instruction Register
        this.ir = new Register(width);
        this.psr = new Register(width);
        
        this.setPC(0x3000);
    }
    
    createRegisters(regCount, width) {
        this.registers = [regCount];
        
        for (var i = 0; i < regCount; i++) {
            this.registers[i] = new Register(width);
        }
    }
    
    setPC(value) {
        this.pc.setValue(value);
    }
    
    getPC() {
        return this.pc.getValue();
    }
    
    accPC() {
        this.pc.acc();
    }
    
    exec(instruction) {
        console.log(itosh(instruction));
        
        var ins = (instruction & 0xf000) >> 12;
        var arg = (instruction & 0x0fff);
        
        console.log(itosh(ins));
        
        switch(ins) {
            // Add
            case instructionSet["add"]:
                console.log("adding...");
                this.add(arg);
                break;
            default:
                console.log("Command not found...");
                break;
        }
        
        this.accPC();
    }
    
    add(arg) {
        var type = arg & 0b100000;
        var dr = arg & 0b111000000000;
        var sr1 = arg & 0b111000000;
        
        var toadd = 0;
        
        // type = 0 - register add
        // type = 1 - imm5
        if (type == 0) {
            var sr2 = arg & 0b111;
            toadd = this.registers[sr2].getValue();
        } else {
            toadd = arg & 0b11111;
        }
        
        var sr1v = this.registers[sr1].getValue();
        this.registers[dr].setValue(sr1v + toadd);
        
        console.log(this.registers[dr].getValue());
    }
}
