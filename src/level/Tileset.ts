export interface TileOptions {
	transformations?: Array<string>,
	weight?: number
}

export interface Tile {
	cells: String,
	options?: TileOptions
}

const TILESET: Array<Tile> = [
	{
		cells:
			`
			.@.
			.@@
			...
			`
	},
	{
		cells:
			`
			.@.
			.@.
			.@.
			`,
		options: {
			transformations: ['cw']
		}
	},
	{
		cells:
			`
			.@.
			@@@
			...
			`
	},
	{
		cells:
			`
			.@.
			@@@
			.@.
			`,
		options: {
			transformations: [],
			weight: 0.1
		}
	},
	{
		cells:
			`
			...
			...
			...
			`,
		options: {
			transformations: [],
			weight: 0.1
		}
	}
];

export default TILESET;