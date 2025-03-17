import baseLevel from "./baseLevel.js";
export default class levelFour extends baseLevel {
    constructor() {
        super('level4');
    }
    init() {
        super.init();
        this.symbol = '+';
        this.realign = true;
    }
    // 1 + ? = 5
    create() {
        super.create();
        // Changes player desk to 1-10 sorted order
        this.deck = this.createDeck();
        this.playerHand = this.deck.splice(0, 10);
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
        for (let i = 1; i <= 10; i++) {
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
            targetSum = Phaser.Math.Between(card.number + 1, 20);
            requiredCard = targetSum - card.number; // Calculate what player card is needed
        } while ((requiredCard < 1 || requiredCard > 10 || !this.playerHand.some(card => card.number === requiredCard)) && attempts < maxAttempts);
        return targetSum || 0;
    }
    aiSelectCard(card, cardSprite, valueCardSprite, position) {
        super.aiSelectCard(card, cardSprite, valueCardSprite, position);
        // Used to generate the target sum aka total card value
        this.targetSum = this.generateTargetSum(card);
        this.requiredCard = this.targetSum - card.number;
        console.log(`AI played ${card.number}, target is ${this.targetSum}, player needs ${this.requiredCard}`);
        this.totalValueText.setText(String(this.targetSum));
        this.totalValueText.x = (String(this.targetSum).length === 1 ? 325 : 300) - this.placeMe;
    }
    evaluateRound(playerCard) {
        super.evaluateRound(playerCard);
        let aiNum = this.aiCardSelected.number;
        let playerNum = playerCard.number;
        this.isPlayerWin = aiNum + playerNum === this.targetSum;
        console.log("BLA", this.isPlayerWin, eval(aiNum + this.symbol + playerNum), this.targetSum);
        this.symbol = '+';
        this.symbolText.setText(this.symbol);
        this.time.delayedCall(this.animationDelay, () => {
            this.totalValueText.setText(String(this.targetSum)).setAlpha(0);
            this.otherCardText.setTexture('card_back');
        });
    }
}
