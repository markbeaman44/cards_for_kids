import baseUI from "./baseUI.js";
const blue = 0x0000ff;
const red = 0xff0000;
export default class gridHelper {
    constructor(scene) {
        this.isModalVisible = false;
        this.scene = scene;
    }
    gridSetup() {
        // Initialize classes
        this.baseUI = new baseUI(this.scene, '20px');
        this.gridSize = 10;
        this.cellSize = 60;
        this.grid = [];
        // Create Modal Container (hidden initially)
        this.modal = this.scene.add.container(this.scene.scale.width / 2, -800).setDepth(1000);
        // Background of modal
        let modalBackground = this.scene.add.rectangle(-200, -200, 690, 690, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setDepth(1000)
            .setInteractive({ useHandCursor: false })
            .on('pointerdown', (pointer) => { pointer.event.stopPropagation(); });
        this.modal.add(modalBackground);
        // Create grid inside the modal
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                let x = col * this.cellSize - 535;
                let y = row * this.cellSize - 535;
                let square = this.scene.add.rectangle(x, y, this.cellSize - 2, this.cellSize - 2, blue).setOrigin(0).setDepth(1002);
                ;
                // Enable interaction
                square.setInteractive();
                square.on('pointerdown', () => {
                    square.fillColor = (square.fillColor === blue) ? red : blue;
                });
                this.modal.add(square);
                this.grid[row][col] = square;
            }
        }
        let resetButton = this.baseUI.addInteractiveTextWithBorder(-260, 90, `Reset`, 0x00FF00, () => {
            this.resetGrid();
        });
        this.modal.add(resetButton);
        // Close Button (Top Right)
        let closeButton = this.scene.add.rectangle(105, -505, 30, 30, red)
            .setStrokeStyle(4, 0x000000).setInteractive().setDepth(1005)
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on('pointerdown', () => { this.hideModal(); });
        let closeText = this.scene.add.text(100, -515, 'X', { fontSize: '20px', color: '#fff' }).setDepth(1006);
        this.modal.add(closeButton);
        this.modal.add(closeText);
        this.resizeGame(this.scene.scale.gameSize);
        this.scene.scale.on("resize", this.resizeGame, this);
    }
    showModal() {
        this.isModalVisible = true;
        this.scene.tweens.add({
            targets: this.modal,
            x: this.scene.scale.width / 2,
            y: this.scene.scale.height / 2,
            duration: 500,
            ease: 'Power2'
        });
    }
    hideModal() {
        this.isModalVisible = false;
        this.scene.tweens.add({
            targets: this.modal,
            y: -800,
            duration: 500,
            ease: 'Power2'
        });
    }
    resetGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col].fillColor = blue;
            }
        }
    }
    resizeGame(gameSize) {
        let { width, height } = gameSize;
        let scaleFactorX = width < 700 ? 0.4 : width < 1300 ? 0.6 : width < 1500 ? 0.8 : 1;
        let scaleFactorY = height < 800 ? 0.4 : height < 1000 ? 0.6 : height < 1200 ? 0.8 : 1;
        this.modal.setScale(scaleFactorX, scaleFactorY);
        if (this.isModalVisible) {
            this.modal.setPosition(width / 2, height / 2);
        }
    }
}
