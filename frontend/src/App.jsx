import React, { useState } from 'react';

const resumeIdeaText = `
**Website Idea: AI Resume + Cover Letter Builder**

Goal: Create a simple AI-powered website generating job-ready resumes and cover letters.

Target Users:
- Job seekers without strong writing or formatting skills
- ESL applicants
- Entry-level workers or career switchers

Core Features:
1. Input job history, skills, education, and target job title
2. AI-generated resume and cover letter
3. Export PDF/DOCX
4. Premium features: ATS optimization, templates

Monetization:
- Free with watermark
- $5 one-time export
- $9/month unlimited downloads and editing
`;

function Sidebar() {
  return (
    <div style={{
      width: '320px',
      background: '#f4f4f4',
      padding: '20px',
      height: '100vh',
      overflowY: 'auto',
      borderRight: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
    }}>
      <h2>Saved Idea: Resume Builder</h2>
      <pre>{resumeIdeaText}</pre>
    </div>
  );
}

function ProductResult({ product, locked }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 6,
      padding: 12,
      marginBottom: 12,
      opacity: locked ? 0.5 : 1,
      position: 'relative',
      background: '#fff'
    }}>
      {locked && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#ff6347',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: 4,
          fontWeight: 'bold',
          fontSize: 12,
        }}>Locked</div>
      )}
      <img src={product.image} alt={product.title} width={80} height={80} style={{ float: 'left', marginRight: 12, objectFit: 'contain' }} />
      <div>
        <h3 style={{ margin: '0 0 6px' }}>{product.title}</h3>
        <div>Price: ${product.price}</div>
        <div>Rating: {product.rating} ⭐ ({product.reviews} reviews)</div>
        <div>Est. Monthly Sales: {product.monthlySales}</div>
        <div>Estimated Profit Margin: {product.profitMargin}%</div>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts(q) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!data.search_results) {
        setError('No products found.');
        setResults([]);
        setLoading(false);
        return;
      }

      // Map Rainforest API response to our product format
      const products = data.search_results.map(p => ({
        id: p.asin,
        title: p.title,
        price: p.price?.value || 'N/A',
        rating: p.rating || 'N/A',
        reviews: p.reviews || 0,
        monthlySales: Math.floor(Math.random() * 400) + 300, // Placeholder
        profitMargin: Math.floor(Math.random() * 30) + 30,    // Placeholder
        image: p.images?.[0]?.link || 'https://via.placeholder.com/80'
      }));

      setResults(products);
    } catch (err) {
      setError('Failed to fetch products.');
      setResults([]);
    }
    setLoading(false);
  }

  function onSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    fetchProducts(query);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 20, fontFamily: 'Arial, sans-serif' }}>
        <h1>Amazon High-Profit Product Finder</h1>
        <form onSubmit={onSearch} style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter product keyword (e.g. 'kitchen')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '300px',
              padding: '10px',
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ccc',
              marginRight: 8,
            }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#0070f3',
            color: '#fff',
            cursor: 'pointer'
          }}>
            Search
          </button>
        </form>
        {loading && <div>Loading products...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {results.length > 0 && (
          <div>
            {results.map((product, idx) => (
              <ProductResult
                key={product.id}
                product={product}
                locked={idx >= 3} // Only show first 3 free
              />
            ))}
            {results.length > 3 && (
              <div style={{ marginTop: 10, color: '#666', fontStyle: 'italic' }}>
                Upgrade to Pro to unlock all results!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
