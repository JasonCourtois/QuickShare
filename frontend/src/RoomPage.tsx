import { useParams } from 'react-router-dom';
import { FileList } from "./files/FileList.tsx";

const RoomPage = () => {
	const {roomId} = useParams();
	return (
		<div>
			<p>Room id: {roomId}</p>
			<FileList/>
		</div>
	)
}

export default RoomPage;