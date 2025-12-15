const rows = 10;
const columns = 20;
const mines = 10;
const grid = Array.from({length: columns}, e => Array(rows).fill(0));

function boxClick (event) {
  console.log('click', event.target.id);
  const box = event.target;
  box.classList.remove("hidden");
  const [x, y] = box.id.split("-").map(cord => parseInt(cord));
  console.log(x, y, typeof x, typeof y);
  const text = grid[x][y] == -1 ? "X" : grid[x][y] == 0 ? "" : grid[x][y];
  box.innerHTML = text;
}

function generateBox(col, row) {
  const box = document.createElement("div");
  box.classList.add("box");
  box.classList.add("hidden");
  box.id = `${col}-${row}`
  box.onclick = boxClick;
  return box;
}

function generateColumn(col, rows) {
  const column = document.createElement("div");
  column.classList.add("column");
  for(let i = 0; i < rows; i++) {
    column.appendChild(generateBox(col, i));
  }
  return column;
}

function generateGrid(columns, rows) {
  const grid = document.getElementsByClassName("game")[0];
  for(let i = 0; i < columns; i++) {
    grid.appendChild(generateColumn(i, rows));
  }
}

generateGrid(columns, rows);

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
    console.log(mine_x, mine_y)
    grid[mine_x][mine_y] = -1;
    for (let x = -1; x < 2; x++) {
      console.log("x", x)
      for (let y = -1; y < 2; y++) {
        if (x === 0 && y === 0) break;
        const x_cord = mine_x + x;
        const y_cord = mine_y + y;
        if (x_cord < 0 || x_cord >= columns) break;
        if (y_cord < 0 || y_cord >= rows) break;
        if (grid[x_cord][y_cord] === -1) break;
        console.log("wiii")
        grid[x_cord][y_cord] += 1;
      }
    }
  }
}

generateMines(mines, columns, rows);
console.log(grid);
// grid[0][0] = 1;
// grid[10][3] = 1;


// grid = [n,m]   // initialize all cells to 0
// for k = 1 to number_of_mines
//    get random mine_x and mine_y where grid(mine_x, mine_y) is not a mine
//    for x = -1 to 1
//       for y = -1 to 1
//          if x = 0 and y = 0 then
//             grid[mine_x, mine_y] = -number_of_mines  // negative value = mine
//          else 
//             increment grid[mine_x + x, mine_y + y] by 1
