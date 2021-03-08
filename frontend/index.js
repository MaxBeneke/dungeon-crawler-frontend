// Create global variables

const mapContainer = document.querySelector('div#map')
const battleContainer = document.querySelector('div#battle')
const characterContainer = document.querySelector('div#character-container')
const character = document.querySelector('img#character')
const testChar = document.querySelector('img#test-sprite')
let position = { x: 1, y: 1 }
let wallArray = { x: [2, 2, 2, 3], y: [1, 2, 3, 3] }

function createWalls() {
    for (let i = 0; i < wallArray.x.length; i++) {

        const wallDiv = document.querySelector(`div#gi${wallArray.x[i]}-${wallArray.y[i]}`)
        wallDiv.classList.add("wall")
        console.log(wallDiv)
    }
}

// document.addEventListener('click', () => {startBattle()})
// startBattle should take 2 args. Player and Enemy
function startBattle() {
    mapContainer.style.display == "grid" ? mapContainer.style.display = "none" : mapContainer.style.display = "grid"
    battleContainer.style.display == "none" ? battleContainer.style.display = "block" : battleContainer.style.display = "none"
}

// DOM CONTENT
document.addEventListener('DOMContentLoaded', (event) => {
    createGridDivs()
    createWalls()
    const startDiv = document.querySelector('div#gi1-1')
    startDiv.appendChild(testChar)
    spawnEnemies()
    spawnTreasures()
})

const createGridDivs = () => {

    for (let x = 1; x < 11; x++) {

        for (let y = 1; y < 11; y++) {
            const div = document.createElement('div')
            div.className = 'grid-item'
            div.id = `gi${x}-${y}`
            div.style.height = `64px`
            div.style.width = `64px`
            div.style.gridColumnStart = `${x}`
            div.style.gridRowStart = `${y}`
            mapContainer.appendChild(div)
        }
    }
}


// Helper functions

function checkWall(direction) {
    switch (direction) {
        case "left":
            let checkLeft = document.querySelector(`div#gi${position.x - 1}-${position.y}`)
            if (checkLeft) {
                return checkLeft.classList.contains('wall') ? false : true
            } else {
                return false
            }

        case "right":
            let checkRight = document.querySelector(`div#gi${position.x + 1}-${position.y}`)
            if (checkRight) {
                return checkRight.classList.contains('wall') ? false : true
            } else {
                return false
            }

        case "up":
            let checkUp = document.querySelector(`div#gi${position.x}-${position.y - 1}`)
            if (checkUp) {
                return checkUp.classList.contains('wall') ? false : true
            } else {
                return false
            }

        case "down": 
            let checkDown = document.querySelector(`div#gi${position.x}-${position.y + 1}`)
            if (checkDown) {
                return checkDown.classList.contains('wall') ? false : true
            } else {
                return false
            }
    }
}

function moveLeft() {
    if (checkWall('left')) {
        position.x -= 1
        const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
        newDiv.appendChild(testChar)
    }
}


function moveRight() {
    if (checkWall('right')) {
        position.x += 1
        const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
        newDiv.appendChild(testChar)
    }
}

function moveUp() {
    if (checkWall('up')) {
        position.y -= 1
        const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
        newDiv.appendChild(testChar)
    }
}

function moveDown() {
    if (checkWall('down')) {
        position.y += 1
        const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
        newDiv.appendChild(testChar)
    }
}

function moveCharacter(e) {
    switch (e.keyCode) {
        case 37: // Left
        testChar.className = "facing_left"
            moveLeft()
            break;

        case 38: // Up
            moveUp()
            break;

        case 39: // Right 
        testChar.className = "facing_right"
            moveRight()
            break;

        case 40: // Down
            moveDown()
            break;

        default:
            return;
    }
}


function spawnEnemies() {
    for (let i = 0; i < 5; i++) {
    //     const enemy = document.createElement('img')
    //     enemy.className = "enemy"
    //     enemy.src = "assets/boss.png"
        const randomDiv = mapContainer.children[Math.floor(Math.random() * 100)]
        if (!randomDiv.classList.contains('wall')) { 
            randomDiv.classList.add('enemy')
        }
    }
}

function spawnTreasures() {
    for (let i = 0; i < 5; i++) {
        // const treasure = document.createElement('img')
        // treasure.className = "treasure"
        // treasure.src = "assets/treasure.png"
        const randomDiv = mapContainer.children[Math.floor(Math.random() * 100)]
        if (!randomDiv.classList.contains('wall') && !randomDiv.classList.contains('enemy')) { 
            randomDiv.classList.add('treasure')
        }
    }
}



document.addEventListener('keydown', moveCharacter)