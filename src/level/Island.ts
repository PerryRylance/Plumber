import Cell from "./Cell";

export default class Island
{
	cells: Array<Cell>;

	constructor(cells: Array<Cell>)
	{
		this.cells = cells;

		for(const cell of cells)
			cell.island = this;
	}

	get size()
	{
		return this.cells.length;
	}
}