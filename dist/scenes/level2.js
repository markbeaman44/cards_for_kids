import baseLevel from "./baseLevel.js";
export default class levelTwo extends baseLevel {
    constructor() {
        super('level2');
    }
    // THe below is changed due to positioning of cards
    init() {
        super.init();
        this.symbol = Math.random() < 0.5 ? '>' : '<';
        this.aiCardPosition = 'right';
        this.playerCardPosition = 'left';
    }
    create() {
        super.create();
        // Adds cards to display within baseLevel
        this.displayAiHands(this.aiHand);
        this.displayPlayerHands(this.playerHand);
        // Adds the card lists to the container group
        this.containerGroup.add(this.playerCardList);
        this.containerGroup.add(this.aiCardList);
        this.containerGroup.add(this.playerValueList);
        this.containerGroup.add(this.aiValueList);
        this.addSymbol();
        this.containerGroup.add(this.symbolText);
    }
    // The below is changed evaluation changes
    evaluateRound(playerCard) {
        super.evaluateRound(playerCard);
        let aiNum = this.aiCardSelected.number;
        let playerNum = playerCard.number;
        this.isPlayerWin = (this.symbol === '>' && playerNum > aiNum) || (this.symbol === '<' && playerNum < aiNum);
        this.symbol = Math.random() < 0.5 ? '>' : '<';
        this.symbolText.setText(this.symbol);
    }
}
