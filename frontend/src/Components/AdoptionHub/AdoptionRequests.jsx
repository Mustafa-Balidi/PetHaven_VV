import { useTranslation } from "react-i18next";

function AdoptionRequests({ requests = [], loading, error, onRetry, onViewDetails }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en";
  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? t("adopter.adoptionHub.requests.dateUnavailable")
      : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
  };

  return (
    <section className="adoption-requests">
      <h2 className="adoption-requests__title">{t("adopter.adoptionHub.requests.title")}</h2>

      {loading ? (
        <div className="pet-catalog__state" aria-live="polite">
          <span className="material-symbols-outlined" aria-hidden="true">progress_activity</span>
          <p>{t("adopter.adoptionHub.requests.loading")}</p>
        </div>
      ) : error ? (
        <div className="pet-catalog__state pet-catalog__state--error" role="alert">
          <span className="material-symbols-outlined" aria-hidden="true">error</span>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>{t("adopter.adoptionHub.retry")}</button>
        </div>
      ) : requests.length === 0 ? (
        <div className="pet-catalog__state">
          <span className="material-symbols-outlined" aria-hidden="true">inbox</span>
          <h3>{t("adopter.adoptionHub.requests.empty")}</h3>
        </div>
      ) : (
        <div className="adoption-requests__list">
          {requests.map((request) => {
            const status = String(request.status || "Pending").toLowerCase();
            return (
              <article className="adoption-requests__card" key={request.requestId}>
                <div className="adoption-requests__thumb">
                  {request.petImage ? (
                    <img src={request.petImage} alt={request.petName} />
                  ) : (
                    <span className="material-symbols-outlined" aria-hidden="true">pets</span>
                  )}
                </div>
                <div className="adoption-requests__info">
                  <div className="adoption-requests__info-top">
                    <h3 className="adoption-requests__pet-name">{request.petName}</h3>
                    <span className={`adoption-requests__status-badge adoption-requests__status-badge--${status}`}>
                      {t(`adopter.adoptionHub.requests.statuses.${status}`, {
                        defaultValue: request.status,
                      })}
                    </span>
                  </div>
                  {(request.breed || request.species) && (
                    <p className="adoption-requests__breed">
                      {request.breed || request.species}
                    </p>
                  )}
                  <p className="adoption-requests__date">
                    {t("adopter.adoptionHub.requests.requestedOn", {
                      date: formatDate(request.submittedAt),
                    })}
                  </p>
                  <p className="adoption-requests__score">
                    {t("adopter.adoptionHub.requests.score", { score: request.score })}
                  </p>
                  {request.centerNotes && (
                    <p className="adoption-requests__notes">
                      {t("adopter.adoptionHub.requests.centerNotes", {
                        notes: request.centerNotes,
                      })}
                    </p>
                  )}
                </div>
                <div className="adoption-requests__action">
                  <button
                    type="button"
                    className="adoption-requests__action-btn"
                    onClick={() => onViewDetails?.(request.requestId)}
                  >
                    {t("adopter.adoptionHub.requests.actions.viewDetails")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdoptionRequests;
