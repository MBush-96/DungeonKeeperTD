const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const bgImage = new Image()
canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)
bgImage.src = './assets/mainMenuBG.jpg'
let gameActive = true

const mainMenu = () => {
    // GETS KEY POS
    canvas.addEventListener('click', event => {
        let rect = canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top
        console.log('X: ' + x + ' Y: ' + y)
    })
    context.drawImage(bgImage, 0, 0)
    context.fillStyle = 'white'
    context.fillText('Dungeon Keeper', 300, 80)
    context.font = '100px Metal Mania'
}

const checkKeysPushed = () => {
    document.addEventListener('keyup', e => {
        if(e.key === 'm') {
            console.log('m')
        }
    })
}

class Wall {
    constructor(x=0, y=0, width=600, height=600, color='rgb(134, 0, 0)') {
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
        this.alive = true
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
        context.fillRect(this.x, this.y, this.width, this.height)
    }
    checkAlive() {
        if(this.health >= 1) {
            return true
        } else {
            this.alive = false
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
        this.endpath = false
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
                this.endpath = true
            } else if(this.x >= 40 && this.y >= 500) {
                this.x += this.speed
            }
        }
    }
    checkCollision(other, enemyArr) {
        const horizHit = this.x >= other.x && this.x + this.width < other.x + other.width
        const vertHit = this.y >= other.y && this.y + this.height < other.y + other.height
        if(horizHit && vertHit && this.alive) {
            if (other instanceof DungeonHeart) {
                let index  = enemyArr.indexOf(this)
                enemyArr.splice(index, 1)
                other.takeDamage(this)
            }
            this.takeDamage()
        }
    }
}

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

const dungeonHeart = new DungeonHeart(400, 430, 150, 140)

const roundOne = new Round([
    new Enemy(1, 3),
    new Enemy(1, 4),
    new Enemy(1, 3),
    new Enemy(1, 4),
    new Enemy(1, 5),
    new Enemy(2, 2),
    new Enemy(2, 4),
    new Enemy(2, 6),
    new Enemy(2, 2),
    new Enemy(2, 4),
])


const enemyControl = arr => {
    arr.forEach(enemy => {  
        enemy.render()
        enemy.checkCollision(dungeonHeart, arr)
        enemy.move()
    })
}

const mainGameLoop = () => {
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        dungeonHeart.render()
        checkKeysPushed()
        walls.forEach(wall => {
            wall.render();
        })
        if(dungeonHeart.round === 1) {
            dungeonHeart.checkAlive()
            enemyControl(roundOne.enemies)
            if(roundOne.allEnemiesDead()) {
                dungeonHeart.round++
            }
        } else if(dungeonHeart.round === 2) {
            console.log(dungeonHeart.round)
        }
        if(!dungeonHeart.health === 0) {
            return
        }
    }, 25)
}

//mainGameLoop()