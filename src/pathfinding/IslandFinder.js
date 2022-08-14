import AStar from "./AStar";

export default class IslandFinder extends AStar
{
	getHeuristic(node)
	{
		return 0;
	}

	isGoal(x, y)
	{
		return false;
	}

	getNoGoalResult(closedList)
	{
		return closedList;
	}

	findIsland(x, y)
	{
		this.setStart(x, y);
		return this.findPath();
	}
}