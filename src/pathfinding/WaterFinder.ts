import { backtrace } from "pathfinding/src/core/Util";
import Grid from "pathfinding/src/core/Grid";

import AStar, { Node } from "./AStar";
import Point from "../generic/Point";

export default class WaterFinder extends AStar
{
	getHeuristic(node: Node)
	{
		return node.y * 1000;
	}

	getCost(node: Node, neighbour: Node)
	{
		const dx = Math.abs( neighbour.x - node.x );
		const dy = neighbour.y - node.y;

		if(dx === 0 && dy > 0)
			return node.g; // NB: No cost to flow downwards

		if(dy === 0)
			return node.g + 1; // NB: Small cost to flow across

		if(dy < 0)
			return node.g + 100; // NB: Large cost to flow upwards

		throw new Error("Unexpected state");
	}

	isGoal({x, y}: Point)
	{
		return false;
	}

	getNoGoalResult(closedList: Array<Node>, grid: InstanceType<typeof Grid>):any
	{
		// TODO: Trace all routes from edge, then find the cost

		const edgeNodes = closedList.filter(node => {

			if(node.x === this.start!.x && node.y === this.start!.y)
				return false;

			if(node.x === 0 || node.y === 0 || node.x === this.grid.width - 1 || node.y === this.grid.height - 1)
				return true;

			return false;

		}).sort((a: Node, b: Node) => {
			return a.y > b.y ? -1 : 1; // TODO: I don't think this is going to work well, the lowest point isn't necessarily the first reached. Need to be using G or F really
		});

		return edgeNodes
			.map( backtrace )
			.map( ( pointsAsArray: any ) => {
				// TODO: I know backtrace returns an array of points in the form of arrays. Is there any way to better represent this here?
				return pointsAsArray.map((arr: Array<number>) => { 

					const x: number = arr[0];
					const y: number = arr[1];

					return {
						x,
						y,
						g: grid.getNodeAt(x, y).g
					};

				});
			} );
	}
}