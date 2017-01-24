
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
        this.context.beginPath();
        this.context.rect(
            x * this.pixelSize,
            y * this.pixelSize,
            w * this.pixelSize,
            h * this.pixelSize);
        this.context.fillStyle = "rgba(" + r + ", " + b + ", " + g + ", " + a + ")"; 
        this.context.fill();
    }
    
}
