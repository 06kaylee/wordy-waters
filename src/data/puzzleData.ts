export type WordData = {
	word: string;
	startRow: number;
	startCol: number;
	direction: "horizontal" | "vertical";
	clues: string[];
};

export type WordCell = {
	row: number;
	col: number;
};

export const TOTAL_MOVES = 20;

const DIRECTION_DELTAS = {
	horizontal: [0, 1],
	vertical: [1, 0],
};

// takes a WordData object and returns the array rows and cols that the cells live for that word
// e.g. pass in WordData object -> returns [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }];
export function getWordCells(wordData: WordData): WordCell[] {
	const [dRow, dCol] = DIRECTION_DELTAS[wordData.direction];
	return Array.from({ length: wordData.word.length }, (_, i) => ({
		row: wordData.startRow + i * dRow,
		col: wordData.startCol + i * dCol,
	}));
}

function buildBoard(words: WordData[]) {
	const board = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => ""),
	);
	const wordOwners: (string | null)[][] = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => null),
	);

	words.forEach((wordData) => {
		const wordCells = getWordCells(wordData);
		wordCells.forEach(({ row, col }, i) => {
			board[row][col] = wordData.word[i];
			wordOwners[row][col] = wordData.word;
		});
	});
	return { board, wordOwners };
}

export const WORDS: WordData[] = [
	{
		word: "MINT",
		startRow: 0,
		startCol: 0,
		direction: "vertical",
		clues: ["In perfect condition", "Place that makes coins", "Fresh herb"],
	},
	{
		word: "OCEAN",
		startRow: 4,
		startCol: 0,
		direction: "horizontal",
		clues: [
			"A drop in the ___",
			"Pacific or Atlantic",
			"Very large body of salt water",
		],
	},
	{
		word: "JAM",
		startRow: 0,
		startCol: 3,
		direction: "vertical",
		clues: [
			"Sticky situation",
			"Musicians' impromptu session",
			"Fruit spread for toast",
		],
	},
	{
		word: "BARK",
		startRow: 0,
		startCol: 4,
		direction: "vertical",
		clues: ["Sailing vessel", "Dog's sound", "Tree's outer layer"],
	},
];

export const { board, wordOwners } = buildBoard(WORDS);
export const getWordDataByName = (word: string) =>
	WORDS.find((wordData) => wordData.word === word);
