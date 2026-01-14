const rows = 10;
const columns = 20;
const mines = 60;
const grid = Array.from({length: columns}, e => Array(rows).fill(0));
const gridStatus = Array.from({length: columns}, e => Array(rows).fill(0));

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
      console.log("haha lose");
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
  console.log("set up")
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const x_cord = col + x;
      const y_cord = row + y;
      if (x_cord < 0 || x_cord >= columns) continue;
      if (y_cord < 0 || y_cord >= rows) continue;
      // if (grid[x_cord][y_cord] === -1) continue;
      const secondBox = document.getElementById(`${x_cord}-${y_cord}`);
      console.log("checking second box flag", secondBox);

      if (secondBox.classList.contains("flag")) {
        cantFlags++;
        console.log("cantfalgs++")
      }
    }
  }

  console.log("cantfalgs", cantFlags)

  if (cantFlags == grid[col][row]) {
    console.log("flags match")
    for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const x_cord = col + x;
      const y_cord = row + y;
      if (x_cord < 0 || x_cord >= columns) continue;
      if (y_cord < 0 || y_cord >= rows) continue;
      // if (grid[x_cord][y_cord] === -1) continue;
      const secondBox = document.getElementById(`${x_cord}-${y_cord}`);
      console.log("checking second box", secondBox);
      if (secondBox.classList.contains("hidden")) {
        console.log("clicked")
        showBoxText(secondBox, x_cord, y_cord);
      }
    }
  }
  }
}

// Handle logic for right click
function boxClick (event) {
  const box = event.target;
  const [x, y] = box.id.split("-").map(cord => parseInt(cord));
  if (box.classList.contains("hidden")) {
    clearBox(x, y);
  } else if (box.classList.contains("clicked")) {
    console.log("show around")
    showAround(x, y);
  }

  // box.classList.remove("hidden");
  // console.log(x, y, typeof x, typeof y);
  // const text = grid[x][y] == -1 ? "X" : grid[x][y] == 0 ? "" : grid[x][y];
  // box.innerHTML = text;
}

// Handle logic for left click
function boxLeftClick (event) {
  event.preventDefault();
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
  console.log("starting game");
  generateGrid(columns, rows);
  generateMines(mines, columns, rows);
}

startGame();

// generateMines(mines, columns, rows);
console.log(grid);
// grid[0][0] = 1;
// grid[10][3] = 1;

window.addEventListener('load', (event) => {
  const button = document.getElementsByTagName("button")[0];
  console.log(button);
  button.onclick = startGame;
  // Code to execute after full page load
});

// grid = [n,m]   // initialize all cells to 0
// for k = 1 to number_of_mines
//    get random mine_x and mine_y where grid(mine_x, mine_y) is not a mine
//    for x = -1 to 1
//       for y = -1 to 1
//          if x = 0 and y = 0 then
//             grid[mine_x, mine_y] = -number_of_mines  // negative value = mine
//          else 
//             increment grid[mine_x + x, mine_y + y] by 1
