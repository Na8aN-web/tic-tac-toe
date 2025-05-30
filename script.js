console.log('js connected')

const gameState = {
    currentPlayer: 'X',
    board: Array(9).fill(''),
    gameActive: true,
    difficulty: 1, // 1: Easy, 2: Medium, 3: Hard
    scores: {
        player: 0,
        computer: 0,
        ties: 0
    },
    winningCombinations: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]           
    ],
    winningLine: null,
    movesHistory: []
};


const sounds = {
    click: new Audio('sounds/click.mp3'),
    win: new Audio('sounds/win.mp3'),
    lose: new Audio('sounds/lose.mp3'),
    tie: new Audio('sounds/tie.mp3')
};


const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const tiesScoreElement = document.getElementById('ties-score');

function initializeDifficultySelector() {
    const controlsSection = document.querySelector('.game-controls');

    if (!controlsSection) {
        console.error('Required DOM elements not found');
        return;
    }

    const difficultyContainer = document.createElement('div');
    difficultyContainer.className = 'difficulty-container';

    const difficultyLabel = document.createElement('label');
    difficultyLabel.htmlFor = 'difficulty-select';
    difficultyLabel.textContent = 'Difficulty:';

    const difficultySelect = document.createElement('select');
    difficultySelect.id = 'difficulty-select';
    difficultySelect.className = 'difficulty-select';

    const difficulties = [
        { value: 1, label: 'Easy' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Hard' }
    ];

    difficulties.forEach(diff => {
        const option = document.createElement('option');
        option.value = diff.value;
        option.textContent = diff.label;
        if (diff.value === gameState.difficulty) {
            option.selected = true;
        }
        difficultySelect.appendChild(option);
    });

    difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = parseInt(e.target.value);
        saveGameState();
        resetBoard(true);
    });

    difficultyContainer.appendChild(difficultyLabel);
    difficultyContainer.appendChild(difficultySelect);

    if (resetButton.parentNode) {
        resetButton.parentNode.insertBefore(difficultyContainer, resetButton);
    } else {
        controlsSection.appendChild(difficultyContainer);
    }
}

function initializeGame() {
    loadGameState();
    initializeDifficultySelector();

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', () => resetBoard(true));

    setupKeyboardNavigation();
    updateUI();

    if (gameState.gameActive && gameState.currentPlayer === 'O') {
        setTimeout(makeComputerMove, 700);
    }
}

function handleCellClick(event) {
    if (!gameState.gameActive) return;
    
    if (gameState.currentPlayer !== 'X') return;

    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (gameState.board[cellIndex] !== '') return;

    playSound('click');
    makeMove(cellIndex, 'X');

    if (gameState.gameActive) {
        gameState.currentPlayer = 'O';
        statusMessage.textContent = "Computer is thinking...";
        setTimeout(makeComputerMove, 700);
    }
}


function makeMove(cellIndex, player) {
    gameState.board[cellIndex] = player;
    gameState.movesHistory.push({ cellIndex, player });

    updateCell(cellIndex, player);

    checkGameStatus();
    saveGameState();
}


function updateCell(cellIndex, player) {
    const cell = cells[cellIndex];
    cell.setAttribute('data-player', player);

    if (player) {
        cell.style.cursor = 'default';
    }
}

function makeComputerMove() {
    if (!gameState.gameActive) return;
    
    if (gameState.currentPlayer !== 'O') return;

    let cellIndex;

    switch (gameState.difficulty) {
        case 1:
            cellIndex = makeRandomMove();
            break;
        case 2:
            if (Math.random() < 0.7) {
                cellIndex = makeStrategicMove();
                if (cellIndex === -1) cellIndex = makeRandomMove();
            } else {
                cellIndex = makeRandomMove();
            }
            break;
        case 3:
            cellIndex = makeStrategicMove();
            break;
        default:
            cellIndex = makeRandomMove();
    }

    if (cellIndex !== -1) {
        playSound('click');
        makeMove(cellIndex, 'O');
        
        if (gameState.gameActive) {
            gameState.currentPlayer = 'X';
            statusMessage.textContent = "Your turn! Place an X on the board.";
        }
    }
}

function makeRandomMove() {
    const emptyCells = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);

    if (emptyCells.length === 0) return -1;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function makeStrategicMove() {
    const board = gameState.board;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner(board, 'O')) { 
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinner(board, 'X')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    if (board[4] === '') {
        return 4;
    }

    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(corner => board[corner] === '');
    if (emptyCorners.length > 0) {
        return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    const edges = [1, 3, 5, 7];
    const emptyEdges = edges.filter(edge => board[edge] === '');
    if (emptyEdges.length > 0) {
        return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    }

    return -1;
}

function checkWinner(board, player) {
    return gameState.winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function checkGameStatus() {
    for (const combo of gameState.winningCombinations) {
        const [a, b, c] = combo;
        if (
            gameState.board[a] &&
            gameState.board[a] === gameState.board[b] &&
            gameState.board[a] === gameState.board[c]
        ) {
            handleGameWon(gameState.board[a], combo);
            return;
        }
    }

    if (!gameState.board.includes('')) {
        handleGameDraw();
        return;
    }
}

function handleGameWon(player, winningCombo) {
    gameState.gameActive = false;
    gameState.winningLine = winningCombo;

    winningCombo.forEach(index => {
        cells[index].classList.add('winning-cell');
    });

    if (player === 'X') {
        gameState.scores.player++;
        statusMessage.textContent = "You win!";
        playSound('win');
    } else {
        gameState.scores.computer++;
        statusMessage.textContent = "Computer wins!";
        playSound('lose');
    }

    updateScoreDisplay();
    saveGameState();
}

function handleGameDraw() {
    gameState.gameActive = false;
    statusMessage.textContent = "It's a draw!";
    gameState.scores.ties++;

    updateScoreDisplay();
    playSound('tie');
    saveGameState();
}

function updateScoreDisplay() {
    playerScoreElement.textContent = gameState.scores.player;
    computerScoreElement.textContent = gameState.scores.computer;
    tiesScoreElement.textContent = gameState.scores.ties;
}


function resetBoard(userInitiated = false) {
    gameState.board = Array(9).fill('');
    gameState.gameActive = true;
    gameState.currentPlayer = 'X';
    gameState.winningLine = null;
    gameState.movesHistory = [];

    cells.forEach(cell => {
        cell.removeAttribute('data-player');
        cell.classList.remove('winning-cell');
        cell.style.cursor = 'pointer';
    });

    statusMessage.textContent = "Your turn! Place an X on the board.";

    if (userInitiated) {
        saveGameState();
    }
}


function updateUI() {
    gameState.board.forEach((value, index) => {
        if (value) {
            updateCell(index, value);
        }
    });

    updateScoreDisplay();

    if (!gameState.gameActive) {
        if (gameState.winningLine) {
            const winner = gameState.board[gameState.winningLine[0]];
            gameState.winningLine.forEach(index => {
                cells[index].classList.add('winning-cell');
            });

            if (winner === 'X') {
                statusMessage.textContent = "You win!";
            } else {
                statusMessage.textContent = "Computer wins!";
            }
        } else if (!gameState.board.includes('')) {
            statusMessage.textContent = "It's a draw!";
        }
    } else {
        if (gameState.currentPlayer === 'X') {
            statusMessage.textContent = "Your turn! Place an X on the board.";
        } else {
            statusMessage.textContent = "Computer is thinking...";
        }
    }

    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.value = gameState.difficulty;
    }
}

function saveGameState() {
    const state = {
        board: gameState.board,
        scores: gameState.scores,
        gameActive: gameState.gameActive,
        difficulty: gameState.difficulty,
        currentPlayer: gameState.currentPlayer,
        winningLine: gameState.winningLine
    };

    localStorage.setItem('ticTacToeState', JSON.stringify(state));
}

function loadGameState() {
    const savedState = localStorage.getItem('ticTacToeState');

    if (savedState) {
        const state = JSON.parse(savedState);

        gameState.board = state.board;
        gameState.scores = state.scores;
        gameState.gameActive = state.gameActive;
        gameState.difficulty = state.difficulty;
        gameState.currentPlayer = state.currentPlayer;
        gameState.winningLine = state.winningLine;
    }
}

function setupKeyboardNavigation() {
    let currentFocus = 0;
    cells[currentFocus].setAttribute('tabindex', '0');
    cells.forEach((cell, index) => {
        if (index !== currentFocus) {
            cell.setAttribute('tabindex', '-1');
        }
    });

    document.addEventListener('keydown', (event) => {
        let newFocus = currentFocus;

        switch (event.key) {
            case 'ArrowRight':
                newFocus = (currentFocus + 1) % 9;
                break;
            case 'ArrowLeft':
                newFocus = (currentFocus + 8) % 9;
                break;
            case 'ArrowUp':
                newFocus = (currentFocus - 3 + 9) % 9;
                break;
            case 'ArrowDown':
                newFocus = (currentFocus + 3) % 9;
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement === cells[currentFocus]) {
                    cells[currentFocus].click();
                }
                break;
            default:
                return; 
        }

        if (newFocus !== currentFocus) {
            cells[currentFocus].setAttribute('tabindex', '-1');
            cells[newFocus].setAttribute('tabindex', '0');
            cells[newFocus].focus();
            currentFocus = newFocus;
        }
    });
}


function playSound(type) {
    const audioEnabled = localStorage.getItem('ticTacToeAudio') !== 'disabled';
    if (!audioEnabled) return;

    try {
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play().catch(error => {
                console.log("Audio playback error:", error);
            });
        }
    } catch (error) {
        console.log("Audio system error:", error);
    }
}

function setupAudioToggle() {
    const footerElement = document.querySelector('.game-footer');
    const audioToggle = document.createElement('div');
    audioToggle.className = 'audio-toggle';

    const audioEnabled = localStorage.getItem('ticTacToeAudio') !== 'disabled';

    audioToggle.innerHTML =
        `<label class="audio-label">
            <input type="checkbox" id="audio-checkbox" ${audioEnabled ? 'checked' : ''}>
            <span class="audio-text">Audio ${audioEnabled ? 'On' : 'Off'}</span>
        </label>`;

    const audioCheckbox = audioToggle.querySelector('#audio-checkbox');
    const audioText = audioToggle.querySelector('.audio-text');

    audioCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('ticTacToeAudio', 'enabled');
            audioText.textContent = 'Audio On';
            playSound('click');
        } else {
            localStorage.setItem('ticTacToeAudio', 'disabled');
            audioText.textContent = 'Audio Off';
        }
    });


    footerElement.insertBefore(audioToggle, footerElement.firstChild);
}

function setupHighContrastMode() {
    const footerElement = document.querySelector('.game-footer');
    const contrastToggle = document.createElement('div');
    contrastToggle.className = 'contrast-toggle';

    const highContrast = localStorage.getItem('ticTacToeContrast') === 'high';

    contrastToggle.innerHTML =
        `<label class="contrast-label">
            <input type="checkbox" id="contrast-checkbox" ${highContrast ? 'checked' : ''}>
            <span class="contrast-text">High Contrast ${highContrast ? 'On' : 'Off'}</span>
        </label>`;

    const contrastCheckbox = contrastToggle.querySelector('#contrast-checkbox');
    const contrastText = contrastToggle.querySelector('.contrast-text');

    if (highContrast) {
        document.body.classList.add('high-contrast');
    }

    contrastCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('ticTacToeContrast', 'high');
            document.body.classList.add('high-contrast');
            contrastText.textContent = 'High Contrast On';
        } else {
            localStorage.setItem('ticTacToeContrast', 'normal');
            document.body.classList.remove('high-contrast');
            contrastText.textContent = 'High Contrast Off';
        }
    });

    footerElement.insertBefore(contrastToggle, footerElement.firstChild);
}

function setupResponsiveDesign() {
    const handleResize = () => {
        const gameContainer = document.querySelector('.game-container');
        const isMobile = window.innerWidth < 480;

        if (isMobile) {
            gameContainer.classList.add('mobile-view');
        } else {
            gameContainer.classList.remove('mobile-view');
        }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
}

function setupTouchSupport() {
    cells.forEach(cell => {
        cell.addEventListener('touchstart', function (e) {
            e.preventDefault();
        });

        cell.addEventListener('touchend', function (e) {
            e.preventDefault();
            this.click();
        });
    });
}

function setupLoadingScreen() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div><p>Loading game...</p>';
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 500);
    });
}

function setupUndoButton() {
    const controlsSection = document.querySelector('.game-controls');

    const undoButton = document.createElement('button');
    undoButton.id = 'undo-button';
    undoButton.className = 'btn-undo';
    undoButton.textContent = 'Undo Last Move';
    undoButton.disabled = true;

    undoButton.addEventListener('click', () => {
        if (gameState.movesHistory.length > 0) {
            let movesToUndo = gameState.movesHistory.length >= 2 ? 2 : 1;

            while (movesToUndo > 0 && gameState.movesHistory.length > 0) {
                const lastMove = gameState.movesHistory.pop();
                gameState.board[lastMove.cellIndex] = '';

                const cell = cells[lastMove.cellIndex];
                cell.removeAttribute('data-player');
                cell.style.cursor = 'pointer';

                movesToUndo--;
            }

            if (!gameState.gameActive) {
                gameState.gameActive = true;

                if (gameState.winningLine) {
                    gameState.winningLine.forEach(index => {
                        cells[index].classList.remove('winning-cell');
                    });
                    gameState.winningLine = null;
                }
            }

            gameState.currentPlayer = 'X';
            statusMessage.textContent = "Your turn! Place an X on the board.";

            if (gameState.movesHistory.length === 0) {
                undoButton.disabled = true;
            }

            playSound('click');
            saveGameState();
        }
    });

    controlsSection.insertBefore(undoButton, resetButton);

    const observeGameState = () => {
        undoButton.disabled = gameState.movesHistory.length === 0;
    };

    const originalMakeMove = makeMove;
    window.makeMove = function (cellIndex, player) {
        originalMakeMove(cellIndex, player);
        observeGameState();
    };

    const originalResetBoard = resetBoard;
    window.resetBoard = function (userInitiated) {
        originalResetBoard(userInitiated);
        observeGameState();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    setupLoadingScreen();
    setupAudioToggle();
    setupHighContrastMode();
    setupResponsiveDesign();
    setupTouchSupport();
    setupUndoButton();
    initializeGame();
});