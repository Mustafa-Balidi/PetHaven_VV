import { useId } from "react";
import { useTranslation } from "react-i18next";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function ArticleModal({ article, onClose }) {
  const { t } = useTranslation();
  const titleId = useId();
  const contentId = useId();
  const dialogRef = useModalA11y({ open: Boolean(article), onClose });

  if (!article) return null;

  return (
    <div className="modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal__card modal__card--article"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        tabIndex={-1}
      >
        <button
          type="button"
          aria-label={t("articleModal.close")}
          className="modal__close"
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {article.image && (
          <img src={article.image} alt={article.title} className="article-modal__img" />
        )}
        <h3 id={titleId} className="article-modal__title">{article.title}</h3>
        {(article.author || article.date) && (
          <p className="article-modal__meta">
            {article.author}
            {article.author && article.date ? " · " : ""}
            {article.date}
          </p>
        )}
        <div id={contentId} className="article-modal__content">
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
