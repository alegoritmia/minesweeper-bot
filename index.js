let rows = 0;
let columns = 0;
let mines = 0;
let grid;
let gameLost = false;
let gameText;
let difficulty = "beginner";

const dificulties = {
  beginner: { rows: 9, columns: 9, mines: 10 },
  intermediate: { rows: 16, columns: 16, mines: 40 },
  expert: { rows: 16, columns: 30, mines: 99 },
}

function showGameLost() {
  console.log('game lost');
  gameText.innerHTML = "You lost :(";
  gameText.style.display = "block";
}

function gameWon() {
  gameLost = true;
  gameText.innerHTML = "You win :)";
  gameText.style.display = "block";
}

// Show text of cell
function showBoxText(box, col, row) {
  const text = grid[col][row] == -1 ? "X" : grid[col][row] == 0 ? "" : grid[col][row];
  box.innerHTML = text;
  box.classList.remove("hidden");
  box.classList.add("clicked");
}

// Show text of cell and surrounding cells
function clearBox(col, row) {
  const box = document.getElementById(`${col}-${row}`);
  const text = grid[col][row] == -1 ? "X" : grid[col][row] == 0 ? "" : grid[col][row];
  box.innerHTML = text;
  if (box.classList.contains("hidden")) {
    box.classList.remove("hidden");
    box.classList.add("clicked");
    if (grid[col][row] === -1) {
      gameLost = true;
      showGameLost();
    } else if (grid[col][row] === 0) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue;
          const x_cord = col + x;
          const y_cord = row + y;
          if (x_cord < 0 || x_cord >= columns) continue;
          if (y_cord < 0 || y_cord >= rows) continue;
          if (grid[x_cord][y_cord] === -1) continue;
          clearBox(x_cord, y_cord)
        }
      }
    }
  }
}

// Unhide surroinding cells when flags around cell are met
function showAround(col, row) {
  const box = document.getElementById(`${col}-${row}`);
  let cantFlags = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const x_cord = col + x;
      const y_cord = row + y;
      if (x_cord < 0 || x_cord >= columns) continue;
      if (y_cord < 0 || y_cord >= rows) continue;
      const secondBox = document.getElementById(`${x_cord}-${y_cord}`);

      if (secondBox.classList.contains("flag")) {
        cantFlags++;
      }
    }
  }

  if (cantFlags == grid[col][row]) {
    for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const x_cord = col + x;
      const y_cord = row + y;
      if (x_cord < 0 || x_cord >= columns) continue;
      if (y_cord < 0 || y_cord >= rows) continue;
      const secondBox = document.getElementById(`${x_cord}-${y_cord}`);
      if (secondBox.classList.contains("hidden")) {
        clearBox(x_cord, y_cord);
      }
    }
  }
  }
}

// Handle logic for right click
function boxClick (event) {
  if (gameLost) {
    return;
  }
  const box = event.target;
  const [x, y] = box.id.split("-").map(cord => parseInt(cord));
  if (box.classList.contains("hidden")) {
    clearBox(x, y);
    
  } else if (box.classList.contains("clicked")) {
    showAround(x, y);
  }

  const hidden = document.getElementsByClassName("hidden");
  const flags = document.getElementsByClassName("flag");
  console.log("hidden", hidden.length)
  if (hidden.length + flags.length === mines) {
    gameWon();
  }
}

// Handle logic for left click
function boxLeftClick (event) {
  event.preventDefault();
  if (gameLost) {
    return;
  }
  const box = event.target;
  if (box.classList.contains("hidden")) {
    const [x, y] = box.id.split("-").map(cord => parseInt(cord));
    box.classList.remove("hidden");
    box.classList.add("flag");
  } else if (box.classList.contains("flag")) {
    box.classList.remove("flag");
    box.classList.add("hidden");
  }
}

// Generate singular box in grid
function generateBox(col, row) {
  const box = document.createElement("div");
  box.classList.add("box");
  box.classList.add("hidden");
  box.id = `${col}-${row}`
  box.onclick = boxClick;
  box.oncontextmenu = boxLeftClick;
  return box;
}

// Generate column of boxes in grid
function generateColumn(col, rows) {
  const column = document.createElement("div");
  column.classList.add("column");
  for(let i = 0; i < rows; i++) {
    column.appendChild(generateBox(col, i));
  }
  return column;
}

// Generate whole grid
function generateGrid(columns, rows) {
  const grid = document.getElementsByClassName("game")[0];
  grid.innerHTML = '';
  for(let i = 0; i < columns; i++) {
    grid.appendChild(generateColumn(i, rows));
  }
}

// generateGrid(columns, rows);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateMines(mines, columns, rows) {
  for (let i = 1; i <= mines; i++) {
    let mine_x = -1, mine_y = -1;
    do {
      mine_x = getRandomInt(columns);
      mine_y = getRandomInt(rows);
    } while(grid[mine_x][mine_y] == -1);
    grid[mine_x][mine_y] = -1;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        const x_cord = mine_x + x;
        const y_cord = mine_y + y;
        if (x_cord < 0 || x_cord >= columns) continue;
        if (y_cord < 0 || y_cord >= rows) continue;
        if (grid[x_cord][y_cord] === -1) continue;
        grid[x_cord][y_cord] += 1;
      }
    }
  }
}

function startGame() {
  text.innerHTML = '';
  text.style.display = "none";
  gameLost = false;
  rows = dificulties[difficulty].rows;
  columns = dificulties[difficulty].columns;
  mines = dificulties[difficulty].mines;
  grid = Array.from({length: columns}, e => Array(rows).fill(0))
  generateGrid(columns, rows);
  generateMines(mines, columns, rows);
  // console.log("start game", grid)
}

function changeDifficulty(diff) {
  difficulty = diff;
  startGame();
}

startGame();

window.addEventListener('load', (event) => {
  const button = document.getElementById("restart");
  button.onclick = startGame;
  gameText = document.getElementById("text");

  const beginner = document.getElementById("beginner");
  const intermediate = document.getElementById("intermediate");
  const expert = document.getElementById("expert");
  beginner.onclick = () => changeDifficulty("beginner");
  intermediate.onclick = () => changeDifficulty("intermediate");
  expert.onclick = () => changeDifficulty("expert");

});