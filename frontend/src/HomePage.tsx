import {useNavigate} from "react-router-dom";

export const Test = () => {
	return <div>Hello world!</div>;
};

const HomePage = () => {
	const navigate = useNavigate();

	const createRoom = async () => {
		try {
			// const res  = await fetch("api/create");
			// const data = await res.json();
			const roomId = 'hello-world';

			if (roomId) {
				navigate(`/room/${roomId}`);
			} else {
				console.error('No room ID returned');
			}
		} catch (err) {
			console.error('Failed to create room: ', err)
		}
	}

	return (
		<button onClick={createRoom}>
			Create Room
		</button>
	);
};

export default HomePage;