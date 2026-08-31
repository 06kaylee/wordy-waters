import { useEffect, useReducer, useState } from "react";
import GameBoard from "../GameBoard";
import GameStats from "../GameStats";
import styles from "./GameArea.module.css";
import { gameReducer, initialGameState } from "../../game/gameReducer";
import CluePanel from "../CluePanel";
import {
	isGameOver,
	selectActiveWordView,
	selectGameStatus,
	selectMovesRemaining,
	selectWordsFound,
} from "../../game/gameSelectors";
import { WORDS } from "../../data/puzzleData";
import SuddenDeathModal from "../SuddenDeathModal";
import GameOverModal from "../GameOverModal";

function GameArea() {
	const [state, dispatch] = useReducer(gameReducer, initialGameState);
	const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
	const activeWordView = selectActiveWordView(state);
	const movesRemaining = selectMovesRemaining(state);
	const gameStatus = selectGameStatus(state);
	const wordsFound = selectWordsFound(state);
	const gameOver = isGameOver(gameStatus);

	useEffect(() => {
		if (!gameOver) return;
		// TODO: replace the 800 to be onanimationend
		const timeout = setTimeout(() => setIsGameOverModalOpen(true), 800);

		return () => clearTimeout(timeout);
	}, [gameOver]);

	return (
		<div className={`${styles.area} grid gap-6`}>
			{gameStatus === "sudden_death" && <SuddenDeathModal />}
			{isGameOverModalOpen && (
				<GameOverModal
					onClose={() => setIsGameOverModalOpen(false)}
					gameStatus={gameStatus}
				/>
			)}
			{gameOver && (
				<button onClick={() => setIsGameOverModalOpen(true)}>Results</button>
			)}
			<GameStats
				wordsFound={wordsFound}
				totalWords={WORDS.length}
				movesRemaining={movesRemaining}
				gameStatus={gameStatus}
			/>
			<GameBoard
				dispatch={dispatch}
				cellStates={state.cellStates}
				gameStatus={gameStatus}
			/>
			<CluePanel
				activeWordView={activeWordView}
				dispatch={dispatch}
				gameStatus={gameStatus}
			/>
		</div>
	);
}

export default GameArea;
