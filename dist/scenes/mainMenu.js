import levelUI from "./baseUI.js";
export default class mainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
        this.fontSize = '24px';
        this.backgroundColour = "#224";
        this.resizeGame = this.resizeGame.bind(this);
    }
    preload() {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
    }
    create() {
        // Initialize classes
        this.levelUI = new levelUI(this, this.fontSize);
        this.cameras.main.setBackgroundColor(this.backgroundColour);
        this.input.setDefaultCursor('default');
        let title = this.add.text(-100, -300, 'Select Level', { fontSize: '32px', color: '#ffffff' });
        const levelButtons = [];
        for (let i = 1; i <= 10; i++) {
            let x = i % 2 === 0 ? 20 : -160;
            let y = -200 + Math.floor((i - 1) / 2) * 75;
            let levelText = this.levelUI.addInteractiveTextWithBorder(x, y, `Level ${i}`, 0xfefade, () => { this.scene.start(`level${i}`); });
            levelButtons.push(levelText);
        }
        // Create a container for all elements
        this.containerGroup = this.add.container(this.scale.width / 2, this.scale.height / 2, [title, ...levelButtons]);
        this.scale.on("resize", this.resizeGame, this);
    }
    resizeGame(gameSize) {
        let { width, height } = gameSize;
        let scaleFactor = width < 800 ? 0.9 : 1;
        this.containerGroup.setScale(scaleFactor);
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.containerGroup.setPosition(width / 2, height / 2);
    }
}
