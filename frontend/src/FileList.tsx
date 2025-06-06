import {gekko_file_id, gamble_file_id} from "./AppWriteUtil.ts";
import FileItem from "./FilePreview.tsx";

export const FileList = () => {
	// const fileList: string[] = ["hello", "world", "yay!"];
	// const fileList:  = await fetch("/api/files/");
	const fileIds: string[] = [gekko_file_id, gamble_file_id];

	return (
		<div>
			{fileIds.map((fileId: string) => {
				return (
					<FileItem fileId={fileId}/>
				)
			})}
		</div>
	)
};