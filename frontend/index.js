// Create global variables

const characterContainer = document.querySelector('div#character-container')
const character = document.querySelector('img#character')
const testChar = document.querySelector('img#test-sprite')


// Helper functions
function moveCharacter (e) {
    switch (e.keyCode) {
        case 37: // Left
        testChar.className = 'facing_left'
        testChar.style.left = parseInt(testChar.style.left) - 100 + 'px'
        console.log(testChar.style.left)

        break;

        case 38: // Up
        testChar.className = 'facing_up'
        break;

        case 39: // Right 
        testChar.className = 'facing_right'
        break;

        case 40: // Down 
        testChar.className = 'facing_down'
        break;
    }
}


document.addEventListener('keydown', moveCharacter)