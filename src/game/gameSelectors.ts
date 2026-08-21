import {
	getWordCells,
	getWordDataByName,
	TOTAL_MOVES,
} from "../data/puzzleData";
import type { GameState, GameStatus } from "./gameTypes";

export interface ActiveWordView {
	word: string;
	shownClues: string[];
	isSolved: boolean;
}

export function selectActiveWordView(state: GameState): ActiveWordView | null {
	if (!state.activeWord) return null;
	const wordData = getWordDataByName(state.activeWord);
	if (!wordData) return null;
	const allClues = wordData.clues;
	const wordCells = getWordCells(wordData);
	const wordCellStates = wordCells.map(
		({ row, col }) => state.cellStates[row][col],
	);
	const numDiscovered = wordCellStates.filter(
		(wordCellState) => wordCellState === "discovered",
	)?.length;
	const isSolved = state.wordStates[state.activeWord].isGuessedCorrectly;
	const shownClues =
		isSolved || selectGameStatus(state) !== "playing"
			? allClues
			: allClues.slice(0, numDiscovered);
	return {
		word: state.activeWord,
		shownClues,
		isSolved,
	};
}

export function selectMovesRemaining(state: GameState): number {
	return Math.max(0, TOTAL_MOVES - state.movesUsed);
}

export function selectWordsFound(state: GameState): number {
	return Object.values(state.wordStates).filter(
		(wordState) => wordState.isGuessedCorrectly,
	).length;
}

export function selectGameStatus(state: GameState): GameStatus {
	const allWordsGuessedCorrectly = Object.values(state.wordStates).every(
		(wordState) => wordState.isGuessedCorrectly,
	);
	if (allWordsGuessedCorrectly) return "won";
	if (state.movesUsed > TOTAL_MOVES) return "lost";
	return "playing";
}
