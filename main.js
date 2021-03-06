const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const menuHealthInfo = document.querySelector('.health')
const menuGoldInfo = document.querySelector('.gold')
const menuRoundInfo = document.querySelector('.round')
const spikesButton = document.querySelector('.gmbo')
const turretButton = document.querySelector('.gmbt')
const mainMenu = document.querySelector('.main_menu')
const dungeonHeartImage = document.querySelector('#dungeonheart')
const spikesTriggeredImage = document.querySelector('#spikes')
const spikesNotTriggeredImage = document.querySelector('#spikesoff')
const turretImage = document.querySelector('#turret')
const gameMenu = document.querySelector('.game_menu')
const buttonsMenu = document.querySelector('.buttons')
const gmbPrice = document.querySelectorAll('.gmbprice')
const gameOverScreen = document.querySelector('.gameover')
const audio = new Audio('./audio/Challenger.mp3')
const noGoldAudio = new Audio('./audio/Not_enough_gold.mp3')
const victoryScreen = document.querySelector('.victory')

canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)

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
    buttonsMenu.classList.remove('hidden')
    turretButton.classList.remove('hidden')
    for(let i = 0; i < gmbPrice.length; i++) {
        gmbPrice[i].classList.remove('hidden')
    }
    // audio
    // audio.volume = .05
    // audio.loop = true
    // audio.play()
    mainGameLoop()
})
// ---------------------- Main menu buttons stop here -----------------

// ---------------------- Traps Buttons -----------------------------
spikesButton.addEventListener('click', () => {
    spikesButton.classList.add('selected')
    if(turretButton.classList.contains('selected')) {
        turretButton.classList.remove('selected')
    }
})
turretButton.addEventListener('click', () => {
    turretButton.classList.add('selected')
    if(spikesButton.classList.contains('selected')) {
        spikesButton.classList.remove('selected')
    }
})
// Add Event listener to canvas and do something if trap button is selected
// then remove from selected
canvas.addEventListener('click', event => {
    if(spikesButton.classList.contains('selected')) {
        addTrap(event, 'spike')
        spikesButton.classList.remove('selected')
    } else if(turretButton.classList.contains('selected')) {
        addTrap(event, 'turret')
        turretButton.classList.remove('selected')
    }
})
//-------------------------------------------------------------------
// Gets position of mouse click on the canvas and creates
// a new trap x, y coords to that position
const addTrap = (event, trapType) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    if(dungeonHeart.gold >= 100 && trapType === 'spike') {
        let trap = new Trap(x - 32, y - 32, trapType)
        traps.push(trap)
        dungeonHeart.gold -= 100
    } else if(dungeonHeart.gold >= 200 && trapType === 'turret') {
        let trap = new Trap(x - 32, y - 32, trapType)
        traps.push(trap)
        dungeonHeart.gold -= 200
    } else {
        noGoldAudio.play()
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
    buttonsMenu.classList.add('hidden')
    for(let i = 0; i < gmbPrice.length; i++) {
        gmbPrice[i].classList.add('hidden')
    }
}

const buildTimer = (roundEnemies, timer) => {
    setTimeout(() => {
        enemyControl(roundEnemies.enemies)
    }, timer)
}

const makeNewBullet = trap => {
    const projectile = new Projectile(trap.x + 40, trap.y + 19)
    trap.bulletRack.push(projectile)
}
// used for speeds, gets random float
const getRandFloat = (minNum, maxNum) => {
    return Math.random() * (maxNum - minNum) + minNum
}

class Projectile {
    constructor(x, y, width=20, height=10) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = 5
    }
    render() {
        context.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.x += this.speed
    }
 }
class Trap {
    constructor(x, y, trapType, width=64, height=64, color="green") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.trigger = true
        this.trapType = trapType
        this.turretAttackSpeed = 1000
        this.bulletRack = []
        setInterval(() => {
            this.trigger = false
        }, 500)
        setInterval(() => {
            this.trigger = true
        }, 1500)
    }
    render() {
        if(this.trigger && this.trapType === 'spike') {
            context.drawImage(spikesTriggeredImage, this.x, this.y)
        } else if(!this.trigger && this.trapType === 'spike') {
            context.drawImage(spikesNotTriggeredImage, this.x, this.y)
        } else if(this.trapType ===  'turret') {
            context.drawImage(turretImage, this.x, this.y)
        }
    }
    shoot () {
        let bullet = this.bulletRack[0];
        if(bullet !== undefined) {
            bullet.move()
            bullet.render()
        }
        if(bullet !== undefined) {
            if(bullet.x > 1100) {
                this.bulletRack.splice(bullet, 1)
            }
        } else {
            makeNewBullet(this)
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
        this.gold = 450
        this.health = 15
        this.round = 1
        this.roundOver = false
    }
    takeDamage(other) {
        if(this.health >= 1) {
            this.health -= other.health
        }
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
    constructor(spawnPoint, health, width=30, height=25, color='yellow') {
        this.x
        this.y
        this.width = width
        this.height = height
        this.color = color
        this.health = health
        this.alive = true
        this.speed
        this.spawnPoint = spawnPoint
        this.enemyName
        this.recentlyDamaged = false
        if(spawnPoint === 1) {
            this.x = 1100
            this.y = 100
        } else if (spawnPoint === 2) {
            this.x = 1100
            this.y = 500
        } else if(spawnPoint === 3) {
            this.x = 1200
            this.y = 300
        }
        if(this.health === 1) {
            this.enemyName = 'Adventurer'
            this.speed = getRandFloat(.6, .8)
        } else if(this.health === 2) {
            this.enemyName = 'Knight'
            this.speed = getRandFloat(1, 1.3)
        } else if(this.health === 3) {
            this.enemyName = 'Warrior'
            this.speed = getRandFloat(1.5, 2)
        } else if(this.health === 4) {
            this.enemyName = 'Champion'
            this.speed = getRandFloat(2, 2.6)
        } else if(this.health === 6) {
            this.enemyName = 'Royalty'
            this.speed = getRandFloat(3, 3.4)
        }
    }
    render() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
        context.fillText(this.enemyName, this.x - 10, this.y- 10)
        context.fillStyle = 'black'
        context.font = '25px Arial';
        context.fillText(this.health, this.x + 2, this.y + 20)
    }
    takeDamage(enemyArr) {
        let index = enemyArr.indexOf(this)
        if(!this.recentlyDamaged) {
            if(this.health >= 1) {
                this.health -= 1
                this.recentlyDamaged = true
            }
        } else {
            setTimeout(() => {
                this.recentlyDamaged = false
                }, 200)
            }
        }
    checkDead(enemyArr) {
        let index = enemyArr.indexOf(this)
        enemyArr.forEach(enemy => {
            if(enemy.health === 0) {
                enemyArr.splice(index, 1)
                dungeonHeart.gold += 35
            }
        })
    }
    move(enemiesArr) {
        //if health is 0 remove it
        let index = enemiesArr.indexOf(this)
        if(!this.alive) {
            enemiesArr.splice(index, 1)
        }
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
        //Movement path to dungeon heart at spawnpoint 2
        if(this.spawnPoint === 2) {
            if(this.x > 900 && this.y >= 430) {
                this.y -= this.speed
            } else if(this.x > 700 && this.y > 400) {
                this.x -= this.speed
            } else if(this.x > 695 && this.y > 350) {
                this.y -= this.speed
            } else if(this.x > 55 && this.y > 345 && this.y < 355) {
                this.x -= this.speed
            } else if(this.x > 50 && this.y < 500) {
                this.y += this.speed
            } else if(this.x >= 50 && this.x < 700 && this.y >= 500) {
                this.x += this.speed
            }
        }
        if(this.spawnPoint === 3) {
            if(this.x > 55 && this.y === 300) {
                this.x -= this.speed
            } else if(this.x <= 55 && this.y <= 510) {
                this.y += this.speed
            } else {
                this.x += this.speed
            }
        }
    }
    checkCollision(other, enemyArr) {
        let index = enemyArr.indexOf(this)
        // const xHit = other.x <= this.x && other.x >= other.x + other.width && other.y >= this.y && other.y <= this.y + this.height
        const horizHit = this.x <= other.x + other.width && this.x + this.width > other.x
        const vertHit = this.y <= other.y + other.height && this.y + this.height > other.y
        if(horizHit && vertHit && this.alive) {
            //if enemy is colliding with dungeon heart
            if (other instanceof DungeonHeart) {
                enemyArr.splice(index, 1)
                other.takeDamage(this)
                this.takeDamage(enemyArr)
                dungeonHeart.gold += 35
            }
            // if enemy is colliding with traps
            if(other.trapType === 'spike' && other.trigger && other instanceof Trap) {
                this.takeDamage(enemyArr)
            }
            if(other instanceof Projectile && this.alive) {
                    this.takeDamage(enemyArr)
                    console.log('hit')
                }
            }
        }
    }

//round class use for making new round enemies and checking if all 
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
    //new Wall(730, canvas.height / 2 - 50, 50, 170), //right block
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
    //(spawnpoint, health)
    new Enemy(3, 1),
    new Enemy(1, 1),
    new Enemy(2, 2),
    new Enemy(2, 1),
    new Enemy(1, 2)
])

const roundTwo = new Round([
    new Enemy(1, 2),
    new Enemy(1, 2),
    new Enemy(2, 1),
    new Enemy(2, 1),
    new Enemy(1, 2)
])

const roundThree = new Round([
    new Enemy(1, 2),
    new Enemy(1, 2),
    new Enemy(2, 2),
    new Enemy(2, 2),
    new Enemy(1, 2)
])

const roundFour = new Round([
    new Enemy(1, 3),
    new Enemy(2, 3),
    new Enemy(2, 3),
    new Enemy(2, 3),
    new Enemy(1, 3)
])

const roundFive = new Round([
    new Enemy(1, 4),
    new Enemy(2, 4),
    new Enemy(2, 4),
    new Enemy(2, 3),
    new Enemy(1, 3)
])

const roundSix = new Round([
    new Enemy(1, 6),
    new Enemy(2, 6),
])

const roundSeven = new Round([
    new Enemy(1, 6),
    new Enemy(2, 6),
    new Enemy(1, 3),
    new Enemy(2, 2),
    new Enemy(2, 4)
])
// when a trap is made it will be pushed into this arr
const traps = []
// control enemy movement collision and draw to screen
const enemyControl = arr => {
    arr.forEach(enemy => {  
        enemy.move(arr)
        enemy.checkCollision(dungeonHeart, arr)
        traps.forEach(trap => {
            enemy.checkCollision(trap, arr)
            trap.bulletRack.forEach(bullet => enemy.checkCollision(bullet, arr))
        })
        enemy.checkDead(arr)
    })
}

//main game
const mainGameLoop = () => {
    const intervalId = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        walls.forEach(wall => wall.render())
        traps.forEach(trap => {
            trap.render()
            if(trap.trapType === 'turret') {
                trap.shoot()
            } 
        })
        dungeonHeart.render()
        updateMenuInfo()
        if(dungeonHeart.round === 1) {
            enemyControl(roundOne.enemies)      
            roundOne.enemies.forEach(enemy => enemy.render())
            if(roundOne.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 2) {
            buildTimer(roundTwo, 5000)
            roundTwo.enemies.forEach(enemy => enemy.render())
            if(roundTwo.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 3) {
            buildTimer(roundThree, 5000)
            roundThree.enemies.forEach(enemy => enemy.render())
            if(roundThree.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 4) {
            buildTimer(roundFour, 5000)
            roundFour.enemies.forEach(enemy => enemy.render())
            if(roundFour.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 5) {
            buildTimer(roundFive, 5000)
            roundFive.enemies.forEach(enemy => enemy.render())
            if(roundFive.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 6) {
            buildTimer(roundSix, 5000)
            roundSix.enemies.forEach(enemy => enemy.render())
            if(roundSix.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        }else if(dungeonHeart.round === 7) {
            buildTimer(roundSeven, 5000)
            roundSeven.enemies.forEach(enemy => enemy.render())
            if(roundSeven.allEnemiesDead() && dungeonHeart.checkAlive()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 8) {
            hideGame()
            clearInterval(intervalId)
            victoryScreen.classList.remove('hidden')
            document.querySelector('.dungeonheart_power').textContent = dungeonHeart.health
            document.querySelector('.victorybtn').addEventListener('click', () => {
                location.reload()
            })
        }
        if(!dungeonHeart.checkAlive()) {
            hideGame()
            clearInterval(intervalId)
            gameOverScreen.classList.remove('hidden')
            document.querySelector('.roundachieved').textContent = dungeonHeart.round
            document.querySelector('.gameoverbtn').addEventListener('click', () => {
                location.reload()
            })
        }
    }, 10)
}