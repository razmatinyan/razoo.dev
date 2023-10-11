let id: number = 0;
function generateId(): number {
	return ++id;
}

export function useId(): number {
	return generateId();
}
