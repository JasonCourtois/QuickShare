import React, {useState} from 'react';
import {Account, Client, Storage, Permission, Role, ID} from "appwrite";

const UploadButton = () => {
	const [file, setFile] = useState<File | null>(null);

	const APPWRITE_ENDPOINT: string = 'https://fra.cloud.appwrite.io/v1';
	const APPWRITE_PROJECT_ID: string = 'quickshare';
	const APPWRITE_BUCKET_ID: string = '68387289001b750812f7';

	// Appwrite connection
	const client: Client = new Client()
		.setEndpoint(APPWRITE_ENDPOINT)
		.setProject(APPWRITE_PROJECT_ID);

	const storage = new Storage(client);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || (e.target.files.length < 1)) {
			return;
		}
		setFile(e.target.files[0]);
	}

	const handleUpload = async () => {
		if (!file) return alert('Please select a file!');

		try {
			const account = new Account(client);
			await account.createAnonymousSession();
			const user = await account.get();

			const response = await storage.createFile(
				APPWRITE_BUCKET_ID,
				ID.unique(),
				file,
				[
					Permission.read(Role.user(user.$id)),
					Permission.write(Role.user(user.$id)),
				]);
			console.log('Response: ', response);
			const fileID: string = response.$id;
			const downloadURL: string = storage.getFileView(APPWRITE_BUCKET_ID, fileID);
			console.log(downloadURL);

			console.log('Upload complete: ', response);
			alert('Upload successfully');
		} catch (error) {
			console.log('Upload failed: ', error);
			alert('There was an error trying to upload the file!');
		}
	}

	return (
		<>
			<input type='file' onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload File</button>
		</>
	)
}

export default UploadButton;