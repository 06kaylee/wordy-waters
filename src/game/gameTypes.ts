export type CellState = "hidden" | "discovered" | "revealed" | "empty";

export type WordState = {
	isGuessedCorrectly: boolean;
};

export type GameState = {
	cellStates: CellState[][];
	wordStates: Record<string, WordState>;
	movesUsed: number;
	activeWord: string | null;
	lostInSuddenDeath: boolean;
};

export type GameAction =
	| { type: "CELL_CLICKED"; payload: { row: number; col: number } }
	| { type: "GUESS_SUBMITTED"; payload: { guess: string } };

export type GameStatus = "playing" | "sudden_death" | "won" | "lost";
