console.log("hola")

const rows = 10;
const columns = 20;


function generateBox(col, row) {
  const box = document.createElement("div");
  box.innerHTML = "1";
  box.classList.add("box");
  box.id = `${col}-${row}`
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
  console.log(grid);
  for(let i = 0; i < columns; i++) {
    grid.appendChild(generateColumn(i, rows));
  }
}

generateGrid(columns, rows);
