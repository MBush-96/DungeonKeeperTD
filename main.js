const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const menuHealthInfo = document.querySelector('.health')
const menuGoldInfo = document.querySelector('.gold')
const menuRoundInfo = document.querySelector('.round')
const spikesButton = document.querySelector('.gmbo')
const mainMenu = document.querySelector('.main_menu')
const dungeonHeartImage = document.querySelector('#dungeonheart')
const spikesTriggeredImage = document.querySelector('#spikes')
const spikesNotTriggeredImage = document.querySelector('#spikesoff')
const gameMenu = document.querySelector('.game_menu')
const buttonsMenu = document.querySelector('.buttons')
const gmboPrice = document.querySelector('.gmboprice')
const gameOverScreen = document.querySelector('.gameover')
let gamePaused = false

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
    gameMenu.classList.remove('hidden')
    spikesButton.classList.remove('hidden')
    gmboPrice.classList.remove('hidden')
    buttonsMenu.classList.remove('hidden')
    dungeonHeart.health = 10
    dungeonHeart.round = 1
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
        let trap = new Trap(x - 32, y - 32)
        traps.push(trap)
        dungeonHeart.gold -= 100
    } else {
        console.log('not enough gold')
    }
}

const updateMenuInfo = () => {
    menuHealthInfo.textContent = dungeonHeart.health
    menuGoldInfo.textContent = dungeonHeart.gold
    menuRoundInfo.textContent = dungeonHeart.round
}

const hideGame = () => {
    canvas.classList.add('hidden')
    gameMenu.classList.add('hidden')
    spikesButton.classList.add('hidden')
    gmboPrice.classList.add('hidden')
    buttonsMenu.classList.add('hidden')
}

class Trap {
    constructor(x, y, width=64, height=64, color="green") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.trigger = false
        setInterval(() => {
            this.trigger = true
        }, 1000)
        setInterval(() => {
            this.trigger = false
        }, 1500)
    }
    render() {
        if(this.trigger) {
            context.drawImage(spikesTriggeredImage, this.x, this.y)
        } else if(!this.trigger) {
            context.drawImage(spikesNotTriggeredImage, this.x, this.y)
        }
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
        this.gold = 200
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
    constructor(spawnPoint, speed=5, health, x=0, y=0, width=25, height=25, color='yellow') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = health
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
        context.fillText('Adventurer', this.x - 10, this.y- 10)
        context.fillStyle = 'black'
        context.font = '25px Arial';
        context.fillText(this.health, this.x + 2, this.y + 20)
    }
    takeDamage(enemyArr) {
        let index = enemyArr.indexOf(this)
        if(this.health > 0) {
            this.health -= 1
            console.log(this.health)
        } else {
            this.alive = false
            enemyArr.splice(index, 1)
            dungeonHeart.gold += 25
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
                this.takeDamage(enemyArr)
            // if enemy is colliding with traps BROKEN ??
            } else if(other instanceof Trap && other.trigger) {
                this.takeDamage(enemyArr)
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
    //(spawnpoint, speed, health)
    new Enemy(1, 3, 5),
    new Enemy(1, 4, 5),
    new Enemy(2, 3, 5),
    new Enemy(2, 4, 5),
    new Enemy(1, 5, 5),

])
// when a trap is made it will be pushed into this arr
const traps = []

// control enemy movement collision and draw to screen
const enemyControl = arr => {
    arr.forEach(enemy => {  
        enemy.render()
        enemy.checkCollision(dungeonHeart, arr)
        traps.forEach(trap => enemy.checkCollision(trap, arr))
        enemy.move()
    })
}

//main game
const mainGameLoop = () => {
    const intervalId = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        traps.forEach(trap =>trap.render())
        walls.forEach(wall => wall.render())
        dungeonHeart.render()
        updateMenuInfo()
        if(dungeonHeart.round === 1) {
            dungeonHeart.checkAlive()
            enemyControl(roundOne.enemies)
            if(roundOne.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 2) {
            console.log(dungeonHeart.round)
        } else if(dungeonHeart.round === 5) {
            hideGame()
            return
        }

        if(!dungeonHeart.checkAlive()) {
            hideGame()
            gameOverScreen.classList.remove('hidden')
            document.querySelector('.gameoverokbutton').addEventListener('click', () => {
                location.reload()
            })
        }
    }, 25)

    // document.addEventListener('keydown', event => {
    //     if(event.key === "p" && !gamePaused) {
    //         clearInterval(intervalId)
    //     } else if(event.key === "p" && gamePaused) {

    //     }
    // })
}