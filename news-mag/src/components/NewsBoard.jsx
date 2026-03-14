import { useEffect, useState, useCallback } from "react";
import NewsItem, { SkeletonCard } from "./NewsItems";

const NewsBoard = ({ darkMode }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const pageSize = 9;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchNews = useCallback(
    (searchTerm = "", pageNum = 1) => {
      if (!apiKey) {
        setError("API key is missing. Check your .env file.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const baseUrl = "https://newsapi.org/v2/top-headlines?";
      const url = searchTerm
        ? `${baseUrl}q=${encodeURIComponent(searchTerm)}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
        : `${baseUrl}country=us&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;

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

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews(query, page);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, page, fetchNews]);

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
      <h2 className="text-center mb-4">
        <span style={{ color: "red", fontWeight: "bold" }}>Latest</span> News
      </h2>

      {/* Search input */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="search"
          placeholder="Search news..."
          className="form-control w-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
      </div>

      {error && (
        <p className="text-center text-danger fw-bold">Error: {error}</p>
      )}

      {/* Cards */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {/* Skeleton cards while loading */}
        {loading &&
          Array(pageSize)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} darkMode={darkMode} />)}

        {/* No results */}
        {!loading && !error && articles.length === 0 && (
          <p className="text-center w-100">No news found.</p>
        )}

        {/* News cards */}
        {!loading &&
          articles.map((news, index) => (
            <NewsItem
              key={index}
              title={news.title}
              description={news.description}
              src={
                news.urlToImage ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              url={news.url}
              darkMode={darkMode}
              publishedAt={news.publishedAt}
            />
          ))}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-3">
          <button
            className="btn btn-danger"
            onClick={handlePrev}
            disabled={page === 1}
          >
            &laquo; Prev
          </button>

          <span className={`fw-bold ${darkMode ? "text-light" : "text-dark"}`}>
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-danger"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsBoard;