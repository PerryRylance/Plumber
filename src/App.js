import './App.css';

import Level from './level/Level';
import { useMemo } from 'react';

function App() {

	const level = useMemo(() => {
		const level = new Level();
		level.generate();
		return level;
	})

	return (
		<div className="App">
			{level.tables}
		</div>
	);
}

export default App;
