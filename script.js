document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const restartButton = document.getElementById('restart');
    const computerModeButton = document.getElementById('computer-mode');
    const resultDiv = document.getElementById('result');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameWon = false;
    let isComputerMode = true; // Set computer mode to true by default
    let winningCombination = [];

    function checkWinner() {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameWon = true;
                winningCombination = combination;
                break;
            }
        }

        if (gameWon) {
            resultDiv.innerText = `${currentPlayer} wins!`;
        } else if (!gameBoard.includes('')) {
            resultDiv.innerText = "It's a draw!";
        }
    }

    function checkWinningMove(player) {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (
                gameBoard[a] === player && 
                gameBoard[b] === player && 
                gameBoard[c] === ''
            ) {
                return c;
            } else if (
                gameBoard[a] === player && 
                gameBoard[c] === player && 
                gameBoard[b] === ''
            ) {
                return b;
            } else if (
                gameBoard[b] === player && 
                gameBoard[c] === player && 
                gameBoard[a] === ''
            ) {
                return a;
            }
        }

        return -1;
    }

    function makeComputerMove() {
        const winningMove = checkWinningMove('O');
        if (winningMove !== -1) {
            makeMove(winningMove);
            return;
        }

        const playerBlockingMove = checkWinningMove('X');
        if (playerBlockingMove !== -1) {
            makeMove(playerBlockingMove);
            return;
        }

        const center = 4;
        if (gameBoard[center] === '') {
            makeMove(center);
            return;
        }

        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter((corner) => gameBoard[corner] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            makeMove(randomCorner);
            return;
        }

        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter((side) => gameBoard[side] === '');
        if (availableSides.length > 0) {
            const randomSide = availableSides[Math.floor(Math.random() * availableSides.length)];
            makeMove(randomSide);
            return;
        }
    }

    function makeMove(index) {
        setTimeout(() => {
            gameBoard[index] = currentPlayer;
            cells[index].innerText = currentPlayer;
            checkWinner();

            if (gameWon) {
                showWinningLine(winningCombination);
                resultDiv.innerText = `${currentPlayer} wins!`;
            } else if (!gameBoard.includes('')) {
                resultDiv.innerText = "It's a draw!";
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (isComputerMode && currentPlayer === 'O' && !gameWon) {
                makeComputerMove();
            }
        }, 500);
    }

    function handleCellClick(index) {
        if (!gameWon && gameBoard[index] === '') {
            gameBoard[index] = currentPlayer;
            cells[index].innerText = currentPlayer;
            checkWinner();

            if (gameWon) {
                showWinningLine(winningCombination);
                resultDiv.innerText = `${currentPlayer} wins!`;
            } else if (!gameBoard.includes('')) {
                resultDiv.innerText = "It's a draw!";
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (isComputerMode && currentPlayer === 'O' && !gameWon) {
                makeComputerMove();
            }
        }
    }

    function showWinningLine(combination) {
        combination.forEach(index => {
            cells[index].classList.add('line');
        });
    }

    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameWon = false;
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('line'); // Clear the winning line highlight
        });
        resultDiv.innerText = '';
    }

    function toggleComputerMode() {
        isComputerMode = !isComputerMode;
        restartGame();
        if (isComputerMode) {
            computerModeButton.innerHTML = '<i class="fas fa-desktop"></i>';
        } else {
            computerModeButton.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // Replace the text content of the mode button with the Font Awesome icon
    computerModeButton.innerHTML = '<i class="fas fa-desktop"></i>';

    // Toggle computer mode to set the initial state
    toggleComputerMode();

    // Event listeners
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    restartButton.addEventListener('click', restartGame);
    computerModeButton.addEventListener('click', toggleComputerMode);
});
