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

const NewsItem = ({ title, description, src, url, darkMode, publishedAt, isBookmarked, onBookmark }) => {
  const handleShare = async () => {
    if (navigator.share) {
      // Native share on mobile
      try {
        await navigator.share({ title, text: description, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard on desktop
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className={`card ${darkMode ? "bg-dark text-light" : ""}`} style={{ width: "300px" }}>
      <img src={src} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text mt-auto">
          <small className="text-muted">
            {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
          </small>
        </p>
        <div className="d-flex gap-2 mt-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-grow-1">
            Read More
          </a>
          <button
            onClick={() => onBookmark({ title, description, src, url, publishedAt })}
            className={`btn ${isBookmarked ? "btn-warning" : "btn-outline-warning"}`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
          >
            🔖
          </button>
          <button
            onClick={handleShare}
            className="btn btn-outline-success"
            title="Share Article"
          >
            🔗
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;