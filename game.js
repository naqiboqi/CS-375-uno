const readline = require("readline");

const types = ["normal-card", "action-card", "wild-card"];
const actions = ["draw-two", "reverse", "skip"];
const wild_actions = ["draw-four", "change-color"];
const colors = ["red", "blue", "green", "yellow"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Uno {
    constructor() {
        this.deck = [];
        this.discard = [];
        this.players = new Map();
        this.playerNames = [];
        this.topColor = "";
        this.topNumber = 0;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.skipNext = false;
    };

    getUserInput(question) {
        return new Promise(resolve => {
            this.rl.question(question, resolve);
        });
    };

    displayCards(listOfCards) {
        console.log(listOfCards.length);
        for (const card of listOfCards) {
            this.displayCard(card);
        };
    };

    displayCard(card) {
        let color = "";
        let content = "";
        if (this.isNormalCard(card)) {
            color = card.color;
            content = card.number.toString();
        }
        else if (this.isActionCard(card)) {
            color = card.color;
            content = card.action;
        }
        else {
            color = "black";
            content = card.action;
        };

        const maxContentLength = Math.max(color.length, content.length);
        const cardWidth = maxContentLength + 4;  // Adjust the card width as needed
        const colorPadding = ' '.repeat(Math.floor((cardWidth - color.length) / 2));
        const contentPadding = ' '.repeat(Math.floor((cardWidth - content.length) / 2));

        // Ensure even padding on both sides
        const remainingColorPadding = cardWidth - color.length - colorPadding.length;
        const remainingContentPadding = cardWidth - content.length - contentPadding.length;

        const cardArt = `
            +${'-'.repeat(cardWidth - 2)}+
            |${' '.repeat(cardWidth - 2)}|
            |${colorPadding}${color}${' '.repeat(remainingColorPadding)}|
            |${' '.repeat(cardWidth - 2)}|
            |${contentPadding}${content}${' '.repeat(remainingContentPadding)}|
            |${' '.repeat(cardWidth - 2)}|
            |${' '.repeat(cardWidth - 2)}|
            +${'-'.repeat(cardWidth - 2)}+
        `;

        console.log(cardArt);
    };

    createDeck() {
        for (const color of colors) {
            // Create the normal cards
            this.deck.push({type: "normal-card", color: color, number: 0});
            for (const number of numbers) {
                this.deck.push({type: "normal-card", color: color, number: number});
                this.deck.push({type: "normal-card", color: color, number: number});
            };

            // Create the action cards
            for (const action of actions) {
                this.deck.push({type: "action-card", color: color, action: action});
                this.deck.push({type: "action-card", color: color, action: action});
            };
        };
        
        // Create the wild cards
        for (let i = 0; i < 4; i++) {
            for (const action of wild_actions)
            this.deck.push({type: "wild-card", color: "black", action: action});
        };
    };

    dealCards() {
        for (let i = 0; i < 7; i++) {
            for (const [key, value] of this.players) {
                this.drawCard(key);
            };
        };
    };

    drawCard(player) {
        this.players.get(player).push(this.deck.pop());
    };

    drawFirst() {
        const first = this.deck.pop();
        console.log("The first card is...");
        this.displayCard(first);

        if (this.isNormalCard(first)) {
            this.topColor = first.color;
            this.topNumber = first.number;
        }
        else if (this.isActionCard(first)) {
            this.topColor = first.color;
            this.doAction(first);
        };
        
        this.discard.push(first);
    };

    drawFour(player) {
        for (let i = 0; i < 4; i++) {
            this.drawCard(player);
        };
    };

    peekDiscard() {
        return this.discard[this.discard.length - 1];
    };

    peekPlayerDeck(player) {
        return this.players.get(player);
    };

    placeCard(player, card) {
        player.remove(card);
        this.discard.push(card);
    };

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        };
    };

    setup(callback) {
        const minPlayers = 2;
        const maxPlayers = 10;
        
        const promptForPlayerName = () => {
            this.rl.question("Enter player name (or press Enter to start the game): ", playerName => {
                if (!playerName ||  this.players.size >= maxPlayers) {
                    if (this.players.size >= minPlayers) {
                        //this.rl.close();
                        this.createDeck();
                        this.displayCards(this.deck);
                        this.shuffle();
                        this.dealCards();
                        console.log(this.players);
                        callback();
                    } else {
                        console.log("Minimum number of players not met.");
                        promptForPlayerName();
                    };
                } else {
                    this.players.set(playerName, []);
                    this.playerNames.push(playerName);
                    promptForPlayerName();
                };
            });
        };

        promptForPlayerName();
    };

    async gameLoop() {
        console.log("Welcome to UNO!")
        while (true) {
            for (const name of this.playerNames) {
                if (this.skipNext) {
                    console.log(`Skipping player ${name}'s turn`);
                    this.skipNext = false;
                    continue;
                };

                console.log("Match the current card =>\n");
                this.displayCard(this.discard.get(-1));

                console.log(`It is player ${name}'s turn!`);
                const choice = await this.promptForPlayerCard(name);
                const played = this.players.get(name)[choice];
                
                if (this.isActionCard(played)) {
                    this.doAction(played);
                }
                else if (this.isWildCard(played)) {
                    this.doWildAction(played);
                }
                else {
                    this.topColor = played["color"];
                    this.topNumber = played["number"];
                };
            };
        };
    };

    isGameOver(player) {
        if (this.deck.length === 0) {
            console.log("The deck is out of cards!");
            return true;
        };

        if (this.players[player].length === 0) {
            console.log(`Player ${player} has no cards, they win!`);
            return true;
        };

        return false;
    };

    isNormalCard(card) {
        return (card.type === "normal-card");
    };

    isActionCard(card) {
        return (card.type === "action-card");
    };
    
    doAction(card) {
        if (card.action === "draw-two") {
            this.rl.question("Select a player to draw two", (player) => {
                if (!this.playerNames.includes(player)) {
                    console.log("The player is not in the game, please choose another.");
                    this.doWildAction(card);
                }
                else {
                    console.log(`Player ${player}, has to draw four cards!`);
                    this.drawFour(player);
                };
            });
        }
        else if (card.action === "skip"){
            console.log("Skipping next player's turn.");
            this.skipNext = true;
        }
        else {
            this.players = this.reverseTurnOrder();
        };
    };

    reverseTurnOrder() {
        const reversedEntries = Array.from(this.players.entries()).reverse();
        return new Map(reversedEntries);
    };

    isWildCard(card) {
        return (card.type === "wild-card");
    };

    doWildAction(card) {
        if (card.action === "draw-four") {
            this.rl.question("Select a player to draw four", (player) => {
                if (!this.playerNames.includes(player)) {
                    console.log("The player is not in the game, please choose another.");
                    this.doWildAction(card);
                }
                else {
                    console.log(`Player ${player}, has to draw four cards!`);
                    this.drawFour(player);
                };
            });
        }
        else {
            this.rl.question("Choose the next color (red, blue, green, yellow)", (color) => {
                if (!colors.includes(color)) {
                    console.log("That is not a valid color, please choose another.");
                    this.doWildAction(card);
                }
                else {
                    console.log(`The new color is ${color}!`);
                    this.topColor = color.toLowerCase();
                    this.topNumber = 0;
                };
            });
        };
    };

    async promptForPlayerCard(player) {
        while (true) {
            this.displayCards(this.peekPlayerDeck(player))
            const choice = await this.getUserInput("Select a card by entering its number: ");
            if (this.noValidCards(player)) {
                console.log("You have no valid cards to play, drawing.")
                this.drawCard(player);
            }
            else if (this.isValidCard(choice, player)) {
                return choice;
            }
            else {
                console.log(`The card at position ${choice} is not playable!`);
            };
        };
    };

    noValidCards(player) {
        for (const card of this.players.get(player)) {
            if (card.type === "wild-card") {
                return false;
            }
            else if (card.type === "action-card" &&
                card.color === this.topColor) {
                    return false;
                }
            else if (card.type === "normal-card" &&
                (card.color === this.topColor || card.number === this.topNumber)) {
                    return false;
            };
        };

        return true;
    };
    
    isValidCard(choice, player) {
        const cardIndex = parseInt(choice);
        if (isNaN(cardIndex)) {
            return false;
        };

        const playerCards =  this.players.get(player);
        const playerCard = playerCards[cardIndex];
        if (!(0 <= cardIndex && cardIndex < playerCards.length)) {
            return false;
        };

        if (this.isWildCard(playerCard)) {
            return true;
        }
        else if (this.isActionCard(playerCard) &&
                playerCard.color === this.topColor) {
                    return true;
        };
        return (playerCard.color === this.topColor||
            playerCard.number === this.topNumber);
    };

    start() {
        this.setup(() => {
            this.drawFirst();
            this.gameLoop();
        });
    };
};


const uno = new Uno();
uno.start();