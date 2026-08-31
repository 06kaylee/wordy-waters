import type { GameStatus } from "../game/gameTypes";

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
	return (
		<div className="flex justify-between">
			<p>Moves remaining: {movesRemaining}</p>
			<p>{gameStatus}</p>
			<p>
				Words found: {wordsFound} / {totalWords}
			</p>
		</div>
	);
}

export default GameStats;
