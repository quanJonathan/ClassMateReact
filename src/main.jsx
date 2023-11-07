import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import theme from './theme'

import Root from "./routes/root"

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import SignIn from './routes/sign-in'
import { ThemeProvider, CssBaseline } from '@mui/material'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [],
  },
  {
    path: "/sign-in",
    element: <SignIn/>,
    children: [],
   }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline/>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>,
)
