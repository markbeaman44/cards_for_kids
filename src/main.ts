// @ts-ignore
import Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.85.2/dist/phaser.esm.js";
declare const Phaser: typeof import("phaser");

import levelOne from './scenes/level1';
import levelTwo from './scenes/level2';
import levelThree from './scenes/level3';
import levelFour from './scenes/level4';
import levelFive from "./scenes/level5";
import levelSix from "./scenes/level6";
import levelSeven from "./scenes/level7";
import levelEight from "./scenes/level8";
import levelNine from "./scenes/level9";
import levelTen from "./scenes/level10";
import mainMenu from './scenes/mainMenu';

const backgroundColour = "#224";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, // Adjusts canvas when the window resizes
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:  window.innerWidth,
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
