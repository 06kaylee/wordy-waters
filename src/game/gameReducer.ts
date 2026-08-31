import {
	getWordCells,
	getWordDataByName,
	wordOwners,
	WORDS,
	type WordCell,
} from "../data/puzzleData";
import { isGameOver, selectGameStatus } from "./gameSelectors";
import type { CellState, GameAction, GameState } from "./gameTypes";

export const initialGameState: GameState = {
	cellStates: Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => "hidden"),
	),
	wordStates: Object.fromEntries(
		WORDS.map((wordData) => [wordData.word, { isGuessedCorrectly: false }]),
	),
	movesUsed: 0,
	activeWord: null,
	lostInSuddenDeath: false,
};

function setCellStates(
	cellStates: CellState[][],
	newCellState: CellState,
	wordCells: WordCell[],
): CellState[][] {
	return cellStates.map((row, rowIndex) =>
		row.map((cell, colIndex) =>
			wordCells.some(
				(wordCell) => wordCell.row === rowIndex && wordCell.col === colIndex,
			)
				? newCellState
				: cell,
		),
	);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
	const gameStatus = selectGameStatus(state);
	switch (action.type) {
		case "CELL_CLICKED": {
			const cellState =
				state.cellStates[action.payload.row][action.payload.col];
			if (isGameOver(gameStatus)) {
				const wordAtCell = wordOwners[action.payload.row][action.payload.col];

				if (!wordAtCell) return state;

				return {
					...state,
					activeWord: wordAtCell,
				};
			} else if (cellState === "hidden") {
				if (gameStatus === "sudden_death") return state;
				const wordAtCell = wordOwners[action.payload.row][action.payload.col];

				const newCellState = wordAtCell ? "discovered" : "empty";
				const newCellStates = setCellStates(state.cellStates, newCellState, [
					{ row: action.payload.row, col: action.payload.col },
				]);

				return {
					...state,
					cellStates: newCellStates,
					movesUsed: state.movesUsed + 1,
					activeWord: wordAtCell ?? state.activeWord,
				};
			} else if (cellState === "discovered" || cellState === "revealed") {
				const wordAtCell = wordOwners[action.payload.row][action.payload.col];

				if (!wordAtCell) return state;

				return {
					...state,
					activeWord: wordAtCell,
				};
			}
			return state;
		}
		case "GUESS_SUBMITTED": {
			if (
				!state.activeWord ||
				state.wordStates[state.activeWord].isGuessedCorrectly ||
				gameStatus === "won" ||
				gameStatus === "lost"
			) {
				return state;
			}
			const isGuessedCorrectly =
				action.payload.guess.trim().toUpperCase() === state.activeWord;
			const wordData = getWordDataByName(state.activeWord);
			if (!wordData) return state;
			const wordCells = getWordCells(wordData);
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
				lostInSuddenDeath: !isGuessedCorrectly && gameStatus === "sudden_death",
			};
		}
		default: {
			return state;
		}
	}
}
