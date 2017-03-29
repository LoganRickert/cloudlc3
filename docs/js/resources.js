
var res = [
    [
        "Binary",
        "Hex",
        "AND, OR, and NOT",
        "XOR",
        "Floating Point",
        "ASCII",
        "Binary Add and Subtract",
        "Binary Multiply and Divide",
        "Overflow and Underflow",
        "Signed and Unsigned Ints",
        "2's Complement",
    ],
    [
        "ADD",
        "AND",
        "BR",
        "JMP",
        "JSR",
        "JSRR",
        "LD",
        "LDI",
        "LDR",
        "LEA",
        "NOT",
        "RET",
        "RTI",
        "ST",
        "STI",
        "STR",
        "TRAP"
    ]
]

function loadSidebar() {
    var el = document.getElementById("sidebar");
    var end = "";
    
    for (var i = 0; i < res.length; i++) {
        var t = res[i];
        end += "<h4>Section " + (i + 1) + "</h4>";
        end += "<ul>";
        
        for (var j = 0; j < t.length; j++) {
            var tt = t[j];
            // end += "<li><a href='" + window.location.protocol + "//" + window.location.host + "/lc3/res/" + tt.replace(/ /g, "").toLowerCase() + ".php'>" + tt + "</a></li>";
            end += "<li><a href='" + window.location.protocol + "//" + window.location.host + "/lc3/res/binary.php'>" + tt + "</a></li>";
        }
        
        end += "</ul>";
    }
    
    el.innerHTML = end;
}

loadSidebar();
