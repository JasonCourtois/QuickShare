import { useParams } from 'react-router-dom';
import { FileList } from "./files/FileList.tsx";
import {gekko_file_id, gamble_file_id} from "./AppWriteUtil.ts";

const RoomPage = () => {
	const {roomId} = useParams();
	return (
		<div>
			<p>Room id: {roomId}</p>
			<FileList fileIds={[gekko_file_id, gamble_file_id]}/>
		</div>
	)
}

export default RoomPage;