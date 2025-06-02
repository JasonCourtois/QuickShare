import {useState, useEffect} from 'react';
import type {FileMetaData} from "./types/FileTypes.ts";
import {getFileMetaData} from "./AppWriteUtil.ts";

const FilePreviewInPlace = (metaData: FileMetaData) => {
	const [previewShown, setPreviewShown] = useState(false);
	console.log(metaData);

	const isImage: boolean = /^image\/(png|jpg|jpeg|gif|bmp|webp)$/i.test(metaData.mimeType);
	const isPdf:   boolean = /^application\/pdf$/i.test(metaData.mimeType);
	const isVideo: boolean = /^video\/(mp4|webm|ogg)$/i.test(metaData.mimeType);

	const togglePreview = () => setPreviewShown(!previewShown);

	const imagePreview = <img src={metaData.url}
	                          alt="Preview"
	                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/>;

	const pdfPreview   = <iframe src={metaData.url}
	                             title="Preview"/>;

	const videoPreview = <video src={metaData.url}
	                            title="Preview"
	                            controls
								style={{width: '100%^', maxHeight: '100%', objectFit: 'cover'}}
						> Your browser does not support this video format.</video>;

	return (
		<>
			<button onClick={togglePreview}>{previewShown ? "Hide Preview" : "Show Preview"}</button>
			{previewShown && (
				<div>{
					isImage ? imagePreview :
					isPdf   ? pdfPreview   :
					isVideo ? videoPreview : "Preview not supported for this file type"
				}</div>
			)}
		</>
	)
};

// const FilePreviewWindow = (metaData: FileMetaData) => {
// 	const handlePreview = () => {
// 		window.open(metaData.url, "_blank");
// 	};
//
// 	return (
// 		<>
// 			<button onClick={handlePreview}>Preview File</button>
// 		</>
// 	)
// };

const FileItem = ({fileId} : {fileId: string}) => {
	const [fileMeta, setFileMeta] = useState<FileMetaData | null>(null);

	useEffect(()=>{
		const fetchMetaData = async () => {
			try {
				const data = await getFileMetaData(fileId);
				setFileMeta(data);
			} catch (error) {
				console.error(error);
				setFileMeta(null);
			}
		};
		fetchMetaData().catch(error => {
			console.error(error);
			setFileMeta(null);
		});
	}, [fileId]);

	if (!fileMeta) return <div>Loading...</div>

	return (
		<>
			<div>Hello World</div>
			{/*<FilePreviewWindow url={url}/>*/}
			<FilePreviewInPlace {...fileMeta} />
		</>
	)
};

export default FileItem