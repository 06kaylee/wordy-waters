import clsx from "clsx";
import type { CellState } from "./GameArea/gameReducer";

interface CellProps {
	value: string;
	onCellClick: () => void;
	cellState: CellState;
}

function Cell({ value, onCellClick, cellState }: CellProps) {
	return (
		<div
			className={clsx(
				"aspect-square w-full rounded-2xl flex items-center justify-center",
				cellState === "hidden" && "bg-blue-900",
				cellState === "empty" && "bg-gray-400",
				cellState === "discovered" && "bg-yellow-200",
				cellState === "revealed" && "bg-blue-300",
			)}
			onClick={onCellClick}
		>
			{cellState !== "revealed" ? "" : value}
		</div>
	);
}

export default Cell;
