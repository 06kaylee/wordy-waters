import { board, getWordCells, wordOwners, WORDS } from "../data/puzzleData";
import Cell from "./Cell";
import type { CellState, GameAction } from "./GameArea/gameReducer";

interface GameBoardProps {
	dispatch: React.Dispatch<GameAction>;
	cellStates: CellState[][];
}

function GameBoard({ dispatch, cellStates }: GameBoardProps) {
	const word = WORDS[1];
	console.log(getWordCells(word));
	console.log(wordOwners);
	return (
		<div className="grid grid-cols-5 gap-2 aspect-square w-full">
			{board.map((row, rowIndex) =>
				row.map((cell, colIndex) => (
					<Cell
						key={`cell-${rowIndex}-${colIndex}`}
						value={cell}
						onCellClick={() =>
							dispatch({
								type: "CELL_CLICKED",
								payload: { row: rowIndex, col: colIndex },
							})
						}
						cellState={cellStates[rowIndex][colIndex]}
					/>
				)),
			)}
		</div>
	);
}

export default GameBoard;
