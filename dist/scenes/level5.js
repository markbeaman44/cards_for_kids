import baseLevel from "./baseLevel.js";
export default class levelFive extends baseLevel {
    constructor() {
        super('level5');
    }
    init() {
        super.init();
        this.symbol = '-';
        this.realign = true;
        this.aiCardPosition = 'left';
    }
    // 1 - 4 = ?
    create() {
        super.create();
        this.deck = this.createDeck();
        Phaser.Utils.Array.Shuffle(this.deck);
        this.playerHand = this.deck.splice(0, 10);
        let aiDesk = this.createAiDeck();
        Phaser.Utils.Array.Shuffle(aiDesk);
        this.aiHand = aiDesk.splice(0, 5);
        this.displayAiHands(this.aiHand, true);
        this.displayPlayerHands(this.playerHand);
        this.containerGroup.add(this.playerCardList);
        this.containerGroup.add(this.aiCardList);
        this.containerGroup.add(this.playerValueList);
        this.containerGroup.add(this.aiValueList);
        this.addSymbol();
        this.containerGroup.add(this.symbolText);
        this.addEqual();
        this.containerGroup.add(this.equalText);
        this.otherCard();
        this.containerGroup.add(this.otherCardText);
        this.containerGroup.add(this.totalValueText);
    }
    createDeck() {
        let deck = [];
        for (let i = 1; i <= 15; i++) {
            deck.push({ number: i, image: 'card_front' });
        }
        return deck;
    }
    createAiDeck() {
        let deck = [];
        for (let i = 5; i <= 20; i++) {
            deck.push({ number: i, image: 'card_front' });
        }
        return deck;
    }
    generateTargetSum(card) {
        let targetSum;
        let requiredCard;
        let attempts = 0;
        const maxAttempts = 50;
        do {
            targetSum = Phaser.Math.Between(1, 20);
            requiredCard = card.number - targetSum; // Calculate what player card is needed
            attempts++;
        } while ((requiredCard < 1 || requiredCard > 20 || !this.playerHand.some(playerCard => playerCard.number === requiredCard)) && attempts < maxAttempts);
        return targetSum || 0;
    }
    otherCard() {
        super.otherCard();
        this.otherCardText = this.add.image(350 - this.placeMe, -190, 'card_back').setScale(0.9);
        this.otherCardText.x = -10 - this.placeMe;
    }
    aiSelectCard(card, cardSprite, valueCardSprite, position) {
        super.aiSelectCard(card, cardSprite, valueCardSprite, position);
        // Used to generate the target sum aka total card value
        this.targetSum = this.generateTargetSum(card);
        this.requiredCard = this.targetSum + card.number;
        console.log(`AI played ${card.number}, target is ${this.targetSum}, player needs ${this.requiredCard}`);
        this.totalValueText.setText(String(this.targetSum));
        let newPosition = this.cardPositions[this.playerCardPosition];
        this.totalValueText.x = (String(this.targetSum).length === 1 ? newPosition.valueX1 : newPosition.valueX2) - this.placeMe;
    }
    playerSelectCard(card, cardSprite, valueCardSprite, position) {
        super.playerSelectCard(card, cardSprite, valueCardSprite, position);
        this.tweens.add({
            targets: valueCardSprite,
            x: (card.number.toString().length === 1 ? 325 : 300) - this.placeMe,
            y: position.valueY,
            duration: 800,
            ease: 'Power2',
        });
        this.tweens.add({
            targets: cardSprite,
            x: 350 - this.placeMe,
            y: position.cardY,
            duration: 800,
            ease: 'Power2'
        });
    }
    evaluateRound(playerCard) {
        super.evaluateRound(playerCard);
        let aiNum = this.aiCardSelected.number;
        let playerNum = playerCard.number;
        this.isPlayerWin = aiNum - this.targetSum === playerNum;
        console.log("BLA", this.isPlayerWin, eval(aiNum + this.symbol + this.targetSum), playerNum);
        this.symbol = '-';
        this.symbolText.setText(this.symbol);
        this.time.delayedCall(this.animationDelay, () => {
            this.totalValueText.setText(String(this.targetSum)).setAlpha(0);
            this.otherCardText.setTexture('card_back');
        });
    }
}
