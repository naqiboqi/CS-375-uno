const readline = require("readline");

const types = ["normal-card", "action-card", "wild-card"];

const actions = ["draw-two", "reverse-order", "skip"];
const wild_actions = ["draw-four", "change-color"];

const colors = ["red", "blue", "green", "yellow"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const players = new Map();


class Uno {
    constructor() {
        this.playerNames = [];
        this.deck = [];
        this.discard = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
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
            for (const [key, value] of players) {
                value.push(this.drawCard());
            };
        };
    };

    drawFirst() {
        this.discard.push(this.deck.pop());
    };

    drawCard() {
        return this.deck.pop();
    };

    peekDiscard() {
        return this.discard[this.discard.length - 1];
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
        
        function promptForPlayer() {
            this.rl.question("Enter player name (or press Enter to start the game): ", playerName => {
                if (!playerName || players.size >= maxPlayers) {
                    if (players.size >= minPlayers) {
                        //this.rl.close();
                        createDeck();
                        shuffle();
                        dealCards();
                        console.log(players);
                        callback();
                    } else {
                        console.log("Minimum number of players not met.");
                        promptForPlayer();
                    }
                } else {
                    players.set(playerName, []);
                    this.playerNames.push(playerName);
                    promptForPlayer();
                };
            });
        };

        promptForPlayer();
    };

    gameLoop() {
        console.log("Welcome to UNO!")
        while (true) {
            for (const name of this.playerNames) {
                
                

            };
        };
    };

    isValidCard(cardNum, player) {
        const matchCard = this.peekDiscard();
        const playerCard = players[player][cardNum];

        return ((0 < cardNum < players[player].length) &&
            (matchCard["color"] === playerCard["color"] ||
            matchCard["number"] === playerCard["number"]))
    };

    start() {
        this.setup(() => {
            this.drawFirst();
            this.gameLoop();
        });
    };
};

const uno = new Uno();
uno.start()