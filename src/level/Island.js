import Cell from "./Cell";

export default class Island
{
	constructor(cells)
	{
		this.cells = cells;

		for(const cell of cells)
		{
			if(!(cell instanceof Cell))
				throw new Error("Input must be an array of cells");

			cell.island = this;
		}
	}
}