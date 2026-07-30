export default function MinesweeperCell({ cell, index, onLeftClick, onRightClick }) {
  const cellClassName = cell.wasClicked
    ? "minesweeperCell minesweeperCellClicked"
    : "minesweeperCell";

  return (
    <div
      className={cellClassName}
      onClick={() => onLeftClick(index)}
      onContextMenu={(e) => onRightClick(e, index)}
    >
      {cell.isFlagged ? (
        <img src="./flag.svg" alt="flag" className="flagImage" />
      ) : null}
    </div>
  );
}
