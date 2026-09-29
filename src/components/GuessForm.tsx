import { useState } from "react";
import type { GameAction } from "../game/gameTypes";

interface GuessFormProps {
	wordLength: number;
	dispatch: React.Dispatch<GameAction>;
}

function normalizeGuess(rawGuess: string, wordLength: number) {
	return rawGuess
		.toUpperCase()
		.replace(/[^A-Z]/g, "")
		.slice(0, wordLength);
}

export default function GuessForm({ dispatch, wordLength }: GuessFormProps) {
	const [guess, setGuess] = useState("");

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		if (guess.length !== wordLength) return;
		dispatch({ type: "GUESS_SUBMITTED", payload: { guess } });
		setGuess("");
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setGuess(normalizeGuess(e.target.value, wordLength));
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Enter your guess here"
				aria-label="Enter your guess here"
				value={guess}
				autoComplete="off"
				autoCapitalize="characters"
				spellCheck={false}
				maxLength={wordLength}
				onChange={handleChange}
			/>
			<button type="submit" disabled={guess.length !== wordLength}>
				Submit
			</button>
		</form>
	);
}
