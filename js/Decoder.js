
var reverseAsmSet = {
    0xc1c0: "ret",
    0x8000: "rti",
    0xf020: "getc",
    0xf021: "out",
    0xf022: "puts",
    0xf023: "in",
    0xf024: "putsp",
    0xf025: "halt",
}

class Decoder {
    decode(instruction, addr, memory, cpu) {
        var asm = "NOP";
        
        if (reverseAsmSet[instruction]) {
            return reverseAsmSet[instruction].toUpperCase();
        } else {
            var ins = (instruction & 0xf000) >> 12;
            var arg = (instruction & 0x0fff);
            
            switch(ins) {
                case instructionSet["add"]:
                    asm = this.add(arg);
                    break;
                case instructionSet["not"]:
                    asm = this.not(arg);
                    break;
                case instructionSet["and"]:
                    asm = this.and(arg);
                    break;
                case instructionSet["lea"]:
                    asm = this.lea(arg, addr);
                    break;
                case instructionSet["ld"]:
                    asm = this.ld(arg, addr, memory, cpu);
                    break;
                case instructionSet["ldi"]:
                    asm = this.ldi(arg, addr, memory, cpu);
                    break;
                case instructionSet["ldr"]:
                    asm = this.ldr(arg, addr, memory, cpu);
                    break;
                case instructionSet["st"]:
                    asm = this.st(arg, addr, memory, cpu);
                    break;
                case instructionSet["sti"]:
                    asm = this.sti(arg, addr, memory, cpu);
                    break;
                case instructionSet["str"]:
                    asm = this.str(arg, addr, memory, cpu);
                    break;
                case 0:
                    asm = this.br(arg, addr, memory, cpu);
                    break;
                case 4:
                    asm = this.jsr(arg, addr, memory, cpu);
                    break;
                default:
                    break;
            }
        
            return asm;
        }
    }
    
    add(arg) {
        var type = (arg & 0b100000) >> 5;
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        var asm = "";
        
        if (predict) {
            asm += "R" + dr + " ";
            
            if (dr === sr1) {
                asm += "+= ";
            } else {
                asm += "= R" + sr1 + " + ";
            }
        
            // type = 0 - register add
            // type = 1 - imm5
            if (type == 0) {
                var sr2 = arg & 0b111;
                asm += "R" + sr2;
            } else {
                var toadd = this.getSigned(arg & 0b11111, 5, 0xf);
                asm += toadd;
            }
        } else {
            asm += "ADD R" + dr + ", R" + sr1 + ", ";
        
            // type = 0 - register add
            // type = 1 - imm5
            if (type == 0) {
                var sr2 = arg & 0b111;
                asm += "R" + sr2;
            } else {
                var toadd = this.getSigned(arg & 0b11111, 5, 0xf);
                asm += "#" + toadd;
            }
        }
        
        
        return asm;
    }
    
    not(arg) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        if (predict) {
            if (dr === sr1) {
                asm += "!R" + dr;    
            } else {
                asm += "R" + dr + " = !R" + sr1;
            }
        } else {
            var asm = "NOT ";
            asm += "R" + dr + ", R" + sr1;
        }
        
        return asm;
    }
    
    lea(arg, addr) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff) + 1;
        
        if (predict) {
            asm += "R" + dr + " = " + itosh(addr + pcoffset);
        } else {
            var asm = "LEA ";
            asm += "R" + dr + ", #" + pcoffset;
        }
        
        return asm;
    }
    
    ld(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff);
        addr += 1
        
        var m = memory.getMemoryCell(addr + pcoffset).getHex()
        
        if (predict) {
            asm += "R" + dr + " = " + itosh(m) + " (" + String.fromCharCode((m & 0xff00) >> 8) + String.fromCharCode(m & 0xff) + ")";
        } else {
            var asm = "LD ";
            asm += "R" + dr + ", #" + pcoffset;
        }
        
        return asm;
    }
    
    ldi(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff);
        addr += 1
        
        var m = memory.getMemoryCell(addr + pcoffset).getHex();
        m = memory.getMemoryCell(m).getHex();
        
        if (predict) {
            asm += "R" + dr + " = " + itosh(m) + " (" + String.fromCharCode((m & 0xff00) >> 8) + String.fromCharCode(m & 0xff) + ")";
        } else {
            var asm = "LDI ";
            asm += "R" + dr + ", #" + pcoffset;
        }
        
        return asm;
    }
    
    ldr(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var sr = (arg & 0b111000000) >> 6;
        var offset = this.getSigned(arg & 0x3f, 6, 0x1f);
        
        var add = cpu.getRegister(sr).getValue() + offset;
        var m = memory.getMemoryCell(add).getHex();
        
        if (predict) {
            asm += "R" + dr + " = " + itosh(m) + " (" + String.fromCharCode((m & 0xff00) >> 8) + String.fromCharCode(m & 0xff) + ")";
            // asm += "R" + dr + " = m[R" + sr + " + " + itosh(offset) + "]";
        } else {
            var asm = "LDR ";
            asm += "R" + dr + ", R" + sr + ", #" + offset;
        }
        
        return asm;
    }
    
    st(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff);
        addr += 1
        
        if (predict) {
            asm += "m[" + itosh(addr + pcoffset) + "] = " + itosh(cpu.getRegister(dr).getValue());
        } else {
            var asm = "ST ";
            asm += "R" + dr + ", #" + pcoffset;
        }
        
        return asm;
    }
    
    sti(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff);
        addr += 1
        
        var m = m = memory.getMemoryCell(addr + pcoffset).getHex();
        
        if (predict) {
            asm += "m[" + itosh(m) + "] = " + itosh(cpu.getRegister(dr).getValue());
        } else {
            var asm = "STI ";
            asm += "R" + dr + ", #" + pcoffset;
        }
        
        return asm;
    }
    
    str(arg, addr, memory, cpu) {
        var asm = "";
        var dr = (arg & 0b111000000000) >> 9;
        var sr = (arg & 0b111000000) >> 6;
        var offset = this.getSigned(arg & 0x3f, 6, 0x1f);
        
        if (predict) {
            asm += "m[R" + sr + " + " + itosh(offset) + "] = " + itosh(cpu.getRegister(dr).getValue());
        } else {
            var asm = "STR ";
            asm += "R" + dr + ", R" + sr + ", #" + offset;
        }
        
        return asm;
    }
    
    br(arg, addr, memory, cpu) {
        var asm = "";
        var n = (arg & 0b100000000000) >> 11;
        var z = (arg & 0b010000000000) >> 10;
        var p = (arg & 0b001000000000) >> 9;
        
        var pcoffset = this.getSigned(arg & 0x1ff, 9, 0xff);
        
        if (pcoffset === 0) return "NOP";
        
        var cc = cpu.getCC();
        var isn = (cc & 0b100) >> 2;
        var isz = (cc & 0b10) >> 1;
        var isp = cc & 0b1;
        
        if (predict) {
            asm = "";
            
            if ((isn === 1 && n === 1) ||
                (isz === 1 && z === 1) ||
                (isp === 1 && p === 1)
                ) {
                    asm += "[T] ";
                } else {
                    asm += "[F] ";
                }
            
            asm += "BR";
            
            if (n) asm += "n";
            if (z) asm += "z";
            if (p) asm += "p";
            
            asm += " " + itosh(pcoffset + addr + 1);
        } else {
            asm = "BR";
            
            if (n) asm += "n";
            if (z) asm += "z";
            if (p) asm += "p";
            
            asm += " " + itosh(pcoffset + addr + 1);
        }
        
        return asm;
    }
    
    and(arg) {
        var asm = "";
        var type = (arg & 0b100000) >> 5;
        var dr = (arg & 0b111000000000) >> 9;
        var sr1 = (arg & 0b111000000) >> 6;
        
        if (predict) {
            if (type == 0) {
                var sr2 = arg & 0b111;
                if (dr === sr1 && sr1 === sr2) {
                    asm += "NOP";   
                } else if (sr1 === sr2) {
                    asm += "R" + dr + " = R" + sr1;
                }
            } else {
                var toadd = this.getSigned(arg & 0b11111, 5, 0xf);
                if (toadd === 0) {
                    asm += "Clear R" + dr;
                } else {
                    asm += "R" + dr + " &= #" + toadd;
                }
            }
        } else {
            asm += "AND ";
            asm += "R" + dr + ", R" + sr1 + ", ";
            
            // type = 0 - register add
            // type = 1 - imm5
            if (type == 0) {
                var sr2 = arg & 0b111;
                asm += "R" + sr2;
            } else {
                var toadd = this.getSigned(arg & 0b11111, 5, 0xf);
                asm += "#" + toadd;
            }
        }
        
        return asm;
    }
    
    jsr(arg, addr, memory, cpu) {
        return "JSR";
    }
    
    getSigned(num, l, mask) {
        var sign = (num >> (l - 1)) === 1 ? -1 : 1;
        
        if (sign === -1) {
            var x = num >> (l - 1);
            x <<= (l - 1);
            num ^= 0xffff;
            num += 1;
            num &= mask
        }
        
        return sign * num;
    }
}
