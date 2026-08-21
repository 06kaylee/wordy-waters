import { useState } from "react";
import type { ActiveWordView } from "../game/gameSelectors";
import type { GameAction } from "../game/gameTypes";

interface CluePanelProps {
	activeWordView: ActiveWordView | null;
	dispatch: React.Dispatch<GameAction>;
}

function CluePanel({ activeWordView, dispatch }: CluePanelProps) {
	const [guess, setGuess] = useState<string>("");
	if (!activeWordView) {
		return <p>Keep hunting for clues</p>;
	}

	const { word, shownClues, isSolved } = activeWordView;

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({ type: "GUESS_SUBMITTED", payload: { guess } });
		setGuess("");
	};

	return (
		<div>
			<div>
				<h2>Clues: </h2>
				<ul>
					{shownClues.map((clue) => (
						<li key={clue}>{clue}</li>
					))}
				</ul>
			</div>
			{isSolved ? (
				<div>
					<p>Correct! Answer: {word}</p>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Enter your guess here"
						aria-label="Enter your guess here"
						value={guess}
						onChange={(e) => setGuess(e.target.value)}
					/>
					<button type="submit" disabled={guess.trim() === ""}>
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default CluePanel;
