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
let globalTimer = null
let globalPlayerId = 0
const modal = document.querySelector('div#modal')
const logInForm = document.querySelector('form#login-handler')
const createAccountForm = document.querySelector('form#account-handler')
const mapContainer = document.querySelector('div#map')
const battleContainer = document.querySelector('div#battle')
const characterContainer = document.querySelector('div#character-container')
const character = document.querySelector('img#character')
const testChar = document.querySelector('img#test-sprite')
const battleButtons = document.querySelector('div#battle-buttons')
const portraitDiv = document.querySelector('div#battle-map-container')
const logBox = document.querySelector('div#log')
const allButtons = document.querySelectorAll('button')
const worldCommand = document.querySelector('div#command')
const battleCommand = document.querySelector('div#battle-command')
const position = { x: 1, y: 1 }
const url = "http://localhost:3000"
const attackQuotes = ["A direct hit!", "Take that, loser.", "*Smack* Right in the kisser!", "Ouch! That's gotta hurt!"]
const mainPane = document.querySelector('main#main-game')
const gameScreen = document.querySelector('div#game-screen')
const enemyNameHeader = document.querySelector('h2')


// BGM constant
const bgm = document.querySelector('audio#bgm')


// Player info pane constants
const infoDiv = document.querySelector('div#info')
const playerInfo = document.querySelector('div#character-info')
const playerStat = document.querySelector('div#player-stat')
const playerPortrait = document.querySelector('img#portrait')
const playerName = document.querySelector('section#name')
const playerLevel = document.querySelector('section#level')
const playerHP = document.querySelector('section#hp')
const playerExp = document.querySelector('section#xp')
const playerAttackNames = document.querySelector('section#attack-names')


// Item info pane constants
const itemInfo = document.querySelector('div#item-stat')
const pTagItems = itemInfo.querySelectorAll('p')


// Audio option constant
const audioOption = document.querySelector('div#audio-option')
const audionOnBtn = document.querySelector('button#radio-on')
const audionOffBtn = document.querySelector('button#radio-off')



// Wall 
let wallArray = {
    x: [10, 1, 2, 3, 4, 6, 7, 8, 10, 6, 7, 8, 10, 2, 3, 4, 6, 8, 10, 2, 3, 8, 10, 2, 3, 5, 6, 8, 10, 2, 6, 6, 8, 9, 1, 2, 3, 5, 6, 7, 8, 9],
    y: [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9]
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function rollCrit() {
    const crit = getRandomNum(1, 13) == 12 ? true : false
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

function fetchPlayer() {
    if (globalPlayerId != 0) {
        return fetch(`${url}/players/${globalPlayerId}`).then(res => res.json())
    }
}

function fetchEnemy(id) {
    return fetch(`${url}/enemies/${id}`).then(res => res.json())
}

function updatePlayer(player) {
    fetch(`${url}/players/${player.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(player)
    })
        .then(res => res.json())
        .then(updatedPlayer => {
            checkPlayerStatus(updatedPlayer)
            renderPlayer(updatedPlayer)
        })
}

function checkPlayerStatus(player) {
    if (player.hp <= 0) {
        gameOver()
    }
    else if (player.xp >= 100) {
        levelUp(player)
    }
    else {
        return
    }
}

function updateEnemy(enemy) {
    fetch(`${url}/enemies/${enemy.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enemy)
    })
        .then(res => res.json())
        .then(updatedEnemy => {
            if (mapContainer.style.display == "none") {
                updatedEnemy.hp <= 0 ? battleWin(updatedEnemy.id) : enemyAttack(updatedEnemy.id)
            }
        })
}

function battleWin(enemyId) {
    if (enemyId == 9) {
        setTimeout(gameWon, 1600);
    } else {
        let exp;
        fetchEnemy(enemyId).then(enemy => exp = enemy.xp)
        fetchPlayer().then(player => {
            player.xp += exp
            updatePlayer(player)
            endBattle(findEnemyId())
        })
    }
}

function findEnemyId() {
    const area = checkArea()
    if (area.up && area.up.classList.contains('enemy')) { return parseInt(area.up.dataset.id) }
    else if (area.right && area.right.classList.contains('enemy')) { return parseInt(area.right.dataset.id) }
    else if (area.left && area.left.classList.contains('enemy')) { return parseInt(area.left.dataset.id) }
    else if (area.down && area.down.classList.contains('enemy')) { return parseInt(area.down.dataset.id) }
}

// document.addEventListener('click', () => endBattle())
// startBattle should take 2 args. Player and Enemy
function startBattle(enemyId) {
    let dialog = 1;
    fetchEnemy(enemyId)
        .then(enemy => {
            logText(enemy.dialogue[dialog])
            enemyNameHeader.textContent = enemy.name
            const img = document.createElement('img')
            img.src = enemy.image
            img.alt = enemy.name
            portraitDiv.appendChild(img)

            mapContainer.style.display = "none"
            battleContainer.style.display = "inline-block"
            battleCommand.style.display = "inline-block"
            worldCommand.style.display = "none"
        })
}

function endBattle(enemyId) {

    mapContainer.style.display = "grid"
    battleContainer.style.display = "none"
    battleCommand.style.display = "none"
    worldCommand.style.display = "inline-block"

    const enemyDiv = document.querySelector(`div.enemy[data-id="${findEnemyId()}"]`)
    enemyDiv.classList.remove('enemy')
    enemyDiv.style.backgroundImage = "url(assets/floor-tile.png)"
    const img = portraitDiv.querySelector('img')
    portraitDiv.removeChild(img)
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
            itemInfo.className = ""
            playerInfo.className = "hidden"
            fetchItems()
            break;
        case "status":
            itemInfo.className = "hidden"
            playerInfo.className = ""
            break;
    }
})

function battleAttack(id) {
    fetchPlayer().then(player => {
        let i = getRandomNum(0, 4)
        const crit = rollCrit() ? 2 : 1
        let atk = Math.ceil(player.multiplier * getRandomNum(2, 6))
        atk = atk * crit
        fetchEnemy(id).then(enemy => {
            enemy.hp -= atk
            if (enemy.hp >= 0) {
                crit == 2 ? logText(`It's a critical hit! ${atk} damage.`) : logText(attackQuotes[i] + ` ${atk} damage.`)
            } else if (enemy.hp <= 0) {
                logText(enemy.dialogue[0])
            }
            console.log(enemy)
            updateEnemy(enemy)
        })
    })
}

function battleSpecial(id) {
    fetchPlayer().then(player => {
        const crit = rollCrit() ? 2 : 1
        let spAtk = Math.ceil(1.75 * (Math.ceil(player.multiplier * getRandomNum(3, 6))))
        spAtk = spAtk * crit
        console.log(spAtk)

        if (player.special > 0) {
            fetchEnemy(id).then(enemy => {
                enemy.hp -= spAtk
                if (enemy.hp >= 0) {
                    crit == 2 ? logText(`It's a critical hit! ${spAtk} damage.`) : logText(`Special attack hit for ${spAtk} damage!`)
                } else if (enemy.hp <= 0) {
                    logText(enemy.dialogue[0])
                }
                player.special -= 1
                console.log(enemy)
                updatePlayer(player)
                updateEnemy(enemy)
            })
        } else {
            noSpecialNotif()
        }
    })
}

function useItem(itemId, possesionId) {
    if (itemId == 2 && mapContainer.style.display != "none") {
        logText("You can't use that outside of battle!")
        return;
    }
    if (itemId == 4 && mapContainer.style.display != "none") {
        logText("You can't use that outside of battle!")
        return;
    }

    fetch(`${url}/possessions/${possesionId}`, {
        method: 'DELETE'
    }).then(res => res.json()).then(possession => fetchItems())
    switch (itemId) {
        case 1:
            useMinorHealing()
            if (mapContainer.style.display == 'none') {
                enemyAttack(findEnemyId())
            }
            break;
        case 2:
            useSmokeBomb()
            if (mapContainer.style.display == 'none') {
                enemyAttack(findEnemyId())
            }
            break;
        case 3:
            useMajorHealing()
            if (mapContainer.style.display == 'none') {
                enemyAttack(findEnemyId())
            }
            break;
        case 4:
            useBomb()
            if (mapContainer.style.display == 'none') {
                enemyAttack(findEnemyId())
            }
            break;
    }
}

function enemyAttack(id) {
    let atk;
    let dialog = getRandomNum(2, 5)
    fetchEnemy(id).then(enemy => {
        if (enemy.status == "smoke" && Math.floor(getRandomNum(1, 5)) == 2) {
            logText("The attack missed!")
            return
        }
        switch (enemy.xp) {
            case 0:
                atk = Math.ceil(getRandomNum(6, 13))
            case 25:
                atk = Math.ceil(getRandomNum(3, 7))
                break;
            case 50:
                atk = Math.ceil(getRandomNum(5, 10))
                break;
            case 75:
                atk = Math.ceil(getRandomNum(7, 12))
        }
        fetchPlayer().then(player => {
            setTimeout(logText, 1700, enemy.dialogue[dialog])
            player.hp -= atk
            console.log(player)
            updatePlayer(player)
        })
    })
}
function noSpecialNotif() {
    logText("You're out of Special Moves!")
}

function levelUp(player) {
    player.xp -= 100
    player.level += 1
    let newHp
    switch (player.level) {
        case 2:
            newHp = 55
            break;
        case 3:
            newHp = 60
            break;
        case 4:
            newHp = 65
            break;
        case 5:
            newHp = 70
    }
    player.hp = newHp
    player.special = 4
    console.log(player)
    updatePlayer(player)
}

function gameOver() {
    const gameOverImage = document.createElement('img')
    gameOverImage.src = "assets/gameover.jpeg"
    gameOverImage.className = "gameover"

    const gameOverMsg = document.createElement('p')
    gameOverMsg.textContent = "OH SHOOT IT'S GAME OVER FOR YOU!"
    gameOverMsg.className = "gameover"

    const continueBtn = document.createElement('button')
    continueBtn.textContent = "Restart Game"
    continueBtn.className = "continue-btn"
    continueBtn.addEventListener('click', restartGame)

    mainPane.innerHTML = " "
    logBox.remove()
    gameScreen.append(gameOverMsg, gameOverImage, continueBtn)
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
    const bossDiv = mapContainer.querySelector('div#gi10-10')
    bossDiv.classList.add('enemy')
    bossDiv.dataset.id = "9"
    bossDiv.textContent = "Exit!"
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
        spawnDiv.style.backgroundImage = `url(assets/enemy-${i + 1}.png)`
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
    fetch(`${url}/possessions/`, {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ player_id: globalPlayerId, item_id: id })
    })
        .then(res => res.json())
        .then(possession => {
            console.log(possession)
            const targetDiv = testChar.closest('div')
            targetDiv.classList.remove('treasure')
            console.log(targetDiv)
            logText(`You got a ${possession.item.name}! ${possession.item.description}`)
            fetchItems()
        })
}

function useMinorHealing() {
    fetchPlayer().then(player => {
        console.log(player.hp)
        let healthBonus = player.level
        player.hp += healthBonus + 12
        logText(`You healed ${healthBonus + 12} HP!`)
        updatePlayer(player)
    })
}

function useMajorHealing() {
    fetchPlayer().then(player => {
        console.log(player.hp)
        let healthBonus = (player.level * 2)
        player.hp += healthBonus + 23
        logText(`You healed ${healthBonus + 23} HP!`)
        updatePlayer(player)
    })
}

function useBomb() {
    fetchEnemy(findEnemyId()).then(enemy => {
        enemy.hp -= 15
        console.log(enemy)
        logText("WAPOW! The bomb did 15 damage!")
        updateEnemy(enemy)
    })
}

function useSmokeBomb() {
    fetchEnemy(findEnemyId()).then(enemy => {
        enemy.status = "smoke"
        console.log(enemy)
        logText("You tossed a smoke bomb. Your foe's accuracy decreased!")
        updateEnemy(enemy)
    })
}


function logText(text) {
    logBox.textContent = ""
    let i = 0;
    let txt = text;
    let speed = 25;
    let timer = 0
    globalTimer = true

    function typeWriter() {
        if (i < txt.length) {
            logBox.textContent += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed)
            timer = 400
            if (i == txt.length) {
                globalTimer = null
            }
        }
    }
    disableEventListeners(allButtons)
    disableEventListeners(pTagItems)
    typeWriter()
    setTimeout(enableEventListeners, 1500, allButtons)
    setTimeout(enableEventListeners, 1500, pTagItems)
}




/////////////////////////////////////////////////////////////////////
// Battle BGM 

function playBGM() {
    bgm.play()
}

function stopBGM() {
    bgm.pause()
}

////////////////////////////////////////////////////////////////////
// Show player stat on the right pane

function renderPlayer(player) {
    console.log(player)
    playerStat.className = "active"
    playerPortrait.setAttribute('src', `${player.sprite}`)

    playerName.textContent = player.name
    playerLevel.textContent = `Lvl ${player.level}`
    playerHP.textContent = `HP ${player.hp}`
    playerExp.textContent = `EXP Points ${player.xp}`

    playerAttackNames.textContent = `${player.special || 0} -- Thunderbolt Attack `
}



///////////////////////////////////////////////////////////////
// Get current items from player and show on the right pane

function fetchItems() {
    itemInfo.innerHTML = ''
    fetchPlayer().then(player => {
        if (player.possessions.length === 0) {
            console.log(player.possessions)
            const noneTag = document.createElement('p')
            noneTag.textContent = "Tough scene. Backpack's empty."
            itemInfo.append(noneTag)
        } else {
            player.possessions.forEach(possession => {
                console.log('fetching')
                const pTag = document.createElement('p')
                pTag.textContent = possession.item.name
                pTag.dataset.possessionId = possession.id
                pTag.dataset.itemId = possession.item.id
                const divTag = document.createElement('div')
                divTag.textContent = possession.item.description
                itemInfo.append(pTag, divTag)
            })
        }
    })
}



///////////////////////////////////////////////////////////////
// Add eventlisterns for world map commands, toggle on click

worldCommand.addEventListener('click', e => {
    switch (e.target.id) {
        case "stat":
            playerInfo.className = ""
            itemInfo.className = "hidden"
            audioOption.className = "hidden"
            break;
        case "item":
            fetchItems()
            itemInfo.className = ""
            playerInfo.className = "hidden"
            audioOption.className = "hidden"
            break;
        case "option":
            audioOption.className = ""
            itemInfo.className = "hidden"
            playerInfo.className = "hidden"
    }
})

function disableEventListeners(array) {
    array.forEach(element => element.style.pointerEvents = "none")
}

function enableEventListeners(array) {
    array.forEach(element => element.style.pointerEvents = "all")
    console.log('enabled')
}

//// Reset enemy health at start of game

function resetEnemies() {
    fetch(`${url}/enemies`).then(res => res.json()).then(enemies => {
        enemies.forEach(enemy => {
            switch (enemy.xp) {
                case 0:
                    enemy.hp = 50
                    updateEnemy(enemy)
                    break;
                case 25:
                    enemy.hp = 10
                    updateEnemy(enemy)
                    break;
                case 50:
                    enemy.hp = 15
                    updateEnemy(enemy)
                    break;
                case 75:
                    enemy.hp = 20
                    updateEnemy(enemy)
                    break;
            }
        })
    })
}


///////////////////////////////////////////////////////////////
// Add eventlisterns for background bgm, click on and off

audionOnBtn.addEventListener('click', playBGM)
audionOffBtn.addEventListener('click', stopBGM)
document.addEventListener('keydown', moveCharacter)
itemInfo.addEventListener('click', e => {
    if (e.target.tagName === "P") {
        useItem(parseInt(e.target.dataset.itemId), parseInt(e.target.dataset.possessionId))
    }
})



///////////////////////////////////////////////////////////////
// Check if the game is won
function gameWon() {
    const gameWonImage = document.createElement('img')
    gameWonImage.src = "assets/gamewon.jpeg"
    gameWonImage.className = "gamewon"

    const gameWonMsg = document.createElement('p')
    gameWonMsg.textContent = "You have escaped middle school!"
    gameWonMsg.className = "gamewon"

    mainPane.innerHTML = " "
    logBox.remove()
    gameScreen.append(gameWonMsg, gameWonImage)
}

// Remove Scrolling with arrow keys
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);


// Start a new game/Continue after game over
function restartGame () {
    const player = {'id': 1, 'hp': 50, 'name': "James", 'level': 1, 'xp': 0, 'special': 4, 'sprite': 'assets/player-portrait.png'}
    updatePlayer(player) 
    location.reload()
}
// Handle Login 
function handleLogin(e) {
    e.preventDefault()
    const playerName = e.target.login.value
    fetch('http://localhost:3000/players')
        .then(res => res.json())
        .then(players => {
            if (players.find(player => playerName === player.name)) {
                const myPlayer = players.find(player => playerName === player.name)
                globalPlayerId = myPlayer.id
                fetchPlayer().then(player => renderPlayer(player))
                logText(`Got caught skipping, huh ${myPlayer.name}? Well, that won't stop you. Try again!`)
                modal.style.display = "none"
                mainPane.style.display = "flex"
                resetEnemies()
            }
            else
                alert('No such player')
        })
}


function handleCreateAccount(e) {
    e.preventDefault()

    const userName = e.target.account.value
    const hp = 50
    const level = 1
    const xp = 0
    const special = 4
    const sprite = 'assets/player-portrait.png'

    fetch('http://localhost:3000/players')
        .then(res => res.json())
        .then(players => {
            if (players.find(player => userName === player.name)) {
                alert(`Sorry, that player name already exist, try another...`)
                return
            }
            else {
                fetch('http://localhost:3000/players', {
                    method: 'POST',
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({ name: userName, hp, level, xp, special, sprite })
                })
                    .then(res => res.json())
                    .then(player => {
                        globalPlayerId = player.id
                        logText(`Welcome to Marsha P. Johnson Middle School, ${player.name}. Let's play hooky and head for the exit!`)
                        fetchPlayer().then(player => renderPlayer(player))
                        modal.style.display = "none"
                        mainPane.style.display = "flex"
                        resetEnemies()
                    })
            }
        })
}
logInForm.addEventListener('submit', handleLogin)
createAccountForm.addEventListener('submit', handleCreateAccount)
