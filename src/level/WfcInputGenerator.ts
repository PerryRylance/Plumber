import { WFCTool2D } from "../lib/ndwfc/ndwfc-tools";

import { Tile } from "./Tileset";

export class WfcInputGenerator
{
	static fromTileset(tileset: Array<Tile>)
	{
		const tool = new WFCTool2D();

		for(const definition of tileset)
		{
			// TODO: Is any valid here?
			const args: any = [
				definition.cells.replace(/^\s*\n?/gm, "").trim()
			];

			if("options" in definition)
				args.push(definition.options);

			tool.addTile.apply(tool, args);
		}

		return {
			input: tool.generateWFCInput(),
			tiles: tool.getTiles(),
			tool
		};
	}
}