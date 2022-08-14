import PRNG from "pseudo-random";
import PF from "pathfinding";
import IslandFinder from "../pathfinding/IslandFinder";

import WFC from "../lib/ndwfc/ndwfc";
import TILESET from "./Tileset";
import { WfcInputGenerator } from "./WfcInputGenerator";
import Cell from "./Cell";
import Island from "./Island";
import { WFCTool2D } from "../lib/ndwfc/ndwfc-tools";

const size = 5;

export default class Level {

	generate() {
		this.prng = new PRNG( 1234 );

		// NB: Generate tiles with WFC
		this.generateReadout();

		// NB: Turn into grid for pathfinding
		this.generateCells();

		// NB: Discover the largest island
		this.findIslands();

		// NB: Pick start point at top or side
		this.findStart();

		// NB: Find natural endpoint
		// this.findNaturalEndpoints();

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
		this.tool = result.tool;

		/*var canvas = document.createElement("canvas");
		var viewport = {x:0,y:0,w:10,h:10}; // the region you want to visualize
		tool.plotWFCOoutput(canvas, viewport, wfc.readout()); // plot it!*/
	}

	debugPlot(canvas)
	{
		const viewport = { x: 0, y: 0, w: size, h: size }; // the region you want to visualize

		this.tool.addColor("@", [255,0,0]);
		this.tool.addColor(".", [0,255,255]);

		this.tool.plotWFCOutput(canvas, viewport, this.readout); // plot it!*/
	}

	generateCells() {
		const waveCached = {};
		const wave = this.readout;
		const tiles = this.tiles;

		this.cells = [];
		this.pathfinding = {
			grid: new PF.Grid(size * 3, size * 3)
		};

		for (let x = 0; x < size * 3; x++) {
			const column = [];

			for (let y = 0; y < size * 3; y++)
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

					const cx = x * 3 + j;
					const cy = y * 3 + i;

					this.cells[cx][cy].walkable = state == "@";
					this.pathfinding.grid.setWalkableAt(cx, cy, this.cells[cx][cy].walkable);

				}
			}
		}
	}

	findIslands()
	{
		const w = this.cells.length;
		const h = this.cells[0].length;
		const finder = new IslandFinder({
			grid: this.pathfinding.grid
		});
		
		this.islands = [];

		for(let x = 0; x < w; x++)
		{
			for(let y = 0; y < h; y++)
			{
				const cell = this.cells[x][y];

				if(!cell.walkable || cell.island)
					continue; // NB: Non-walkable cells can't belong to an island
				
				const cells = finder.findIsland(x, y).map(node => {
					return this.cells[node.x][node.y];
				});

				const island = new Island(cells);
				this.islands.push(island);
			}
		}
	}

	findStart()
	{
		// NB: Plain and simple just pick the highest point on the outside
		// TODO: Maybe pick all points, lose half the array and then randomly pick one of the remaining points?
		for(let y = 0; y < size; y++)
		{
			for(
				let x = 0; 
				x < size; 
				x += (y === 0 || y === size - 1 ? 1 : size - 1)
				)
			{
				if(this.cells[x][y].walkable)
				{
					this.start = {x, y};
					return;
				}
			}
		}

		throw new Error("Failed to find start point");
	}

	findNaturalEndpoints()
	{

	}

	get table() {
		const rows = [];

		for(let x = 0; x < size * 3; x++)
		{
			for(let y = 0; y < size * 3; y++)
			{
				if(!rows[y])
					rows[y] = [];
				
				const cell = this.cells[x][y];
				const islandIndex = this.islands.indexOf(cell.island);

				const classes = [];
				const children = [];

				if(cell.walkable)
				{
					const isIslandEven = islandIndex % 2;

					classes.push(isIslandEven ? "island-even" : "island-odd");
					
					classes.push("walkable");
				}
				else
					classes.push("impassible");
				
				if(x == this.start.x && y == this.start.y)
					classes.push("start");

				rows[y].push ( <td key={x} className={classes.join(" ")}>{children}</td> );
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