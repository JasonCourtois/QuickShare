import { useParams } from 'react-router-dom';
import FileList from "./files/FileList.tsx";
import FilePreview from "./files/FilePreview.tsx";
import {gekko_file_id, gamble_file_id, getFileMetaData} from "./AppWriteUtil.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import type {FileMetaData} from "./types/FileTypes.ts";

const RoomPage = () => {
	const {roomId} = useParams();

	// Used for FilePreview
	const [previewIndex, setPreviewIndex] = useState(0);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	// TODO: Get fileIds live from the
	const [fileIds, setFileIds] = useState<string[]>([gekko_file_id, gamble_file_id]);
	const [fileMap, setFileMap] = useState<Record<string, FileMetaData>>({});
	const fileMapRef = useRef(fileMap);

	useEffect(() => {
		fileMapRef.current = fileMap;
	}, [fileMap]);

	// Get FileMetaData for each ID
	useEffect(() => {
		let isCancelled: boolean = false;

		const updateFileMap = async () => {
			const updatedMap = {...fileMapRef.current};
			const currentKeys: string[] = Object.keys(updatedMap);

			// Remove old removed files
			const removedIds: string[] = currentKeys.filter((key) => (!fileIds.includes(key)))
			for (const id of removedIds) {
				delete updatedMap[id];
			}

			// Add newly added files
			const newIds: string[] = fileIds.filter((id) => !currentKeys.includes(id));
			for (const id of newIds) {
				try {
					updatedMap[id] = await getFileMetaData(id);
				} catch (err) {
					console.error(err);
				}
			}

			if (!isCancelled) {
				setFileMap(updatedMap);
			}
		}

		updateFileMap().catch(console.error);

		return () => {
			isCancelled = true;
		}
	}, [fileIds]);

	const setIndexWithBoundsChecking = useCallback((index: number) => {
		if (index < 0) index = 0;
		if (index >= fileIds.length) index = fileIds.length - 1;
		setPreviewIndex(index);
	}, [fileIds, setPreviewIndex]);

	return (
		<div>
			<p>Room id: {roomId}</p>
			<FilePreview files={Object.values(fileMap)} previewIndex={previewIndex} setPreviewIndex={setIndexWithBoundsChecking}
			             isOpen={isPreviewOpen} setIsOpen={setIsPreviewOpen} />
			<FileList fileMap={fileMap} setPreviewIndex={setPreviewIndex} setPreviewIsOpen={setIsPreviewOpen} />
		</div>
	)
}

export default RoomPage;