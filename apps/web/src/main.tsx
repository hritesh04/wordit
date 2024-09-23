import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import Routes from './routes/Routes.tsx'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <>
    <Analytics />
    <RouterProvider router={Routes} />
    <Toaster richColors position='top-center'/>
    </>
  // </React.StrictMode>,
)
