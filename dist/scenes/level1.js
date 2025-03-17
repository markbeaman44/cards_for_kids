import baseLevel from "./baseLevel.js";
export default class levelOne extends baseLevel {
    constructor() {
        super('level1');
    }
    init() {
        super.init();
        this.symbol = Math.random() < 0.5 ? '>' : '<';
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
    evaluateRound(playerCard) {
        super.evaluateRound(playerCard);
        let aiNum = this.aiCardSelected.number;
        let playerNum = playerCard.number;
        this.isPlayerWin = (this.symbol === '>' && aiNum > playerNum) || (this.symbol === '<' && aiNum < playerNum);
        this.symbol = Math.random() < 0.5 ? '>' : '<';
        this.symbolText.setText(this.symbol);
    }
}
