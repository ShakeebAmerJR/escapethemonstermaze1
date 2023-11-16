document.addEventListener('DOMContentLoaded', function () {
  const maze = document.getElementById('maze');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const gameOverMessage = document.getElementById('gameOverMessage');
  const retryButton = document.getElementById('retryButton');
  const cells = [];
  let monsterIndex;

  const rows = 15;
  const cols = 15;
  const respawnChance = 0.1; // Adjust this value as needed

  // Create maze cells
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cells.push(cell);
      maze.appendChild(cell);

      // Add obstacles
      if (Math.random() < 0.2) {
        cell.classList.add('obstacle');
      }

      // Set monster position
      if (Math.random() < 0.05 && !cell.classList.contains('obstacle') && !cell.classList.contains('start') && !cell.classList.contains('end')) {
        monsterIndex = i * cols + j;
        cell.classList.add('monster');
      }
    }
  }

  // Set start and end points
  cells[0].classList.add('start');
  cells[cells.length - 1].classList.add('end');

  let currentPlayerIndex = 0;

  document.addEventListener('keydown', function (event) {
    handleKeyPress(event.key);
  });

  retryButton.addEventListener('click', function () {
    resetGame();
  });

  function handleKeyPress(key) {
    const currentCell = cells[currentPlayerIndex];

    // Remove player from current cell
    currentCell.classList.remove('player');

    // Calculate new player index based on key press
    switch (key) {
      case 'ArrowUp':
        if (currentPlayerIndex - cols >= 0 && !cells[currentPlayerIndex - cols].classList.contains('obstacle')) {
          currentPlayerIndex -= cols;
        }
        break;
      case 'ArrowDown':
        if (currentPlayerIndex + cols < cells.length && !cells[currentPlayerIndex + cols].classList.contains('obstacle')) {
          currentPlayerIndex += cols;
        }
        break;
      case 'ArrowLeft':
        if (currentPlayerIndex % cols !== 0 && !cells[currentPlayerIndex - 1].classList.contains('obstacle')) {
          currentPlayerIndex -= 1;
        }
        break;
      case 'ArrowRight':
        if (currentPlayerIndex % cols !== cols - 1 && !cells[currentPlayerIndex + 1].classList.contains('obstacle')) {
          currentPlayerIndex += 1;
        }
        break;
    }

    const newCell = cells[currentPlayerIndex];

    // Check for collision with monster
    if (newCell.classList.contains('monster')) {
      showGameOverScreen('Game Over! The monster caught you.');
      return;
    }

    // Check for reaching the finish line
    if (newCell.classList.contains('end')) {
      showGameOverScreen('Congratulations! You reached the end of the challenging maze.');
      return;
    }

    // Add player to new cell
    newCell.classList.add('player');

    // Move monster towards the player
    moveMonsterTowardsPlayer();

    // Check if the monster should respawn
    if (Math.random() < respawnChance) {
      respawnMonster();
    }
  }

  function resetGame() {
    currentPlayerIndex = 0;
    cells.forEach(cell => cell.classList.remove('player', 'monster'));
    cells[0].classList.add('player');
    cells[monsterIndex].classList.add('monster');
    hideGameOverScreen();
  }

  function showGameOverScreen(message) {
    gameOverMessage.textContent = message;
    gameOverScreen.classList.remove('hidden');
  }

  function hideGameOverScreen() {
    gameOverScreen.classList.add('hidden');
  }

  function moveMonsterTowardsPlayer() {
    // Calculate monster position
    const monsterRow = Math.floor(monsterIndex / cols);
    const monsterCol = monsterIndex % cols;

    // Calculate player position
    const playerRow = Math.floor(currentPlayerIndex / cols);
    const playerCol = currentPlayerIndex % cols;

    // Calculate the direction to move towards the player
    const rowDiff = playerRow - monsterRow;
    const colDiff = playerCol - monsterCol;

    // Determine the next position for the monster
    let nextMonsterRow = monsterRow + Math.sign(rowDiff);
    let nextMonsterCol = monsterCol + Math.sign(colDiff);

    // Check for obstacles
    const nextMonsterIndex = nextMonsterRow * cols + nextMonsterCol;
    const nextMonsterCell = cells[nextMonsterIndex];

    if (!nextMonsterCell.classList.contains('obstacle')) {
      // Move the monster
      cells[monsterIndex].classList.remove('monster');
      monsterIndex = nextMonsterIndex;
      cells[monsterIndex].classList.add('monster');
    }
  }

  function respawnMonster() {
    // Find a random empty cell near the finish line for respawn
    let respawnCellIndex;
    do {
      respawnCellIndex = Math.floor(Math.random() * (rows * cols));
    } while (cells[respawnCellIndex].classList.contains('obstacle') || cells[respawnCellIndex].classList.contains('start') || cells[respawnCellIndex].classList.contains('monster') || cells[respawnCellIndex].classList.contains('end'));

    // Respawn the monster
    cells[monsterIndex].classList.remove('monster');
    monsterIndex = respawnCellIndex;
    cells[monsterIndex].classList.add('monster');
  }
});
