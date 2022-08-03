import logo from './logo.svg';
import './App.css';

import WFC from "./lib/ndwfc/ndwfc";
import { WFCTool2D } from "./lib/ndwfc/ndwfc-tools";
import Level from './level/Level';

function App() {

	const level = new Level();
	level.generate();

	return (
		<div className="App">
			{level.table}
		</div>
	);
}

export default App;
