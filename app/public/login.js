// initialize user interface elements
const loginMessage = document.getElementById("login-status");
const userInput = document.getElementById("user-input");
const passInput = document.getElementById("pass-input");
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");


// login function
function doUserLogin(username, password) {
    // make POST fetch request to server's endpoint '/login'
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

// add event listener to the login button
loginButton.addEventListener("click", () => {
    // get entered credentials
    const username = userInput.value;
    const password = passInput.value;

    // call login function
    doUserLogin(username, password);
});

// add event listener to the register button
registerButton.addEventListener("click", (event) => {
    event.preventDefault();
    // redirect the user to the signup.html page
    window.location.href = "/signup.html";
});
