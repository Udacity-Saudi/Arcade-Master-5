'use strict';
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var enemies = ['images/enemy-bug.png', 'images/ghost.png'];
    this.sprite = enemies[Math.floor(Math.random() * (1 - 0 + 1) + 0)];
    // Set the y position of the enemy to one of three values (52, 134, 216) 
    // This way the enemies will only appear on the stones (not grass or water)
    // The position will be chosen randomly for each instance,
    // based on the value of the var random which will either be 0, 1 or 2
    var yPos = [52, 134, 216];
    var random = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    this.y = yPos[random];
    this.x = -50;
    // Speed of the enemy is a random number between 200 and 400
    this.speed = Math.floor(Math.random() * (400 - 200 + 1) + 200);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (!this.checkCollision()) {
        if (this.x > 505) {
            this.x = -50;
        } else {
            this.x = this.x + this.speed * dt;
        }
    } else {
        player.collision = true;
        player.reset();
    }
};

// Check that no collision is occurring while moving an enemy
// Collision points are the player's x position +/- 50 and enemies y positions (52, 134, 216) 
Enemy.prototype.checkCollision = function() {
    if (this.x <= player.x + 50 && this.x >= player.x - 50 && this.y == player.y)
        return true;
    return false;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// The player that avoids enemies and tries to reach water
var Player = function() {

    switch (character.selected) {
        case 'yellow':
            this.char = character.yellow;
            break;
        case 'pink':
            this.char = character.pink;
            break;
        case 'green':
            this.char = character.green;
            break;
        default:
            this.char = character.green;
            break;

    }

    this.sprite = this.char.front;
    this.x = 201;
    this.y = 380;
    this.newX = 0;
    this.newY = 0;
    this.score = 0;
    this.collision = false;
    this.lives = 3;
    this.keys = 0;

};

// Collecting gems and keys
Player.prototype.update = function() {
    this.collectGems();
    this.collectKey();
};

// Resets the player position to the starting position
// If collision occurs and lives are available, score does not reset but does not increase
// lives are decreased by one
// If collesion occurs and 1 life is available, the game resets
// If the player reached water and no collision occured, score is increased by one 
Player.prototype.reset = function() {
    this.sprite = this.char.front;
    this.x = 201;
    this.y = 380;
    this.newX = 0;
    this.newY = 0;
    if (!this.collision) {
        this.score++;
    } else if (this.lives > 1 && this.collision) {
        this.lives--;
        this.collision = false;
    } else {
        reset();
    }
};

// Draw the player, lives, collected keys and score on the screen
Player.prototype.render = function() {
    if (character.selected)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = "60px Baloo Tammudu";
    ctx.fillStyle="#000000";
    ctx.fillText(this.score, 10, 575);

    var heartX = 440;
    var heartY = 440;
    for (var i = 0; i < 3; i++) {
        ctx.drawImage(Resources.get('images/empty-heart.png'), heartX, heartY);
        heartX = heartX - 55;
    }

    var heartOutlineX = 440;
    var heartOutlineY = 440;
    for (var i = 0; i < this.lives; i++) {
        ctx.drawImage(Resources.get('images/heart.png'), heartOutlineX, heartOutlineY);
        heartOutlineX = heartOutlineX - 55;
    }

    var keyX = -10;
    var keyY = -40;
    for (var i = 0; i < 5; i++) {
        ctx.drawImage(Resources.get('images/empty-key.png'), keyX, keyY);
        keyX = keyX + 55;
    }

    keyX = -10;
    keyY = -40;
    for (var i = 0; i < this.keys; i++) {
        ctx.drawImage(Resources.get('images/key.png'), keyX, keyY);
        keyX = keyX + 55;
    }
};

// Handles keyboard pressed to update the player's position on the canvas
// Parameter: direction, player's direction based on the pressed key
Player.prototype.handleInput = function(direction) {
    if (character.selected) {
        switch (direction) {
            case 'left':
                this.newX = this.x - 100;
                this.sprite = this.char.left;
                if (this.newX > 0) {
                    this.x = this.newX;
                }
                break;

            case 'right':
                this.newX = this.x + 100;
                this.sprite = this.char.right;
                if (this.newX < 500) {
                    this.x = this.newX;
                }
                break;

            case 'up':
                this.sprite = this.char.front;
                this.newY = this.y - 82;
                if (this.newY > 0) {
                    this.y = this.newY;
                } else {
                    // Game won, reset
                    this.reset();
                }
                break;

            case 'down':
                this.sprite = this.char.front;
                this.newY = this.y + 82;
                if (this.newY < 400) {
                    this.y = this.newY;
                }
                break;
        }
    }
};

// Collect key and generate new key
// If 5 keys are collected, lives are increased by 1
// If lives are full, the score is increased by 100
Player.prototype.collectKey = function() {
    if (!key.collected) {
        if (key.position[0] === this.x && key.position[1] === this.y) {
            this.keys++;
            key.collected = true;
            clearPos(key.position[0], key.position[1]);

            if (this.keys === 5) {
                if (this.lives < 3) {
                    this.lives++;
                } else {
                    this.score = this.score + 100;
                }
                this.keys = 0;
            }
        }
    } else {
        key = new Key();
    }

}

// Collect gem and generate new gems
// Gems increase the player's score depending on the gem's color
// blue: increase by 20
// orange: increase by 10
// green: increase by 5
Player.prototype.collectGems = function() {
    for (var i = 0; i < gems.length; i++) {
        if (gems[i].position[0] === this.x && gems[i].position[1] === this.y) {
            this.score = this.score + gems[i].value;
            gems.splice(i, 1);
            clearPos(this.x, this.y);
            setTimeout(function() {
                if (gems.length < 3 && allEnemies.length > 0) {
                    var colors = ['orange', 'blue', 'green'];
                    var randomColor = Math.floor(Math.random() * (2 - 0 + 1) + 0);
                    gems.push(new Gem(colors[randomColor]));
                }
            }, 5000);
        }
    }
}

// Collectable gem by the player
var Gem = function(color) {
    if (color === 'green') {
        this.sprite = 'images/gem-green.png';
        this.value = 5;
    } else if (color === 'orange') {
        this.sprite = 'images/gem-orange.png';
        this.value = 10;
    } else if (color === 'blue') {
        this.sprite = 'images/gem-blue.png';
        this.value = 20;
    }

    this.position = getEmptyPosition();
};

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.position[0], this.position[1]);
};

// Collectable key by the player
var Key = function() {
    this.sprite = 'images/key.png';
    this.position = getEmptyPosition();
    this.collected = false;

}

// Draw the key on the screen
Key.prototype.render = function() {
    if (!this.collected && allEnemies.length > 0)
        ctx.drawImage(Resources.get(this.sprite), this.position[0], this.position[1]);
};


// Function that gets positions on the stone 
// tile that are not occupied by either keys or gems
// and reserves the position by adding it in occupiedPos array
var getEmptyPosition = function() {
    var x = getRandomX();
    var y = getRandomY();

    var i = 0;
    while (i < occupiedPos.length) {
        if (occupiedPos[i][0] === x && occupiedPos[i][1] === y) {
            x = getRandomX();
            i = 0;
        } else {
            i++;
        }
    }

    occupiedPos.push([x, y]);
    return [x, y];
};

// Function that returns random x positions on the stone tile
var getRandomX = function() {
    var xPos = [1, 101, 201, 301, 401];
    var randomX = Math.floor(Math.random() * (4 - 0 + 1) + 0);

    return xPos[randomX];
};

// Function that returns random y positions on the stone tile
var getRandomY = function() {
    var yPos = [52, 134, 216];
    var randomY = Math.floor(Math.random() * (2 - 0 + 1) + 0);

    return yPos[randomY];
};

// Function that clears a position once an item (gem, key) is collected
var clearPos = function(x, y) {
    for (var i = 0; i < occupiedPos.length; i++) {
        if (x === occupiedPos[i][0] && y === occupiedPos[i][1]) {
            occupiedPos.splice(i, 1);
            break;
        }
    }
};

var Character = function() {
    this.icons = ['images/char-green.png', 'images/char-yellow.png', 'images/char-pink.png'];

    this.positions = [280, 200, 120];

    this.green = {
        front: 'images/char-green.png',
        left: 'images/char-green-left.png',
        right: 'images/char-green-right.png'
    };

    this.yellow = {
        front: 'images/char-yellow.png',
        left: 'images/char-yellow-left.png',
        right: 'images/char-yellow-right.png'
    };

    this.pink = {
        front: 'images/char-pink.png',
        left: 'images/char-pink-left.png',
        right: 'images/char-pink-right.png'
    };

    this.selected = '';
};

Character.prototype.render = function() {
    if (!this.selected) {
        ctx.drawImage(Resources.get('images/star.png'), 215, 500);
        ctx.drawImage(Resources.get('images/outline.png'), 200, 400);
        for (var i = 0; i < 3; i++) {
            ctx.drawImage(Resources.get(this.icons[i]), this.positions[i], 380);
        }
    }
};

Character.prototype.chooseChar = function(direction) {
    if(instruction.startGame){
    switch (direction) {
        case 'left':
            if (this.positions[0] < 360) {
                for (var i = 0; i < this.positions.length; i++) {

                    this.positions[i] = this.positions[i] + 80;
                }
            }
            break;

        case 'right':
            if (this.positions[2] > 40) {
                for (var i = 0; i < this.positions.length; i++) {

                    this.positions[i] = this.positions[i] - 80;
                }
            }

            break;

        case 'enter':
        if(!this.selected){
            switch (this.positions[0]) {
                case 200:
                    this.selected = 'green';
                    break;
                case 280:
                    this.selected = 'yellow';
                    break;
                case 360:
                    this.selected = 'pink';
                    break;
            }

            player = new Player();
            gems = [new Gem('green'), new Gem('orange')];
            allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
            key = new Key();
            break;
        }

    }
}
};

var Instruction = function() {
    this.main = 'images/inst.png';
    this.startGame = false;
};

Instruction.prototype.render = function() {
    if(!this.startGame){
        ctx.drawImage(Resources.get(this.main), 0, 0);
    } else {
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,505,606);
    }
    
};

Instruction.prototype.beginGame = function(input) {
    if(input === 'enter'){
        this.startGame = true;
    }
    
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var instruction = new Instruction();

var character = new Character();

var occupiedPos = [];

var gems = [];

var allEnemies = [];

var player = new Player();

var key = new Key();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    
    character.chooseChar(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
    instruction.beginGame(allowedKeys[e.keyCode]);
});