
class GUI {
    
    constructor(el) {
        this.el = el;
        this.context = this.el.getContext('2d');
        this.objs = {};
        this.pixelSize = 4;
        
        this.clear();
    }
    
    clear() {
        this.context.clearRect(0, 0, this.el.width, this.el.height);
    }
    
    draw(x, y, w = 1, h = 1, r = 221, b = 221, g = 221, a = 1) {
        r *= 16;
        g *= 16;
        b *= 16;
        
        if (x * this.pixelSize > 512) return;
        if (y * this.pixelSize > 288) return;
        
        // console.log("Drawing on the gui! -" + x + "- -" + y + "- -" + w + "- -" + h + "- -" + r + "- -" + g + "- -" + b + "- -" + a + "-");
        
        this.context.beginPath();
        this.context.rect(
            x * this.pixelSize,
            y * this.pixelSize,
            w * this.pixelSize,
            h * this.pixelSize);
        this.context.fillStyle = "rgba(" + r + ", " + b + ", " + g + ", " + a + ")"; 
        this.context.fill();
    }
    
    show() {
        $(this.el).parent().parent().parent().slideDown();
    }
    
    hide() {
        $(this.el).parent().parent().parent().slideUp();
    }
    
}
