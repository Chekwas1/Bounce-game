// Game variables
const fish = document.getElementById('fish');
const ball = document.getElementById('ball');
const gameBox = document.getElementById('game-box');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const faqButton = document.getElementById('faqButton');
const faqContent = document.getElementById('faqContent');

let boxWidth = 600;
let boxHeight = 400;
let fishX = 200;
let fishY = 200;
let ballX = 100;
let ballY = 100;
let ballSpeedX = 3;
let ballSpeedY = 3;
let score = 0;
let level = 1;
let fishSpeed = 5;
let mouseX = 0;
let mouseY = 0;
let isMouseControlActive = false;
let gameRunning = false;
let isPaused = false;
let pauseOverlay = document.createElement('div');
pauseOverlay.id = 'pauseOverlay';
pauseOverlay.innerHTML = `
    <div class="pause-menu">
        <h2>Game Paused</h2>
        <button id="resumeButton">Resume</button>
        <button id="restartButton">Restart</button>
    </div>
`;
gameBox.appendChild(pauseOverlay);

// Pink gradients for different levels
const pinkGradients = [
    'linear-gradient(135deg, rgba(255,20,147,0.2), rgba(255,105,180,0.4))',
    'linear-gradient(135deg, rgba(255,105,180,0.3), rgba(255,182,193,0.5))',
    'linear-gradient(135deg, rgba(219,112,147,0.4), rgba(255,20,147,0.6))',
    'linear-gradient(135deg, rgba(255,182,193,0.5), rgba(255,0,255,0.3))',
    'linear-gradient(135deg, rgba(199,21,133,0.4), rgba(255,105,180,0.6))'
];

// Box shapes for different levels
const boxShapes = [
    { borderRadius: '0px', clipPath: 'none' },
    { borderRadius: '50px', clipPath: 'none' },
    { borderRadius: '0px', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { borderRadius: '0px', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    { borderRadius: '50%', clipPath: 'none' }
];

// Add this to your existing styles
const pauseStyle = document.createElement('style');
pauseStyle.textContent = `
    #pauseOverlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .pause-menu {
        background: rgba(10, 10, 26, 0.9);
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #ff41b4;
        box-shadow: 0 0 15px #ff41b4;
        text-align: center;
    }

    .pause-menu h2 {
        color: #fff;
        text-shadow: 0 0 10px #ff41b4;
        margin-bottom: 20px;
    }

    .pause-menu button {
        display: block;
        width: 200px;
        padding: 10px;
        margin: 10px auto;
        background: transparent;
        color: #ff41b4;
        border: 2px solid #ff41b4;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s;
    }

    .pause-menu button:hover {
        background: #ff41b4;
        color: #0a0a1a;
        box-shadow: 0 0 10px #ff41b4;
    }
`;
document.head.appendChild(pauseStyle);

// Replace the existing quizQuestions array with this complete set
const quizQuestions = [
    // Basic Questions (1-5)
    {
        question: "What is a zero-knowledge proof?",
        options: [
            "A way to prove knowledge without revealing it",
            "A method to store blockchain data",
            "A new type of cryptocurrency",
            "A privacy coin"
        ],
        correct: 0
    },
    {
        question: "Which cryptographic technique do zero-knowledge proofs rely on?",
        options: [
            "Hash functions",
            "Digital signatures",
            "Mathematical proofs",
            "Symmetric encryption"
        ],
        correct: 2
    },
    {
        question: "What does a zkSNARK stand for?",
        options: [
            "Zero-Knowledge Succinct Non-Interactive Argument of Knowledge",
            "Zero-Knowledge Super Non-Interactive Reliable Key",
            "Zero-Knowledge Security Network for Anonymous Reliable Keys",
            "Zero-Knowledge Smart Non-Arithmetic Recursive Kernel"
        ],
        correct: 0
    },
    {
        question: "What is the main advantage of using zero-knowledge proofs in blockchain?",
        options: [
            "Faster consensus",
            "Enhanced privacy & scalability",
            "Reduced mining difficulty",
            "Lower gas fees only"
        ],
        correct: 1
    },
    {
        question: "Which of these is NOT a type of zero-knowledge proof?",
        options: [
            "zkSNARK",
            "zkSTARK",
            "zkPLONK",
            "zkBOLT"
        ],
        correct: 3
    },
    // Intermediate Questions (6-10)
    {
        question: "What is Succinct Labs' main zkVM called?",
        options: [
            "SP1",
            "zkMamba",
            "zkRoller",
            "ProofX"
        ],
        correct: 0
    },
    {
        question: "How does Succinct Labs contribute to proof generation?",
        options: [
            "By providing centralized nodes for proofs",
            "By running a decentralized prover network",
            "By offering an Ethereum scaling solution",
            "By creating private smart contracts"
        ],
        correct: 1
    },
    {
        question: "What is a prover in zero-knowledge systems?",
        options: [
            "A node that verifies transactions",
            "A component that generates cryptographic proofs",
            "A miner that processes blocks",
            "A validator on a staking network"
        ],
        correct: 1
    },
    {
        question: "What is the main function of a verifier in ZKPs?",
        options: [
            "To generate proofs",
            "To validate proofs without learning the secret",
            "To store data on-chain",
            "To stake tokens for governance"
        ],
        correct: 1
    },
    {
        question: "Why are zkRollups important for Ethereum scaling?",
        options: [
            "They bundle transactions off-chain and submit a single proof on-chain",
            "They increase gas fees",
            "They create new Ethereum Layer 1 networks",
            "They eliminate the need for validators"
        ],
        correct: 0
    },
    // Advanced Questions (11-15)
    {
        question: "What makes SP1 different from other zkVMs?",
        options: [
            "It can prove computation faster and with lower costs",
            "It runs only on Bitcoin",
            "It requires centralized validators",
            "It doesn't use zero-knowledge proofs"
        ],
        correct: 0
    },
    {
        question: "Which of the following is a challenge in generating zero-knowledge proofs?",
        options: [
            "High computational costs",
            "Instant verification",
            "Reducing the number of transactions",
            "Removing blockchain dependencies"
        ],
        correct: 0
    },
    {
        question: "Which blockchain networks support zkSNARK-based applications?",
        options: [
            "Ethereum, Polygon, Mina",
            "Bitcoin, Dogecoin, Litecoin",
            "Solana, Cardano, Avalanche",
            "XRP, Stellar, Cosmos"
        ],
        correct: 0
    },
    {
        question: "What is the main benefit of Succinct Prover Network?",
        options: [
            "Decentralized proof generation",
            "Free smart contracts for developers",
            "Mining rewards for staking ETH",
            "Eliminating the need for private keys"
        ],
        correct: 0
    },
    {
        question: "What is the purpose of zkML (Zero-Knowledge Machine Learning)?",
        options: [
            "Running AI models with privacy-preserving proofs",
            "Training AI models on Bitcoin transactions",
            "Making Ethereum faster",
            "Building quantum-resistant cryptography"
        ],
        correct: 0
    },
    // Expert-Level Questions (16-20)
    {
        question: "How does a recursive proof improve efficiency?",
        options: [
            "By allowing multiple proofs to be combined into one",
            "By making smart contracts cheaper",
            "By verifying all transactions instantly",
            "By replacing traditional consensus models"
        ],
        correct: 0
    },
    {
        question: "What role does polynomial commitment play in zkSNARKs?",
        options: [
            "Helps prove statements without revealing the underlying data",
            "Increases transaction speed on Ethereum",
            "Improves governance mechanisms",
            "Prevents front-running on DEXs"
        ],
        correct: 0
    },
    {
        question: "Why do zkSTARKs use hash functions instead of elliptic curve cryptography?",
        options: [
            "To be post-quantum secure",
            "To increase proof size",
            "To eliminate the need for blockchain",
            "To make mining easier"
        ],
        correct: 0
    },
    {
        question: "What is an arithmetic circuit in the context of ZKPs?",
        options: [
            "A mathematical representation of a computation",
            "A mining algorithm",
            "A tool for converting ETH to fiat",
            "A consensus mechanism"
        ],
        correct: 0
    },
    {
        question: "What does the term 'succinct' mean in Succinct Labs?",
        options: [
            "Compact and efficient proofs",
            "Proofs with long execution times",
            "The ability to scale without any transaction fees",
            "A type of validator used in rollups"
        ],
        correct: 0
    }
];

// Add quiz overlay HTML
const quizOverlay = document.createElement('div');
quizOverlay.id = 'quizOverlay';
quizOverlay.innerHTML = `
    <div class="quiz-container">
        <h2>Level Complete!</h2>
        <div id="questionText"></div>
        <div id="options"></div>
    </div>
`;
document.body.appendChild(quizOverlay);

// Add quiz styles
const quizStyle = document.createElement('style');
quizStyle.textContent = `
    #quizOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        clip-path: none !important;
        border-radius: 0 !important;
    }

    .quiz-container {
        position: relative;
        background: rgba(10, 10, 26, 0.95);
        padding: 30px;
        border-radius: 10px !important;
        border: 2px solid #ff41b4;
        box-shadow: 0 0 20px #ff41b4;
        text-align: center;
        max-width: 600px;
        width: 90%;
        clip-path: none !important;
        transform: none !important;
        margin: auto;
    }

    .quiz-container h2 {
        color: #fff;
        text-shadow: 0 0 10px #ff41b4;
        margin-bottom: 20px;
    }

    #questionText {
        color: #fff;
        font-size: 18px;
        margin-bottom: 20px;
        line-height: 1.4;
    }

    #options button {
        display: block;
        width: 100%;
        padding: 15px;
        margin: 10px 0;
        background: transparent;
        color: #ff41b4;
        border: 2px solid #ff41b4;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s;
        text-align: left;
    }

    #options button:hover {
        background: #ff41b4;
        color: #0a0a1a;
        box-shadow: 0 0 10px #ff41b4;
    }
`;
document.head.appendChild(quizStyle);

// Add failure overlay HTML
const failureOverlay = document.createElement('div');
failureOverlay.id = 'failureOverlay';
failureOverlay.innerHTML = `
    <div class="failure-container">
        <h2>Incorrect Answer!</h2>
        <p>Don't worry, you can try again from the beginning.</p>
        <button id="restartFromFailure">Restart Game</button>
    </div>
`;
gameBox.appendChild(failureOverlay);

// Add failure overlay styles
const failureStyle = document.createElement('style');
failureStyle.textContent = `
    #failureOverlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .failure-container {
        background: rgba(10, 10, 26, 0.95);
        padding: 30px;
        border-radius: 10px;
        border: 2px solid #ff41b4;
        box-shadow: 0 0 20px #ff41b4;
        text-align: center;
        max-width: 400px;
        width: 90%;
    }

    .failure-container h2 {
        color: #ff41b4;
        text-shadow: 0 0 10px #ff41b4;
        margin-bottom: 20px;
    }

    .failure-container p {
        color: #fff;
        margin-bottom: 20px;
    }

    #restartFromFailure {
        padding: 15px 30px;
        background: transparent;
        color: #ff41b4;
        border: 2px solid #ff41b4;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s;
    }

    #restartFromFailure:hover {
        background: #ff41b4;
        color: #0a0a1a;
        box-shadow: 0 0 10px #ff41b4;
    }
`;
document.head.appendChild(failureStyle);

// Add game state variables
let gameAnimationState = null;
let animationFrames = 0;

// Add at the top of your script after game variables
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Sound effects setup
const sounds = {
    bounce: null,
    eat: null,
    success: null,
    background: null
};

// Load audio file
async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

// Play loaded audio
function playSound(buffer) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
}

// Create oscillator-based sound effects
function createBounceSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function createEatSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function createSuccessSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
}

// Initialize game
function init() {
    updateBoxShape();
    positionBall();
    
    // Add event listeners for mouse movement
    document.addEventListener('mousemove', (e) => {
        const rect = gameBox.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseControlActive = true;
    });
    
    // Touch support
    gameBox.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = gameBox.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        isMouseControlActive = true;
    });
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
    if (!gameRunning || isPaused) return;
    
    updateFish();
    updateBall();
    checkCollisions();
    
    requestAnimationFrame(gameLoop);
}

// Update fish position based on mouse or touch
function updateFish() {
    if (isMouseControlActive) {
        // Calculate angle between fish and mouse
        const dx = mouseX - fishX;
        const dy = mouseY - fishY;
        const angle = Math.atan2(dy, dx);
        
        // Flip fish based on direction
        if (dx < 0) {
            fish.style.transform = 'scaleX(-1)';
        } else {
            fish.style.transform = 'scaleX(1)';
        }
        
        // Move fish towards mouse/touch
        fishX += Math.cos(angle) * fishSpeed;
        fishY += Math.sin(angle) * fishSpeed;
        
        // Constrain fish inside box
        constrainFish();
        
        // Position fish element
        fish.style.left = (fishX - 20) + 'px';
        fish.style.top = (fishY - 12.5) + 'px';
    }
}

// Constrain fish inside the current box shape
function constrainFish() {
    const bounds = gameBox.getBoundingClientRect();
    const fishRadius = 20; // Approximate fish radius
    
    // Ensure fish stays within game box bounds
    fishX = Math.max(fishRadius, Math.min(bounds.width - fishRadius, fishX));
    fishY = Math.max(fishRadius, Math.min(bounds.height - fishRadius, fishY));
    
    // Check if fish is inside the current shape
    if (!getShapeCollisionPoints(fishX, fishY, boxShapes[(level - 1) % boxShapes.length])) {
        // If outside, move fish towards center
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const angle = Math.atan2(centerY - fishY, centerX - fishX);
        
        fishX += Math.cos(angle) * fishSpeed;
        fishY += Math.sin(angle) * fishSpeed;
    }
    
    // Update fish position
    fish.style.left = (fishX - fishRadius) + 'px';
    fish.style.top = (fishY - fishRadius/1.6) + 'px';
}

// Update ball position
function updateBall() {
    const bounds = gameBox.getBoundingClientRect();
    const ballRadius = 10;
    const padding = ballRadius + 5; // Extra padding for smoother collisions
    
    // Calculate next position
    let nextX = ballX + ballSpeedX;
    let nextY = ballY + ballSpeedY;
    
    // Check if next position is valid
    const nextPosValid = getShapeCollisionPoints(nextX, nextY, boxShapes[(level - 1) % boxShapes.length]);
    
    if (!nextPosValid) {
        // Try to find which axis caused the collision
        const checkX = getShapeCollisionPoints(nextX, ballY, boxShapes[(level - 1) % boxShapes.length]);
        const checkY = getShapeCollisionPoints(ballX, nextY, boxShapes[(level - 1) % boxShapes.length]);
        
        if (!checkX) {
            createBounceSound();
            ballSpeedX = -ballSpeedX;
            nextX = ballX;
            createRipple(ballX, ballY);
            pulseBoxGradient();
        }
        
        if (!checkY) {
            createBounceSound();
            ballSpeedY = -ballSpeedY;
            nextY = ballY;
            createRipple(ballX, ballY);
            pulseBoxGradient();
        }
        
        // If still invalid, move towards center
        if (!getShapeCollisionPoints(nextX, nextY, boxShapes[(level - 1) % boxShapes.length])) {
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            const angle = Math.atan2(centerY - ballY, centerX - ballX);
            nextX = ballX + Math.cos(angle) * 5;
            nextY = ballY + Math.sin(angle) * 5;
        }
    }
    
    // Update position
    ballX = nextX;
    ballY = nextY;
    
    // Ensure minimum speed
    if (Math.abs(ballSpeedX) < 2) ballSpeedX *= 1.5;
    if (Math.abs(ballSpeedY) < 2) ballSpeedY *= 1.5;
    
    // Update ball position
    ball.style.left = (ballX - ballRadius) + 'px';
    ball.style.top = (ballY - ballRadius) + 'px';
}

// Check for collision between fish and ball
function checkCollisions() {
    const dx = fishX - ballX;
    const dy = fishY - ballY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 30) { // Collision detected
        createEatSound();
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        
        // Check if we've reached the score for next level
        const nextLevelScore = level * 100;
        console.log("Current score:", score, "Need:", nextLevelScore);
        
        if (score >= nextLevelScore && !isPaused) {
            console.log("Triggering level up animation");
            // Pause the game and show animation
            isPaused = true;
            gameAnimationState = "correct";
            animationFrames = 0;
            showSuccessAnimation();
        } else {
            // Just reposition the ball if not reaching next level
            positionBall();
        }
    }
}

// Create ripple effect when ball hits wall
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = (x - 15) + 'px';
    ripple.style.top = (y - 15) + 'px';
    ripple.style.width = '30px';
    ripple.style.height = '30px';
    
    gameBox.appendChild(ripple);
    
    setTimeout(() => {
        gameBox.removeChild(ripple);
    }, 800);
}

// Pulse box gradient when ball hits wall
function pulseBoxGradient() {
    const currentGradientIndex = (level - 1) % pinkGradients.length;
    const baseGradient = pinkGradients[currentGradientIndex];
    
    const intensifiedGradient = baseGradient.replace(
        /rgba\((\d+),(\d+),(\d+),(0\.\d+)\)/g, 
        (match, r, g, b, a) => `rgba(${r},${g},${b},${Math.min(parseFloat(a) + 0.3, 0.9)})`
    );
    
    gameBox.style.background = intensifiedGradient;
    gameBox.style.boxShadow = '0 0 25px rgba(255,105,180,0.8)';
    
    setTimeout(() => {
        gameBox.style.background = baseGradient;
        gameBox.style.boxShadow = '0 0 15px rgba(255,105,180,0.5)';
    }, 200);
}

// Position ball randomly
function positionBall() {
    const bounds = gameBox.getBoundingClientRect();
    const ballRadius = 10;
    let attempts = 0;
    let validPosition = false;
    
    while (!validPosition && attempts < 100) {
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const radius = Math.min(bounds.width, bounds.height) / 4;
        const angle = Math.random() * Math.PI * 2;
        
        ballX = centerX + Math.cos(angle) * radius;
        ballY = centerY + Math.sin(angle) * radius;
        
        validPosition = getShapeCollisionPoints(ballX, ballY, boxShapes[(level - 1) % boxShapes.length]);
        attempts++;
    }
    
    if (!validPosition) {
        ballX = bounds.width / 2;
        ballY = bounds.height / 2;
    }
    
    // Set initial speed based on level 1
    const baseSpeed = 3;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
    
    ball.style.left = (ballX - ballRadius) + 'px';
    ball.style.top = (ballY - ballRadius) + 'px';
}

// Show success animation
function showSuccessAnimation() {
    createSuccessSound();
    const successText = document.createElement('div');
    successText.style.position = 'absolute';
    successText.style.fontSize = '48px';
    successText.style.color = '#ff41b4';
    successText.style.textAlign = 'center';
    successText.style.width = '100%';
    successText.style.top = '50%';
    successText.style.transform = 'translateY(-50%)';
    successText.style.textShadow = '0 0 10px #ff41b4';
    successText.textContent = 'SUCCINCT!';
    gameBox.appendChild(successText);

    let opacity = 1;
    const fadeOut = setInterval(() => {
        opacity -= 0.02;
        successText.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(fadeOut);
            gameBox.removeChild(successText);
            showQuiz();
        }
    }, 20);
}

// Level up
function levelUp() {
    console.log("Leveling up from", level);
    level++;
    levelElement.textContent = `Level: ${level}`;
    
    // Reset game state
    gameAnimationState = null;
    animationFrames = 0;
    
    // Update speeds
    fishSpeed = 5 + (level - 1) * 0.5;
    const baseSpeed = 3;
    const speedMultiplier = 1 + (level - 1) * 0.1;
    ballSpeedX = Math.sign(ballSpeedX) * baseSpeed * speedMultiplier;
    ballSpeedY = Math.sign(ballSpeedY) * baseSpeed * speedMultiplier;
    
    // Update visuals
    updateBoxShape();
    positionBall();
    
    // Reset fish position
    fishX = gameBox.offsetWidth / 2;
    fishY = gameBox.offsetHeight / 2;
    fish.style.left = (fishX - 20) + 'px';
    fish.style.top = (fishY - 12.5) + 'px';
    
    // Resume game
    isPaused = false;
    console.log("Level up complete, now at level:", level);
    requestAnimationFrame(gameLoop);
}

// Update box shape based on current level
function updateBoxShape() {
    const shapeIndex = (level - 1) % boxShapes.length;
    const colorIndex = (level - 1) % pinkGradients.length;
    
    gameBox.style.borderRadius = boxShapes[shapeIndex].borderRadius;
    gameBox.style.clipPath = boxShapes[shapeIndex].clipPath;
    gameBox.style.background = pinkGradients[colorIndex];
}

// Start the game
function startGame() {
    startScreen.style.display = 'none';
    gameRunning = true;
    init();
}

// Add event listeners
startButton.addEventListener('click', () => {
    // Resume audio context on user interaction
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    startGame();
});

faqButton.addEventListener('click', function() {
    faqContent.style.display = 'block';
    startButton.style.display = 'none';
    faqButton.style.display = 'none';
});

document.querySelector('.back-button').addEventListener('click', function() {
    faqContent.style.display = 'none';
    startButton.style.display = 'inline-block';
    faqButton.style.display = 'inline-block';
});

// Add this function to calculate collision points for different shapes
function getShapeCollisionPoints(x, y, shape) {
    const bounds = gameBox.getBoundingClientRect();
    const currentShape = boxShapes[(level - 1) % boxShapes.length];
    const padding = 10; // Add padding to keep objects away from edges
    
    if (currentShape.clipPath === 'none') {
        if (currentShape.borderRadius === '50%') {
            // Circle shape
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            const radius = (Math.min(bounds.width, bounds.height) / 2) - padding;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            return distance <= radius;
        } else {
            // Rectangle or rounded rectangle
            return x >= padding && x <= bounds.width - padding && 
                   y >= padding && y <= bounds.height - padding;
        }
    } else {
        // For polygon shapes
        const points = currentShape.clipPath.match(/\d+(\.\d+)?/g).map(Number);
        const vertices = [];
        for (let i = 0; i < points.length; i += 2) {
            vertices.push({
                x: (points[i] * (bounds.width - padding * 2)) / 100 + padding,
                y: (points[i + 1] * (bounds.height - padding * 2)) / 100 + padding
            });
        }
        return isPointInPolygon(x, y, vertices);
    }
}

// Helper function to check if a point is inside a polygon
function isPointInPolygon(x, y, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;
        
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Add pause/resume functionality
function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    if (!isPaused) {
        requestAnimationFrame(gameLoop);
    }
}

// Add restart functionality
function restartGame() {
    fullReset();
}

// Add event listeners for pause/resume/restart
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameRunning) {
        togglePause();
    }
});

document.getElementById('resumeButton').addEventListener('click', togglePause);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Add quiz functions
function showQuiz() {
    // Get current question based on level
    const questionIndex = (level - 1) % quizQuestions.length;
    console.log("Showing quiz for level:", level, "Question index:", questionIndex);
    
    const currentQuestion = quizQuestions[questionIndex];
    const questionText = document.getElementById('questionText');
    const options = document.getElementById('options');
    
    // Clear previous options
    options.innerHTML = '';
    questionText.textContent = currentQuestion.question;
    
    // Create new option buttons
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.onclick = () => checkAnswer(index);
        options.appendChild(button);
    });
    
    quizOverlay.style.display = 'flex';
    isPaused = true;
}

function checkAnswer(selectedIndex) {
    const questionIndex = (level - 1) % quizQuestions.length;
    const currentQuestion = quizQuestions[questionIndex];
    
    if (selectedIndex === currentQuestion.correct) {
        // Correct answer
        quizOverlay.style.display = 'none';
        isPaused = false;
        levelUp();
        requestAnimationFrame(gameLoop);
    } else {
        // Wrong answer - show failure overlay
        quizOverlay.style.display = 'none';
        failureOverlay.style.display = 'flex';
        isPaused = true;
    }
}

// Add event listener for failure restart button
document.getElementById('restartFromFailure').addEventListener('click', () => {
    failureOverlay.style.display = 'none';
    fullReset();
});

// Add new function for complete reset
function fullReset() {
    // Reset all game variables
    score = 0;
    level = 1;
    fishSpeed = 5;
    ballSpeedX = 3;
    ballSpeedY = -3;
    isPaused = false;
    
    // Reset UI
    scoreElement.textContent = 'Score: 0';
    levelElement.textContent = 'Level: 1';
    pauseOverlay.style.display = 'none';
    quizOverlay.style.display = 'none';
    failureOverlay.style.display = 'none';
    
    // Reset shapes and positions
    updateBoxShape();
    
    // Reset fish position to center
    fishX = gameBox.offsetWidth / 2;
    fishY = gameBox.offsetHeight / 2;
    fish.style.left = (fishX - 20) + 'px';
    fish.style.top = (fishY - 12.5) + 'px';
    
    // Reset ball with initial speed
    positionBall();
    
    // Ensure game is running
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

// Add background style with musical notes
const backgroundStyle = document.createElement('style');
backgroundStyle.textContent = `
    body {
        background: #0a0a1a;
        overflow: hidden;
        position: relative;
    }

    .background-illumination {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        background: radial-gradient(circle at 50% 50%, 
            rgba(255, 65, 180, 0.4) 0%,     /* Much brighter center */
            rgba(255, 65, 180, 0.25) 45%,   /* Brighter middle */
            rgba(10, 10, 26, 0.8) 100%);    /* More transparent edge */
        animation: pulse 4s ease-in-out infinite;
        box-shadow: inset 0 0 100px rgba(255, 65, 180, 0.3); /* Inner glow */
    }

    .musical-note {
        position: fixed;
        color: rgba(255, 65, 180, 0.8);    /* Much brighter notes */
        font-size: 36px;                    /* Larger size */
        pointer-events: none;
        animation: float 10s linear infinite;
        z-index: -1;
        text-shadow: 
            0 0 15px #ff41b4,              /* Stronger glow */
            0 0 30px #ff41b4,              /* Additional glow layer */
            0 0 45px #ff41b4;              /* Extra glow for brightness */
    }

    @keyframes pulse {
        0%, 100% { 
            opacity: 0.8;                   /* Higher minimum opacity */
            filter: brightness(1.2);        /* Brighter base state */
        }
        50% { 
            opacity: 1;
            filter: brightness(1.5);        /* Much brighter pulse */
        }
    }

    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        50% {
            opacity: 0.9;                   /* Higher peak opacity */
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(backgroundStyle);

// Create background elements
const backgroundIllumination = document.createElement('div');
backgroundIllumination.className = 'background-illumination';
document.body.appendChild(backgroundIllumination);

// Musical notes array
const musicalNotes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];

// Function to create floating musical notes
function createMusicalNote() {
    const note = document.createElement('div');
    note.className = 'musical-note';
    note.textContent = musicalNotes[Math.floor(Math.random() * musicalNotes.length)];
    
    // Random position and animation duration
    const startX = Math.random() * window.innerWidth;
    const duration = 5 + Math.random() * 10;
    
    note.style.left = `${startX}px`;
    note.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(note);
    
    // Remove note after animation
    setTimeout(() => {
        document.body.removeChild(note);
    }, duration * 1000);
}

// Create notes periodically
setInterval(createMusicalNote, 1000);

// Create initial set of notes
for (let i = 0; i < 10; i++) {
    createMusicalNote();
}

requestAnimationFrame(gameLoop);