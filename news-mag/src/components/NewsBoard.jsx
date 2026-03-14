import { useEffect, useState, useCallback } from "react";
import NewsItem, { SkeletonCard } from "./NewsItems";

const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "de", label: "🇩🇪 German" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "fr", label: "🇫🇷 French" },
  { code: "it", label: "🇮🇹 Italian" },
  { code: "pt", label: "🇵🇹 Portuguese" },
  { code: "ru", label: "🇷🇺 Russian" },
  { code: "zh", label: "🇨🇳 Chinese" },
];

const TrendingCard = ({ article, index, darkMode }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className={`text-decoration-none flex-shrink-0 p-3 rounded shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"}`}
      style={{ width: "220px", display: "block", border: hovered ? "1px solid #dc3545" : "1px solid transparent", transform: hovered ? "translateY(-4px)" : "translateY(0)", transition: "transform 0.2s ease, border 0.2s ease" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="badge bg-danger mb-2">#{index + 1} Trending</span>
      <p className="mb-1 fw-bold" style={{ fontSize: "13px", lineHeight: "1.4" }}>
        {article.title?.length > 80 ? article.title.slice(0, 80) + "..." : article.title}
      </p>
      <small className="text-muted">{article.source?.name}</small>
    </a>
  );
};

const NewsBoard = ({ darkMode, selectedCategory }) => {
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [language, setLanguage] = useState("en");
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [stats, setStats] = useState({ totalFetched: 0, categoriesExplored: new Set(), bookmarksCount: 0 });

  const pageSize = 9;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchNews = useCallback((searchTerm = "", pageNum = 1, category = "general", lang = "en") => {
    if (!apiKey) { setError("API key is missing."); setLoading(false); return; }
    setLoading(true); setError(null);
    const baseUrl = "https://newsapi.org/v2/top-headlines?";
    const url = searchTerm
      ? `${baseUrl}q=${encodeURIComponent(searchTerm)}&language=${lang}&category=${category}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
      : `${baseUrl}country=us&language=${lang}&category=${category}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
    fetch(url).then(r => r.json()).then(data => {
      if (data.status === "ok") {
        setArticles(data.articles || []);
        setTotalResults(data.totalResults || 0);
        setStats(prev => ({ ...prev, totalFetched: data.totalResults || 0, categoriesExplored: new Set([...prev.categoriesExplored, category]) }));
      } else { setError(data.message || "Failed to fetch news"); }
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [apiKey]);

  const fetchTrending = useCallback(() => {
    if (!apiKey) return;
    setTrendingLoading(true);
    fetch(`https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=${apiKey}`)
      .then(r => r.json()).then(data => { if (data.status === "ok") setTrendingArticles(data.articles || []); })
      .catch(err => console.log(err)).finally(() => setTrendingLoading(false));
  }, [apiKey]);

  useEffect(() => { fetchTrending(); }, [fetchTrending]);
  useEffect(() => { setPage(1); }, [query, selectedCategory, language]);
  useEffect(() => {
    const t = setTimeout(() => fetchNews(query, page, selectedCategory, language), 500);
    return () => clearTimeout(t);
  }, [query, page, selectedCategory, language, fetchNews]);
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setStats(prev => ({ ...prev, bookmarksCount: bookmarks.length }));
  }, [bookmarks]);

  const handleBookmark = (article) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.url === article.url);
      return exists ? prev.filter(b => b.url !== article.url) : [...prev, article];
    });
  };
  const isBookmarked = (url) => bookmarks.some(b => b.url === url);
  const totalPages = Math.ceil(totalResults / pageSize);
  const handlePrev = () => { if (page > 1) { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const handleNext = () => { if (page < totalPages) { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  const handlePrint = () => {
    const content = articles.map((a, i) => `
      <div style="margin-bottom:20px;border-bottom:1px solid #ccc;padding-bottom:10px;">
        <h3>${i + 1}. ${a.title || "No Title"}</h3>
        <p>${a.description || "No description."}</p>
        <p><strong>Source:</strong> ${a.source?.name || "Unknown"}</p>
        <p><strong>Published:</strong> ${a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ""}</p>
        <a href="${a.url}">${a.url}</a>
      </div>`).join("");
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>NewsMag</title>
      <style>body{font-family:Arial,sans-serif;padding:30px;max-width:800px;margin:0 auto;}h1{color:#dc3545;}</style>
      </head><body>
      <h1>NewsMag — ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News</h1>
      <p>Printed on: ${new Date().toLocaleString()}</p><hr/>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"} style={{ minHeight: "100vh", padding: "20px" }}>

      {/* Stats */}
      <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
        {[
          { value: stats.totalFetched.toLocaleString(), label: "Total Articles" },
          { value: stats.categoriesExplored.size, label: "Categories Explored" },
          { value: stats.bookmarksCount, label: "Bookmarked" },
          { value: page, label: "Current Page" },
        ].map((s, i) => (
          <div key={i} className={`text-center p-3 rounded shadow-sm ${darkMode ? "bg-secondary" : "bg-white"}`} style={{ minWidth: "140px" }}>
            <h4 className="text-danger fw-bold mb-0">{s.value}</h4>
            <small className="text-muted">{s.label}</small>
          </div>
        ))}
      </div>

      {/* Trending */}
      <div className="mb-5">
        <h4 className="mb-3 text-center">🔥 <span style={{ color: "red", fontWeight: "bold" }}>Trending</span> in Technology</h4>
        <div className="d-flex gap-3 pb-2 flex-wrap justify-content-center mx-auto" style={{ maxWidth: "1200px" }}>
          {trendingLoading
            ? Array(5).fill(0).map((_, i) => (
              <div key={i} className={`p-3 rounded shadow-sm flex-shrink-0 ${darkMode ? "bg-secondary" : "bg-white"}`} style={{ width: "220px" }}>
                <div style={{ height: "12px", width: "80%", background: darkMode ? "#777" : "#dee2e6", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s infinite ease-in-out" }} />
                <div style={{ height: "12px", width: "60%", background: darkMode ? "#777" : "#dee2e6", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
                <style>{`@keyframes pulse{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}`}</style>
              </div>
            ))
            : trendingArticles.map((article, index) => (
              <TrendingCard key={index} article={article} index={index} darkMode={darkMode} />
            ))
          }
        </div>
      </div>

      {/* News of the Day */}
      {!loading && articles.length > 0 && (
        <div
          className={`p-4 mb-5 rounded shadow ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"}`}
          style={{ border: "2px solid #dc3545", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: "0", right: "0" }}>
            <span className="badge bg-danger px-3 py-2" style={{ borderRadius: "0 0 0 12px", fontSize: "13px" }}>
              ⭐ News of the Day
            </span>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5 mb-3 mb-md-0">
              <img
                src={articles[0].urlToImage || "https://via.placeholder.com/600x300?text=No+Image"}
                alt={articles[0].title}
                className="img-fluid rounded"
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-7">
              {articles[0].source?.name && (
                <span className="badge bg-danger mb-2">{articles[0].source.name}</span>
              )}
              <h3 className="fw-bold mb-2" style={{ lineHeight: "1.4" }}>
                {articles[0].title}
              </h3>
              <p className="mb-3" style={{ opacity: 0.8 }}>
                {articles[0].description}
              </p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <small className="text-muted">
                  🕐 {articles[0].publishedAt ? new Date(articles[0].publishedAt).toLocaleString() : ""}
                </small>
                <a href={articles[0].url} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
                  Read Full Story →
                </a>
                <button
                  onClick={() => handleBookmark({
                    title: articles[0].title,
                    description: articles[0].description,
                    src: articles[0].urlToImage,
                    url: articles[0].url,
                    publishedAt: articles[0].publishedAt,
                    source: articles[0].source?.name,
                  })}
                  className={`btn btn-sm ${isBookmarked(articles[0].url) ? "btn-warning" : "btn-outline-warning"}`}
                >
                  🔖 {isBookmarked(articles[0].url) ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heading */}
      <h2 className="text-center mb-4">
        <span style={{ color: "red", fontWeight: "bold" }}>
          {query ? `Results for "${query}"` : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </span>{" "}{!query && "News"}
      </h2>

      {/* Controls */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4 flex-wrap">
        <input type="search" placeholder="Search news..." className="form-control" value={query}
          onChange={(e) => setQuery(e.target.value)} style={{ maxWidth: "300px" }} />
        <select className={`form-select ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
          style={{ maxWidth: "160px" }} value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
        </select>
        <button className={`btn ${showBookmarks ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setShowBookmarks(!showBookmarks)}>
          🔖 Bookmarks ({bookmarks.length})
        </button>
        <button className="btn btn-outline-secondary" onClick={handlePrint}>🖨️ Print</button>
      </div>

      {error && <p className="text-center text-danger fw-bold">Error: {error}</p>}

      {/* Bookmarks */}
      {showBookmarks && (
        <div>
          <h4 className="text-center mb-3"><span style={{ color: "orange" }}>Saved</span> Articles</h4>
          {bookmarks.length === 0
            ? <p className="text-center">No bookmarks yet.</p>
            : (
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                {bookmarks.map((news, index) => (
                  <NewsItem key={index} title={news.title} description={news.description}
                    src={news.src || "https://via.placeholder.com/300x200?text=No+Image"}
                    url={news.url} darkMode={darkMode} publishedAt={news.publishedAt}
                    isBookmarked={true} onBookmark={handleBookmark} source={news.source} />
                ))}
              </div>
            )}
          <hr className={darkMode ? "border-light mt-4" : "mt-4"} />
          <h4 className="text-center mb-3"><span style={{ color: "red" }}>Latest</span> News</h4>
        </div>
      )}

      {/* News Cards */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {loading && Array(pageSize).fill(0).map((_, i) => <SkeletonCard key={i} darkMode={darkMode} />)}
        {!loading && !error && articles.length === 0 && <p className="text-center w-100">No news found.</p>}
        {!loading && articles.map((news, index) => (
          <NewsItem key={index} title={news.title} description={news.description}
            src={news.urlToImage || "https://via.placeholder.com/300x200?text=No+Image"}
            url={news.url} darkMode={darkMode} publishedAt={news.publishedAt}
            isBookmarked={isBookmarked(news.url)} onBookmark={handleBookmark} source={news.source?.name} />
        ))}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && !showBookmarks && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-3">
          <button className="btn btn-danger" onClick={handlePrev} disabled={page === 1}>&laquo; Prev</button>
          <span className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}>Page {page} of {totalPages}</span>
          <button className="btn btn-danger" onClick={handleNext} disabled={page === totalPages}>Next &raquo;</button>
        </div>
      )}
    </div>
  );
};

export default NewsBoard;