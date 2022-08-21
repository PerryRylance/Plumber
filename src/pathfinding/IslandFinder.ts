import AStar from "./AStar";

import Point from "../generic/Point";
import { Node } from "./AStar";

export default class IslandFinder extends AStar
{
	getHeuristic(node: Node)
	{
		return 0;
	}

	isGoal({x, y}: Node)
	{
		return false;
	}

	getNoGoalResult(closedList: Array<Node>):any
	{
		return closedList;
	}

	findIsland(start: Point)
	{
		return this.findPath(start);
	}
}