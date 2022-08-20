import Island from "./Island";

export default class Cell
{
	walkable: boolean;
	island?: Island;

	constructor()
	{
		this.walkable = true;
	}
}