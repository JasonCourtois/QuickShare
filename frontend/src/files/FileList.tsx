import {gekko_file_id, gamble_file_id} from "../AppWriteUtil.ts";
import FileItem from "./FilePreview.tsx";
import {useEffect, useState} from "react";

export const FileList = ({roomId} : {roomId: string}) => {
	const [fileIds, setFileIds] = useState<string[]>([]);

	useEffect(() => {
		const fetchFileIds = async () => {
			// const files = await fetch(`/api/files/${roomId}`);
			setFileIds([gekko_file_id, gamble_file_id]);
		}

		fetchFileIds().catch(console.error);
	}, [roomId]);

	return (
		<div>
			{fileIds.map((fileId: string) => {
				return (
					<FileItem key={fileId} fileId={fileId}/>
				)
			})}
		</div>
	);
};