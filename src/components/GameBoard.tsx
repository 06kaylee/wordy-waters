import { board } from "../data/puzzleData";
import Cell from "./Cell";
import type { CellState, GameAction, GameStatus } from "../game/gameTypes";
import { isGameOver } from "../game/gameSelectors";

interface GameBoardProps {
	dispatch: React.Dispatch<GameAction>;
	cellStates: CellState[][];
	gameStatus: GameStatus;
}

function GameBoard({ dispatch, cellStates, gameStatus }: GameBoardProps) {
	return (
		<div className="grid grid-cols-5 gap-2 aspect-square w-full">
			{board.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					const gameOverCellState: CellState = board[rowIndex][colIndex]
						? "revealed"
						: "empty";
					return (
						<Cell
							key={`cell-${rowIndex}-${colIndex}`}
							value={cell}
							onCellClick={() =>
								dispatch({
									type: "CELL_CLICKED",
									payload: { row: rowIndex, col: colIndex },
								})
							}
							cellState={
								isGameOver(gameStatus)
									? gameOverCellState
									: cellStates[rowIndex][colIndex]
							}
						/>
					);
				}),
			)}
		</div>
	);
}

export default GameBoard;
