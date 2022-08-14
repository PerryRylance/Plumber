import Heuristic from "pathfinding/src/core/Heuristic";
import Heap from "heap";
import { Grid, Util } from "pathfinding";
import DiagonalMovement from "pathfinding/src/core/DiagonalMovement";

export default class AStar {
	constructor({diagonalMovement, grid})
	{
		if(!(grid instanceof Grid))
			throw new Error("Expected instance of Grid");
		
		this.grid = grid;
		this.diagonalMovement = diagonalMovement ?? DiagonalMovement.Never;
	}

	setStart(x, y)
	{
		this.start = {x, y};
	}

	setEnd(x, y)
	{
		this.end = {x, y};
	}

	findPath() {
		const grid = this.grid.clone();
		const openList = new Heap(function (nodeA, nodeB) {
			return nodeA.f - nodeB.f;
		});
		const closedList = [];
		const startNode = grid.getNodeAt(this.start.x, this.start.y);
		let node, neighbours, neighbour;

		startNode.g = startNode.f = 0;

		openList.push(startNode);
		startNode.opened = true;

		while(!openList.empty())
		{
			node = openList.pop();
			node.closed = true;

			closedList.push(node);

			if(this.isGoal(node))
				return Util.backtrace(node);
			
			neighbours = grid.getNeighbors(node, this.diagonalMovement);

			for(let i = 0; i < neighbours.length; ++i)
			{
				neighbour = neighbours[i];

				if(neighbour.closed)
					continue;
				
				const cost = this.getCost(node, neighbour);

				if(!neighbour.opened || cost < neighbour.g)
				{
					neighbour.g = cost;
					neighbour.h = neighbour.h * this.getHeuristic(neighbour);
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.parent = node;

					if(!neighbour.opened)
					{
						openList.push(neighbour);
						neighbour.opened = true;
					}
					else
						openList.updateItem(neighbour);
				}
			}
		}

		return this.getNoGoalResult(closedList); // NB: No path found
	}

	isGoal(x, y) {
		return x === this.end.x && y === this.end.y;
	}

	getHeuristic(node) {
		const dx = Math.abs( this.end.x - node.x );
		const dy = Math.abs( this.end.y - node.y );

		if(this.diagonalMovement)
			return Heuristic.octile(dx, dy);
		
		return Heuristic.manhattan(dx, dy);
	}

	getCost(node, neighbour) {
		return node.g + (neighbour.x - node.x === 0 || neighbour.y - node.y === 0 ? 1 : Math.SQRT2);
	}

	getNoGoalResult(closedList)
	{
		return null;
	}
}