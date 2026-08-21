interface GameStatsProps {
	movesRemaining: number;
	wordsFound: number;
	totalWords: number;
}

function GameStats({ movesRemaining, wordsFound, totalWords }: GameStatsProps) {
	return (
		<div className="flex justify-between">
			<p>Moves remaining: {movesRemaining}</p>
			<p>
				Words found: {wordsFound} / {totalWords}
			</p>
		</div>
	);
}

export default GameStats;
