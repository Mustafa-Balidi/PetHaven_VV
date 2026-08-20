import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";
import BackLink from "../Components/ApplicationDetails/BackLink";
import StatusBadge from "../Components/ApplicationDetails/StatusBadge";
import { getMyAdoptionRequest } from "../api/adoptionHubApi.js";
import "../Styling/ApplicationDetails.css";

export default function ApplicationDetailsPage() {
  const { t } = useTranslation();
  const { requestId } = useParams();
  const parsedRequestId = Number(requestId);
  const hasValidRequestId = Number.isInteger(parsedRequestId) && parsedRequestId > 0;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(hasValidRequestId);
  const [error, setError] = useState(null);

  const loadRequest = useCallback(async () => {
    if (!hasValidRequestId) return;

    try {
      setLoading(true);
      setError(null);
      setRequest(await getMyAdoptionRequest(parsedRequestId));
    } catch (requestError) {
      setRequest(null);
      setError({
        message: requestError.message,
        status: requestError.status,
      });
    } finally {
      setLoading(false);
    }
  }, [hasValidRequestId, parsedRequestId]);

  useEffect(() => {
    if (!hasValidRequestId) return undefined;

    let active = true;
    getMyAdoptionRequest(parsedRequestId)
      .then((data) => {
        if (active) setRequest(data);
      })
      .catch((requestError) => {
        if (active) {
          setError({
            message: requestError.message,
            status: requestError.status,
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hasValidRequestId, parsedRequestId]);

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("adopter.applicationDetails.notProvided");
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const stateTitle = !hasValidRequestId
    ? t("adopter.applicationDetails.invalidRequestTitle")
    : error?.status === 404
      ? t("adopter.applicationDetails.notFoundTitle")
      : error?.status === 403
        ? t("adopter.applicationDetails.forbiddenTitle")
        : t("adopter.applicationDetails.loadErrorTitle");

  const stateMessage = !hasValidRequestId
    ? t("adopter.applicationDetails.invalidRequest")
    : error?.status === 404
      ? t("adopter.applicationDetails.notFound")
      : error?.status === 403
        ? t("adopter.applicationDetails.forbidden")
        : error?.message || t("adopter.applicationDetails.loadError");

  return (
    <div className="application-details-page">
      <TopNavBar />

      <main className="application-details-main">
        <BackLink href="/adopter/adoption-hub?tab=requests" />

        <div className="application-details__header">
          <div>
            <h1 className="application-details__title">{t("adopter.applicationDetails.title")}</h1>
            {hasValidRequestId && (
              <p className="application-details__reference">
                {t("adopter.applicationDetails.reference", { id: parsedRequestId })}
              </p>
            )}
          </div>
          {request?.status && <StatusBadge status={request.status} />}
        </div>

        {loading ? (
          <section className="application-details__unavailable" aria-live="polite">
            <span className="material-symbols-outlined" aria-hidden="true">progress_activity</span>
            <p>{t("adopter.applicationDetails.loading")}</p>
          </section>
        ) : !hasValidRequestId || error ? (
          <section className="application-details__unavailable" role="alert">
            <span className="material-symbols-outlined" aria-hidden="true">
              {error?.status === 404 ? "search_off" : "error"}
            </span>
            <h2>{stateTitle}</h2>
            <p>{stateMessage}</p>
            {hasValidRequestId && error?.status !== 403 && error?.status !== 404 && (
              <button type="button" className="application-details__retry" onClick={loadRequest}>
                {t("adopter.applicationDetails.retry")}
              </button>
            )}
          </section>
        ) : request ? (
          <div className="application-details__backend-grid">
            <section className="application-details__pet-card">
              <div className="application-details__pet-image-wrap">
                {request.petImage ? (
                  <img src={request.petImage} alt={request.petName} />
                ) : (
                  <span className="material-symbols-outlined" aria-hidden="true">pets</span>
                )}
              </div>
              <div className="application-details__pet-content">
                <h2>{request.petName}</h2>
                <dl className="application-details__fields">
                  {request.species && <><dt>{t("adopter.applicationDetails.fields.species")}</dt><dd>{request.species}</dd></>}
                  {request.breed && <><dt>{t("adopter.applicationDetails.fields.breed")}</dt><dd>{request.breed}</dd></>}
                  {request.age != null && <><dt>{t("adopter.applicationDetails.fields.age")}</dt><dd>{request.age}</dd></>}
                  {request.gender && <><dt>{t("adopter.applicationDetails.fields.gender")}</dt><dd>{request.gender}</dd></>}
                  {request.healthStatus && <><dt>{t("adopter.applicationDetails.fields.healthStatus")}</dt><dd>{request.healthStatus}</dd></>}
                  {request.centerName && <><dt>{t("adopter.applicationDetails.fields.center")}</dt><dd>{request.centerName}</dd></>}
                </dl>
                {request.description && <p className="application-details__description">{request.description}</p>}
                <Link className="animal-summary-card__link" to={`/adopter/pet-profile/${request.petId}`}>
                  {t("adopter.applicationDetails.animal.viewProfile")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </section>

            <section className="application-details__request-card">
              <h2>{t("adopter.applicationDetails.request.title")}</h2>
              <dl className="application-details__fields">
                <dt>{t("adopter.applicationDetails.request.submittedAt")}</dt>
                <dd>{formatDate(request.submittedAt)}</dd>
                <dt>{t("adopter.applicationDetails.request.score")}</dt>
                <dd>{request.score}</dd>
                <dt>{t("adopter.applicationDetails.request.status")}</dt>
                <dd>{request.status}</dd>
                {request.centerNotes && (
                  <>
                    <dt>{t("adopter.applicationDetails.request.centerNotes")}</dt>
                    <dd>{request.centerNotes}</dd>
                  </>
                )}
              </dl>
            </section>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
