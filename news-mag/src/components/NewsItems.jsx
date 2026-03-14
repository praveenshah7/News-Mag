import { useState } from "react";

const Toast = ({ message, show }) => {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9999, minWidth: "250px" }}>
      <div className="toast show align-items-center text-white bg-success border-0 shadow" role="alert">
        <div className="d-flex">
          <div className="toast-body fw-bold">✅ {message}</div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonCard = ({ darkMode }) => {
  return (
    <div className={`card ${darkMode ? "bg-secondary" : "bg-light"}`} style={{ width: "300px" }}>
      <div style={{ width: "100%", height: "200px", background: darkMode ? "#555" : "#dee2e6", animation: "pulse 1.5s infinite ease-in-out" }} />
      <div className="card-body">
        <div style={{ height: "20px", width: "80%", background: darkMode ? "#555" : "#dee2e6", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s infinite ease-in-out" }} />
        <div style={{ height: "14px", width: "100%", background: darkMode ? "#555" : "#dee2e6", borderRadius: "4px", marginBottom: "6px", animation: "pulse 1.5s infinite ease-in-out" }} />
        <div style={{ height: "14px", width: "60%", background: darkMode ? "#555" : "#dee2e6", borderRadius: "4px", marginBottom: "16px", animation: "pulse 1.5s infinite ease-in-out" }} />
        <div style={{ height: "36px", width: "100px", background: darkMode ? "#555" : "#dee2e6", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
      </div>
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
    </div>
  );
};

const getReadingTime = (text) => {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

const NewsItem = ({ title, description, src, url, darkMode, publishedAt, isBookmarked, onBookmark, source }) => {
  const [toast, setToast] = useState({ show: false, message: "" });
  const [hovered, setHovered] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: description, url }); }
      catch (err) { console.log("Share cancelled"); }
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    }
  };

  const handleBookmarkClick = () => {
    onBookmark({ title, description, src, url, publishedAt });
    showToast(isBookmarked ? "Bookmark removed!" : "Article bookmarked!");
  };

  const handleAISummary = async () => {
    if (summary) { setShowSummary(!showSummary); return; }
    setSummaryLoading(true);
    setShowSummary(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Summarize this news article in 2-3 short sentences. Be concise and informative.
Title: ${title}
Description: ${description}
Just give the summary, no intro or extra text.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === "text")?.text || "Could not generate summary.";
      setSummary(text);
    } catch (err) {
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <div
        className={`card ${darkMode ? "bg-dark text-light" : "bg-white"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "300px",
          transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: hovered ? "0 12px 30px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
          borderRadius: "12px",
          overflow: "hidden",
          border: hovered ? "1px solid #dc3545" : "1px solid transparent",
        }}
      >
        {/* Image */}
        <div style={{ overflow: "hidden", height: "200px", position: "relative" }}>
          <img src={src} className="card-img-top" alt={title}
            style={{ height: "200px", width: "100%", objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.4s ease" }}
          />
          <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "11px", padding: "3px 8px", borderRadius: "20px" }}>
            ⏱ {getReadingTime(description)}
          </span>
        </div>

        <div className="card-body d-flex flex-column">
          {source && (
            <span className="badge bg-danger mb-2" style={{ width: "fit-content", fontSize: "11px" }}>
              📰 {source}
            </span>
          )}
          <h5 className="card-title" style={{ color: hovered ? "#dc3545" : "", transition: "color 0.3s ease" }}>
            {title}
          </h5>
          <p className="card-text">{description}</p>

          {/* AI Summary Box */}
          {showSummary && (
            <div
              className={`p-2 mb-2 rounded ${darkMode ? "bg-secondary" : "bg-light"}`}
              style={{ fontSize: "13px", border: "1px solid #dc3545" }}
            >
              <strong className="text-danger">🤖 AI Summary:</strong>
              <p className="mb-0 mt-1">
                {summaryLoading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm text-danger me-2" role="status"></span>
                    Generating summary...
                  </span>
                ) : summary}
              </p>
            </div>
          )}

          <p className="card-text mt-auto">
            <small className="text-muted">
              {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
            </small>
          </p>

          {/* Buttons */}
          <div className="d-flex gap-1 mt-2">
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-grow-1">
              Read More
            </a>
            <button onClick={handleAISummary} className={`btn btn-sm ${showSummary ? "btn-danger" : "btn-outline-danger"}`} title="AI Summary">
              🤖
            </button>
            <button onClick={handleBookmarkClick} className={`btn btn-sm ${isBookmarked ? "btn-warning" : "btn-outline-warning"}`} title={isBookmarked ? "Remove Bookmark" : "Bookmark"}>
              🔖
            </button>
            <button onClick={handleShare} className="btn btn-sm btn-outline-success" title="Share Article">
              🔗
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsItem;