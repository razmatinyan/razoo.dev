export type Sizes = {
	top: number,
	bottom: number,
	left?: number,
	right?: number
}

export interface PositionerOptions {
    el: Ref,
    type?: string,
    sizes?: Sizes
}