import { useEffect, useRef } from "react";

export default function SuddenDeathModal() {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!dialogRef?.current?.open) {
			dialogRef?.current?.showModal();
		}
	}, []);

	function handleClose() {
		dialogRef.current?.close();
	}

	return (
		<dialog ref={dialogRef} className="m-auto backdrop:bg-black/50">
			<h2>You've entered Sudden Death Mode</h2>
			<p>Guess your discovered words. One wrong guess ends the game.</p>
			<button onClick={handleClose}>Got it</button>
		</dialog>
	);
}
