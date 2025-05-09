import Phaser from 'phaser';
import gameConfig from './config/gameConfig';
import BootScene from './scenes/BootScene';
import GameOverScene from './scenes/GameOverScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';

// Register scenes
const scenes = [BootScene, GameScene, UIScene, GameOverScene];
const game = new Phaser.Game({
    ...gameConfig,
    scene: scenes
}); 