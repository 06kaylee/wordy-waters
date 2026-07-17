import { useReducer } from "react";
import GameBoard from "../GameBoard";
import GameStats from "../GameStats";
import styles from "./GameArea.module.css";
import { gameReducer, initialGameState } from "./gameReducer";

function GameArea() {
	const [state, dispatch] = useReducer(gameReducer, initialGameState);
	return (
		<div className={`${styles.area} grid gap-6`}>
			<GameStats />
			<GameBoard dispatch={dispatch} cellStates={state.cellStates} />
		</div>
	);
}

export default GameArea;
