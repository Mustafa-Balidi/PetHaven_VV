import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import ArticleModal from "./ArticleModal.jsx";
import { BLOG_ARTICLES } from "../text/publicTexts.js";

export default function BlogArticles() {
  const { t } = useTranslation();
  const articles = t("blog.articles", { returnObjects: true });
  const [article, setArticle] = useState(null);

  return (
    <section id="ai-checker" className="blog">
      <div className="blog__header">
        <h2 className="blog__title">{t("blog.title")}</h2>
        <a className="blog__view-all blog__view-all--desktop" href="#">
          {t("blog.viewAll")}
        </a>
      </div>
      <div className="blog__grid">
        {BLOG_ARTICLES.map((item, i) => (
          <div
            key={item.title}
            className="blog__card"
            role="button"
            tabIndex={0}
            onClick={() => setArticle({ ...item, ...articles[i] })}
            onKeyDown={(e) => e.key === "Enter" && setArticle({ ...item, ...articles[i] })}
          >
            <div className="blog__image-wrap">
              {item.image ? (
                <img alt={articles[i].alt} className="blog__image" src={item.image} />
              ) : (
                <div className="blog__placeholder">
                  <Icon name={item.icon} className="blog__placeholder-icon" />
                </div>
              )}
            </div>
            <div className="blog__body">
              <span className={`blog__tag blog__tag--${item.accent}`}>{articles[i].tag}</span>
              <h3 className="blog__card-title">{articles[i].title}</h3>
              <p className="blog__card-desc">{articles[i].description}</p>
              <span className="blog__read-more">
                {t("blog.readArticle")}
                <Icon name="arrow_forward" className="blog__read-more-icon" />
              </span>
            </div>
          </div>
        ))}
      </div>
      {article && <ArticleModal article={article} onClose={() => setArticle(null)} />}
    </section>
  );
}
