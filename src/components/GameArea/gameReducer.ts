import {
	getWordCells,
	getWordDataByName,
	wordOwners,
	WORDS,
	type WordCell,
} from "../../data/puzzleData";

export type CellState = "hidden" | "discovered" | "revealed" | "empty";

export type WordState = {
	isGuessedCorrectly: boolean;
};

export type GameState = {
	cellStates: CellState[][];
	wordStates: Record<string, WordState>;
	movesUsed: number;
	activeWord: string | null;
};

export const initialGameState: GameState = {
	cellStates: Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => "hidden"),
	),
	wordStates: Object.fromEntries(
		WORDS.map((wordData) => [wordData.word, { isGuessedCorrectly: false }]),
	),
	movesUsed: 0,
	activeWord: null,
};

export type GameAction =
	| { type: "CELL_CLICKED"; payload: { row: number; col: number } }
	| { type: "GUESS_SUBMITTED"; payload: { guess: string } };

function setCellStates(
	cellStates: CellState[][],
	newCellState: CellState,
	cells: WordCell[],
): CellState[][] {
	return cellStates.map((row, rowIndex) =>
		row.map((cell, colIndex) =>
			cells.some((cell) => cell.row === rowIndex && cell.col === colIndex)
				? newCellState
				: cell,
		),
	);
}

export function gameReducer(state: GameState, action: GameAction) {
	switch (action.type) {
		case "CELL_CLICKED": {
			const cellState =
				state.cellStates[action.payload.row][action.payload.col];
			if (cellState === "hidden") {
				const wordAtCell = wordOwners[action.payload.row][action.payload.col];

				const newCellState = wordAtCell ? "discovered" : "empty";
				const newCellStates = setCellStates(state.cellStates, newCellState, [
					{ row: action.payload.row, col: action.payload.col },
				]);

				return {
					...state,
					cellStates: newCellStates,
					movesUsed: state.movesUsed + 1,
					activeWord: wordAtCell,
				};
			} else if (cellState === "discovered") {
				const wordAtCell = wordOwners[action.payload.row][action.payload.col];

				return {
					...state,
					activeWord: wordAtCell,
				};
			}
			return state;
		}
		case "GUESS_SUBMITTED": {
			if (!state.activeWord) return state;
			const isGuessedCorrectly = action.payload.guess === state.activeWord;
			const wordData = getWordDataByName(state.activeWord);
			if (!wordData) return state;
			const wordCells = getWordCells(wordData);
			// guessed correctly -> set cell state to revealed. all cell states of the word?
			// guessed correctly -> word state's isGuessedCorrectly needs to be true
			console.log(state);
			console.log(action);
			return {
				...state,
				movesUsed: isGuessedCorrectly ? state.movesUsed : state.movesUsed + 2,
				wordStates: {
					...state.wordStates,
					[state.activeWord]: {
						isGuessedCorrectly,
					},
				},
				cellStates: isGuessedCorrectly
					? setCellStates(state.cellStates, "revealed", wordCells)
					: state.cellStates,
			};
		}
		default: {
			return state;
		}
	}
}
