import {useCallback} from "react";
import type {FileMetaData} from "../types/FileTypes.ts";

const FileItem = ({metadata, index, setPreviewIndex, setPreviewIsOpen} : {metadata: FileMetaData, index: number
	setPreviewIndex: (index: number) => void, setPreviewIsOpen: (value: boolean) => void}
) => {
	const onClickHandler = useCallback(() => {
		setPreviewIndex(index);
		setPreviewIsOpen(true);
	}, [index, setPreviewIndex, setPreviewIsOpen]);

	if (!metadata) return <div>Loading...</div>

	return (
		<div style={{
			display: 'flex',
			gap: '1rem',
			justifyContent: 'space-between',
		}}>
			<p>{metadata.name}</p>
			<button onClick={onClickHandler}>Open Preview</button>
		</div>
	)
};

export const FileList = ({fileMap, setPreviewIndex, setPreviewIsOpen} : {fileMap: Record<string, FileMetaData>,
	setPreviewIndex: (index: number) => void, setPreviewIsOpen: (value: boolean) => void}
) => {
	return (
		<div>
			{Object.entries(fileMap).map(([fileId, metadata], index) => (
				<FileItem key={fileId} metadata={metadata} index={index} setPreviewIndex={setPreviewIndex}
				          setPreviewIsOpen={setPreviewIsOpen} />
			))}
		</div>
	);
};

export default FileList;