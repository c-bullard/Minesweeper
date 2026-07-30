import "./App.css";
import { useState } from "react";
import MinesweeperCell from "./MinesweeperCell";

// Amount of mines and row/column counts per difficulty
const difficulty = {
  easy: { mines: 10, rows: 10, columns: 10 },
  medium: { mines: 40, rows: 16, columns: 16 },
  hard: { mines: 99, rows: 16, columns: 30 },
};

// Total number of cells for a difficulty level
function getGridSize(difficultyLevel) {
  return difficultyLevel.rows * difficultyLevel.columns;
}

// Looks up the difficulty level that matches a given grid size
function getDifficultyByGridSize(gridSize) {
  if (gridSize === getGridSize(difficulty.easy)) {
    return difficulty.easy;
  }
  if (gridSize === getGridSize(difficulty.medium)) {
    return difficulty.medium;
  }
  if (gridSize === getGridSize(difficulty.hard)) {
    return difficulty.hard;
  }
}

// Counts how many of cell[index]'s 8 neighbors are bombs
function countAdjacentBombs(cellsToCheck, index, rows, columns) {
  const row = Math.floor(index / columns);
  const col = index % columns;

  let bombCount = 0;
  for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
    for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {
      if (!(rowDirection === 0 && columnDirection === 0)) {
        const neighborRow = row + rowDirection;
        const neighborCol = col + columnDirection;

        if (neighborRow >= 0 && neighborRow < rows) {
          if (neighborCol >= 0 && neighborCol < columns) {
            const neighborIndex = neighborRow * columns + neighborCol;
            if (cellsToCheck[neighborIndex].isBomb) {
              bombCount++;
            }
          }
        }
      }
    }
  }

  return bombCount;
}

// Creates starting cells, places mines on random cell indices, then counts
// each cell's adjacent bombs
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
  const [gridSize, setGridSize] = useState(getGridSize(difficulty.easy));
  const [cells, setCells] = useState(function () {
    return createCells(difficulty.easy);
  });

  // Updates the grid size and recreates cells with new mines when difficulty changes
  const difficultyChange = (e) => {
    const newSize = Number(e.target.value);
    const selectedDifficulty = getDifficultyByGridSize(newSize);
    setGridSize(newSize);
    setCells(createCells(selectedDifficulty));
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
    gridSize === getGridSize(difficulty.easy)
      ? "minesweeperGridEasy"
      : gridSize === getGridSize(difficulty.medium)
        ? "minesweeperGridMedium"
        : "minesweeperGridHard";

  return (
    <div>
      <select
        onChange={difficultyChange}
        defaultValue={getGridSize(difficulty.easy)}
      >
        <option value={getGridSize(difficulty.easy)}>Beginner</option>
        <option value={getGridSize(difficulty.medium)}>Intermediate</option>
        <option value={getGridSize(difficulty.hard)}>Expert</option>
      </select>

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
    </div>
  );
}
