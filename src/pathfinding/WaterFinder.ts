import AStar, { Node } from "./AStar";
import Point from "../generic/Point";

export default class WaterFinder extends AStar
{
	getHeuristic(node: Node)
	{
		return 0;
	}

	getCost(node: Node, neighbour: Node)
	{
		const dx = Math.abs( neighbour.x - node.x );
		const dy = Math.abs( neighbour.y - node.y );
		
		if(dx === 0 && dy > 0)
			return node.g; // NB: No cost to flow downwards

		if(dy === 0)
			return node.g + 1; // NB: Small cost to flow across

		if(dy < 0)
			return node.g + 1000; // NB: Large cost to flow upwards

		throw new Error("Unexpected state");
	}

	isGoal({x, y}: Point)
	{
		return false;
	}

	getNoGoalResult(closedList: Array<Node>):any
	{
		// TODO: Trace all routes from edge, then find the cost
		return closedList;
	}
}