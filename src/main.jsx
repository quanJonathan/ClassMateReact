import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import theme from './theme'

import Root from "./routes/root"

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>,
)
