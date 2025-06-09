import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
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

export const FilePreview = ({files, previewIndex, setPreviewIndex, isOpen, setIsOpen}
	: {files: FileMetaData[], previewIndex: number, setPreviewIndex: (index: number) => void
	isOpen: boolean, setIsOpen: (value: boolean) => void}
) => {
	useEffect(() => {
		if (files.length <= 0) {
			setIsOpen(false);
		} else if (previewIndex < 0) {
			console.error(`Index given to file preview must be at least 0. Index given: ${previewIndex}`);
			setPreviewIndex(0);
		} else if (previewIndex >= files.length) {
			console.error(`Index given to file preview must be less than ${files.length}. Index given: ${previewIndex}`);
			setPreviewIndex(files.length - 1);
		}
	}, [files, previewIndex, setPreviewIndex, setIsOpen]);

	if (files.length <= 0) return null;

	const file: FileMetaData = files[previewIndex];

	const isImage: boolean = file.mimeType.startsWith('image/');
	const isVideo: boolean = file.mimeType.startsWith('video/');
	const isPdf:   boolean = /^application\/pdf$/i.test(file.mimeType);

	const overlayRoot = document.getElementById('overlay-root');

	const previewOverlay =
		<div className={styles['preview-overlay']} onClick={() => setIsOpen(false)}>
			<button
				className={styles['close-preview-button']}
				onClick={() => setIsOpen(false)}
				aria-label="Close Preview"
			> × </button>
			<button onClick={(e) => { e.stopPropagation(); setPreviewIndex(previewIndex - 1)}}>Previous Image</button>
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
					isImage ? <ImagePreview url={file.url}/> :
					isVideo ? <VideoPreview url={file.url}/> :
					isPdf   ? <PdfPreview   url={file.url}/> : <UnsupportedPreview/>
				}</div>
			)}
			<button onClick={(e) => { e.stopPropagation(); setPreviewIndex(previewIndex + 1)}}>Next Image</button>
		</div>

	return (
		<>
			{isOpen && overlayRoot && createPortal(previewOverlay, overlayRoot)}
		</>
	)
};

export default FilePreview