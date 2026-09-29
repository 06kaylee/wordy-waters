import { useState } from "react";
import type { GameStatus } from "../../game/gameTypes";
import styles from "./GameStats.module.css";

interface GameStatsProps {
	movesRemaining: number;
	wordsFound: number;
	totalWords: number;
	gameStatus: GameStatus;
}

function GameStats({
	movesRemaining,
	wordsFound,
	totalWords,
	gameStatus,
}: GameStatsProps) {
	const [prevMovesRemaining, setPrevMovesRemaining] = useState(movesRemaining);
	const [steps, setSteps] = useState(0);
	if (prevMovesRemaining !== movesRemaining) {
		console.log(prevMovesRemaining, movesRemaining);
		setPrevMovesRemaining(movesRemaining);
		setSteps(prevMovesRemaining - movesRemaining);
	}

	return (
		<div className="flex justify-between">
			<p>
				Moves remaining:{" "}
				<span className={styles.visibleWindow} aria-hidden>
					<span
						key={movesRemaining}
						className={steps ? styles.movingWheel : ""}
						style={{ "--steps": steps } as React.CSSProperties}
					>
						{Array.from({ length: steps + 1 }, (_, i) => (
							<span key={movesRemaining + steps - i}>
								{movesRemaining + steps - i}
							</span>
						))}
					</span>
				</span>
				<span className="sr-only">{movesRemaining}</span>
			</p>
			<p>{gameStatus}</p>
			<p>
				Words found: {wordsFound} / {totalWords}
			</p>
		</div>
	);
}

export default GameStats;
