let boardSize = 8;
const maxHints = 3;
const moves = [
    { x: 2, y: 1 }, { x: 2, y: -1 },
    { x: -2, y: 1 }, { x: -2, y: -1 },
    { x: 1, y: 2 }, { x: 1, y: -2 },
    { x: -1, y: 2 }, { x: -1, y: -2 }
];

let board = [];
let knightPosition = null;
let moveCount = 0;
let hintCount = maxHints;
let moveHistory = [];
let isGameOver = false;

function initGame(size) {
    boardSize = size;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    knightPosition = null;
    moveCount = 0;
    hintCount = maxHints;
    isGameOver = false;
    moveHistory = [];
    createBoard();
    updateHintButton();
}

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 50px)`;
    boardElement.innerHTML = '';

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => handleCellClick(x, y));
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(x, y) {
    if (isGameOver) return;

    if (!knightPosition) {
        setKnightPosition(x, y);
    } else if (isValidMove(x, y)) {
        makeMove(x, y);
    }
}

function setKnightPosition(x, y) {
    knightPosition = { x, y };
    moveCount = 1;
    board[y][x] = moveCount;
    moveHistory = [{ x, y }];
    updateCell(x, y);
}

function isValidMove(x, y) {
    return moves.some(move =>
        knightPosition.x + move.x === x &&
        knightPosition.y + move.y === y &&
        board[y][x] === null
    );
}

function makeMove(x, y) {
    knightPosition = { x, y };
    moveCount++;
    board[y][x] = moveCount;
    moveHistory.push({ x, y });
    updateCell(x, y);
    checkEndGame();
}

function updateCell(x, y) {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        cell.classList.add('visited');
        cell.textContent = board[y][x];
        if (knightPosition.x === x && knightPosition.y === y) {
            cell.classList.add('knight');
        } else {
            cell.classList.remove('knight');
        }
    }
}

function checkEndGame() {
    if (moveCount === boardSize * boardSize) {
        endGame("Вітаємо! Ваш рахунок: " + moveCount);
    } else if (!getValidMoves(knightPosition.x, knightPosition.y).length) {
        endGame("Гра закінчена. Ходи вичерпані.");
    }
}

function endGame(message) {
    isGameOver = true;
    alert(message);
}

function getValidMoves(x, y) {
    return moves.filter(move =>
        x + move.x >= 0 && x + move.x < boardSize &&
        y + move.y >= 0 && y + move.y < boardSize &&
        board[y + move.y][x + move.x] === null
    );
}

function undoMove() {
    if (moveHistory.length > 1) {
        moveHistory.pop();
        const lastMove = moveHistory[moveHistory.length - 1];
        board[lastMove.y][lastMove.x] = null;
        updateCell(lastMove.x, lastMove.y);
        knightPosition = lastMove;
        moveCount--;
        isGameOver = false;
    }
}

function updateHintButton() {
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.disabled = hintCount <= 0;
}

document.getElementById('hintBtn').addEventListener('click', () => {
    if (hintCount > 0 && !isGameOver) {
        hintCount--;
        updateHintButton();
        getValidMoves(knightPosition.x, knightPosition.y).forEach(move => {
            const cell = document.querySelector(`[data-x="${knightPosition.x + move.x}"][data-y="${knightPosition.y + move.y}"]`);
            cell && cell.classList.add('hint');
        });
    }
});

document.getElementById('undoBtn').addEventListener('click', undoMove);
