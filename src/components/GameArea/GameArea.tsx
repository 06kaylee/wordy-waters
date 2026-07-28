import { useReducer } from "react";
import GameBoard from "../GameBoard";
import GameStats from "../GameStats";
import styles from "./GameArea.module.css";
import { gameReducer, initialGameState } from "./gameReducer";
import CluePanel from "../CluePanel";
import { selectActiveWordView } from "./gameSelectors";

function GameArea() {
	const [state, dispatch] = useReducer(gameReducer, initialGameState);
	const activeWordView = selectActiveWordView(state);
	return (
		<div className={`${styles.area} grid gap-6`}>
			<GameStats />
			<GameBoard dispatch={dispatch} cellStates={state.cellStates} />
			{activeWordView && (
				<CluePanel activeWordView={activeWordView} dispatch={dispatch} />
			)}
		</div>
	);
}

export default GameArea;
