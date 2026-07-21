export type WordData = {
	word: string;
	startRow: number;
	startCol: number;
	direction: "horizontal" | "vertical" | "diagonal";
	length: number;
	clues: string[];
};

export type WordCell = {
	row: number;
	col: number;
};

export const MOVE_BUDGET: number = 20;
const DIRECTION_DELTAS = {
	horizontal: [0, 1],
	vertical: [1, 0],
	diagonal: [1, 1],
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
	const wordOwners = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => ""),
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
		length: 4,
		clues: ["In perfect condition", "Place that makes coins", "Fresh herb"],
	},
	{
		word: "LEAD",
		startRow: 4,
		startCol: 0,
		direction: "horizontal",
		length: 4,
		clues: ["Heavy metal", "Leash for a dog", "Go first"],
	},
	{
		word: "PLAN",
		startRow: 1,
		startCol: 1,
		direction: "diagonal",
		length: 4,
		clues: [
			"Drawing or blueprint",
			"Strategy or scheme",
			"To arrange in advance",
		],
	},
	{
		word: "BARK",
		startRow: 0,
		startCol: 4,
		direction: "vertical",
		length: 4,
		clues: ["Sailing vessel", "Dog's sound", "Tree's outer layer"],
	},
];

export const { board, wordOwners } = buildBoard(WORDS);
export const getWordDataByName = (word: string) =>
	WORDS.find((wordData) => wordData.word === word);
