import {Client, Storage} from "appwrite";
import type {FileMetaData} from "./types/FileTypes.ts";

const APPWRITE_ENDPOINT   : string = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID : string = 'quickshare';
const APPWRITE_BUCKET_ID  : string = '68387289001b750812f7';

export const  gekko_file_id = "683875570032d81b9797";
export const gamble_file_id = "683dca2a003667c8673e";

// Appwrite connection
const client: Client = new Client()
	.setEndpoint(APPWRITE_ENDPOINT)
	.setProject(APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const getFileMetaData = async (fileId: string): Promise<FileMetaData> => {
	try {
		const file = await storage.getFile(APPWRITE_BUCKET_ID, fileId);
		return {
			name: file.name,
			mimeType: file.mimeType,
			url: storage.getFileView(APPWRITE_BUCKET_ID, fileId)
		};
	} catch (error) {
		console.error("Error fetching file metadata: ", error);
		throw error;
	}
}
