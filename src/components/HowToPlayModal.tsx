import { useEffect, useRef } from "react";

interface HowToPlayModalProps {
	onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!dialogRef?.current?.open) {
			dialogRef?.current?.showModal();
		}
	}, []);

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			className="m-auto backdrop:bg-black/50"
		>
			<h1>How to Play</h1>
			<p>
				Hunt for 4 hidden words in the grid. Find them all before you run out of
				moves
			</p>
			<ul>
				<li>
					Clicking a cell costs one move. It reveals either an empty square or a
					clue for the hidden word.
				</li>
				<li>
					Guessing a word costs 2 moves if you're wrong and nothing if you're
					right.
				</li>
				<li>The fewer moves you use, the better your end score.</li>
				<li>
					Run out of moves with discovered words still on the board? Sudden
					death: Guess any word you've uncovered, but the first miss ends the
					game.
				</li>
			</ul>
			<p>
				<strong>A new puzzle every day at midnight UTC</strong>
			</p>
			<button onClick={onClose}>Close</button>
		</dialog>
	);
}
