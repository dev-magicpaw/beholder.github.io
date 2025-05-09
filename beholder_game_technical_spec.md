# 2D Browser Game Technical Specification

## 1. Game Overview
- **Genre & Perspective**  
  - Top-down 2D with a slight isometric tilt.
- **Theme & Lore**  
  - A small beholder escapes its dungeon and must survive against waves of monsters.
- **Core Loop**  
  1. Player moves to dodge and position.  
  2. Auto-attacks (melee hitbox + ranged projectiles).  
  3. Damage any colliding or projectile-hit enemies.  
  4. Gain EXP per kill; when EXP ≥ threshold, choose 1 of 3 upgrades.  
  5. Survive until health ≤ 0 → Game Over.

## 2. Technology Stack
- **Engine:** Phaser 3  
- **Language:** JavaScript (ES6 modules)  
- **Build:** webpack or Parcel (bundling, live-reload)  
- **Hosting / Deployment:** GitHub Pages

## 3. Project Structure
```
/src
  /config
    gameConfig.js
    playerConfig.js
    enemyConfig.js
    upgradeConfig.js
  /scenes
    BootScene.js
    GameScene.js
    UIScene.js
    GameOverScene.js
  /objects
    Player.js
    Enemy.js
    Projectile.js
  /ui
    HUD.js
    VirtualJoystick.js
  /assets
    /sprites
    /audio
  index.html
  main.js
package.json
webpack.config.js
```

## 4. Configuration Files
Each `/config/*.js` exports a plain object.

```js
// enemyConfig.js
export default {
  spawnRate: 1.5,
  types: {
    melee: {
      speedRange: [60, 100],
      hitPointsRange: [2, 5],
      damageRange: [1, 2],
      attackRateRange: [0.8, 1.5]
    },
    ranged: {
      speedRange: [40, 80],
      hitPointsRange: [1, 3],
      damageRange: [1, 2],
      attackRateRange: [1.0, 2.0],
      projectileSpeed: 200,
      optimalRange: 200
    }
  },
  expRewardMultiplier: 1.0
};
```

```js
// upgradeConfig.js
export default {
  tiers: 5,
  baseChoices: [
    { type: 'speed',    baseValue: 20 },
    { type: 'health',   baseValue: 10 },
    { type: 'regen',    baseValue: 1 },
    { type: 'newAttack',options: ['melee','ranged'] },
    { type: 'expBoost', baseValue: 0.1 }
  ],
  choiceCount: 3,
  expFormula: (n) => n * 2
};
```

## 5. Gameplay Mechanics
1. **Movement**  
   - 8-direction via arrow keys or on-screen joystick.  
2. **Attacks**  
   - **Melee:** auto-hitbox around player every attackInterval.  
   - **Ranged:** spawn projectile from player toward cursor/direction; enemies fire when at/above optimal range.  
3. **EXP & Level-Up**  
   - EXP per kill as configured.  
   - Thresholds follow `expₙ₊₁ = expₙ × 2`.  
   - On threshold, game pauses and 3 random upgrades are presented.  
4. **Health & Death**  
   - HP decremented on enemy overlap or projectile hit.  
   - At HP ≤ 0 → GameOverScene.  
5. **Enemy Behavior**  
   - **Melee:** pathfind toward player.  
   - **Ranged:** maintain distance ≈ optimalRange, firing projectiles.  
6. **World & Spawning**  
   - 16:9 world bounds, base resolution 1280×720.  
   - Enemies spawn off-screen edges.

## 6. Collision & Physics
- **System:** Phaser Arcade  
- **Colliders & Overlaps:**  
```js
this.physics.add.overlap(player.meleeHitbox, enemies, onEnemyHit);
this.physics.add.overlap(projectiles, enemies, onProjectileHit);
this.physics.add.overlap(enemies.projectiles, player, onPlayerHit);
```  
- **Bounds & Culling:** off-world objects are destroyed/pooled.

## 7. Controls & Input
- **Desktop:** `this.input.keyboard.createCursorKeys()`.  
- **Mobile:** on-screen Virtual Joystick.

## 8. Rendering & Scaling
- **Canvas:** 1280×720 (16:9).  
- **Scale Mode:** `Phaser.Scale.FIT`, centered.  
- **Camera:** follows player, clamped.

## 9. Asset Pipeline
- **Sprites:** vector art.  
- **Atlases:** JSON + PNG if needed.  
- **Loading:** BootScene.

## 10. UI & HUD
- **Health Bar:** floating above player sprite.  
- **EXP Bar:** fixed at top of screen.  
- **Upgrade Popup:** centered modal with 3 buttons.  
- **FPS Meter:** always visible bottom-left.

## 11. Audio
- **SFX Only:** attack, hit, upgrade.

## 12. Mobile & Visibility
- Auto-pause on visibility change.  
- Responsive touch controls.
