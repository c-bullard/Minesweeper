import "./App.css";
import { useState } from "react";

const difficulty = {
  easy: 100,
  medium: 256,
  hard: 480,
};

export default function MinesweeperBoard() {
  const [gridSize, setGridSize] = useState(difficulty.easy);
  // const [cells, setCells] = useState(() =>
  //   Array.from({ length: gridSize }, () => ({
  //     wasClicked: false,
  //     isBomb: false,
  //     adjacentBombCount: 0,
  //   })),
  // );

  return (
    <div>
      <select
        onChange={(e) => setGridSize(Number(e.target.value))}
        defaultValue={difficulty.easy}
      >
        <option value={difficulty.easy}>Beginner</option>
        <option value={difficulty.medium}>Intermediate</option>
        <option value={difficulty.hard}>Expert</option>
      </select>
      <div
        className={
          gridSize == difficulty.easy
            ? "minesweeperGridEasy"
            : gridSize == difficulty.medium
              ? "minesweeperGridMedium"
              : "minesweeperGridHard"
        }
      >
        {Array.from({ length: gridSize }, (number) => (
          <div key={number} className="minesweeperCell" />
        ))}
      </div>
    </div>
  );
}
