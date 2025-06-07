import { Routes, Route } from 'react-router-dom';
import HomePage, {Test} from "./HomePage.tsx";
import RoomPage from "./types/RoomPage.tsx";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage/>}/>
			<Route path="/test" element={<Test/>}/>
			<Route path="/room/:roomId" element={<RoomPage/>}/>
		</Routes>
	);
};

export default App