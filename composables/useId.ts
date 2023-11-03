let id: number = 0;
function generateId(number?: number): number {
	return number && number !== 0 ? (id += ++number) : ++id;
}

export function useId(number?: number): number {
	return generateId(number);
}
