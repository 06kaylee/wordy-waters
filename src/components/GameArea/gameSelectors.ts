import { getWordCells, getWordDataByName } from "../../data/puzzleData";
import { type GameState } from "./gameReducer";

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
	console.log(isSolved);
	const shownClues = isSolved ? allClues : allClues?.slice(0, numDiscovered);
	return {
		word: state.activeWord,
		shownClues,
		isSolved,
	};
}
