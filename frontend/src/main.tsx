import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Uploader from './Uploader.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Uploader/>
	</StrictMode>,
)
