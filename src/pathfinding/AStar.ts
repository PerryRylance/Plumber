import Heuristic from "pathfinding/src/core/Heuristic";
import Heap from "heap";
import { Grid } from "pathfinding";
import { backtrace } from "pathfinding/src/core/Util";

import Point from "../generic/Point";

enum DiagonalMovement {
	Always = 1,
	Never = 2,
	IfAtMostOneObstacle = 3,
	OnlyWhenNoObstacles = 4
}

export interface AStarInterface {
	diagonalMovement?: DiagonalMovement,
	grid: InstanceType<typeof Grid>
};

export interface Node extends Point {
	walkable: boolean;
	g: number;
	f: number;
	opened: boolean;
}

export default class AStar {
	grid: InstanceType<typeof Grid>;
	diagonalMovement: DiagonalMovement;
	start?: Point;
	end?: Point;

	constructor({diagonalMovement, grid}: AStarInterface)
	{
		if(!(grid instanceof Grid))
			throw new Error("Expected instance of Grid");
		
		this.grid = grid;
		this.diagonalMovement = diagonalMovement ?? DiagonalMovement.Never;
	}

	findPath(start: Point, end?: Point) {

		this.start = start;
		this.end = end;

		const grid = this.grid.clone();
		const openList = new Heap(function (nodeA: Node, nodeB: Node) {
			return nodeA.f - nodeB.f;
		});
		const closedList: Array<Node> = [];
		const startNode = grid.getNodeAt(start!.x, start!.y) as Node;
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
				return backtrace(node);
			
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

	isGoal({x, y}: Node): boolean {
		return x === this.end!.x && y === this.end!.y;
	}

	getHeuristic(node: Node): number {
		const dx = Math.abs( this.end!.x - node.x );
		const dy = Math.abs( this.end!.y - node.y );

		if(this.diagonalMovement)
			return Heuristic.octile(dx, dy);
		
		return Heuristic.manhattan(dx, dy);
	}

	getCost(node: Node, neighbour: Node): number {
		return node.g + (neighbour.x - node.x === 0 || neighbour.y - node.y === 0 ? 1 : Math.SQRT2);
	}

	getNoGoalResult(closedList: Array<Node>)
	{
		return null;
	}
}