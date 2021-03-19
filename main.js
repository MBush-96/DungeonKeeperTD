const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)


class Wall {
    constructor(x=0, y=0, width=600, height=600, color='brown') {
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
    takeDamage() {
        if(this.health > 0) {
            this.health -= 1
        } else if(health === 0) {
            this.alive = false
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
}

class Enemy {
    constructor(x, y, width=50, height=50, color='yellow') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = 1
        this.alive = true
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
    new Enemy(1000, 400, 50, 50)
]

setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    dungeonHeart.render()
    walls.forEach(wall => {
        wall.render();
    })
    enemies.forEach(enemy => {
        enemy.render()
    })
}, 25)