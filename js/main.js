
var mtr = "<tr>\
    <th></th>\
    <th>Addr</th>\
    <th>Label</th>\
    <th>Hex</th>\
    <th>Instruction</th>\
</tr>";

function itosh(i) {
    return "x" + (i | 0x10000).toString(16).substr(1,4).toUpperCase();
}

var memory = new Memory(0xffff);

var machine = new Machine();

// Starting memory address
var sm = 0x3000;

function shiftMemory(delta) {
    sm += delta
    loadMemory(sm);
}

function setMemoryToPC() {
    sm = 0x3000;
    loadMemory(sm);
}

/*
    sm - Starting memory address
*/
function loadMemory(sm) {
    var el = document.getElementById("memory-unit-memory");
    
    var newInner = mtr;
    
    var endingAddress = 0x8;
    
    for (var i = sm; i < sm + endingAddress; i++) {
        newInner += "<tr>\
            <td><button id='memory-unit-breakpoint'>Br</button></td>\
            <td>" + itosh(i) + "</td>\
            <td>" + machine.getMemoryCell(i).getLabel() + "</td>\
            <td>" + itosh(machine.getMemoryCell(i).getHex()) + "</td>\
            <td>NOP</td>";
        newInner += "</tr>";
    }
    
    el.innerHTML = newInner;
}

loadMemory(sm);

machine.step();
