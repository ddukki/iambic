import React from 'react'
import ReactDOM from 'react-dom/client'
import { PoemRenderer } from '../src/react'
import poem from './poem.json'

const pa = poem as any

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0ebe3',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '2rem 1rem',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.75rem',
    color: '#2c1810',
    margin: 0,
    fontWeight: 400,
  },
  author: {
    fontFamily: 'Georgia, serif',
    color: '#6b4c3b',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    marginTop: '0.25rem',
    marginBottom: '2rem',
  },
  poemFrame: {
    background: '#fffaf5',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '1.5rem 2rem',
  },
}

function App() {
  return React.createElement('div', { style: styles.page },
    React.createElement('h1', { style: styles.title }, pa.meta?.title),
    React.createElement('p', { style: styles.author }, `by ${pa.meta?.author}`),
    React.createElement('div', { style: styles.poemFrame },
      React.createElement(PoemRenderer, { poem: pa })
    ),
  )
}

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(React.createElement(App))
}
