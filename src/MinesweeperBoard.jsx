import "./App.css";
import { useState } from "react";
import MinesweeperCell from "./MinesweeperCell";

// Amount of mines and row/column counts per difficulty
const difficulty = {
  beginner: { mines: 10, rows: 10, columns: 10 },
  intermediate: { mines: 40, rows: 16, columns: 16 },
  expert: { mines: 99, rows: 16, columns: 30 },
};

// Total number of cells for a difficulty level
function getGridSize(difficultyLevel) {
  return difficultyLevel.rows * difficultyLevel.columns;
}

// Returns the indices of the 8 squares around selection
function getNeighborIndexes(index, rows, columns) {
  const row = Math.floor(index / columns);
  const col = index % columns;

  const neighborIndexes = [];
  for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
    for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {
      if (!(rowDirection === 0 && columnDirection === 0)) {
        const neighborRow = row + rowDirection;
        const neighborCol = col + columnDirection;

        if (neighborRow >= 0 && neighborRow < rows) {
          if (neighborCol >= 0 && neighborCol < columns) {
            neighborIndexes.push(neighborRow * columns + neighborCol);
          }
        }
      }
    }
  }

  return neighborIndexes;
}

// Counts how many of cell[index]'s 8 neighbors are bombs
function countAdjacentBombs(cellsToCheck, index, rows, columns) {
  const neighborIndexes = getNeighborIndexes(index, rows, columns);

  let bombCount = 0;
  for (let i = 0; i < neighborIndexes.length; i++) {
    if (cellsToCheck[neighborIndexes[i]].isBomb) {
      bombCount++;
    }
  }

  return bombCount;
}

// Creates starting cells, places mines on random cell indices, then counts each cell's adjacent bombs
function createCells(difficultyLevel) {
  const { mines, rows, columns } = difficultyLevel;
  const grid = getGridSize(difficultyLevel);

  const newCells = [];
  for (let i = 0; i < grid; i++) {
    newCells.push({
      wasClicked: false,
      isBomb: false,
      adjacentBombCount: 0,
      isFlagged: false,
    });
  }

  const mineCount = mines;
  const bombIndexes = [];
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const randomIndex = Math.floor(Math.random() * grid);
    if (!newCells[randomIndex].isBomb) {
      newCells[randomIndex].isBomb = true;
      bombIndexes.push(randomIndex);
      minesPlaced++;
    }
  }

  console.log("Bombs placed at indexes:", bombIndexes);

  for (let i = 0; i < grid; i++) {
    if (!newCells[i].isBomb) {
      newCells[i].adjacentBombCount = countAdjacentBombs(
        newCells,
        i,
        rows,
        columns,
      );
    }
  }

  return newCells;
}

export default function MinesweeperBoard() {
  const [gridSize, setGridSize] = useState(getGridSize(difficulty.beginner));
  const [cells, setCells] = useState(function () {
    return createCells(difficulty.beginner);
  });

  // Updates the grid size and recreates cells with new mines when difficulty changes
  const difficultyChange = (e) => {
    const selectedDifficulty = difficulty[e.target.value];
    setGridSize(getGridSize(selectedDifficulty));
    setCells(createCells(selectedDifficulty));
    console.log(e.target.value);
  };

  // Updates the isFlagged key for cell[index] on right click
  const handleRightClick = (e, index) => {
    e.preventDefault();
    console.log("Flag placed at cell:", index);

    const newCells = [];
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      if (i === index) {
        const updatedCell = {
          wasClicked: cell.wasClicked,
          isBomb: cell.isBomb,
          adjacentBombCount: cell.adjacentBombCount,
          isFlagged: !cell.isFlagged,
        };
        newCells.push(updatedCell);
      } else {
        newCells.push(cell);
      }
    }

    setCells(newCells);
  };

  // Sets wasClicked to true for cell[index] on left click, unless it's flagged.
  // If the clicked cell is a bomb, reveals every bomb on the board.
  const handleLeftClick = (index) => {
    console.log("Selected cell:", index);

    const clickedCell = cells[index];
    if (clickedCell.isFlagged) {
      return;
    }

    const gameOver = clickedCell.isBomb;

    const newCells = [];
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      if (i === index || (gameOver && cell.isBomb)) {
        const updatedCell = {
          wasClicked: true,
          isBomb: cell.isBomb,
          adjacentBombCount: cell.adjacentBombCount,
          isFlagged: cell.isFlagged,
        };
        newCells.push(updatedCell);
      } else {
        newCells.push(cell);
      }
    }

    setCells(newCells);

    if (gameOver) {
      alert("Game over!");
    }
  };

  const gridClassName =
    gridSize === getGridSize(difficulty.beginner)
      ? "minesweeperGridBeginner"
      : gridSize === getGridSize(difficulty.intermediate)
        ? "minesweeperGridIntermediate"
        : "minesweeperGridExpert";

  return (
    <>
      <div>
        <h1>Minesweeper</h1>
      </div>
      <div className={gridClassName}>
        {cells.map((cell, index) => (
          <MinesweeperCell
            key={index}
            cell={cell}
            index={index}
            onLeftClick={handleLeftClick}
            onRightClick={handleRightClick}
          />
        ))}
      </div>
      <div className="selectDifficulty">
        <label>Select a difficulty: </label>
        <select onChange={difficultyChange} defaultValue="beginner">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div className="resetButton">
        <button type="button" onClick={() => window.location.reload()}>
          Reset
        </button>
      </div>
    </>
  );
}
