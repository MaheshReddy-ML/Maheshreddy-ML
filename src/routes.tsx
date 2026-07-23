import { createBrowserRouter } from 'react-router'
import { Root } from './root'
import { Home, Projects, Expertise, Research, Contact, NotFound } from './pages'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'projects', Component: Projects },
      { path: 'expertise', Component: Expertise },
      { path: 'research', Component: Research },
      { path: 'contact', Component: Contact },
      { path: '*', Component: NotFound },
    ],
  },
])
