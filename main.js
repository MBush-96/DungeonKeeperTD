const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)
let gameActive = true

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
    }
    takeDamage(other) {
        if(this.health > 0) {
            this.health -= other.health
        } else if(health === 0) {
            this.alive = false
        }
        console.log(this.health);
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
        if(spawnPoint === 1) {
            this.x = 1000
            this.y = 400
        } else if (spawnPoint === 2) {
            this.x = 1000
            this.y = 200
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
        if(this.x >= 50 && this.y <= 349) {
            this.x -= this.speed
        } else if(this.x <= 50 && this.y <= 450) {
            this.y += this.speed
        } else {
            this.x += this.speed
        }
    }
    checkCollision(other) {
        const horizHit = this.x >= other.x && this.x + this.width < other.x + other.width
        const vertHit = this.y >= other.y && this.y + this.height < other.y + other.height
        if(horizHit && vertHit && this.alive) {
            if (other instanceof DungeonHeart) {
                let index  = enemies.indexOf(this)
                enemies.splice(index, index+1)
                other.takeDamage(this)
            }
            this.takeDamage()
        }
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

const enemies = [
    new Enemy(2, 8),
    new Enemy(2)
]


setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    dungeonHeart.render()
    walls.forEach(wall => {
        wall.render();
    })
    enemies.forEach(enemy => {
        enemy.render()
        enemy.checkCollision(dungeonHeart)
        enemy.move()
    })
}, 25)