// Create global variables

const characterContainer = document.querySelector('div#character-container')
const character = document.querySelector('img#character')



// Helper functions
function moveCharacter (e) {
    switch (e.keyCode) {
        case 37: // Left
        character.className = 'facing_left'

        break;

        case 38: // Up
        character.className = 'facing_up'
        break;

        case 39: // Right 
        character.className = 'facing_right'
        break;

        case 40: // Down 
        character.className = 'facing_down'
        break;
    }
}


document.addEventListener('keydown', moveCharacter)