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
import HowToPlayModal from "../HowToPlayModal";

function GameArea() {
	const [state, dispatch] = useReducer(gameReducer, initialGameState);
	const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
	const [showHowToPlayModal, setShowHowToPlayModal] = useState(() => {
		const currentValue = localStorage.getItem("showHowToPlayModal");
		return currentValue ? JSON.parse(currentValue) : true;
	});
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

	function handleHowToPlayModalClose() {
		localStorage.setItem("showHowToPlayModal", "false");
		setShowHowToPlayModal(false);
	}

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
			<button onClick={() => setShowHowToPlayModal(true)}>How to Play</button>
			{showHowToPlayModal && (
				<HowToPlayModal onClose={handleHowToPlayModalClose} />
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
