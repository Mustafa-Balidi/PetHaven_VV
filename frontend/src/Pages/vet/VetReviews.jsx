import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import VetReviewsSummary from "../../Components/vet/VetReviewsSummary.jsx";
import VetReviewsList from "../../Components/vet/VetReviewsList.jsx";
import { getClientReviews } from "../../api/vetReviewsApi.js";
import "../../Styling/VetReviews.css";

const PAGE_SIZE = 10;

export default function VetReviews() {
  const { t } = useTranslation();
  useDocumentTitle(t("vetReviews.title"));
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(
      () => {
        getClientReviews({ search, filter, page, pageSize: PAGE_SIZE })
          .then((result) => {
            if (!active) return;
            setData(result);
            setError("");
          })
          .catch((err) => {
            if (active) setError(err.message);
          })
          .finally(() => {
            if (active) setListLoading(false);
          });
      },
      search ? 300 : 0
    );

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search, filter, page]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
    setListLoading(true);
  }

  function handleFilterChange(next) {
    if (next === filter) return;
    setFilter(next);
    setPage(1);
    setListLoading(true);
  }

  function handlePageChange(next) {
    setPage(next);
    setListLoading(true);
  }

  if (!data && listLoading) {
    return (
      <div className="vet-reviews-page">
        <VetHeader />
        <div className="vet-reviews-loading" role="status">{t("vetReviews.loading")}</div>
      </div>
    );
  }

  if (!data && error) {
    return (
      <div className="vet-reviews-page">
        <VetHeader />
        <div className="vet-reviews-main">
          <div className="vet-reviews-alert" role="alert">
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vet-reviews-page">
      <VetHeader />

      <main id="main-content" tabIndex={-1} className="vet-reviews-main">
        <header className="vet-reviews-heading">
          <h1 className="vet-reviews-title">{t("vetReviews.title")}</h1>
          <p className="vet-reviews-subtitle">{t("vetReviews.subtitle")}</p>
        </header>

        <VetReviewsSummary stats={data.stats} />

        <VetReviewsList
          items={data.items}
          loading={listLoading}
          error={listLoading ? "" : error}
          search={search}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterChange={handleFilterChange}
          unansweredCount={data.stats.unansweredCount}
          page={data.page}
          pageSize={data.pageSize}
          totalItems={data.totalItems}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  );
}
