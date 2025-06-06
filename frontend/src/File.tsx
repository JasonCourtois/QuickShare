import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {getFileMetaData} from "./AppWriteUtil.ts";
import type {FileMetaData} from "./types/FileTypes.ts";

const UnsupportedPreview = () => {
	return <div>Preview not supported</div>
}

const ImagePreview = ({url} : {url: string}) => {
	const [error, setError] = useState(false);

	if (error) {
		return <UnsupportedPreview/>;
	}

	return (
		<img src={url}
		     alt="Image preview"
		     style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
			 onError={() => setError(true)}/>
	);
};

const PdfPreview = ({url}: {url: string}) => {
	return <iframe src={url} title="Preview"/>;
}

const VideoPreview = ({url} : {url: string}) => {
	const [error, setError] = useState(false);

	if (error) {
		return <UnsupportedPreview/>;
	}

	return (
		<video src={url}
		       title="Preview"
		       controls
		       style={{width: '100%^', maxHeight: '100%', objectFit: 'cover'}}
		       onError={() => setError(true)}
		> Your browser does not support this video format.</video>
	);
};

const FilePreviewInPlace = (metadata: FileMetaData) => {
	const [previewShown, setPreviewShown] = useState(false);
	console.log(metadata);

	const isImage: boolean = metadata.mimeType.startsWith('image/');
	const isVideo: boolean = metadata.mimeType.startsWith('video/');
	const isPdf:   boolean = /^application\/pdf$/i.test(metadata.mimeType);

	const togglePreview = () => setPreviewShown(!previewShown);
	const overlayRoot = document.getElementById('overlay-root');

	const previewContent =
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			backgroundColor: 'rgba(0,0,0,0.6)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 9999,
		}} onClick={() => {console.log("Button clicked");}}>
			{previewShown && (
				<div
					onClick={(e) => e.stopPropagation()}
				>{
					isImage ? <ImagePreview url={metadata.url}/> :
						isVideo ? <VideoPreview url={metadata.url}/> :
							isPdf   ? <PdfPreview   url={metadata.url}/> : <UnsupportedPreview/>
				}</div>
			)}
		</div>

	return (
		<>
			<button onClick={togglePreview}>{previewShown ? "Hide Preview" : "Show Preview"}</button>
			{previewShown && overlayRoot && createPortal(previewContent, overlayRoot)}
		</>
	)
};

const FileItem = ({fileId} : {fileId: string}) => {
	const [metadata, setMetadata] = useState<FileMetaData | null>(null);

	useEffect(()=>{
		const fetchMetaData = async () => {
			try {
				const data = await getFileMetaData(fileId);
				setMetadata(data);
			} catch (error) {
				console.error(error);
				setMetadata(null);
			}
		};
		fetchMetaData().catch(error => {
			console.error(error);
			setMetadata(null);
		});
	}, [fileId]);

	if (!metadata) return <div>Loading...</div>

	return (
		<div>
			<p>{metadata.name}</p>
			<FilePreviewInPlace {...metadata} />
		</div>
	)
};

export default FileItem