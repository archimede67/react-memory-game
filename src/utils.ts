export const shuffle = (array: any[]) => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

export const generateCards = (symbols: any[], cardCount: number) => {
	const generatedCards = [];
	const subsymbols = [...symbols];
	for (let i = 0; i < cardCount / 2; i++) {
		const randIndex = Math.floor(Math.random() * subsymbols.length);
		const symbol = subsymbols[randIndex];
		subsymbols.splice(randIndex, 1);
		for (let j = 0; j < 2; j++)
			generatedCards.push({
				symbol,
				revealed: false,
				clicked: false,
				id: symbol + (j + 1),
			});
	}
	return shuffle(generatedCards);
};
