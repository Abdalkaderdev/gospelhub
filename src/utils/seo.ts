export const updateMetaTags = (title: string, description: string, url: string, image?: string) => {
  // Update title
  document.title = title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);

  // Update Open Graph tags
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'GospelHub' }
  ];

  if (image) {
    ogTags.push({ property: 'og:image', content: image });
  }

  ogTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // Update Twitter Card tags
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@GospelHub' }
  ];

  if (image) {
    twitterTags.push({ name: 'twitter:image', content: image });
  }

  twitterTags.forEach(({ name, content }) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

export const generateVerseShareData = (book: string, chapter: number, verse: number, text: string) => {
  const title = `${book} ${chapter}:${verse} - GospelHub`;
  const description = `"${text.substring(0, 140)}..." - Read more Bible verses at GospelHub`;
  const url = `https://gospelhub.space/${encodeURIComponent(book)}/${chapter}/${verse}`;
  
  return { title, description, url };
};

export const generateStructuredData = (book: string, chapter: number, verse: number, text: string) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${book} ${chapter}:${verse}`,
    "description": text,
    "author": {
      "@type": "Organization",
      "name": "GospelHub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GospelHub",
      "url": "https://gospelhub.space"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://gospelhub.space/${encodeURIComponent(book)}/${chapter}/${verse}`
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  };

  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
};