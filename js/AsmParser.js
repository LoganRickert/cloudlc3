
var asmSet = {
    "ret":   0xc1c0,
    "rti":   0x8000,
    "getc":  0xf020,
    "out":   0xf021,
    "puts":  0xf022,
    "in":    0xf023,
    "putsp": 0xf024,
    "halt":  0xf025
}

class AsmParser {
    
    parse(program) {
        program = this._cleanupInstructions(
            program.replace(/\r/g, "").split("\n")
        );
        
        var orig = this._findOrig(program);
        
        if (orig === -1) {
            return {
                errors: ["No .orig found!"]
            };
        } else if (isNaN(orig)) {
            return {
                errors: ["Orig is not a number!"]
            };
        } else {
            console.log("Orig at: " + orig);
        }
        
        var instructions = {};
        
        var symbols = this._getSymbols(program);
        var rSymbols = this._reverse(symbols);
        
        console.log(symbols);
        console.log(rSymbols);
        
        var addr = orig;
        
        // 1 to skip orig instruction.
        for (var i = 1; i < program.length; i++) {
            var instruction = program[i];
            var token = instruction[0].toLowerCase();
            var s = 1;
            
            console.log(instruction);
            console.log(token);
            
            if (instructionSet[token] === undefined && !asmSet[token] && token[0] !== '.' && token.match(/[a-z][a-z0-9_]*/)) {
                // symbol!!!
                if (instruction.length === 1) {
                    continue;
                } else {
                    token = instruction[1].toLowerCase();
                    s++;
                }
            }
            
            console.log(token);
            console.log("? " + instructionSet[token])
            
            if (instructionSet[token] !== undefined) {
                instruction = this._lower(instruction);
                switch (token) {
                    case "add":
                        instructions[addr] = {
                            hex: this._add(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "not":
                        instructions[addr] = {
                            hex: this._not(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "and":
                        instructions[addr] = {
                            hex: this._and(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "lea":
                        instructions[addr] = {
                            hex: this._lea(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "ld":
                        instructions[addr] = {
                            hex: this._ld(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "ldi":
                        instructions[addr] = {
                            hex: this._ldi(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "ldr":
                        instructions[addr] = {
                            hex: this._ldr(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "st":
                        instructions[addr] = {
                            hex: this._st(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "sti":
                        instructions[addr] = {
                            hex: this._sti(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "str":
                        instructions[addr] = {
                            hex: this._str(instruction.slice(s), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    case "br":
                    case "brz":
                    case "brn":
                    case "brp":
                    case "brnz":
                    case "brzp":
                    case "brnp": 
                    case "brnzp":
                        instructions[addr] = {
                            hex: this._br(instruction.slice(s-1), symbols, addr),
                            label: rSymbols[addr]
                        }
                        break;
                    default:
                        console.log("Hit default");
                        instructions[addr] = {
                            hex: 0xFFF0,
                            label: rSymbols[addr]
                        }
                        break;
                }
                addr++;
            } else if (asmSet[token]) {
                instructions[addr] = {
                    hex: asmSet[token],
                    label: rSymbols[addr]
                }
                addr++;
            } else if (token[0] === '.') {
                if (token === ".fill") {
                    instructions[addr] = {
                        hex: this._toint(instruction[s]),
                        label: rSymbols[addr]
                    }
                    addr++;
                } else if (token === ".blkw") {
                    var dist = this._toint(instruction[s]);
                    
                    for (var j = 0; j < dist; j++) {
                        instructions[addr] = {
                            hex: 0x0,
                            label: rSymbols[addr]
                        }
                        addr++;
                    }
                } else if (token === ".stringz") {
                    var str = instruction.slice(s).join(" ");
                    str = str.substr(1, str.length - 2);
                    
                    var dist = str.length;
                    
                    console.log("String: " + str);
                    
                    for (var j = 0; j < dist; j++) {
                        instructions[addr] = {
                            hex: str.charCodeAt(j) & 0xff,
                            label: rSymbols[addr]
                        }
                        addr++;
                    }
                    
                    instructions[addr] = {
                        hex: 0,
                        label: rSymbols[addr]
                    }
                    addr++;
                }
            }
        }
        
        return {instructions: instructions, orig: orig};
    }
    
    _add(args, symbols, addr) {
        if (args.length !== 3 || args[0][0] !== 'r' || args[1][0] !== 'r' || args[0].length > 2 || args[1].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with ADD '" + args + "'."
            }
        }
        
        var instruction = instructionSet["add"] << 12;
        
        var dr = parseInt(args[0][1]);
        var sr1 = parseInt(args[1][1]);
        var toadd = args[2];
        
        instruction += dr << 9;
        instruction += sr1 << 6;
        
        if (toadd[0] === 'r' && toadd.length === 2) {
            var sr2 = parseInt(toadd[1]);
            instruction += sr2;
        } else if (!isNaN(this._toint(toadd, 5))) {
            instruction += 0x20;
            instruction += this._toint(toadd, 5) & 0x1f;
        } else {
            return {
                error: "Error on line " + itosh(addr) + " with ADD '" + args + "'. Last arg invalid."
            }
        }
        
        return instruction;
    }
    
    _not(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[1][0] !== 'r' || args[0].length > 2 || args[1].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with NOT '" + args + "'."
            }
        }
        
        var instruction = instructionSet['not'] << 12;
        
        var dr = parseInt(args[0][1]);
        var sr1 = parseInt(args[1][1]);
        var toadd = args[2];
        
        instruction += dr << 9;
        instruction += sr1 << 6;
        instruction += 0b111111;
        
        return instruction;
    }
    
    _lea(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[0].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LEA '" + args + "'."
            }
        }
        
        var instruction = instructionSet['lea'] << 12;
        
        var dr = parseInt(args[0][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]];
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += dr << 9;
        instruction += pcoffset;
        
        return instruction;
    }
    
    _ld(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[0].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['ld'] << 12;
        
        var dr = parseInt(args[0][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += dr << 9;
        instruction += pcoffset;
        
        return instruction;
    }
    
    _ldi(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[0].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['ldi'] << 12;
        
        var dr = parseInt(args[0][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += dr << 9;
        instruction += pcoffset;
        
        return instruction;
    }
    
    _ldr(args, symbols, addr) {
        if (args.length !== 3 || args[0][0] !== 'r' || args[0].length > 2 || args[1][0] !== 'r' || args[1].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['ldr'] << 12;
        
        var dr = parseInt(args[0][1]);
        var sr = parseInt(args[1][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[2]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x2f;
        } else {
            pcoffset = this._toint(args[2]) & 0x2f;
        }
        
        instruction += dr << 9;
        instruction += sr << 6;
        instruction += pcoffset;
        
        console.log("LDRRRR " + itosh(instruction));
        
        return instruction;
    }
    
    _st(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[0].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['st'] << 12;
        
        var dr = parseInt(args[0][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += dr << 9;
        instruction += pcoffset;
        
        return instruction;
    }
    
    _sti(args, symbols, addr) {
        if (args.length !== 2 || args[0][0] !== 'r' || args[0].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['sti'] << 12;
        
        var dr = parseInt(args[0][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += dr << 9;
        instruction += pcoffset;
        
        return instruction;
    }
    
    _str(args, symbols, addr) {
        if (args.length !== 3 || args[0][0] !== 'r' || args[0].length > 2 || args[1][0] !== 'r' || args[1].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LD '" + args + "'."
            }
        }
        
        var instruction = instructionSet['str'] << 12;
        
        var dr = parseInt(args[0][1]);
        var sr = parseInt(args[1][1]);
        
        var pcoffset = -1;
        
        console.log("aflkasdfljkasdflf; " + args[1] + " " + symbols[args[1]]);
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[2]] - 1;
            
            console.log("test: " + (a).toString() + " " + (b).toString() + " " + " " + (a - b).toString() + " " + ((a - b) & 0x1ff).toString());
            
            pcoffset = (a - b) & 0x2f;
        } else {
            pcoffset = this._toint(args[2]) & 0x2f;
        }
        
        instruction += dr << 9;
        instruction += sr << 6;
        instruction += pcoffset;
        
        console.log("LDRRRR " + itosh(instruction));
        
        return instruction;
    }
    
    _br(args, symbols, addr) {
        if (args.length !== 2) {
            return {
                error: "Error on line " + itosh(addr) + " with LEA '" + args + "'."
            }
        }
        
        var instruction = 0;
        var tag = args[0].substr(2);
        var n = tag.indexOf("n") > -1;
        var z = tag.indexOf("z") > -1;
        var p = tag.indexOf("p") > -1;
        
        if (n) instruction += 1 << 11;
        if (z) instruction += 1 << 10;
        if (p) instruction += 1 << 9;
        
        var pcoffset = -1
        
        if (args[1] in symbols) {
            var b = addr;
            var a = symbols[args[1]];
    
            pcoffset = (a - b) & 0x1ff;
        } else {
            pcoffset = this._toint(args[1]) & 0x1ff;
        }
        
        instruction += pcoffset;
        
        return instruction;
    }
    
    _and(args, symbols, addr) {
        if (args.length !== 3 || args[0][0] !== 'r' || args[1][0] !== 'r' || args[0].length > 2 || args[1].length > 2) {
            return {
                error: "Error on line " + itosh(addr) + " with AND '" + args + "'."
            }
        }
        
        var instruction = instructionSet["and"] << 12;
        
        var dr = parseInt(args[0][1]);
        var sr1 = parseInt(args[1][1]);
        var toadd = args[2];
        
        instruction += dr << 9;
        instruction += sr1 << 6;
        
        if (toadd[0] === 'r' && toadd.length === 2) {
            var sr2 = parseInt(toadd[1]);
            instruction += sr2;
        } else if (!isNaN(this._toint(toadd))) {
            instruction += 0x20;
            instruction += (this._toint(toadd) & 0x1f);
        } else {
            return {
                error: "Error on line " + itosh(addr) + " with ADD '" + args + "'. Last arg invalid."
            }
        }
        
        return instruction;
    }
    
    _getSymbols(program) {
        var symbols = {};
        var addr = this._findOrig(program);
        
        for (var i = 1; i < program.length; i++) {
            var instruction = this._lower(program[i]);
            
            var token = instruction[0];
            
            if (instructionSet[token] === undefined && !asmSet[token] && token[0] != '.') {
                console.log("symbolz: " + token)
                // symbol!!!
                if (token.match(/[a-z][a-z0-9_]*/)) {
                    if (token in symbols) {
                        return {
                            errors: ["Duplicate symbol '" + token + "' at line " + i + ". Last found at line: " + itosh(symbols[token])]
                        };
                    }
                    
                    if (instruction.length === 1) {
                        symbols[token] = addr;
                    } else if (instruction[1][0] !== '.') {
                        symbols[token] = addr;
                        addr++
                    } else if (instruction[1][0] === '.'){
                        symbols[token] = addr;
                        
                        if (instruction.length >= 3 && instruction[1] === ".fill") {
                            addr++;
                        } else if (instruction.length >= 3 && instruction[1] === ".blkw") {
                            addr += this._toint(instruction[2]);
                        } else if (instruction.length >= 3 && instruction[1] === ".stringz") {
                            var str = instruction.slice(2).join(" ");
                            str = str.substr(1, str.length - 2);
                            addr += str.length+1;
                        } else {
                            return {
                                errors: ["Invalid asm instruction on line " + i + ". Make sure you didn't misspell it. " + instruction]
                            };
                        }
                    }
                } else {
                    return {
                        errors: ["Symbol '" + token + "' is invalid at line " + i]
                    };
                }
            } else {
                addr++;
            }
        }
        
        return symbols;
    }
    
    _reverse(dic) {
        var reverseSym = {};
        
        for (var s in dic) {
            var m = dic[s];
            reverseSym[m] = s;
        }
        
        return reverseSym;
    }
    
    _findOrig(program) {
        if (program.length > 0 && program[0][0].toLowerCase() === ".orig") {
            return this._toint(program[0][1]);
        } else {
            return -1;
        }
    }
    
    _cleanupInstructions(program) {
        var newProgram = [];
        
        for (var i = 0; i < program.length; i++) {
            var tokens = this._splitInstruction(program[i]);
            
            if (tokens && tokens.length > 0) {
                newProgram.push(tokens);
            }
        }
        
        return newProgram;
    }
    
    _splitInstruction(line) {
        var instruction = line.trim().split(';', 1)[0].split(/,| |\t/);
        
        if (instruction.length > 0 && instruction[0] != "") {
            var tokens = [];
            
            for (var i = 0; i < instruction.length; i++) {
                if (instruction[i] != "") {
                    tokens.push(instruction[i]);
                }
            }
            
            return tokens;
        } else {
            return false;
        }
    }
    
    _toint(n, bit = -1, mask = -1) {
        var num = NaN;
        
        console.log("Passed in: " + n);
        
        if (n.length >= 2) {
            if (n[0] == "x") {
                n = n.slice(1);
                if (n.match("[0-9A-F]+")) {
                    num = parseInt(n, 16);
                }
            } else if (n[0] == "#") {
                var sign = 1;
                
                if (n.length >= 3 && n[1] === '-') {
                    sign = -1;
                    n = n.slice(2);
                } else {
                    n = n.slice(1);
                }
                
                num = sign * parseInt(n);
            }
        }
        
        num &= 0xffff;
        
        if (bit > 0) {
            var t = (num << (16 - bit)) & 0xffff;
            t = t >> (16 - bit);
            t = t >> (bit - 1);
            
            if (!isNaN(num) && bit > 0 && t === 1) {
                console.log(num.toString(2));
                num ^= 0xffff;
                num += 1;
                num = num * -1;
                console.log(num);
                console.log(num.toString(2));
            }
        }
        
        
        return num;
    }
    
    _lower(x) {
        var l = [];
        
        for (var i = 0; i < x.length; i++) {
            l.push(x[i].toLowerCase());
        }
        
        return l;
    }
}
