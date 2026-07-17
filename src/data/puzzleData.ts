export type WordData = {
	word: string;
	startRow: number;
	startCol: number;
	direction: "horizontal" | "vertical" | "diagonal";
	length: number;
	clues: string[];
};

export const BOARD: string[][] = [
	["M", "", "", "", "B"],
	["I", "P", "", "", "A"],
	["N", "", "L", "", "R"],
	["T", "", "", "A", "K"],
	["L", "E", "A", "D", "N"],
];

export const MOVE_BUDGET: number = 20;

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
