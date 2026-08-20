import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ArticleModal({ article, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal__card modal__card--article" onClick={(e) => e.stopPropagation()}>
        <button aria-label={t("articleModal.close")} className="modal__close" onClick={onClose}>
          &times;
        </button>
        {article.image && (
          <img src={article.image} alt={article.title} className="article-modal__img" />
        )}
        <h3 className="article-modal__title">{article.title}</h3>
        {(article.author || article.date) && (
          <p className="article-modal__meta">
            {article.author}
            {article.author && article.date ? " · " : ""}
            {article.date}
          </p>
        )}
        <div className="article-modal__content">
          {(article.content || article.description || "")
            .split("\n")
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
