'use strict';

//literal consts
const grass = {
    id: "grass",
    type: "free",
    blocked: false
};

const rock = {
    id: "rock",
    type: "obstacle",
    blocked: true
};
 
class Player {
    constructor(name, health, weapon, id, score) {
        this.name = name;
        this.health = health;
        this.weapon = weapon;
        this.id = id;
        this.score = score;
        this.type = "player";
        this.position = {};
        this.movement = 0;
        this.blocked = true;
        this.defend = false;
        this.defaultWeapon = weapon;
    }

    attack(target) {
        //target is not dead
        if (target.health > 0) {
            if (target.defend) {
                target.health = target.health - this.weapon.damage / 2;
                target.defend = false;
            } else {
                target.health = target.health - this.weapon.damage;
            }
            //target is dead
            if (target.health <= 0) {
                target.health = 0
                const popFooter = document.getElementById("pop-footer");
                popFooter.style.bottom = "-120px";
                const textMessage = document.getElementById("text-message");
                textMessage.innerHTML = "";
                textMessage.textContent =
                    "Game over! " + gameBoard.players.active.name + " Won!!!";
                let timer = setInterval(() => {
                    const textMessage = document.getElementById("text-message");
                    textMessage.innerHTML = "";
                    textMessage.textContent = "Press restart & play to begin!";
                }, 5000);
            }
        }
    }
}

class Weapon {
    constructor(name, damage, id, src) {
        this.name = name;
        this.damage = damage;
        this.id = id;
        this.type = "weapon";
        this.blocked = true;
        this.src = src;
    }
}

class Game {
    constructor(rows, cols, tile, players, weapons, obstacles, gameId) {
        this.gameId = gameId;
        this.rows = rows;
        this.cols = cols;
        this.tile = tile;
        this.map = [];
        this.players = {
            enemy: {},
            moving: false,
            active: {},
            list: players,
            swap() {
                var oldPlayer = this.list.shift();
                this.list.push(oldPlayer);
                this.active = this.list[0];
                this.enemy = {};
            }
        };
        this.weapons = weapons;
        this.obstacles = obstacles;
    }

    changeFooter() {
        const footerText = document.getElementById("footer-text");
        footerText.innerHTML = "";
        footerText.textContent = this.players.active.name + " Turn!";
    }

    changingUi() {
        const textMessage = document.getElementById("text-message");
        textMessage.innerHTML = "";
        textMessage.textContent = this.players.active.name + " Turn!";

        //const player1Name = document.querySelector(`#${this.gameId} #p1_left .player-name`);
        //player1Name.innerHTML = gameBoard.players.active.name
    }

    updatePlayerUi() {
        this.players.list.forEach(player => {
            //updating players health bar
            const healthBar = document.querySelector(`#${player.id} .red`);
            healthBar.setAttribute("style", `width: ${player.health}%`);
            //updating the weapon
            const image = document.querySelector(`#${player.id} .player-info-weapon`);
            image.setAttribute("src", player.weapon.src);
            const weaponName = document.querySelector(`#${player.id} .weapon-name`);
            weaponName.innerHTML = player.weapon.name;
            //displaying the weapon damage
            const weaponDamage = document.querySelector(`#${player.id} .weapon-damage`);
            weaponDamage.innerHTML = player.weapon.damage;
            //displaying the active player container
            const playerContainer = document.getElementById(player.id);
            playerContainer.classList.toggle("active");
            });
        }

    //CREATING THE MAP DATA and placing items on the map and renders the map and Ui    
    init() {
        //creating the map
        this.map = [];
        // 2 dimensional arrays - making all tiles grass
        for (let i = 0; i < this.rows; i++) {
            this.map[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.map[i][j] = [this.tile];
            }
        }
        //adding the obsticles - rocks
        this.obstacles.forEach(obstacle => {
            this.addItem(obstacle);
        });
        //adding the weapons
        this.weapons.forEach(weapon => {
            this.addItem(weapon);
        });
        //adding the players 
        this.players.list.forEach(player => {
            player.health = 100;
            player.weapon = player.defaultWeapon;
            player.movement = 0;
            this.addItem(player);
        });

        this.players.active = this.players.list[0];

        this.renderMap();
        this.renderUi();

        const textMessage = document.getElementById("text-message");
        textMessage.textContent = "Press play in order to start!";
    }

    renderUi() {
        const playersInfo = document.querySelector(`#${this.gameId} #players_info`);
        playersInfo.innerHTML = "";
        this.players.list.forEach((player, index) => {
            const playerContainer = document.createElement("div");
            playerContainer.setAttribute("id", player.id);
            if (index === 0) {
                playerContainer.setAttribute("class", "active")
            }
            const nameHealth = document.createElement("div");
            nameHealth.setAttribute("class", "name_health");
            const playerName = document.createElement("h4");
            playerName.setAttribute("class", "player-name");
            playerName.innerHTML = player.name;
            const healthBar = document.createElement("div");
            healthBar.setAttribute("class", "health-bar");
            const red = document.createElement("div");
            red.setAttribute("class", "red");
            red.setAttribute("style", `width: ${player.health}%`);
            const weapon = document.createElement("div");
            weapon.setAttribute("class", "player1_weapon");
            const image = document.createElement("img");
            image.setAttribute("src", player.weapon.src);
            image.setAttribute("class", "player-info-weapon");
            const weaponName = document.createElement("span");
            weaponName.setAttribute("class", "weapon-name");
            weaponName.innerHTML = player.weapon.name;
            const weaponDamage = document.createElement("span");
            weaponDamage.setAttribute("class", "weapon-damage");
            weaponDamage.innerHTML = player.weapon.damage;

            healthBar.appendChild(red);
            nameHealth.appendChild(playerName);
            nameHealth.appendChild(healthBar);
            weapon.appendChild(image);
            weapon.appendChild(weaponName);
            weapon.appendChild(weaponDamage);
            playerContainer.appendChild(nameHealth);
            playerContainer.appendChild(weapon);
            playersInfo.appendChild(playerContainer);
        });
    }

    renderMap() {
        const board = document.querySelector(`#${this.gameId} #board`);
        board.innerHTML = "";
        for (let i = 0; i < this.map.length; i++) {
            const row = document.createElement("div");
            row.setAttribute("id", "row" + i);
            row.setAttribute("class", "row");
            for (let j = 0; j < this.map[i].length; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("id", "cell" + i + j);
                cell.setAttribute("class", "cell");
                for (let m = 0; m < this.map[i][j].length; m++) {
                    cell.classList.add(this.map[i][j][m].id);
                }
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }

    renderTile(y, x) {
        const cell = document.getElementById("cell" + y + x);

        cell.setAttribute("class", "cell");
        for (let m = 0; m < this.map[y][x].length; m++) {
            cell.classList.add(this.map[y][x][m].id);
        }
    }

    randomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    // adding a specific item(grass, rock, player, weapon) randomly on the map. only if not contains the same object and if is not blocked
    addItem(item) {
        let y = this.randomNumber(this.map.length);
        let x = this.randomNumber(this.map[y].length);

        //console.log(y, x); change the name of the itemType to isCellBlocked
        while (true) {
            var itemId = this.findItem(y, x, item.id);
            var itemType = this.map[y][x].find(item => item.blocked);
            //if item exists on square or the square is blocked get new cords
            if (itemId || itemType) {
                y = this.randomNumber(this.map.length);
                x = this.randomNumber(this.map[y].length);
            } else {
                //found the item and update its position
                item.position = {
                    y,
                    x
                };
                return this.map[y][x].push(item);
            }
        }
    }

    // is deleting an item from a position on the map.
    // moving  a player from one tile to another one, requaired to remove player from previous tile.
     deleteItem(y, x, id) {
        this.map[y][x] = this.map[y][x].filter(tile => {
            return tile.id !== id;
        });
    }

    // to find an item by id from a position(y, x) on the map.
    findItem(y, x, id) {
        return this.map[y][x].find(item => {
            return item.id === id;
        });
    }
    // to find an item by type from a position(y, x) on the map.
    findItemByType(y, x, type) {
        return this.map[y][x].find(item => {
            // look for what is .find
            return item.type === type;
        });
    }

    //moving player function
    movePlayer(dir) {
        this.changingUi();
        const player = this.players.active;
        let dirY = 0;
        let dirX = 0;
        let {
            y,
            x
        } = player.position;

        if (dir === "up") {
            dirY = -1;
        } else if (dir === "down") {
            dirY = +1;
        } else if (dir === "right") {
            dirX = +1;
        } else if (dir === "left") {
            dirX = -1;
        }

        let newY = y + dirY;
        let newX = x + dirX;

        //pushing the player to his new position and delete him from his previous position (updating the map everytime the player moves)
        if (
            newY >= 0 &&
            newY < this.map.length &&
            newX >= 0 &&
            newX < this.map[newY].length
        ) {
            if (!this.findItemByType(newY, newX, "obstacle")) {
                let enemy = this.findItemByType(newY, newX, "player");
                if (enemy) {
                    this.players.moving = false;
                    this.players.enemy = enemy;
                } else {
                    this.map[newY][newX].push(player);
                    this.deleteItem(y, x, player.id);

                    //updating the position of the player in the player object
                    player.position.y = newY;
                    player.position.x = newX;
                    player.movement++;
                    enemy = this.checkForEnemy();
                    console.log(enemy);
                    if (enemy) {
                        this.changeFooter();
                        const popFooter = document.getElementById("pop-footer");
                        popFooter.style.bottom = "0px";
                        const textMessage = document.getElementById("text-message");
                        textMessage.innerHTML = "";
                        textMessage.textContent = "Fight!!!";
                        player.movement = 0;
                        this.players.moving = false;
                        this.players.enemy = enemy;
                    }

                    //rendering the tiles
                    this.renderTile(y, x);
                    this.renderTile(newY, newX);
                }
            }

            if (player.movement == 3) {
                player.movement = 0;
                this.players.swap();
                this.changingUi();
            }

            var newWeapon = this.map[newY][newX].find(item => item.type === "weapon");

            if (newWeapon) {
                this.map[newY][newX].push(player.weapon);
                player.weapon = newWeapon;
                this.map[newY][newX] = this.map[newY][newX].filter(
                    item => item.id !== newWeapon.id
                );
                this.deleteItem(newY, newX, newWeapon.id);
            }
        }
    }

    checkForEnemy() {
        const checkCell = (dirY, dirX, y, x) => {
            let newY = y + dirY;
            let newX = x + dirX;

            if (
                newY >= 0 &&
                newY < this.map.length &&
                newX >= 0 &&
                newX < this.map[newY].length
            ) {
                return this.findItemByType(newY, newX, "player");
            }
        };
        const player = this.players.active;
        let dirY = 0;
        let dirX = 0;
        let {
            y,
            x
        } = player.position;

        let enemy;

        enemy = checkCell(-1, 0, y, x);
        if (enemy) {
            return enemy;
        }

        enemy = checkCell(+1, 0, y, x);
        if (enemy) {
            return enemy;
        }

        enemy = checkCell(0, -1, y, x);
        if (enemy) {
            return enemy;
        }

        enemy = checkCell(0, +1, y, x);
        if (enemy) {
            return enemy;
        }
    }
}

//adding on the map 20 rocks
const obstacles = [];
let rocknum = 0;
while (rocknum <= 20) {
    obstacles.push(rock);
    rocknum++; 
}

//creating a new object called Weapon with the parameters
const weapons = [
    new Weapon("Baseball", 20, "weapon2", "./images/baseball-bat.png"),
    new Weapon("Knife", 30, "weapon3", "./images/knife_1.png"),
    new Weapon("Axe", 40, "weapon4", "./images/axe_3.png"),
    new Weapon("Pistol", 50, "weapon5", "./images/gun_2.png")
];

//creating the default Weapon with its parameters
const defaultWeapon = new Weapon(
    "Gloves",
    10,
    "weapon1",
    "./images/gloves_1.png"
);

//creating a new object called Player with the parameters
const players = [
    new Player("Booboo", 100, defaultWeapon, "player1"),
    new Player("Doodoo", 100, defaultWeapon, "player2")
];

//creating a board object which contains the map and the methods which are managing the map. passing all the data 
const gameBoard = new Game(
    10,
    10,
    grass,
    players,
    weapons,
    obstacles,
    "gameee"
);

//initiating the game
gameBoard.init();

window.addEventListener("keydown", event => {
    if (gameBoard.players.moving) {
        switch (event.code) {
            case "ArrowLeft":
                gameBoard.movePlayer("left");   //updating the data
                gameBoard.updatePlayerUi();    //updating the DOM
                break;

            case "ArrowRight":
                gameBoard.movePlayer("right");
                gameBoard.updatePlayerUi();
                break;

            case "ArrowUp":
                gameBoard.movePlayer("up");
                gameBoard.updatePlayerUi();
                break;

            case "ArrowDown":
                gameBoard.movePlayer("down");
                gameBoard.updatePlayerUi();
                break;

            case "Space":
                gameBoard.players.active.movement = 0;
                gameBoard.players.swap();
                gameBoard.updatePlayerUi();
                gameBoard.changingUi();
                break;
        }
    }
});

//const attackBtn = document.getElementById("attack-btn");
$('#attack-btn').click(function () {
    gameBoard.players.active.attack(gameBoard.players.enemy);
    gameBoard.players.swap();
    gameBoard.players.enemy = gameBoard.checkForEnemy();
    gameBoard.updatePlayerUi();
    gameBoard.changeFooter();
});

//const defendBtn = document.getElementById("defend-button");
$('#defend-button').click(function () {
    gameBoard.players.active.defend = true;
    gameBoard.players.swap();
    gameBoard.players.enemy = gameBoard.checkForEnemy();
    gameBoard.updatePlayerUi();
    gameBoard.changeFooter();
});

//const buttonPlay = document.getElementById("btn-play");
$('#btn-play').click(function () {
    //console.log("clicked");
    let timeLeft = 3;
    let timer = setInterval(() => {
        document.getElementById("text-message").innerHTML = timeLeft;
        timeLeft -= 1;
        if (timeLeft <= -1) {
            gameBoard.players.moving = true;
            clearInterval(timer);
            gameBoard.changingUi();
        }
    }, 800);
});

//const buttonReload = document.getElementById("btn-reload");
$('#btn-reload').click(function () {
    gameBoard.players.moving = false;
    gameBoard.init();
});