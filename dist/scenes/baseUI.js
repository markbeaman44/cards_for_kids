export default class baseUI {
    constructor(scene, fontSize) {
        this.scene = scene;
        this.fontSize = fontSize;
    }
    addInteractiveText(x, y, title, onSuccessCallback) {
        return this.scene.add.text(x, y, title, {
            fontSize: this.fontSize,
            color: "#0f0",
            fontStyle: "bold"
        })
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on('pointerdown', onSuccessCallback);
    }
    addInteractiveTextWithBorder(x, y, title, backgroundColor, onSuccessCallback) {
        const fixedWidth = 150;
        const fixedHeight = 60;
        const text = this.scene.add.text(x, y, title, {
            fontSize: this.fontSize,
            color: "#000000",
            align: 'center',
            padding: { x: 10, y: 10 },
            fontStyle: "bold"
        })
            .setFixedSize(fixedWidth, fixedHeight - 20)
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on('pointerdown', onSuccessCallback);
        ;
        const background = this.scene.add.rectangle(text.x + text.width / 2, text.y + text.height / 2, text.width + 20, text.height + 20, backgroundColor).setStrokeStyle(4, 0x000000) // Stroke thickness and color
            .setOrigin(0.5); // Ensure proper positioning
        const container = this.scene.add.container(0, 0, [background, text]);
        container.setSize(fixedWidth, fixedHeight);
        // container.setSize(background.width, background.height);
        return container;
    }
}
