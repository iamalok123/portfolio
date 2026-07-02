export default async function handler(req, res) {
  try {
    const { slug } = req.query;
    
    // 1. Fetch the default index.html from the current deployment
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    // Fetch the base HTML
    const htmlRes = await fetch(`${baseUrl}/index.html`);
    let html = await htmlRes.text();

    // 2. Fetch the blog metadata from the backend
    const apiUrl = process.env.VITE_API_URL || 'https://portfolio-backend-kappa-plum.vercel.app/api';
    let blogData = null;
    
    try {
      const blogRes = await fetch(`${apiUrl}/blogs/${slug}`);
      if (blogRes.ok) {
        const json = await blogRes.json();
        if (json.success && json.data) {
          blogData = json.data;
        }
      }
    } catch (err) {
      console.error('Failed to fetch blog data for OG tags:', err);
    }

    // 3. Inject dynamic OG tags if blog data exists
    if (blogData) {
      const title = `${blogData.title} | Alok Hotta`;
      const description = blogData.content 
        ? blogData.content.substring(0, 160).replace(/[^a-zA-Z0-9 ]/g, '') + '...' 
        : 'Read this article by Alok Hotta.';
      
      const imageUrl = blogData.coverImage 
        ? (blogData.coverImage.startsWith('http') ? blogData.coverImage : `${apiUrl.replace('/api', '')}/assets/blog/${blogData.coverImage}`)
        : `${baseUrl}/og-image.png`;

      // Replace Title
      html = html.replace(
        /<title>.*?<\/title>/i,
        `<title>${title}</title>`
      );
      
      // Replace standard meta description
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"/i,
        `<meta name="description" content="${description}"`
      );

      // Replace OG Title
      html = html.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"/i,
        `<meta property="og:title" content="${title}"`
      );

      // Replace OG Description
      html = html.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"/i,
        `<meta property="og:description" content="${description}"`
      );

      // Replace OG Image
      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"/i,
        `<meta property="og:image" content="${imageUrl}"`
      );

      // Replace Twitter Title
      html = html.replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"/i,
        `<meta name="twitter:title" content="${title}"`
      );

      // Replace Twitter Description
      html = html.replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"/i,
        `<meta name="twitter:description" content="${description}"`
      );

      // Replace Twitter Image
      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"/i,
        `<meta name="twitter:image" content="${imageUrl}"`
      );
    }

    // 4. Send the modified HTML back to the browser / bot
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Vercel OG Function Error:', error);
    // Fallback to plain response
    res.status(500).send('Error rendering page');
  }
}
