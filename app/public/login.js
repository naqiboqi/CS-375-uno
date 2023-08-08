const loginMessage = document.getElementById("login-status");
const userInput = document.getElementById("user-input");
const passInput = document.getElementById("pass-input");

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
    const username = userInput.value;
    const password = passInput.value; // Fixed the typo here

    doUserLogin(username, password);
});

function doUserLogin(username, password) {
    fetch("/login", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "password": password,
        }),
    }).then(response => {
        if (response.ok) {
            loginMessage.textContent = `${username} has logged in!`;
        } else {
            loginMessage.textContent = "Invalid login credentials";
        }
    });
}

const newAccountButton = document.getElementById("new-account-button");
newAccountButton.addEventListener("click", () => {
    // Redirect the user to the signup.html page
    window.location.href = "/signup.html";
});
