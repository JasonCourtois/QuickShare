import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import FileItem from "./File.tsx";
import Uploader from './Uploader.tsx'
import {gekko_file_id, gamble_file_id} from "./AppWriteUtil.ts";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div>
			<FileItem fileId={gekko_file_id}/>
			<div>This should be after the overlay</div>
			<FileItem fileId={gamble_file_id}/>
			<Uploader/>
		</div>
	</StrictMode>,
)
