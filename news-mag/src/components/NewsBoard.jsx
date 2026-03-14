import { useEffect, useState, useCallback } from "react";
import NewsItem from "./NewsItems";

const NewsBoard = ({ darkMode }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchNews = useCallback((searchTerm = "") => {
    if (!apiKey) {
      setError("API key is missing. Check your .env file.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const baseUrl = "https://newsapi.org/v2/top-headlines?";
    const url = searchTerm
      ? `${baseUrl}q=${encodeURIComponent(searchTerm)}&apiKey=${apiKey}`
      : `${baseUrl}country=us&apiKey=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setArticles(data.articles || []);
        } else {
          setError(data.message || "Failed to fetch news");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [apiKey]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, fetchNews]); // ✅ no more warning

  return (
    <div
      className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <h2 className="text-center mb-4">
        <span style={{ color: "red", fontWeight: "bold" }}>Latest</span> News
      </h2>

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

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading news...</p>
        </div>
      )}

      {error && (
        <p className="text-center text-danger fw-bold">Error: {error}</p>
      )}

      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {!loading && !error && articles.length === 0 && (
          <p className="text-center w-100">No news found.</p>
        )}

        {articles.map((news, index) => (
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
    </div>
  );
};

export default NewsBoard;