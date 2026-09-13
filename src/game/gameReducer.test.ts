import { describe, it, expect } from "vitest";
import { gameReducer, initialGameState } from "./gameReducer";
import type { GameAction, GameState } from "./gameTypes";
import { selectGameStatus, selectWordsFound } from "./gameSelectors";

// Test board layout (see puzzleData.ts):
// MINT vertical [0,0]-[3,0], LEAD horizontal [4,0]-[4,3],
// PLAN diagonal [1,1]-[4,4], BARK vertical [0,4]-[3,4]
// [0,1] is empty

const click = (row: number, col: number): GameAction => ({
	type: "CELL_CLICKED",
	payload: { row, col },
});

const guess = (word: string): GameAction => ({
	type: "GUESS_SUBMITTED",
	payload: { guess: word },
});

function playActions(
	actions: GameAction[],
	start: GameState = initialGameState,
): GameState {
	return actions.reduce(gameReducer, start);
}

// Discover MINT (1 move), then 10 wrong guesses (+2 each) → movesUsed 21.
// MINT's cell is still "discovered", so the game enters sudden death.
function buildSuddenDeathState(): GameState {
	return playActions([
		click(0, 0),
		...Array.from({ length: 10 }, () => guess("XXXX")),
	]);
}

// A wrong guess made during sudden death loses the game. BARK, PLAN, and
// LEAD are never discovered, so their cells stay hidden after the loss.
function buildLostState(): GameState {
	return playActions([guess("XXXX")], buildSuddenDeathState());
}

function buildWinState(): GameState {
	return playActions([
		click(0, 0),
		guess("MINT"),
		click(4, 0),
		guess("LEAD"),
		click(1, 1),
		guess("PLAN"),
		click(0, 4),
		guess("BARK"),
	]);
}

describe("gameReducer", () => {
	describe("CELL_CLICKED", () => {
		it("costs 1 move to click a hidden empty cell", () => {
			const action = click(0, 1);
			const gameState = gameReducer(initialGameState, action);
			expect(gameState.cellStates[0][1]).toBe("empty");
			expect(gameState.movesUsed).toBe(1);
			expect(gameState).not.toBe(initialGameState);
			expect(gameState.cellStates).not.toBe(initialGameState.cellStates);
		});
		it("discovers a word cell, costs 1 move, and sets it as the active word", () => {
			const action = click(0, 0);
			const gameState = gameReducer(initialGameState, action);
			expect(gameState.cellStates[0][0]).toBe("discovered");
			expect(gameState.movesUsed).toBe(1);
			expect(gameState.activeWord).toBe("MINT");
		});
		it("costs 0 moves to re-click a discovered cell and makes its word active", () => {
			// Discover MINT, then LEAD (making LEAD active), then re-click MINT's cell.
			const gameState = playActions([click(0, 0), click(4, 1), click(0, 0)]);
			expect(gameState.movesUsed).toBe(2);
			expect(gameState.activeWord).toBe("MINT");
			expect(gameState.cellStates[0][0]).toBe("discovered");
		});
		it("keeps the previous active word when clicking an empty cell", () => {
			const gameState = playActions([click(0, 0), click(0, 1)]);
			expect(gameState.movesUsed).toBe(2);
			expect(gameState.activeWord).toBe("MINT");
		});
		it("ignores hidden-cell clicks during sudden death", () => {
			const suddenDeathState = buildSuddenDeathState();
			expect(selectGameStatus(suddenDeathState)).toBe("sudden_death");
			const gameState = gameReducer(suddenDeathState, click(0, 4));
			expect(gameState).toBe(suddenDeathState);
		});
		it("allows viewing any word's clues after the game is over, without changing state otherwise", () => {
			const lostState = buildLostState();
			expect(selectGameStatus(lostState)).toBe("lost");
			// BARK's cells are still hidden, but clicking one after the game ends
			// should make it the active word (to show its clues) at no cost.
			const gameState = gameReducer(lostState, click(0, 4));
			expect(gameState.activeWord).toBe("BARK");
			expect(gameState.movesUsed).toBe(lostState.movesUsed);
			expect(gameState.cellStates).toBe(lostState.cellStates);
		});
	});

	describe("GUESS_SUBMITTED", () => {
		it("marks the word solved, reveals all its cells, and costs 0 moves on a correct guess", () => {
			const gameState = playActions([click(0, 0), guess("MINT")]);
			expect(gameState.wordStates["MINT"].isGuessedCorrectly).toBe(true);
			expect(gameState.cellStates[0][0]).toBe("revealed");
			expect(gameState.cellStates[1][0]).toBe("revealed");
			expect(gameState.cellStates[2][0]).toBe("revealed");
			expect(gameState.cellStates[3][0]).toBe("revealed");
			expect(gameState.movesUsed).toBe(1);
		});
		it("costs 2 moves on a wrong guess and leaves the cells discovered", () => {
			const gameState = playActions([click(0, 0), guess("test")]);
			expect(gameState.wordStates["MINT"].isGuessedCorrectly).toBe(false);
			expect(gameState.cellStates[0][0]).toBe("discovered");
			expect(gameState.cellStates[1][0]).toBe("hidden");
			expect(gameState.cellStates[2][0]).toBe("hidden");
			expect(gameState.cellStates[3][0]).toBe("hidden");
			expect(gameState.movesUsed).toBe(3);
		});
		it("accepts a guess regardless of case and surrounding whitespace", () => {
			const gameState = playActions([click(0, 0), guess(" mint ")]);
			expect(gameState.wordStates["MINT"].isGuessedCorrectly).toBe(true);
		});
		it("ignores a guess when no word is active", () => {
			const action = guess("mint");
			const gameState = gameReducer(initialGameState, action);
			expect(gameState).toBe(initialGameState);
		});
		it("ignores a guess on an already-solved word", () => {
			const solvedState = playActions([
				click(0, 0),
				guess("mint"),
				click(0, 0),
			]);
			const gameState = gameReducer(solvedState, guess("test"));
			expect(gameState).toBe(solvedState);
		});
		it("wins the game if all words have been guessed correctly", () => {
			const winState = buildWinState();
			expect(selectGameStatus(winState)).toBe("won");
			expect(winState.movesUsed).toBe(4);
			expect(selectWordsFound(winState)).toBe(4);
		});
	});
});
