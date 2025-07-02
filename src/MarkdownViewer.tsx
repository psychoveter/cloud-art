import { useEffect, useState } from 'react'

interface MarkdownViewerProps {
  url: string
}

export function MarkdownViewer({ url }: MarkdownViewerProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then(res => res.text())
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading markdown:', err)
        setContent('Error loading content')
        setLoading(false)
      })
  }, [url])

  if (loading) {
    return <div className="markdown-viewer loading">Loading...</div>
  }

  // Simple markdown to HTML conversion
  const convertMarkdown = (md: string): string => {
    let html = md
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
    html = '<p>' + html + '</p>'
    
    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    return html
  }

  return (
    <div className="markdown-viewer">
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: convertMarkdown(content) }}
      />
    </div>
  )
}