import { useEffect, useState, useCallback } from "react";
import NewsItem, { SkeletonCard } from "./NewsItems";

const NewsBoard = ({ darkMode, selectedCategory }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarks, setShowBookmarks] = useState(false);

  const pageSize = 9;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchNews = useCallback(
    (searchTerm = "", pageNum = 1, category = "general") => {
      if (!apiKey) {
        setError("API key is missing. Check your .env file.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const baseUrl = "https://newsapi.org/v2/top-headlines?";
      const url = searchTerm
        ? `${baseUrl}q=${encodeURIComponent(searchTerm)}&category=${category}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
        : `${baseUrl}country=us&category=${category}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            setArticles(data.articles || []);
            setTotalResults(data.totalResults || 0);
          } else {
            setError(data.message || "Failed to fetch news");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [apiKey]
  );

  // Reset page when query or category changes
  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory]);

  // Fetch news when page, query or category changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews(query, page, selectedCategory);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query, page, selectedCategory, fetchNews]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleBookmark = (article) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.url === article.url);
      if (exists) return prev.filter((b) => b.url !== article.url);
      return [...prev, article];
    });
  };

  const isBookmarked = (url) => bookmarks.some((b) => b.url === url);

  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      {/* Dynamic Heading */}
      <h2 className="text-center mb-4">
        <span style={{ color: "red", fontWeight: "bold" }}>
          {query
            ? `Results for "${query}"`
            : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </span>{" "}
        {!query && "News"}
      </h2>

      {/* Search + Bookmark Toggle */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4 flex-wrap">
        <input
          type="search"
          placeholder="Search news..."
          className="form-control"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
        <button
          className={`btn ${showBookmarks ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setShowBookmarks(!showBookmarks)}
        >
          🔖 Bookmarks ({bookmarks.length})
        </button>
      </div>

      {error && <p className="text-center text-danger fw-bold">Error: {error}</p>}

      {/* Bookmarks View */}
      {showBookmarks && (
        <div>
          <h4 className="text-center mb-3">
            <span style={{ color: "orange" }}>Saved</span> Articles
          </h4>
          {bookmarks.length === 0 ? (
            <p className="text-center">No bookmarks yet.</p>
          ) : (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {bookmarks.map((news, index) => (
                <NewsItem
                  key={index}
                  title={news.title}
                  description={news.description}
                  src={news.src || "https://via.placeholder.com/300x200?text=No+Image"}
                  url={news.url}
                  darkMode={darkMode}
                  publishedAt={news.publishedAt}
                  isBookmarked={true}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
          <hr className={darkMode ? "border-light mt-4" : "mt-4"} />
          <h4 className="text-center mb-3">
            <span style={{ color: "red" }}>Latest</span> News
          </h4>
        </div>
      )}

      {/* News Cards */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {loading && Array(pageSize).fill(0).map((_, i) => (
          <SkeletonCard key={i} darkMode={darkMode} />
        ))}

        {!loading && !error && articles.length === 0 && (
          <p className="text-center w-100">No news found.</p>
        )}

        {!loading && articles.map((news, index) => (
          <NewsItem
            key={index}
            title={news.title}
            description={news.description}
            src={news.urlToImage || "https://via.placeholder.com/300x200?text=No+Image"}
            url={news.url}
            darkMode={darkMode}
            publishedAt={news.publishedAt}
            isBookmarked={isBookmarked(news.url)}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && !showBookmarks && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-3">
          <button className="btn btn-danger" onClick={handlePrev} disabled={page === 1}>
            &laquo; Prev
          </button>
          <span className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}>
            Page {page} of {totalPages}
          </span>
          <button className="btn btn-danger" onClick={handleNext} disabled={page === totalPages}>
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsBoard;