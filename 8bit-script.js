// 8-BIT RETRO PORTFOLIO - JAVASCRIPT

// ============================================
// STARFIELD ANIMATION
// ============================================

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.numStars = 150;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * this.canvas.width,
        size: Math.random() * 2 + 1
      });
    }
  }

  animate() {
    this.ctx.fillStyle = '#0f0f23';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach(star => {
      // Move star towards viewer
      star.z -= 2;

      // Reset star if it goes off screen
      if (star.z <= 0) {
        star.z = this.canvas.width;
        star.x = Math.random() * this.canvas.width;
        star.y = Math.random() * this.canvas.height;
      }

      // Calculate 3D projection
      const k = 128.0 / star.z;
      const px = (star.x - this.canvas.width / 2) * k + this.canvas.width / 2;
      const py = (star.y - this.canvas.height / 2) * k + this.canvas.height / 2;

      // Calculate star size and brightness
      const size = (1 - star.z / this.canvas.width) * star.size;
      const brightness = (1 - star.z / this.canvas.width);

      // Draw star
      this.ctx.fillStyle = `rgba(248, 248, 248, ${brightness})`;
      this.ctx.fillRect(px, py, size, size);

      // Add some colored stars (purple/blue tint)
      if (Math.random() > 0.95) {
        this.ctx.fillStyle = `rgba(139, 92, 246, ${brightness * 0.6})`;
        this.ctx.fillRect(px, py, size + 1, size + 1);
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================

class Modal {
  constructor() {
    this.modal = document.getElementById('demo-modal');
    this.demoButtons = document.querySelectorAll('.demo-btn');
    this.closeBtn = document.querySelector('.close-btn');

    if (!this.modal) return;

    this.init();
  }

  init() {
    // Open modal on demo button click
    this.demoButtons.forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    // Close modal on close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close modal on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.add('active');
    playSound('select');
  }

  close() {
    this.modal.classList.remove('active');
    playSound('back');
  }
}

// ============================================
// TYPING ANIMATION FOR SPEECH BUBBLE
// ============================================

function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing');

  typingElements.forEach((element, index) => {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '3px solid #1a1a2e';

    let charIndex = 0;
    const baseDelay = 1000; // Initial delay
    const delayIncrement = 2000; // Delay between lines
    const typingSpeed = 100; // Speed per character

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          element.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Remove cursor after typing is complete
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 500);
        }
      }, typingSpeed);
    }, baseDelay + (index * delayIncrement));
  });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only prevent default for internal links
      if (href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          playSound('select');
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ============================================
// INSTALL BUTTON FUNCTIONALITY
// ============================================

function initInstallButton() {
  const installButtons = document.querySelectorAll('.install-btn');

  installButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Replace with your actual Chrome Web Store URL
      const chromeStoreUrl = 'https://chrome.google.com/webstore';
      window.open(chromeStoreUrl, '_blank');
      playSound('powerup');
    });
  });
}

// ============================================
// POWER BAR ANIMATION
// ============================================

function animatePowerBars() {
  const powerFills = document.querySelectorAll('.power-fill');

  powerFills.forEach(fill => {
    const power = fill.getAttribute('data-power') || 95;
    fill.style.width = '0%';

    setTimeout(() => {
      fill.style.width = power + '%';
    }, 300);
  });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        // Animate power bars when they come into view
        if (entry.target.classList.contains('powerups-section')) {
          animatePowerBars();
        }
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe sections
  document.querySelectorAll('.cartridge-select, .powerups-section, .contact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// ============================================
// SOUND EFFECTS (OPTIONAL - 8-BIT STYLE)
// ============================================

// Simple 8-bit sound synthesis using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = false;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    } catch (e) {
      console.log('Web Audio API not supported');
      this.enabled = false;
    }
  }

  play(type) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different sounds for different actions
    switch(type) {
      case 'select':
        oscillator.frequency.value = 600;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        break;

      case 'back':
        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        break;

      case 'powerup':
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        break;

      case 'coin':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        break;
    }

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}

const soundFX = new SoundEffects();

function playSound(type) {
  soundFX.play(type);
}

// ============================================
// KONAMI CODE EASTER EGG
// ============================================

class KonamiCode {
  constructor() {
    this.pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.current = 0;

    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      const key = e.key;

      if (key === this.pattern[this.current]) {
        this.current++;

        if (this.current === this.pattern.length) {
          this.activate();
          this.current = 0;
        }
      } else {
        this.current = 0;
      }
    });
  }

  activate() {
    // Easter egg: Add extra lives, change colors, play sound, etc.
    playSound('powerup');

    // Add rainbow effect to the page
    document.body.style.animation = 'rainbow-bg 3s ease-in-out';

    // Show secret message
    const message = document.createElement('div');
    message.textContent = '★ 30 LIVES! ★';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Press Start 2P', monospace;
      font-size: 32px;
      color: #fbbf24;
      text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      z-index: 10001;
      animation: fadeInOut 3s ease-in-out;
      pointer-events: none;
    `;
    document.body.appendChild(message);

    // Update lives counter
    const livesElement = document.querySelector('.lives');
    if (livesElement) {
      livesElement.textContent = '♥'.repeat(30);
    }

    // Remove message after animation
    setTimeout(() => {
      message.remove();
      document.body.style.animation = '';
    }, 3000);
  }
}

// ============================================
// COIN COLLECTION GAME
// ============================================

class CoinCollectionGame {
  constructor() {
    this.gameActive = false;
    this.playerName = '';
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.playerX = 0;
    this.playerY = 0;
    this.playerSpeed = 5;
    this.coins = [];
    this.keys = {};
    this.gameArea = null;
    this.player = null;
    this.collectedThisWave = 0;
    this.totalCollectibleThisWave = 0;
  }

  init() {
    // Hide existing decorative coins and speech bubble
    const decorativeCoins = document.querySelector('.coins');
    const speechBubble = document.querySelector('.speech-bubble');

    if (decorativeCoins) decorativeCoins.style.display = 'none';
    if (speechBubble) speechBubble.style.display = 'none';

    // Show start screen
    this.showStartScreen();
  }

  showStartScreen() {
    const heroWorld = document.querySelector('.hero-world');
    if (!heroWorld) return;

    const startScreen = document.createElement('div');
    startScreen.className = 'game-start-screen pixel-box';
    startScreen.innerHTML = `
      <h2 class="pixel-text" style="margin-bottom: 20px; color: #8b5cf6;">COIN QUEST</h2>
      <p class="pixel-text-sm" style="margin-bottom: 20px;">COLLECT COINS TO LEVEL UP!</p>
      <div style="margin-bottom: 16px;">
        <p class="pixel-text-tiny" style="margin-bottom: 8px;">🪙 SILVER = 10 PTS</p>
        <p class="pixel-text-tiny" style="margin-bottom: 8px;">🏆 GOLD = 100 PTS</p>
        <p class="pixel-text-tiny" style="margin-bottom: 8px;">💣 BOMB = -1 LIFE</p>
      </div>
      <input type="text" id="player-name-input" class="pixel-input" placeholder="ENTER NAME" maxlength="10" />
      <button class="pixel-btn game-btn" id="start-game-btn" style="margin-top: 16px;">
        ▶ START GAME
      </button>
    `;

    heroWorld.appendChild(startScreen);

    const startBtn = document.getElementById('start-game-btn');
    const nameInput = document.getElementById('player-name-input');

    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && nameInput.value.trim()) {
        this.startGame(nameInput.value.trim());
      }
    });

    startBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'PLAYER';
      this.startGame(name);
    });
  }

  startGame(playerName) {
    this.playerName = playerName;
    this.gameActive = true;
    this.score = 0;
    this.level = 1;
    this.lives = 3;

    // Remove start screen
    const startScreen = document.querySelector('.game-start-screen');
    if (startScreen) startScreen.remove();

    // Update HUD
    this.updateHUD();

    // Setup game area
    this.setupGameArea();

    // Setup player
    this.setupPlayer();

    // Spawn first wave
    this.spawnCoinWave();

    // Start game loop
    this.gameLoop();

    // Setup controls
    this.setupControls();

    playSound('powerup');
  }

  setupGameArea() {
    const heroWorld = document.querySelector('.hero-world');
    this.gameArea = heroWorld.getBoundingClientRect();
  }

  setupPlayer() {
    this.player = document.querySelector('.character-sprite');
    if (!this.player) return;

    // Center player
    const heroWorld = document.querySelector('.hero-world');
    const rect = heroWorld.getBoundingClientRect();

    this.playerX = rect.width / 2 - 40;
    this.playerY = rect.height / 2 - 60;

    this.player.style.position = 'absolute';
    this.player.style.left = this.playerX + 'px';
    this.player.style.top = this.playerY + 'px';
    this.player.classList.remove('bounce');
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        this.keys[e.key] = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  spawnCoinWave() {
    this.coins = [];
    this.collectedThisWave = 0;
    this.totalCollectibleThisWave = 0;

    const heroWorld = document.querySelector('.hero-world');
    const rect = heroWorld.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
      const coinType = this.randomCoinType();
      const coin = this.createCoin(coinType, rect);
      this.coins.push(coin);
      heroWorld.appendChild(coin.element);

      if (coinType !== 'bomb') {
        this.totalCollectibleThisWave++;
      }
    }
  }

  randomCoinType() {
    const rand = Math.random();
    if (rand < 0.10) return 'gold';      // 10% gold
    if (rand < 0.30) return 'bomb';      // 20% bomb
    return 'silver';                      // 70% silver
  }

  createCoin(type, areaRect) {
    const coin = document.createElement('div');
    coin.className = 'game-coin';

    let emoji, value;
    if (type === 'gold') {
      emoji = '🏆';
      value = 100;
    } else if (type === 'bomb') {
      emoji = '💣';
      value = -1;
    } else {
      emoji = '🪙';
      value = 10;
    }

    coin.textContent = emoji;
    coin.style.fontSize = '32px';
    coin.style.position = 'absolute';

    // Random position, but not on player
    let x, y, tooClose;
    do {
      x = Math.random() * (areaRect.width - 50);
      y = Math.random() * (areaRect.height - 150) + 50;
      const dx = x - this.playerX;
      const dy = y - this.playerY;
      tooClose = Math.sqrt(dx * dx + dy * dy) < 100;
    } while (tooClose);

    coin.style.left = x + 'px';
    coin.style.top = y + 'px';

    return {
      element: coin,
      x: x,
      y: y,
      type: type,
      value: value,
      collected: false
    };
  }

  gameLoop() {
    if (!this.gameActive) return;

    // Move player
    this.movePlayer();

    // Check collisions
    this.checkCollisions();

    // Continue loop
    requestAnimationFrame(() => this.gameLoop());
  }

  movePlayer() {
    const heroWorld = document.querySelector('.hero-world');
    const rect = heroWorld.getBoundingClientRect();

    let isMoving = false;
    let movingLeft = false;
    let movingRight = false;

    if (this.keys['ArrowUp']) {
      this.playerY -= this.playerSpeed;
      isMoving = true;
    }
    if (this.keys['ArrowDown']) {
      this.playerY += this.playerSpeed;
      isMoving = true;
    }
    if (this.keys['ArrowLeft']) {
      this.playerX -= this.playerSpeed;
      isMoving = true;
      movingLeft = true;
    }
    if (this.keys['ArrowRight']) {
      this.playerX += this.playerSpeed;
      isMoving = true;
      movingRight = true;
    }

    // Boundaries
    this.playerX = Math.max(0, Math.min(this.playerX, rect.width - 80));
    this.playerY = Math.max(0, Math.min(this.playerY, rect.height - 150));

    if (this.player) {
      this.player.style.left = this.playerX + 'px';
      this.player.style.top = this.playerY + 'px';

      // Add walking animation when moving
      if (isMoving) {
        this.player.classList.add('walking');
      } else {
        this.player.classList.remove('walking');
      }

      // Flip character based on direction
      if (movingLeft && !movingRight) {
        this.player.classList.add('flip-left');
      } else if (movingRight && !movingLeft) {
        this.player.classList.remove('flip-left');
      }
    }
  }

  checkCollisions() {
    this.coins.forEach(coin => {
      if (coin.collected) return;

      // Calculate center of player character (80px wide, 120px tall)
      const playerCenterX = this.playerX + 40;
      const playerCenterY = this.playerY + 60;

      // Calculate center of coin (32px emoji)
      const coinCenterX = coin.x + 16;
      const coinCenterY = coin.y + 16;

      const dx = coinCenterX - playerCenterX;
      const dy = coinCenterY - playerCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Collision radius: character width/2 + coin size/2
      const collisionRadius = 40 + 16;

      if (distance < collisionRadius) {
        this.collectCoin(coin);
      }
    });
  }

  collectCoin(coin) {
    coin.collected = true;

    if (coin.type === 'bomb') {
      // Bomb explosion
      this.explodeBomb(coin);
      this.lives--;
      this.updateHUD();

      if (this.lives <= 0) {
        this.gameOver();
      }
    } else {
      // Collect coin
      coin.element.style.transition = 'all 0.3s ease-out';
      coin.element.style.transform = 'translateY(-50px) scale(0)';
      coin.element.style.opacity = '0';

      this.score += coin.value;
      this.collectedThisWave++;
      this.updateHUD();

      playSound('coin');

      // Check level up
      if (this.score >= this.level * 100) {
        this.levelUp();
      }

      // Check if wave complete
      if (this.collectedThisWave >= this.totalCollectibleThisWave) {
        setTimeout(() => {
          this.clearCoins();
          this.spawnCoinWave();
        }, 500);
      }
    }

    setTimeout(() => coin.element.remove(), 300);
  }

  explodeBomb(coin) {
    const explosion = document.createElement('div');
    explosion.textContent = '💥';
    explosion.style.cssText = `
      position: absolute;
      left: ${coin.x}px;
      top: ${coin.y}px;
      font-size: 64px;
      animation: explosion-anim 0.5s ease-out;
      pointer-events: none;
    `;

    const heroWorld = document.querySelector('.hero-world');
    heroWorld.appendChild(explosion);

    // Add explosion animation CSS
    if (!document.getElementById('explosion-style')) {
      const style = document.createElement('style');
      style.id = 'explosion-style';
      style.textContent = `
        @keyframes explosion-anim {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    playSound('back');

    setTimeout(() => explosion.remove(), 500);
  }

  clearCoins() {
    this.coins.forEach(coin => {
      if (coin.element && !coin.collected) {
        coin.element.remove();
      }
    });
    this.coins = [];
  }

  levelUp() {
    this.level++;
    this.updateHUD();

    const levelUpMsg = document.createElement('div');
    levelUpMsg.textContent = `LEVEL ${this.level}!`;
    levelUpMsg.className = 'pixel-text';
    levelUpMsg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      color: #fbbf24;
      text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      z-index: 10001;
      animation: fadeInOut 2s ease-in-out;
      pointer-events: none;
    `;

    document.body.appendChild(levelUpMsg);

    playSound('powerup');

    setTimeout(() => levelUpMsg.remove(), 2000);
  }

  updateHUD() {
    // Update player name in HUD
    const hudLeft = document.querySelector('.hud-left .pixel-text');
    if (hudLeft) hudLeft.textContent = this.playerName.toUpperCase();

    // Update lives
    const livesElement = document.querySelector('.lives');
    if (livesElement) {
      livesElement.textContent = '♥'.repeat(this.lives);
    }

    // Update score
    const scoreElement = document.querySelector('.score-num');
    if (scoreElement) {
      scoreElement.textContent = this.score.toString().padStart(6, '0');
    }

    // Update level in center HUD
    const hudCenter = document.querySelector('.hud-center');
    if (hudCenter) {
      hudCenter.innerHTML = `★ LEVEL ${this.level} ★`;
    }
  }

  gameOver() {
    this.gameActive = false;

    // Clear coins
    this.clearCoins();

    // Show game over screen
    const heroWorld = document.querySelector('.hero-world');
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen-display pixel-box';
    gameOverScreen.innerHTML = `
      <h2 class="pixel-text blink" style="font-size: 32px; color: #ef4444; margin-bottom: 24px;">GAME OVER</h2>
      <div style="margin-bottom: 24px;">
        <p class="pixel-text-sm" style="margin-bottom: 12px;">PLAYER: ${this.playerName}</p>
        <p class="pixel-text-sm" style="margin-bottom: 12px;">FINAL SCORE: ${this.score}</p>
        <p class="pixel-text-sm" style="margin-bottom: 12px;">LEVEL REACHED: ${this.level}</p>
      </div>
      <button class="pixel-btn game-btn" id="restart-game-btn">
        ↺ PLAY AGAIN
      </button>
    `;

    heroWorld.appendChild(gameOverScreen);

    const restartBtn = document.getElementById('restart-game-btn');
    restartBtn.addEventListener('click', () => {
      gameOverScreen.remove();
      this.init();
    });

    playSound('back');
  }
}

// ============================================
// COIN COLLECTION ON CLICK (OLD - FOR DECORATION)
// ============================================

function initCoinCollection() {
  const coins = document.querySelectorAll('.coin');

  coins.forEach(coin => {
    coin.addEventListener('click', (e) => {
      playSound('coin');

      // Animate coin collection
      coin.style.transition = 'all 0.5s ease-out';
      coin.style.transform = 'translateY(-100px) scale(0)';
      coin.style.opacity = '0';

      // Add score
      const scoreElement = document.querySelector('.score-num');
      if (scoreElement) {
        let currentScore = parseInt(scoreElement.textContent);
        currentScore += 100;
        scoreElement.textContent = currentScore.toString().padStart(6, '0');
      }

      // Reset coin after animation
      setTimeout(() => {
        coin.style.transition = '';
        coin.style.transform = '';
        coin.style.opacity = '1';
      }, 1000);
    });
  });
}

// ============================================
// BUTTON HOVER SOUND EFFECTS
// ============================================

function initButtonSounds() {
  const buttons = document.querySelectorAll('.pixel-btn, .powerup-item, .cartridge');

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      // Subtle hover sound
      if (Math.random() > 0.7) { // Don't play on every hover
        playSound('select');
      }
    });
  });
}

// ============================================
// PARALLAX EFFECT FOR CHARACTER
// ============================================

function initParallax() {
  const character = document.querySelector('.character-sprite');
  if (!character) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.3;

    if (scrolled < window.innerHeight) {
      character.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

// ============================================
// ADD CSS ANIMATIONS DYNAMICALLY
// ============================================

function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }

    @keyframes rainbow-bg {
      0%, 100% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c★ PRETHAM.DEV - 8-BIT PORTFOLIO LOADED ★', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');

  // Initialize all features
  new Starfield('starfield');
  new Modal();
  new KonamiCode();

  // Initialize Coin Collection Game
  const game = new CoinCollectionGame();
  game.init();

  initSmoothScrolling();
  initInstallButton();
  animatePowerBars();
  initScrollAnimations();
  initButtonSounds();
  addDynamicStyles();

  // Play a subtle startup sound
  setTimeout(() => playSound('powerup'), 500);
});

// ============================================
// HANDLE PAGE VISIBILITY (PAUSE/RESUME)
// ============================================

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Game paused');
  } else {
    console.log('Game resumed');
  }
});
