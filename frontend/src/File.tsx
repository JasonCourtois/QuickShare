import React from "react";

interface FileProps {
	url: string;
	type : string;
}

const FilePreview: React.FC<FileProps> = ({url, type} : FileProps) => {
	// const type: string = file.type;

	if (type.startsWith('image/')) {
		return <img src={url} alt="preview"/>
	} else if (type.startsWith('video/')) {
		return <video src={url} controls/>
	} else if (type.startsWith('application/pdf')) {
		return <iframe src={url}/>
	} else {
		return <p>No preview available for file type.</p>
	}
}

export default FilePreview