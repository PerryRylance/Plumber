import PRNG from "pseudo-random";
import WFC from "../lib/ndwfc/ndwfc";
import TILESET from "./Tileset";
import { WfcInputGenerator } from "./WfcInputGenerator";
import Cell from "./Cell";

const size = 3;

export default class Level {
	generate() {
		this.prng = new PRNG(80087355);

		// NB: Generate tiles with WFC
		this.generateReadout();

		// NB: Turn into grid for pathfinding
		this.generateCells();

		// NB: Discover the largest island
		this.generateIslands();

		// NB: Pick start point at top or side
		// NB: Find natural endpoint
		// NB: Add valves
		// NB: Rotate corners
		// NB: Etc. with more obstacles
	}

	generateReadout() {
		let done = false;

		const result = WfcInputGenerator.fromTileset(TILESET);

		const wfc = new WFC({
			...result.input,
			random: this.prng.random
		});

		wfc.expand([0, 0], [size, size]);

		while (!done)
			done = wfc.step();

		this.readout = wfc.readout();
		this.tiles = result.tiles;
	}

	generateCells() {
		const waveCached = {};
		const wave = this.readout;
		const tiles = this.tiles;

		const w = tiles[0][0].length;
		const h = tiles[0].length;

		this.cells = [];

		for (let x = 0; x < w * 3; x++) {
			const column = [];

			for (let y = 0; y < h * 3; y++)
				column.push( new Cell() );

			this.cells.push(column);
		}

		for (let k in wave) {
			if (k in waveCached) {
				continue
			}
			waveCached[k] = wave[k]
			const [y, x] = k.split(",").map(x => parseInt(x));

			let v = wave[k];

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {

					const state = tiles[v][i][j];

					const cx = x * 3 + i;
					const cy = y * 3 + j;

					this.cells[cx][cy].walkable = state == ".";

				}
			}
		}
	}

	generateIslands()
	{

	}

	get table() {

		const w = this.cells.length;
		const h = this.cells[0].length;

		const rows = [];

		for(let x = 0; x < w; x++)
		{
			for(let y = 0; y < h; y++)
			{
				if(!rows[y])
					rows[y] = [];
				
				rows[y].push ( this.cells[x][y].walkable ? <td key={x}></td> : <td key={x} style={{background: "black"}}></td> )
			}
		}

		return <table className="debug">
			<tbody>
				{
					rows.map((cells, index) => {
						return <tr key={index}>
							{cells}
						</tr>;
					})
				}
			</tbody>
		</table>

		// return rows.join("\r\n");
	}
}