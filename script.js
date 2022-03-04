// Function pour afficher la fenêtre a l'écran
window.onload = function() {
    // Variables
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;

    init();
        
    // Initialise le canvas
    function init() {
        // Création du canvas et attachement a l'HTML
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d'); // Dessin en 2d
        snakee = new Snake([[6,4], [5,4], [4,4]], "right"); // Position de départ du snake
        refreshCanvas();
    }
    // Rafraîchir le canvas
    function refreshCanvas() {  
        // Coordonnées du rectangle     
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Efface le rectangle
        snakee.advance(); // Fait avancé le snake
        snakee.draw(); // Dessine le snake
        setTimeout(refreshCanvas, delay); // Animation du rectangle
    }
    // Function qui dessine le cadrillage du canvas et dessine le snake
    function drawBlock(ctx,position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }
    // Function constructeur, pour construire le corps du snake
    function Snake(body,direction) {
        this.body = body;
        // Dirige le serpent
        this.direction = direction;
        // Dessine le corps du snake
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        // Méthode pour faire avancé le snake
        this.advance = function() {
            let nextPosition = this.body[0].slice();
            nextPosition[0] += 1;
            this.body.unshift(nextPosition);
            this.body.pop();
        };
    }
}