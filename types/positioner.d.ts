export type Sizes = {
	top: number;
	bottom: number;
	left?: number;
	right?: number;
};

export interface PositionerOptions {
	type?: string;
	sizes?: Sizes;
}
