export default interface Point
{
	x: number;
	y: number;
}

export interface PointWithCost extends Point
{
	g: number;
}