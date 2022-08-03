import PRNG from "pseudo-random";
import PF from "pathfinding";
import IslandFinder from "./IslandFinder";

import WFC from "../lib/ndwfc/ndwfc";
import TILESET from "./Tileset";
import { WfcInputGenerator } from "./WfcInputGenerator";
import Cell from "./Cell";
import Island from "./Island";

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
		this.pathfinding = {
			grid: new PF.Grid(w * 3, h * 3)
		};

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

					this.cells[cx][cy].walkable = state == "@";
					this.pathfinding.grid.setWalkableAt(cx, cy, this.cells[cx][cy].walkable);

				}
			}
		}
	}

	generateIslands()
	{
		const w = this.cells.length;
		const h = this.cells[0].length;
		const finder = new IslandFinder();
		
		this.islands = [];

		for(let x = 0; x < w; x++)
		{
			for(let y = 0; y < h; y++)
			{
				const cell = this.cells[x][y];

				if(!cell.walkable || cell.island)
					continue; // NB: Non-walkable cells can't belong to an island
				
				const cells = finder.findIsland(x, y, this.pathfinding.grid).map(node => {
					return this.cells[node.x][node.y];
				});

				const island = new Island(cells);
				this.islands.push(island);
			}
		}
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
				
				const cell = this.cells[x][y];
				const islandIndex = this.islands.indexOf(cell.island);

				rows[y].push ( cell.walkable ? <td key={x}>{islandIndex}</td> : <td key={x} style={{background: "grey"}}></td> )
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