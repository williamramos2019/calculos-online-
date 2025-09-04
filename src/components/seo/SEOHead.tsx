import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl
}) => {
  useEffect(() => {
    // Update title
    const fullTitle = title.includes('Calculadoras Online') ? title : `${title} | Calculadoras Online`
    document.title = fullTitle
    
    // Update description
    const descMeta = document.querySelector('meta[name="description"]')
    if (descMeta) {
      descMeta.setAttribute('content', description)
    }
    
    // Update keywords
    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]')
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta')
        keywordsMeta.setAttribute('name', 'keywords')
        document.head.appendChild(keywordsMeta)
      }
      keywordsMeta.setAttribute('content', keywords)
    }
    
    // Update canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonicalUrl)
    }
    
  }, [title, description, keywords, canonicalUrl])

  return null
}

export default SEOHead