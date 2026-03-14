import { useEffect, useState, useCallback } from "react";

const categories = ["General", "Business", "Technology", "Sports", "Entertainment", "Health", "Science"];

const getCategoryEmoji = (cat) => {
  const map = { general: "🌍", business: "💼", technology: "💻", sports: "⚽", entertainment: "🎬", health: "🏥", science: "🔬" };
  return map[cat] || "📰";
};

const CompareCard = ({ article, darkMode }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className={`text-decoration-none d-flex gap-3 p-3 rounded mb-2 ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"}`}
      style={{ border: hovered ? "1px solid #dc3545" : "1px solid #dee2e6", transition: "all 0.2s ease", transform: hovered ? "translateX(4px)" : "translateX(0)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={article.urlToImage || "https://via.placeholder.com/80x80?text=N"} alt={article.title}
        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
      <div>
        {article.source?.name && (
          <span className="badge bg-danger mb-1" style={{ fontSize: "10px" }}>{article.source.name}</span>
        )}
        <p className="mb-1 fw-bold" style={{ fontSize: "13px", lineHeight: "1.4" }}>
          {article.title?.length > 100 ? article.title.slice(0, 100) + "..." : article.title}
        </p>
        <small className="text-muted">
          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
        </small>
      </div>
    </a>
  );
};

const SkeletonCompare = ({ darkMode }) => (
  <div className={`p-3 rounded mb-2 ${darkMode ? "bg-secondary" : "bg-white"}`}>
    <div style={{ height: "14px", width: "80%", background: darkMode ? "#777" : "#dee2e6", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s infinite ease-in-out" }} />
    <div style={{ height: "12px", width: "60%", background: darkMode ? "#777" : "#dee2e6", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
    <style>{`@keyframes pulse{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}`}</style>
  </div>
);

const NewsComparison = ({ darkMode }) => {
  const [leftCategory, setLeftCategory] = useState("technology");
  const [rightCategory, setRightCategory] = useState("sports");
  const [leftArticles, setLeftArticles] = useState([]);
  const [rightArticles, setRightArticles] = useState([]);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchCategory = useCallback((category, side) => {
    if (!apiKey) return;
    const setLoading = side === "left" ? setLeftLoading : setRightLoading;
    const setArticles = side === "left" ? setLeftArticles : setRightArticles;
    setLoading(true);
    fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=6&apiKey=${apiKey}`)
      .then(r => r.json())
      .then(data => { if (data.status === "ok") setArticles(data.articles || []); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [apiKey]);

  useEffect(() => {
    if (isOpen) {
      fetchCategory(leftCategory, "left");
      fetchCategory(rightCategory, "right");
    }
  }, [leftCategory, rightCategory, isOpen, fetchCategory]);

  return (
    <div className="mb-5">
      {/* Toggle Button */}
      <div className="text-center mb-3">
        <button
          className={`btn ${isOpen ? "btn-danger" : "btn-outline-danger"} px-4`}
          onClick={() => setIsOpen(!isOpen)}
        >
          ⚖️ {isOpen ? "Close" : "Compare"} News Categories
        </button>
      </div>

      {isOpen && (
        <div
          className={`p-4 rounded shadow ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
          style={{ border: "2px solid #dc3545" }}
        >
          <h4 className="text-center mb-4">
            ⚖️ <span style={{ color: "red", fontWeight: "bold" }}>Compare</span> Categories Side by Side
          </h4>

          {/* Selectors */}
          <div className="row mb-4">
            <div className="col-6">
              <label className="fw-bold mb-2 d-block text-center">Left Category</label>
              <select
                className={`form-select ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}
                value={leftCategory}
                onChange={(e) => setLeftCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {getCategoryEmoji(cat.toLowerCase())} {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="fw-bold mb-2 d-block text-center">Right Category</label>
              <select
                className={`form-select ${darkMode ? "bg-secondary text-light border-secondary" : ""}`}
                value={rightCategory}
                onChange={(e) => setRightCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {getCategoryEmoji(cat.toLowerCase())} {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Articles */}
          <div className="row g-3">
            {/* Left */}
            <div className="col-12 col-md-6">
              <h5 className="text-center mb-3">
                <span className="badge bg-danger px-3 py-2">
                  {getCategoryEmoji(leftCategory)} {leftCategory.charAt(0).toUpperCase() + leftCategory.slice(1)}
                </span>
              </h5>
              {leftLoading
                ? Array(4).fill(0).map((_, i) => <SkeletonCompare key={i} darkMode={darkMode} />)
                : leftArticles.map((article, i) => <CompareCard key={i} article={article} darkMode={darkMode} />)
              }
            </div>

            {/* Right */}
            <div className="col-12 col-md-6">
              <h5 className="text-center mb-3">
                <span className="badge bg-danger px-3 py-2">
                  {getCategoryEmoji(rightCategory)} {rightCategory.charAt(0).toUpperCase() + rightCategory.slice(1)}
                </span>
              </h5>
              {rightLoading
                ? Array(4).fill(0).map((_, i) => <SkeletonCompare key={i} darkMode={darkMode} />)
                : rightArticles.map((article, i) => <CompareCard key={i} article={article} darkMode={darkMode} />)
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsComparison;