export default function MinesweeperCell({
  cell,
  index,
  onLeftClick,
  onRightClick,
}) {
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
      {cell.wasClicked && cell.isBomb ? (
        <img src="./mine.svg" alt="bomb" className="bombImage" />
      ) : null}
      {cell.wasClicked && !cell.isBomb && cell.adjacentBombCount > 0 ? (
        <div className="adjacentBombCount">{cell.adjacentBombCount}</div>
      ) : null}
    </div>
  );
}
