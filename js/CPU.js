
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
    
    changeValue(delta) {
        this.setValue(this.value + delta);
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
        this.setPSR(0, 7, 0);
    }
    
    createRegisters(regCount, width) {
        this.registers = [regCount];
        
        for (var i = 0; i < regCount; i++) {
            this.registers[i] = new Register(width);
        }
    }
    
    setMode(mode) {
        this.psr.setValue(
            (mode << 15) | this.psr.getValue()    
        )
    }
    
    setPriority(priority) {
        this.psr.setValue(
            (priority << 7) | this.psr.getValue()    
        )
    }
    
    setPSR(mode, priority, nzp) {
        this.setMode(mode);
        this.setPriority(priority)
    }
    
    getPSR() {
        return this.psr;
    }
    
    setPC(value) {
        this.pc.setValue(value);
    }
    
    getPC() {
        return this.pc.getValue();
    }
    
    setIR(value) {
        this.ir.setValue(value);
    }
    
    getIR() {
        return this.ir.getValue();
    }
    
    getPSR() {
        return this.psr.getValue();
    }
    
    accPC() {
        this.pc.acc();
    }
    
    getRegister(i) {
        return this.registers[i]
    }
    
    setCC(c) {
        this.psr.setValue(
            (this.psr.getValue() & 0xfff8) | c
        )
    }
    
    getCC() {
        return this.psr.getValue() & 0x7;
    }
    
    newCC(v) {
        var sign = ((v & 0xffff) >> 0xf) === 1 ? -1 : 1;
        
        if (v === 0) this.setCC(0b010);
        else if (sign < 0) this.setCC(0b100);
        else if (sign > 0) this.setCC(0b001);
    }
    
    setRegister(i, x) {
        this.registers[i].setValue(x);
    }
    
    exec(memory) {
        var instruction = this.ir.getValue();
        this.accPC();
        
        var ins = (instruction & 0xf000) >> 12;
        var arg = (instruction & 0x0fff);
        
        switch(ins) {
            case instructionSet["add"]:
                this.add(arg);
                break;
            case instructionSet["not"]:
                this.not(arg);
                break;
            case instructionSet["and"]:
                this.and(arg);
                break;
            case instructionSet["lea"]:
                this.lea(arg);
                break;
            case 0x0:
                this.br(arg);
                break;
            case instructionSet["ld"]:
                this.ld(arg, memory);
                break;
            case instructionSet["ldi"]:
                this.ldi(arg, memory);
                break;
            case instructionSet["ldr"]:
                this.ldr(arg, memory);
                break;
            case instructionSet["st"]:
                this.st(arg, memory);
                break;
            case instructionSet["sti"]:
                this.sti(arg, memory);
                break;
            case instructionSet["str"]:
                this.str(arg, memory);
                break;
            case instructionSet["trap"]:
                if (arg !== 0x0fff)
                    this.trap(arg, memory);
                break;
            case instructionSet["jsr"]:
                this.jsr(arg);
                break;
            case instructionSet["ret"]:
            case instructionSet["jmp"]:
                this.jmp(arg, memory);
                break;
            
            default:
                break;
        }
    }
    
    add(arg) {
        var type = (arg & 0b100000) >> 5;
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        var toadd = 0;
        
        // type = 0 - register add
        // type = 1 - imm5
        if (type == 0) {
            var sr2 = arg & 0b111;
            toadd = this.registers[sr2].getValue();
        } else {
            toadd = this.bextend(arg & 0b11111, 5);
        }
        
        var sr1v = this.registers[sr1].getValue();
        this.registers[dr].setValue(sr1v + toadd);
        
        this.newCC(this.registers[dr].getValue());
    }
    
    and(arg) {
        var type = (arg & 0b100000) >> 5;
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        var toadd = 0;
        
        // type = 0 - register add
        // type = 1 - imm5
        if (type == 0) {
            var sr2 = arg & 0b111;
            toadd = this.registers[sr2].getValue();
        } else {
            toadd = this.bextend(arg & 0b11111, 5);
        }
        
        var sr1v = this.registers[sr1].getValue();
        this.registers[dr].setValue(sr1v & toadd);
        
        this.newCC(this.registers[dr].getValue());
        
        console.log(this.registers[dr].getValue());
    }
    
    not(arg) {
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        this.registers[dr].setValue(~this.registers[sr1].getValue());
        
        this.newCC(this.registers[dr].getValue());
    }
    
    lea(arg) {
        var dr = (arg & 0b111000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        
        this.registers[dr].setValue(this.getPC() + offset);
        
        this.newCC(this.registers[dr].getValue());
    }
    
    br(arg) {
        var n = (arg & 0b100000000000) >> 11;
        var z = (arg & 0b010000000000) >> 10;
        var p = (arg & 0b001000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        
        if (this.getCC() & 0b100 && n === 1 ||
            this.getCC() & 0b010 && z === 1 ||
            this.getCC() & 0b001 && p === 1) {
            this.pc.changeValue(offset);
        }
    }
    
    ld(arg, memory) {
        var dr = (arg & 0b111000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        
        this.registers[dr].setValue(memory.getMemoryCell(this.getPC() + offset, false).getHex(), false);
        
        this.newCC(this.registers[dr].getValue());
    }
    
    ldi(arg, memory) {
        var dr = (arg & 0b111000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        
        var mem = memory.getMemoryCell(this.getPC() + offset, false).getHex()
        
        this.registers[dr].setValue(memory.getMemoryCell(mem, false).getHex());
        
        this.newCC(this.registers[dr].getValue());
    }
    
    ldr(arg, memory) {
        var dr = (arg & 0b111000000000) >> 9;
        var sr = (arg & 0b111000000) >> 6;
        var offset = this.bextend(arg & 0x3f, 6);
        
        var rv = this.registers[sr].getValue();
        
        var mem = memory.getMemoryCell(rv + this.signed(offset), false).getHex();
        
        this.registers[dr].setValue(mem);
        
        this.newCC(this.registers[dr].getValue());
    }
    
    st(arg, memory) {
        var sr = (arg & 0b111000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        sr = this.registers[sr].getValue();
        
        memory.updateMemoryCell(this.getPC() + offset, sr);
    }
    
    sti(arg, memory) {
        var sr = (arg & 0b111000000000) >> 9;
        var offset = this.bextend(arg & 0x1ff, 9);
        sr = this.registers[sr].getValue();
        
        var mem = memory.getMemoryCell(this.getPC() + offset, false).getHex();
        
        memory.updateMemoryCell(mem, sr);
    }
    
    str(arg, memory) {
        var dr = (arg & 0b111000000000) >> 9;
        var sr = (arg & 0b111000000) >> 6;
        var offset = this.bextend(arg & 0x3f, 6);
        
        var rv = this.registers[sr].getValue();
        
        memory.updateMemoryCell(rv + this.signed(offset), this.registers[dr].getValue());
    }
    
    trap(arg, memory) {
        var offset = arg & 0xff;
        this.registers[0x7].setValue(this.getPC());
        
        var to = memory.getMemoryCell(offset, false).getHex();
        
        this.setPC(to);
    }
    
    jmp(arg, memory) {
        var reg = (arg & 0x1c0) >> 6;
        this.setPC(this.registers[reg].getValue());
    }
    
    jsr(arg, memory) {
        var bitSwitched = (arg & 0x800) >> 11;
        
        console.log("----");
        console.log(arg)
        console.log(arg & 0x800);
        console.log(bitSwitched);
        
        this.registers[7].setValue(this.getPC());
        var newPC = -1;
        
        if (bitSwitched === 1) {
            console.log(arg & 0x7FF);
            console.log(this.bextend(arg & 0x7FF, 10));
            newPC = this.getPC() + this.bextend(arg & 0x7FF, 10);
        } else {
            console.log("Took wrong one.");
            newPC = this.registers[arg & 0x1C0 >> 6].getValue();
        }
        
        console.log("----");
        
        this.setPC(newPC);
    }
    
    bextend(v, a) {
        
        var b = v.toString(2)
        if ((v >> (a-1))) {
            while (b.length < 16) {
                b = "1" + b;
            }
        }
        
        return parseInt(b, 2);
    }
    
    signed(num, bit = 16) {
        var t = (num << (16 - bit)) & 0xffff;
        t = t >> (16 - bit);
        t = t >> (bit - 1);
        
        if (!isNaN(num) && bit > 0 && t === 1) {
            num ^= 0xffff;
            num += 1;
            num = num * -1;
        }
        
        return num;
    }
}
