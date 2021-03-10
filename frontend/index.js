// DOM CONTENT
document.addEventListener('DOMContentLoaded', (event) => {
    createGridDivs()
    createWalls()
    const startDiv = document.querySelector('div#gi1-1')
    startDiv.appendChild(testChar)
    spawnEnemies()
    spawnTreasures()
})
// Create global variables

const mapContainer = document.querySelector('div#map')
const battleContainer = document.querySelector('div#battle')
const characterContainer = document.querySelector('div#character-container')
const character = document.querySelector('img#character')
const testChar = document.querySelector('img#test-sprite')
const battleButtons = document.querySelector('div#battle-buttons')
const logBox = document.querySelector('div#log')
const worldCommand = document.querySelector('div#command')
const battleCommand = document.querySelector('div#battle-command')
const position = { x: 1, y: 1 }
const url = "http://localhost:3000"
let wallArray = {
    x: [10, 1, 2, 3, 4, 6, 7, 8, 10, 6, 7, 8, 10, 2, 3, 4, 6, 8, 10, 2, 3, 8, 10, 2, 3, 5, 6, 8, 10, 2, 6, 6, 8, 9, 1, 2, 3, 5, 6, 7, 8, 9],
    y: [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9]
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function rollCrit() {
   const crit = getRandomNum(1, 13) == 12 ? true : false
   if (crit) {
       logText("It's a critical hit!")
   }
   return crit
}

function checkArea() {
    const left = document.querySelector(`div#gi${position.x - 1}-${position.y}`)
    const right = document.querySelector(`div#gi${position.x + 1}-${position.y}`)
    const up = document.querySelector(`div#gi${position.x}-${position.y - 1}`)
    const down = document.querySelector(`div#gi${position.x}-${position.y + 1}`)

    return { left, right, up, down }
}
function createWalls() {
    for (let i = 0; i < wallArray.x.length; i++) {
        const wallDiv = document.querySelector(`div#gi${wallArray.x[i]}-${wallArray.y[i]}`)
        wallDiv.classList.add("wall")
    }
}


function renderPlayer() {
    return fetch(`${url}/players/1`).then(res => res.json())
}

function renderEnemy(id) {
    return fetch(`${url}/enemies/${id}`).then(res => res.json())
}

function fetchPlayer() {
    const player = {}
    renderPlayer().then(playerObj => {Object.assign(player, playerObj)})
    return player
}

function fetchEnemy(id) {
    const enemy = {}
    renderEnemy(id).then(enemyObj => {Object.assign(enemy, enemyObj)})
    return enemy
}

function updatePlayer(player) {
    fetch(`${url}/players/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
        .then(res => res.json())
        .then(updatedPlayer => updatedPlayer)
}

function updateEnemy(enemy) {
    fetch(`${url}/enemies/${enemy.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enemy)
    })
        .then(res => res.json())
        .then(updatedEnemy => updatedEnemy)
}

function findEnemyId() {
    const area = checkArea()
    if (area.left.classList.contains('enemy')) {return parseInt(area.left.dataset.id)}
    else if (area.right.classList.contains('enemy')) {return parseInt(area.right.dataset.id)}
    else if (area.up.classList.contains('enemy')) {return parseInt(area.up.dataset.id)}
    else if (area.down.classList.contains('enemy')) {return parseInt(area.down.dataset.id)}
}

// document.addEventListener('click', () => endBattle())
// startBattle should take 2 args. Player and Enemy
function startBattle(enemyId) {
    mapContainer.style.display = "none"
    battleContainer.style.display = "inline-block"
    battleCommand.style.display = "inline-block"
    worldCommand.style.display = "none"
}

function endBattle(enemyId) {
    mapContainer.style.display = "grid"
    battleContainer.style.display = "none"
    battleCommand.style.display = "none"
    worldCommand.style.display = "inline-block"
    
    const enemyDiv = document.querySelector(`div.enemy[data-id="${1}"]`)
    enemyDiv.classList.remove('enemy')
}

battleButtons.addEventListener('click', e => {
    const enemyId = findEnemyId()
    switch (e.target.id) {
        case "attack":
            battleAttack(enemyId)
            break;
        case "special":
            battleSpecial(enemyId)
            break;
        case "battle-item":
            showItems()
            break;
        case "run":
            battleRun()
            break;
    }
})
/// FETCHING ENEMY DOES NOT WORK
function battleAttack(id) {
    const player = fetchPlayer()
    const enemy = fetchEnemy(id)
    console.log(player.hp)
    // const crit = rollCrit() ? 2 : 1
    // const atk = Math.ceil(player.multiplier * getRandomNum(2, 6))
    // // atk *= crit
    // enemy.hp -= atk
    // const updatedEnemy = updateEnemy(enemy)
    // console.log(updatedEnemy)
    // updatedEnemy.hp <= 0 ? battleWin(updatedEnemy) : enemyAttack(updatedEnemy)
}

function battleSpecial(id) {
    const player = fetchPlayer()
    const enemy = fetchEnemy(id)
    if (player.special > 0) {
        const atk = Math.ceil(1.5 * (player.multiplier * getRandomNum(2, 6)))
        enemy.hp -= atk
        player.special -= 1
        const updatedEnemy = updateEnemy(enemy)
        updatedEnemy.hp <= 0 ? battleWin(updatedEnemy) : enemyAttack(updatedEnemy)
    } else {
        noSpecialNotif()
    }
}

function showItems() {
    // Render the Item Div 
}

function useItem(itemId) {
}

function noSpecialNotif() {
    logText("You're out of Special Moves!")
}

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

function moveLeft() {
    position.x -= 1
    const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
    newDiv.appendChild(testChar)
}

function moveRight() {
    position.x += 1
    const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
    newDiv.appendChild(testChar)
}

function moveUp() {
    position.y -= 1
    const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
    newDiv.appendChild(testChar)
}

function moveDown() {
    position.y += 1
    const newDiv = document.querySelector(`div#gi${position.x}-${position.y}`)
    newDiv.appendChild(testChar)
}

function moveCharacter(e) {
    const left = checkArea().left
    const right = checkArea().right
    const up = checkArea().up
    const down = checkArea().down

    switch (e.keyCode) {
        case 37: // Left
            testChar.className = "facing_left"
            if (left.classList.contains('enemy')) {
                startBattle(parseInt(left.dataset.id))
            } else if (left.classList.contains('wall')) {
                return;
            }
            else if (left.classList.contains('treasure')) {
                pickupTreasure(parseInt(left.dataset.id))
                moveLeft()
            }
            else { moveLeft() }
            break;

        case 38: // Up
            if (up.classList.contains('enemy')) {
                startBattle(parseInt(up.dataset.id))
            } else if (up.classList.contains('wall')) {
                return;
            }
            else if (up.classList.contains('treasure')) {
                pickupTreasure(parseInt(up.dataset.id))
                moveUp()
            }
            else { moveUp() }
            break;

        case 39: // Right 
            testChar.className = "facing_right"
            if (right.classList.contains('enemy')) {
                startBattle(parseInt(right.dataset.id))
            } else if (right.classList.contains('wall')) {
                return;
            }
            else if (right.classList.contains('treasure')) {
                pickupTreasure(parseInt(right.dataset.id))
                moveRight()
            }
            else { moveRight() }
            break;

        case 40: // Down
            if (down.classList.contains('enemy')) {
                startBattle(parseInt(down.dataset.id))
            } else if (down.classList.contains('wall')) {
                return;
            }
            else if (down.classList.contains('treasure')) {
                pickupTreasure(parseInt(down.dataset.id))
                moveDown()
            }
            else { moveDown() }
            break;

        default:
            return;
    }
}

function spawnEnemies() {
    enemyObj =
    {
        x: [5, 1, 3, 5, 7, 10, 9, 9],
        y: [1, 5, 10, 4, 5, 7, 1, 5]
    }
    for (let i = 0; i < enemyObj.x.length; i++) {
        const spawnDiv = document.querySelector(`div#gi${enemyObj.x[i]}-${enemyObj.y[i]}`)
        spawnDiv.classList.add('enemy')
        spawnDiv.dataset.id = `${i + 1}`
    }
}

function spawnTreasures() {
    itemObj =
    {
        x: [1, 7, 10, 9],
        y: [10, 4, 8, 3]
    }
    for (let i = 0; i < itemObj.x.length; i++) {
        const spawnDiv = document.querySelector(`div#gi${itemObj.x[i]}-${itemObj.y[i]}`)
        spawnDiv.classList.add('treasure')
        spawnDiv.dataset.id = `${i + 1}`
    }
}

function pickupTreasure(id) {
    console.log('HEY')
    fetch(`${url}/possessions/`, {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ player_id: 1, item_id: id })
    })
        .then(res => res.json())
        .then(possession => {
            console.log(possession)
            const targetDiv = testChar.closest('div')
            targetDiv.classList.remove('treasure')
            console.log(targetDiv)
            logBox.textContent = `You got a ${possession.item.name}! ${possession.item.description}`
        })


}

function logText(text) {
    // Animation set up? Timeout?
    logBox.textContent = text
}






document.addEventListener('keydown', moveCharacter)