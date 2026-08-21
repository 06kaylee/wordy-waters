import { useReducer } from "react";
import GameBoard from "../GameBoard";
import GameStats from "../GameStats";
import styles from "./GameArea.module.css";
import { gameReducer, initialGameState } from "../../game/gameReducer";
import CluePanel from "../CluePanel";
import {
	selectActiveWordView,
	selectGameStatus,
	selectMovesRemaining,
	selectWordsFound,
} from "../../game/gameSelectors";
import { WORDS } from "../../data/puzzleData";

function GameArea() {
	const [state, dispatch] = useReducer(gameReducer, initialGameState);
	const activeWordView = selectActiveWordView(state);
	const movesRemaining = selectMovesRemaining(state);
	const gameStatus = selectGameStatus(state);
	const wordsFound = selectWordsFound(state);
	return (
		<div className={`${styles.area} grid gap-6`}>
			<GameStats
				wordsFound={wordsFound}
				totalWords={WORDS.length}
				movesRemaining={movesRemaining}
			/>
			<GameBoard
				dispatch={dispatch}
				cellStates={state.cellStates}
				gameStatus={gameStatus}
			/>
			<CluePanel activeWordView={activeWordView} dispatch={dispatch} />
		</div>
	);
}

export default GameArea;
