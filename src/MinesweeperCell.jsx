export default function MinesweeperCell({ cell, index, onRightClick }) {
  return (
    <div
      className="minesweeperCell"
      onContextMenu={(e) => onRightClick(e, index)}
    >
      {cell.isFlagged ? (
        <img src="./flag.svg" alt="flag" className="flagImage" />
      ) : null}
    </div>
  );
}
