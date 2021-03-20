const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const menuHealthInfo = document.querySelector('.health')
const menuGoldInfo = document.querySelector('.gold')
const menuRoundInfo = document.querySelector('.round')
const spikesButton = document.querySelector('.gmbo')
const dungeonHeartImage = document.querySelector('#dungeonheart')

canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)
let gameActive = false

// ----------------------  Main menu buttons -----------------------
document.querySelector('.quit').addEventListener('click', () => {
    if(confirm('Close window?')) {
        close();
    }
})
document.querySelector('.play').addEventListener('click', () => {
    document.querySelector('.main_menu').classList.add('hidden')
    canvas.classList.remove('hidden')
    document.querySelector('.game_menu').classList.remove('hidden')
    spikesButton.classList.remove('hidden')
    mainGameLoop()
})
// ---------------------- Main menu buttons stop here -----------------

spikesButton.addEventListener('click', () => {
    spikesButton.classList.add('selected')
})

// Add Event listener to canvas and do something if trap button is selected
// then remove from selected
canvas.addEventListener('click', event => {
    if(spikesButton.classList.contains('selected')) {
        addTrap(event)
        spikesButton.classList.remove('selected')
    }
})
// Gets position of mouse click on the canvas and creates
// a new trap x, y coords to that position
const addTrap = event => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    if(dungeonHeart.gold >= 100) {
        let trap = new Trap(x, y)
        traps.push(trap)
        dungeonHeart.gold -= 100
    } else {
        console.log('not enought gold')
    }
}

const updateMenuInfo = () => {
    menuHealthInfo.textContent = dungeonHeart.health
    menuGoldInfo.textContent = dungeonHeart.gold
    menuRoundInfo.textContent = dungeonHeart.round
}

class Trap {
    constructor(x, y, width=75, height=75, color="green") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    render() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Wall {
    constructor(x=0, y=0, width=600, height=600, color='#4B1E00') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    render() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class DungeonHeart {
    constructor(x, y, width, height, color='blue') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.gold = 500
        this.health = 10
        this.round = 1
    }
    takeDamage(other) {
        if(this.health >= 1) {
            this.health -= other.health
        }
    }
    gainGold(amount) {
        this.gold += amount
    }
    loseGold(amount) {
        this.gold -= amount
    }
    render() {
        context.fillStyle = this.color
        context.drawImage(dungeonHeartImage, this.x, this.y, 150, 150)
    }
    checkAlive() {
        if(this.health >= 1) {
            return true
        } else {
            return false
        }
    }
}

class Enemy {
    constructor(spawnPoint, speed=5, x=0, y=0, width=50, height=50, color='yellow') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = 1
        this.alive = true
        this.speed = speed
        this.spawnPoint = spawnPoint
        if(spawnPoint === 1) {
            this.x = 1100
            this.y = 100
        } else if (spawnPoint === 2) {
            this.x = 1100
            this.y = 500
        }
    }
    render() {        
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
    takeDamage() {
        if(this.health > 0) {
            this.health -= 1
        } else {
            this.alive = false
        }
    }
    move() {
        //movement path to dungeon heart at spawnpoint 1
        if(this.spawnPoint === 1) {
            if(this.y <= 200 && this.x >= 1100) {
                this.y += this.speed
            } else if(this.x >= 50 && this.y <= 210) {
                this.x -= this.speed
            } else if(this.x <= 50 && this.y <= 460) {
                this.y += this.speed
            } else {
                this.x += this.speed
            }
        }
        // Movement path to dungeon heart at spawnpoint 2
        if(this.spawnPoint === 2) {
            if(this.x >= 870 && this.y >= 500) {
                this.x -= this.speed
            } else if(this.x >= 850 && this.y >= 430) {
                this.y -= this.speed
            } else if(this.x >= 682 && this.y >= 400) {
                this.x -= this.speed
            } else if(this.x >= 680 && this.y >= 350) {
                this.y -= this.speed
            } else if(this.x >= 50 && this.y <= 350) {
                this.x -= this.speed
            } else if(this.x >= 40 && this.y <= 500) {
                this.y += this.speed
            } else if(this.x >= 40 && this.y >= 500) {
                this.x += this.speed
            }
        }
    }
    checkCollision(other, enemyArr) {
        let index = enemyArr.indexOf(this)
        const horizHit = this.x >= other.x && this.x + this.width < other.x + other.width
        const vertHit = this.y >= other.y && this.y + this.height < other.y + other.height
        if(horizHit && vertHit && this.alive) {
            //if enemy is colliding with dungeon heart
            if (other instanceof DungeonHeart) {
                enemyArr.splice(index, 1)
                other.takeDamage(this)
                dungeonHeart.gold += 5
                this.takeDamage()
            // if enemy is colliding with traps BROKEN ??
            } else if(other instanceof Trap) {
                enemyArr.splice(index, 1)
                dungeonHeart.gold += 5
                console.log('trap hit')
            }
        }
    }
}

//round class use for making new round enemies and checking is all 
//enemies in round are dead
class Round {
    constructor(enemiesArr=[]) {
        this.enemies = enemiesArr
    }
    allEnemiesDead() {
        let allDead = this.enemies.every(enemy => {
            enemy.alive === false
        })
        return allDead
    }
}

const walls = [
    new Wall(0, 0, canvas.width, 20), //top
    new Wall(0, canvas.height - 20, canvas.width, 20), //bottom
    new Wall(canvas.width - 20, 0, 20, canvas.height), //right
    new Wall(0, 0, 20, canvas.height), // left
    new Wall(730, canvas.height / 2 - 50, 50, 170), //right block
    new Wall(770, 10, 160, 170),// top block
    new Wall(670, 480, 160, 170),//bottom block
    new Wall(0, 175, 320, 5), //top left wall
    new Wall(480, 175, 300, 5), //top right wall
    new Wall(400, 0, 5, 183), // top middle wall
    new Wall(100, 410, 575, 5), // bottom left wall
    new Wall(655, 410, 20, 180), //bottom right wall
]

const dungeonHeart = new DungeonHeart(480, 420, 150, 140)

//round one enemies
const roundOne = new Round([
    new Enemy(1, 3),
    new Enemy(1, 4),
    new Enemy(2, 3),
    new Enemy(2, 4),
    new Enemy(1, 5),

])
// when a trap is made it will be pushed into this arr
const traps = []

// control enemy movement collision and draw to screen
const enemyControl = arr => {
    arr.forEach(enemy => {  
        enemy.render()
        enemy.checkCollision(dungeonHeart, arr)
        traps.forEach(trap => {
            enemy.checkCollision(trap, arr)
        })
        enemy.move()
    })
}

//main game
const mainGameLoop = () => {
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        dungeonHeart.render()
        updateMenuInfo()
        walls.forEach(wall => {
            wall.render();
        })
        traps.forEach(trap => {
            trap.render()
        })
        if(dungeonHeart.round === 1) {
            dungeonHeart.checkAlive()
            enemyControl(roundOne.enemies)
            if(roundOne.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 2) {
            console.log(dungeonHeart.round)
        }
        if(!dungeonHeart.checkAlive()) {
            return
        }
    }, 25)
}