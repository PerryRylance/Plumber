const TILESET = [
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