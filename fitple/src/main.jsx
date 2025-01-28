import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import MainApp from './quiz/pages/MainApp.jsx'

createRoot(document.getElementById('root')).render(
    <MainApp />
)
