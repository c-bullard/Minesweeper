import "./App.css";
import { useState } from "react";
import MinesweeperCell from "./MinesweeperCell";

// Grid size and amount of mines per difficulty
const difficulty = {
  easy: { grid: 100, mines: 10 },
  medium: { grid: 256, mines: 40 },
  hard: { grid: 480, mines: 99 },
};

// Looks up the difficulty level that matches a given grid size
function getDifficultyByGridSize(gridSize) {
  if (gridSize === difficulty.easy.grid) {
    return difficulty.easy;
  }
  if (gridSize === difficulty.medium.grid) {
    return difficulty.medium;
  }
  if (gridSize === difficulty.hard.grid) {
    return difficulty.hard;
  }
}

// Creates starting cells and then places mines on random cell indices
function createCells(difficultyLevel) {
  const { grid, mines } = difficultyLevel;

  const newCells = [];
  for (let i = 0; i < grid; i++) {
    newCells.push({
      wasClicked: false,
      isBomb: false,
      adjacentBombCount: 0,
      isFlagged: false,
    });
  }

  const mineCount = Math.floor(Math.random() * mines) + 1;
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const randomIndex = Math.floor(Math.random() * grid);
    if (!newCells[randomIndex].isBomb) {
      newCells[randomIndex].isBomb = true;
      minesPlaced++;
    }
  }

  return newCells;
}

export default function MinesweeperBoard() {
  const [gridSize, setGridSize] = useState(difficulty.easy.grid);
  const [cells, setCells] = useState(createCells(difficulty.easy));

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

  const gridClassName =
    gridSize === difficulty.easy.grid
      ? "minesweeperGridEasy"
      : gridSize === difficulty.medium.grid
        ? "minesweeperGridMedium"
        : "minesweeperGridHard";

  return (
    <div>
      <select onChange={difficultyChange} defaultValue={difficulty.easy.grid}>
        <option value={difficulty.easy.grid}>Beginner</option>
        <option value={difficulty.medium.grid}>Intermediate</option>
        <option value={difficulty.hard.grid}>Expert</option>
      </select>

      <div className={gridClassName}>
        {cells.map((cell, index) => (
          <MinesweeperCell
            key={index}
            cell={cell}
            index={index}
            onRightClick={handleRightClick}
          />
        ))}
      </div>
    </div>
  );
}
