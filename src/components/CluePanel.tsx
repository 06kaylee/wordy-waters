import { isGameOver, type ActiveWordView } from "../game/gameSelectors";
import type { GameAction, GameStatus } from "../game/gameTypes";
import GuessForm from "./GuessForm";

interface CluePanelProps {
	activeWordView: ActiveWordView | null;
	dispatch: React.Dispatch<GameAction>;
	gameStatus: GameStatus;
}

function CluePanel({ activeWordView, dispatch, gameStatus }: CluePanelProps) {
	if (!activeWordView) {
		return <p>Keep hunting for clues</p>;
	}

	const { word, shownClues, isSolved } = activeWordView;

	const isGuessingDone = isSolved || isGameOver(gameStatus);
	const resultText = isSolved ? "Correct! Answer:" : "The word was:";

	return (
		<div>
			<div>
				<h2>Clues: </h2>
				<p>{word.length} letters</p>
				<ul>
					{shownClues.map((clue) => (
						<li key={clue}>{clue}</li>
					))}
				</ul>
			</div>
			{isGuessingDone && (
				<div>
					<p>
						{resultText} {word}
					</p>
				</div>
			)}
			{!isGuessingDone && (
				<GuessForm key={word} wordLength={word.length} dispatch={dispatch} />
			)}
		</div>
	);
}

export default CluePanel;
