import baseUI from "./baseUI.js";
import gridHelper from "./gridHelper.js";
export default class baseLevel extends Phaser.Scene {
    constructor(levelKey) {
        super({ key: levelKey });
        this.backgroundColour = "#224";
        this.isPlayerTurn = false;
        this.isAiTurn = true;
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentRound = 1;
        this.totalRounds = 3;
        this.animationDelay = 500;
        this.aiCardPosition = 'left';
        this.playerCardPosition = 'right';
        this.realign = false;
        this.placeMe = 0;
    }
    init() {
        this.isPlayerTurn = false;
        this.isAiTurn = true;
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentRound = 1;
        this.aiCardPosition = 'left';
        this.playerCardPosition = 'right';
        this.cardPositions = {
            left: { valueX1: -390, valueX2: -420, valueY: -240, cardX: -370, cardY: -190 },
            right: { valueX1: -30, valueX2: -60, valueY: -240, cardX: -10, cardY: -190 }
        };
    }
    preload() {
        this.load.image('card_back', 'assets/cardBack.png');
        this.load.image('card_front', 'assets/cardFront.png');
        this.placeMe = this.realign === true ? 180 : 0;
    }
    create() {
        // Initialize classes
        this.baseUI = new baseUI(this, '24px');
        this.gridHelper = new gridHelper(this);
        this.gridHelper.gridSetup();
        let menuText = this.baseUI.addInteractiveTextWithBorder(310, -380, `Main Menu`, 0xfefade, () => {
            this.scene.start('mainMenu');
            this.cleanup();
        });
        let restartText = this.baseUI.addInteractiveTextWithBorder(505, -380, `Restart`, 0xfefade, () => {
            this.scene.restart();
            this.cleanup();
        });
        let gridBoard = this.baseUI.addInteractiveTextWithBorder(310, -310, `Helper`, 0xfefade, () => {
            if (this.gridHelper.modal.y >= 0) {
                this.gridHelper.hideModal();
            }
            else {
                this.gridHelper.showModal();
            }
        });
        this.cameras.main.setBackgroundColor(this.backgroundColour);
        this.input.setDefaultCursor('default');
        this.deck = this.createDeck();
        Phaser.Utils.Array.Shuffle(this.deck);
        this.playerHand = this.deck.splice(0, 5);
        this.aiHand = this.deck.splice(0, 5);
        this.scoreDisplay();
        // Create a container for all elements
        this.containerGroup = this.add.container(this.scale.width / 2, this.scale.height / 2, [restartText, this.scoreText, menuText, gridBoard]);
        this.resizeGame(this.scale.gameSize);
        this.scale.on("resize", this.resizeGame, this);
    }
    cleanup() {
        // Clean up event listeners
        this.input.off('pointerdown');
        // Destroy game objects
        this.containerGroup.destroy(true);
        this.playerCardList.forEach(card => card.destroy());
        this.aiCardList.forEach(card => card.destroy());
        this.playerValueList.forEach(value => value.destroy());
        this.aiValueList.forEach(value => value.destroy());
    }
    createDeck() {
        let deck = [];
        for (let i = 1; i <= 20; i++) {
            deck.push({ number: i, image: 'card_front' });
        }
        return deck;
    }
    displayAiHands(aiHand, callotherCard = false) {
        // Display AI's first card face-down
        this.aiCardList = [];
        this.aiValueList = [];
        aiHand.forEach((card, index) => {
            const NumberPosition = card.number.toString().length === 1 ? -575 : -600;
            let aiCard = this.add.image(-550 + index * 180, -440, 'card_back').setScale(0.9);
            aiCard.setData('card', card); // Store card reference
            // change below into a list and add here ?SDFSDFSDFSDF
            let aiValue = this.add.text(NumberPosition + index * 180, -480, card.number, {
                fontSize: "80px",
                color: "#000000"
            }).setAlpha(0);
            aiCard.setData('value', aiValue); // Store card reference
            aiCard.setInteractive();
            aiCard.on('pointerover', () => { this.input.setDefaultCursor('pointer'); });
            aiCard.on('pointerout', () => { this.input.setDefaultCursor('default'); });
            aiCard.on('pointerdown', () => {
                if (!this.isAiTurn)
                    return;
                this.aiSelectCard(card, aiCard, aiValue, this.cardPositions[this.aiCardPosition]);
                this.aiCardSelected = card;
                if (callotherCard) {
                    this.time.delayedCall(this.animationDelay + 1000, () => {
                        this.otherCardAnimation();
                    });
                }
            });
            this.aiValueList.push(aiValue);
            this.aiCardList.push(aiCard);
        });
    }
    displayPlayerHands(playerHand) {
        this.playerCardList = [];
        this.playerValueList = [];
        playerHand.forEach((card, index) => {
            let row = Math.floor(index / 5) === 0 ? 0 : 1.1; // Determines if it's the first (0) or second (1) row
            let col = index % 5; // Positions card within the row
            let xPosition = -550 + col * 180; // Adjust X position per card
            let yPosition = 60 + row * 220; // Shift Y position down for the second row
            let numberXPosition = card.number.toString().length === 1 ? xPosition - 25 : xPosition - 50;
            let playerCard = this.add.image(xPosition, yPosition, card.image).setScale(0.9);
            playerCard.setData('card', card);
            let playerValue = this.add.text(numberXPosition, yPosition - 40, card.number, {
                fontSize: "80px",
                color: "#000000"
            });
            playerCard.setData('value', playerValue); // Store card reference
            playerCard.setInteractive();
            playerCard.on('pointerover', () => { this.input.setDefaultCursor('pointer'); });
            playerCard.on('pointerout', () => { this.input.setDefaultCursor('default'); });
            playerCard.on('pointerdown', () => {
                if (!this.isPlayerTurn)
                    return;
                this.playerSelectCard(card, playerCard, playerValue, this.cardPositions[this.playerCardPosition]);
            });
            this.playerValueList.push(playerValue);
            this.playerCardList.push(playerCard);
        });
    }
    scoreDisplay() {
        this.scoreText = this.add.text(300, -540, `Score (Round ${this.currentRound}/${this.totalRounds}) \nPlayer: ${this.playerScore} \nAI:     ${this.aiScore}`, {
            fontSize: "32px",
            color: "#000000",
            backgroundColor: "#fefade",
            padding: { x: 10, y: 10 }
        });
    }
    addSymbol() {
        this.symbolText = this.add.text(-255 - this.placeMe, -270, this.symbol, {
            fontSize: "80px",
            color: "#000000",
            backgroundColor: "#fefade",
            padding: { x: 40, y: 40 }
        });
    }
    addEqual() {
        this.equalText = this.add.text(105 - this.placeMe, -270, '=', {
            fontSize: "80px",
            color: "#000000",
            backgroundColor: "#fefade",
            padding: { x: 40, y: 40 }
        });
    }
    otherCard() {
        this.otherCardText = this.add.image(350 - this.placeMe, -190, 'card_back').setScale(0.9);
        this.totalValueText = this.add.text(350 - this.placeMe, -240, "", {
            fontSize: "80px",
            color: "#000000"
        }).setAlpha(0);
    }
    otherCardAnimation() {
        this.tweens.add({
            targets: this.otherCardText,
            scaleX: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.otherCardText.setTexture('card_front'); // Change texture to front side
                this.time.delayedCall(100, () => {
                    this.totalValueText.setAlpha(1); // Reveal the number
                });
                this.tweens.add({
                    targets: this.otherCardText,
                    scaleX: 0.9,
                    duration: 500,
                    ease: 'Power2'
                });
            }
        });
    }
    aiSelectCard(card, cardSprite, valueCardSprite, position) {
        cardSprite.disableInteractive();
        // Flip animation: Scale to 0, change texture, scale back up
        this.tweens.add({
            targets: cardSprite,
            scaleX: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                cardSprite.setTexture('card_front'); // Change texture to front side
                this.time.delayedCall(100, () => {
                    valueCardSprite.setAlpha(1); // Reveal the number
                });
                this.tweens.add({
                    targets: cardSprite,
                    scaleX: 0.9,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        this.tweens.add({
                            targets: valueCardSprite,
                            x: (card.number.toString().length === 1 ? position.valueX1 : position.valueX2) - this.placeMe,
                            y: position.valueY,
                            duration: 800,
                            ease: 'Power2'
                        });
                        this.tweens.add({
                            targets: cardSprite,
                            x: position.cardX - this.placeMe,
                            y: position.cardY,
                            duration: 800,
                            ease: 'Power2',
                            onComplete: () => {
                                this.isPlayerTurn = true;
                                this.isAiTurn = false;
                            }
                        });
                    }
                });
            }
        });
    }
    playerSelectCard(card, cardSprite, valueCardSprite, position) {
        cardSprite.disableInteractive();
        this.tweens.add({
            targets: valueCardSprite,
            x: (card.number.toString().length === 1 ? position.valueX1 : position.valueX2) - this.placeMe,
            y: position.valueY,
            duration: 800,
            ease: 'Power2',
        });
        this.tweens.add({
            targets: cardSprite,
            x: position.cardX - this.placeMe,
            y: position.cardY,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.evaluateRound(card); // Check if the player wins or loses
                this.time.delayedCall(this.animationDelay, () => {
                    this.isPlayerTurn = false;
                    this.isAiTurn = true;
                });
            }
        });
    }
    evaluateRound(playerCard) {
        this.time.delayedCall(this.animationDelay, () => {
            this.removeSelectedCard(playerCard);
            this.currentRound++;
            this.isPlayerWin ? this.playerScore++ : this.aiScore++;
            this.scoreText.setText(`Score (Round ${this.currentRound}/${this.totalRounds}) \nPlayer: ${this.playerScore} \nAI:     ${this.aiScore}`);
            if (this.currentRound > this.totalRounds) {
                this.endGame(this.playerScore > this.aiScore);
            }
        });
    }
    removeSelectedCard(playerCard) {
        var _a, _b;
        // Remove selected cards from hands
        this.aiHand = this.aiHand.filter(c => c !== this.aiCardSelected);
        this.playerHand = this.playerHand.filter(c => c !== playerCard);
        // Find and remove card image and value text from AI's hand
        let aiSprite = this.aiCardList.find(sprite => { var _a; return ((_a = sprite === null || sprite === void 0 ? void 0 : sprite.data) === null || _a === void 0 ? void 0 : _a.get('card')) === this.aiCardSelected; });
        let aiValue = (_a = aiSprite === null || aiSprite === void 0 ? void 0 : aiSprite.data) === null || _a === void 0 ? void 0 : _a.get('value');
        if (aiSprite) {
            aiSprite.destroy();
            aiValue.destroy();
            this.aiCardList = this.aiCardList.filter(sprite => sprite !== aiSprite);
        }
        // Find and remove card image and value text from player's hand
        let playerSprite = this.playerCardList.find(sprite => { var _a; return ((_a = sprite === null || sprite === void 0 ? void 0 : sprite.data) === null || _a === void 0 ? void 0 : _a.get('card')) === playerCard; });
        let playerValue = (_b = playerSprite === null || playerSprite === void 0 ? void 0 : playerSprite.data) === null || _b === void 0 ? void 0 : _b.get('value');
        if (playerSprite) {
            playerSprite.destroy();
            playerValue.destroy();
            this.playerCardList = this.playerCardList.filter(sprite => sprite !== playerSprite);
        }
    }
    endGame(playerWin = false) {
        let winText = this.add.text(this.scale.width / 2, this.scale.height / 2, playerWin ? 'YOU WIN' : 'YOU LOSE', {
            fontSize: '128px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setScale(0).setAlpha(1); // Start small & visible
        // Tween to grow the text
        this.tweens.add({
            targets: winText,
            scaleX: 2,
            scaleY: 2,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Hold for 1 second, then shrink & disappear
                this.time.delayedCall(this.animationDelay, () => {
                    this.tweens.add({
                        targets: winText,
                        scaleX: 0.5,
                        scaleY: 0.5,
                        alpha: 0,
                        duration: 800,
                        ease: 'Power2',
                        onComplete: () => {
                            winText.destroy();
                            this.scene.restart();
                        }
                    });
                });
            }
        });
    }
    resizeGame(gameSize) {
        let { width, height } = gameSize;
        let scaleFactorX = width < 700 ? 0.4 : width < 1300 ? 0.6 : width < 1500 ? 0.8 : 1;
        let scaleFactorY = height < 800 ? 0.4 : height < 1000 ? 0.6 : height < 1200 ? 0.8 : 1;
        this.containerGroup.setScale(scaleFactorX, scaleFactorY);
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.containerGroup.setPosition(width / 2, height / 2);
    }
}
