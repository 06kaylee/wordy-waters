import { WORDS } from "../../data/puzzleData";

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

function getWordAtCell(row: number, col: number): string | null {
	// loop through WORDS
	for (const wordData of WORDS) {
		const { direction, startCol, startRow, word } = wordData;
		// for each word, loop through its cells
		for (let i = 0; i < word.length; i++) {
			let currentRow: number = startRow;
			let currentCol: number = startCol;
			if (direction === "vertical") {
				// row increases, col stays the same
				currentRow += i;
			} else if (direction === "horizontal") {
				// row stays the same, col increases
				currentCol += i;
			} else {
				// both increase
				currentRow += i;
				currentCol += i;
			}

			// if row and col match, return the word
			if (row === currentRow && col === currentCol) {
				return word;
			}
		}
	}
	return null;
}

export function gameReducer(state: GameState, action: GameAction) {
	switch (action.type) {
		case "CELL_CLICKED": {
			const cellState =
				state.cellStates[action.payload.row][action.payload.col];
			if (cellState === "hidden") {
				const wordAtCell = getWordAtCell(
					action.payload.row,
					action.payload.col,
				);

				const newCellState = wordAtCell ? "discovered" : "empty";
				const newCellStates = state.cellStates.map((row, rowIndex) =>
					row.map((cell, colIndex) =>
						action.payload.row === rowIndex && action.payload.col === colIndex
							? newCellState
							: cell,
					),
				);

				return {
					...state,
					cellStates: newCellStates,
					movesUsed: state.movesUsed + 1,
					activeWord: wordAtCell,
				};
			} else if (cellState === "discovered") {
				const wordAtCell = getWordAtCell(
					action.payload.row,
					action.payload.col,
				);

				return {
					...state,
					activeWord: wordAtCell,
				};
			}
			return { ...state };
		}
		case "GUESS_SUBMITTED": {
			if (!state.activeWord) return { ...state };
			// guessed correctly -> set cell state to revealed. all cell states of the word?
			// guessed correctly -> word state's isGuessedCorrectly needs to be true
			const isGuessedCorrectly = action.payload.guess === state.activeWord;
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
			};
		}
		default: {
			return { ...state };
		}
	}
}
