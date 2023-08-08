
// List of reserved words that shouldn't be present in login credentials
const reserved = [];
// Only accept alphanumerics; no whitespace
const pattern = /^[a-zA-Z0-9]+$/;

// TODO: add to the list of reserved words: should be words that are reserved in SQL (don't want to accidentally delete stuff...)
// Add event listener -> fetch request to server to validate server side stuff (does username exist?)
function isUsernameWithinRequirements(username) {
    return ((3 <= username.length && username.length <= 30) &&
            pattern.test(username));
};


function isPasswordWithinRequirements(password) {
    return (8 <= password.length && 
            pattern.test(password));
}
