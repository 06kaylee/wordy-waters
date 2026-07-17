import GameArea from "./components/GameArea/GameArea";

function App() {
	return (
		<div className="flex flex-col h-dvh p-4 gap-8">
			<header className="shrink-0">
				<h1>Wordy Waters</h1>
			</header>
			<main className="flex-1 min-h-0 flex items-start justify-center">
				<GameArea />
			</main>
		</div>
	);
}

export default App;
