const logInForm = document.querySelector('form#login-handler')
const createAccountForm = document.querySelector('form#account-handler')



function handleLogin(e) {
    e.preventDefault()
    const playerName = e.target.login.value
    fetch('http://localhost:3000/players')
    .then(res => res.json())
    .then(players => {
        if (players.find(player => playerName === player.name)) {
            alert(`Logging you in...... Just a moment`)
            window.location.replace('index.html')
        }
        else 
            alert('No such player')
    })
}


function handleCreateAccount(e) {
    e.preventDefault()

    const userName = e.target.account.value
    const hp = 20
    const level = 1
    const xp = 0
    const special = 5

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
                body: JSON.stringify({name: userName, hp, level, xp, special})
            })
            .then(res => res.json())
            .then(() => window.location.replace(index.html))  // After successfully create account. Log them in?
        }
    })

}


logInForm.addEventListener('submit', handleLogin)
createAccountForm.addEventListener('submit', handleCreateAccount)


