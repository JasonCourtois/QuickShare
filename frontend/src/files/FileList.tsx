import {getFileMetaData} from "../AppWriteUtil.ts";
import FileItem from "./FilePreview.tsx";
import {useEffect, useRef, useState} from "react";
import type {FileMetaData} from "../types/FileTypes.ts";

export const FileList = ({fileIds} : {fileIds: string[]}) => {
	const [fileMap, setFileMap] = useState<Record<string, FileMetaData>>({});
	const fileMapRef = useRef(fileMap);
	
	useEffect(() => {
		fileMapRef.current = fileMap;
	}, [fileMap]);

	useEffect(() => {
		const updatedMap = {...fileMapRef.current};
		const currentKeys: string[] = Object.keys(updatedMap);

		const removeOldMetaData = () => {
			const removedIds: string[] = Object.keys(currentKeys).filter((key) => (!fileIds.includes(key)))
			for (const id in removedIds) {
				delete updatedMap[id];
			}
		};

		const addNewMetadata = async () => {
			const newIds: string[] = fileIds.filter((id) => !currentKeys.includes(id));
			for (const id of newIds) {
				try {
					updatedMap[id] = await getFileMetaData(id);
				} catch (err) {
					console.error(err);
				}
			}
		}

		removeOldMetaData();
		addNewMetadata().catch(console.error);
		setFileMap(updatedMap);
	}, [fileIds]);

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