import { useEffect, useRef } from "react";
import type { GameStatus } from "../game/gameTypes";

interface GameOverModalProps {
	onClose: () => void;
	gameStatus: GameStatus;
}

export default function GameOverModal({
	onClose,
	gameStatus,
}: GameOverModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog?.open) {
			dialog?.showModal();
		}
	}, []);

	return (
		<dialog
			ref={dialogRef}
			className="m-auto backdrop:bg-black/50"
			onClose={onClose}
		>
			<h2>Game Over</h2>
			<p>You {gameStatus}</p>
			<p>Game stats here</p>
			<button onClick={onClose}>Close</button>
		</dialog>
	);
}
