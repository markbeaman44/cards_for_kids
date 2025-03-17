import levelOne from "./scenes/level1.js";
import levelTwo from "./scenes/level2.js";
import levelThree from "./scenes/level3.js";
import levelFour from "./scenes/level4.js";
import levelFive from "./scenes/level5.js";
import levelSix from "./scenes/level6.js";
import levelSeven from "./scenes/level7.js";
import levelEight from "./scenes/level8.js";
import levelNine from "./scenes/level9.js";
import levelTen from "./scenes/level10.js";
import mainMenu from "./scenes/mainMenu.js";
const backgroundColour = "#224";
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    backgroundColor: backgroundColour,
    scene: [
        mainMenu, levelOne, levelTwo, levelThree,
        levelFour, levelFive, levelSix, levelSeven,
        levelEight, levelNine, levelTen
    ]
};
const game = new Phaser.Game(config);
