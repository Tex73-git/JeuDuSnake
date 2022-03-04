// Function pour afficher la fenêtre a l'écran
window.onload = function() {
    // Variables
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 125;
    let snakee;
    let applee;
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;

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
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    // Rafraîchir le canvas
    function refreshCanvas() {  
        snakee.advance(); // Fait avancé le snake
        // Vérifie si il y a une colision
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee));
            }
            // Coordonnées du rectangle     
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Efface le rectangle
            snakee.draw(); // Dessine le snake
            applee.draw(); // Dessine la pomme
            drawScore(); // Affiche le score à l'écran
            setTimeout(refreshCanvas, delay); // Update du canvas
        }
    }
    // Function game over
    function gameOver() {
        ctx.save();
        ctx.fillText("GameOver", 5, 15);
        ctx.fillText("Appuyez sur la touche espace pour rejouer", 5, 30);
        ctx.restore();
    }
    // Function restart space
    function restart() {
        snakee = new Snake([[6,4], [5,4], [4,4]], "right"); 
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    // On affiche le score à l'écran
    function drawScore() {
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasHeight -5);
        ctx.restore();
    }
    // Function qui dessine le cadrillage du canvas et dessine le snake
    function drawBlock(ctx,position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }
    // Function constructeur, pour construire le corp du snake
    function Snake(body,direction) {
        this.body = body;
        // Dirige le snake
        this.direction = direction;
        // Le snake a mangé la pomme
        this.ateApple = false;
        // Dessine le corp du snake
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        // Méthode pour faire avancé le snake
        this.advance = function() {
            let nextPosition = this.body[0].slice();
            switch(this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");                
            }
            this.body.unshift(nextPosition);
            // On agrandit le corp du snake si il a mangé une pomme
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection) {
            let allowedDirections;
            switch(this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");    
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        // Gestion des collisions, murs et corp du snake en mesurant le plateau de jeu
        this.checkCollision = function() {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks -1;
            let maxY = heightInBlocks -1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }
            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        // Le snake mange la pomme
        this.isEatingApple = function(appleToEat) {
            let head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
                else
                return false;
        };
    }
    // Création de la pomme
    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            let radius = blockSize/2;
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        // Nouvelle position de la pomme
        this.setNewPosition = function() {
            let newX = Math.round(Math.random() * (widthInBlocks -1));
            let newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX, newY];
        };
        // On vérifie si la pomme est sur le snake
        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    // Evènement lors de l'appuie d'une touche sur le clavier
    document.onkeydown = function handleKeyDown (e) {
        let key = e.keyCode;
        let newDirection;
        switch(key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return; 
        }
        snakee.setDirection(newDirection);
    }
}