import { ChangeEvent, FormEvent, MouseEventHandler, useState, useEffect } from "react";
import "./App.css";
import SYMBOLS from "./symbols";
import { generateCards, shuffle } from "./utils";
import GithubIcon from "./GithubIcon";

function MainMenu({
	cardCount,
	setCardCount,
	onPlayClick,
}: {
	cardCount: number;
	setCardCount: (v: number) => void;
	onPlayClick: () => void;
}) {
	const handleCardsOptionSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		setCardCount(+e.target.value);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onPlayClick();
	};

	return (
		<div className="menu">
			<form onSubmit={handleSubmit}>
				<div className="form-item">
					<label htmlFor="card-count-select">Number of cards</label>
					<select id="card-count-select" value={cardCount} onChange={handleCardsOptionSelect}>
						<option value="4">4 cards</option>
						<option value="8">8 cards</option>
						<option value="16">16 cards</option>
						<option value="32">32 cards</option>
						<option value="48">48 cards</option>
						<option value="64">64 cards</option>
						<option value="96">96 cards</option>
					</select>
				</div>
				<div className="form-item">
					<button>Play</button>
				</div>
			</form>

			<footer>
				<GithubIcon url="https://github.com/archimede67/react-memory-game" />
			</footer>
		</div>
	);
}

const cardsPerRowConfigs = {
	"4": 2,
	"8": 4,
	"16": 4,
	"32": 8,
};

type BoardProps = {
	cards: Card[];
	onFinished: () => void;
};

const Board = ({ cards, onFinished }: BoardProps) => {
	let cardsPerRow = cardsPerRowConfigs[`${cards.length}` as "4" | "8" | "16" | "32"];
	if (!cardsPerRow) cardsPerRow = 8;
	const [clickedCards, setClickedCards] = useState<number[]>([]);
	const [revealedCards, setRevealedCards] = useState<number[]>([]);
	const [moves, setMoves] = useState(0);
	const [gameEnded, setGameEnded] = useState(false);

	const handleCardClick = (card: Card, index: number) => {
		return (e: React.MouseEvent<HTMLDivElement>) => {
			const isCardRevealed = revealedCards.findIndex((c) => c === index) !== -1;
			const isCardClicked = clickedCards.findIndex((c) => c === index) !== -1;
			if (isCardRevealed || isCardClicked) return;
			if (clickedCards.length < 2) setClickedCards([...clickedCards, index]);
		};
	};

	const endGame = () => {
		setGameEnded(true);
	};

	const goBack = () => {
		onFinished();
	};

	useEffect(() => {
		let timeoutId: number;
		if (clickedCards.length === 2) {
			if (cards[clickedCards[0]].symbol === cards[clickedCards[1]].symbol) {
				setRevealedCards([...revealedCards, ...clickedCards]);
				setClickedCards([]);
			} else {
				timeoutId = setTimeout(() => {
					setClickedCards([]);
				}, 1000);
			}
			setMoves(moves + 1);
		}
		return () => clearTimeout(timeoutId);
	}, [clickedCards]);

	useEffect(() => {
		if (revealedCards.length === cards.length) {
			endGame();
		}
	}, [revealedCards]);

	return (
		<div className="board-outer">
			<button onClick={goBack} style={{ marginRight: "1em", position: "absolute", top: -80, left: 0 }}>
				Back
			</button>
			{gameEnded && (
				<div className="overlay">
					<p>Game Finished!</p>
					<span>Moves: {moves}</span>
					<button onClick={goBack}>Ok</button>
				</div>
			)}
			<div>
				<p>Moves: {moves}</p>
			</div>
			<div
				className="board"
				style={{
					gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
				}}>
				{cards.map((card, cardIndex) => {
					const isCardClicked = clickedCards.findIndex((c) => c === cardIndex) !== -1;
					const isCardRevealed = revealedCards.findIndex((c) => c === cardIndex) !== -1;

					return (
						<div
							className={`card ${isCardClicked ? "clicked" : ""} ${isCardRevealed ? "revealed" : ""}`}
							onClick={handleCardClick(card, cardIndex)}
							key={cardIndex}>
							<div className="card-inner">{(isCardClicked || isCardRevealed) && card.symbol}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

type Card = {
	symbol: string;
	revealed: boolean;
	clicked: boolean;
	id: string;
};
function App() {
	const [cardCount, setCardCount] = useState(4);
	const [gameStarted, setGameStarted] = useState(false);
	const [cards, setCards] = useState<Card[]>([]);

	const startGame = () => {
		const generatedCards = generateCards(SYMBOLS, cardCount);
		setCards(generatedCards);

		setGameStarted(true);
	};

	const handleEnd = () => {
		setGameStarted(false);
	};

	return (
		<div className="App">
			<h1>Memory game</h1>
			<div className="container">
				{!gameStarted && <MainMenu cardCount={cardCount} setCardCount={setCardCount} onPlayClick={startGame} />}
				{gameStarted && <Board cards={cards} onFinished={handleEnd} />}
			</div>
		</div>
	);
}

export default App;
