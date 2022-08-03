import { WFCTool2D } from "../lib/ndwfc/ndwfc-tools";

export class WfcInputGenerator
{
	static fromTileset(tileset)
	{
		const tool = new WFCTool2D();

		for(const definition of tileset)
		{
			const args = [
				definition.cells.replace(/^\s*\n?/gm, "").trim("\n")
			];

			if("options" in definition)
				args.push(definition.options);

			tool.addTile.apply(tool, args);
		}

		return {
			input: tool.generateWFCInput(),
			tiles: tool.getTiles()
		};
	}
}