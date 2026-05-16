import React from 'react'
import ReactDOM from 'react-dom/client'
import { PoemRenderer } from '../src/react'
import poem from './poem.json'

function App() {
  return React.createElement('div', { style: { padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
    React.createElement('h1', { style: { fontFamily: 'Georgia, serif', marginBottom: '0.5rem', fontSize: '1.5rem', color: '#333' } }, (poem as any).meta.title),
    React.createElement('p', { style: { fontFamily: 'Georgia, serif', color: '#666', marginBottom: '2rem', fontStyle: 'italic' } }, `by ${(poem as any).meta.author}`),
    React.createElement(PoemRenderer, { poem: poem as any })
  )
}

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(React.createElement(App))
}
