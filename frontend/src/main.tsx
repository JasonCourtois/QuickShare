import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {FileList} from "./FileList.tsx";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<FileList/>
	</StrictMode>,
)
