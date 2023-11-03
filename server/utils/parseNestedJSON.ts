export const parseNestedJSON = <T>(array: Array<string>): T[] =>
	array.map((item) => JSON.parse(item));
