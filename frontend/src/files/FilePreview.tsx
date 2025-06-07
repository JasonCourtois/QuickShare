import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {getFileMetaData} from "../AppWriteUtil.ts";
import type {FileMetaData} from "../types/FileTypes.ts";
import styles from "./FilePreview.module.css";

const width: string = '70vw';

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
		     alt='Image preview'
		     style={{
			     maxWidth: width,
			     objectFit: 'contain',
			     display: 'block',
		     }}
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
		       style={{maxWidth: width, objectFit: 'cover'}}
		       onError={() => setError(true)}
		> Your browser does not support this video format.</video>
	);
};

export const FilePreview = ({metadata, isOpen, setIsOpen}
	: {metadata: FileMetaData, isOpen: boolean, setIsOpen: (value: boolean) => void}
) => {
	const isImage: boolean = metadata.mimeType.startsWith('image/');
	const isVideo: boolean = metadata.mimeType.startsWith('video/');
	const isPdf:   boolean = /^application\/pdf$/i.test(metadata.mimeType);

	const overlayRoot = document.getElementById('overlay-root');

	const previewOverlay =
		<div className={styles['preview-overlay']} onClick={() => setIsOpen(false)}>
			<button
				className={styles['close-preview-button']}
				onClick={() => setIsOpen(false)}
				aria-label="Close Preview"
			> × </button>
			{isOpen && (
				<div
					onClick={(e) => e.stopPropagation()}
					style={{
						maxWidth: '90vw',
						maxHeight: '90vh',
						overflow: 'auto',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>{
					isImage ? <ImagePreview url={metadata.url}/> :
					isVideo ? <VideoPreview url={metadata.url}/> :
					isPdf   ? <PdfPreview   url={metadata.url}/> : <UnsupportedPreview/>
				}</div>
			)}
		</div>

	return (
		<>
			{isOpen && overlayRoot && createPortal(previewOverlay, overlayRoot)}
		</>
	)
};

const FileItem = ({fileId} : {fileId: string}) => {
	const [metadata, setMetadata] = useState<FileMetaData | null>(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
		<div style={{
			display: 'flex',
			gap: '1rem',
			justifyContent: 'space-between',
		}}>
			<p>{metadata.name}</p>
			<button onClick={() => {setIsPreviewOpen(true)}}>Open Preview</button>
			{isPreviewOpen &&
				<FilePreview metadata={metadata} isOpen={isPreviewOpen} setIsOpen={setIsPreviewOpen} />
			}
		</div>
	)
};

export default FileItem