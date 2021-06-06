export default function capitalize(word: string) {
	return word
		.trim()
		.replace(/^\w/, (c) => c.toUpperCase());
}
