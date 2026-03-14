const NewsItem = ({ title, description, src, url, darkMode, publishedAt }) => {
  return (
    <div
      className={`card ${darkMode ? "bg-dark text-light" : ""}`}
      style={{ width: "300px" }}
    >
      <img src={src} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text mt-auto">
          <small className="text-muted">
            {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
          </small>
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-2"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsItem;