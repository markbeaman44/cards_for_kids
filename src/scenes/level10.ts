import baseLevel from './baseLevel';

export default class levelTen extends baseLevel {
    constructor() {
        super('level10');
    }
    private targetSum!: number;

    init() {
        super.init();
        this.symbol = '÷';
        this.realign = true;
    }
    // 1 / ? = 5
    create() {
        super.create();

        this.deck = this.createDeck();
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
        this.otherCard()
        this.containerGroup.add(this.otherCardText);
        this.containerGroup.add(this.totalValueText);
    }

    protected createDeck() {
        let deck: any = [];
        for (let i = 1; i <= 10; i++) {
            deck.push({ number: i, image: 'card_front' });
        }
        return deck;
    }

    protected createAiDeck() {
        let deck: any = [];
        for (let i = 5; i <= 20; i++) {
            // Exlude prime numbers above 10
            if (![11, 13, 17, 19].includes(i)) {
                deck.push({ number: i, image: 'card_front' });
            }
        }
        return deck;
    }

    protected generateTargetSum(card: { number: number }) {
        let targetSum: number;
        let requiredCard: number;
        let attempts = 0;
        const maxAttempts = 100;
        do {
            targetSum = Phaser.Math.Between(1, 5);
            if (card.number % targetSum === 0) { 
                requiredCard = card.number / targetSum;
            } else {
                requiredCard = -1;
            }
            attempts++;
            console.log(`Target sum: ${targetSum}, required card: ${requiredCard}`);
        } while (
            (requiredCard < 1 || requiredCard > 10 || requiredCard === -1 || !this.playerHand.some(playerCard => playerCard.number === requiredCard))
            && attempts < maxAttempts
        );

        return targetSum || 0;
    }

    protected aiSelectCard(card, cardSprite, valueCardSprite, position) {
        super.aiSelectCard(card, cardSprite, valueCardSprite, position);
        // Used to generate the target sum aka total card value
        this.targetSum = this.generateTargetSum(card);
        this.requiredCard = card.number / this.targetSum;
        console.log("ss", this.requiredCard , card.number, this.targetSum);
        console.log(`AI played ${card.number}, target is ${this.targetSum}, player needs ${this.requiredCard}`);
        this.totalValueText.setText(String(this.targetSum));
        this.totalValueText.x = (String(this.targetSum).length === 1 ? 325 : 300) - this.placeMe;
    }

    protected evaluateRound(playerCard) {
        super.evaluateRound(playerCard);

        let aiNum = this.aiCardSelected.number;
        let playerNum = playerCard.number;
        this.isPlayerWin = this.isPlayerWin = aiNum / playerNum === this.targetSum;


        this.symbol = '÷';
        this.symbolText.setText(this.symbol);

        this.time.delayedCall(this.animationDelay, () => {
            this.totalValueText.setText(String(this.targetSum)).setAlpha(0);
            this.otherCardText.setTexture('card_back');
        });
    }
}
