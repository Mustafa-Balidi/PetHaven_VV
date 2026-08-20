import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import AdoptionApplicationReview from "../../Components/center/AdoptionApplicationReview.jsx";
import RejectApplication from "../../Components/center/RejectApplication.jsx";
import "../../Styling/CenterPages.css";

export default function AdoptionRequests() {
  const { t: translate, i18n } = useTranslation();
  const t = translate("center.adoptionRequests", { returnObjects: true });

  const TABS = [
    { key: "all", label: t.tabs.all },
    { key: "Pending", label: t.tabs.pending },
    { key: "Approved", label: t.tabs.approved },
    { key: "Rejected", label: t.tabs.rejected },
  ];

  const STATUS_BADGE = {
    Pending: { className: "center-requests-status--pending", label: t.card.statusPending },
    Approved: { className: "center-requests-status--approved", label: t.card.statusApproved },
    Rejected: { className: "center-requests-status--rejected", label: t.card.statusRejected },
  };

  const {
    adoptionRequests: requests,
    requestsLoading,
    requestsError,
    fetchRequests,
    approveRequest,
    rejectRequest,
    blacklist,
    blacklistLoading,
    blacklistError,
    fetchBlacklist,
  } = useCenterContext();
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("applications");
  const [activeTab, setActiveTab] = useState("all");
  const [reviewing, setReviewing] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (activeView === "blacklist") fetchBlacklist().catch(() => {});
  }, [activeView, fetchBlacklist]);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((req) => {
      const matchesTab = activeTab === "all" || req.status === activeTab;
      const matchesSearch =
        !q || req.pet.name.toLowerCase().includes(q) || req.applicant.name.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [requests, search, activeTab]);

  const filteredBlacklist = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blacklist;
    return blacklist.filter((entry) =>
      entry.adopterName?.toLowerCase().includes(q) || entry.reason?.toLowerCase().includes(q));
  }, [blacklist, search]);

  async function handleApproved(id) {
    await approveRequest(id);
    setReviewing(null);
  }

  async function handleRejected(id, reason) {
    await rejectRequest(id, reason);
    setRejecting(null);
    setReviewing(null);
  }

  function openReject(request) {
    setReviewing(null);
    setRejecting(request);
  }

  if (requestsLoading) {
    return (
      <div className="center-requests-page">
        <CenterHeader />
        <div className="center-requests-loading">{requestsError || t.loading}</div>
      </div>
    );
  }

  return (
    <div className="center-requests-page">
      <CenterHeader />

      <div className="center-requests-body">
        <div className="center-requests-header">
          <div>
            <h1 className="center-requests-header__title">{t.header.title}</h1>
            <p className="center-requests-header__subtitle">{t.header.subtitle}</p>
          </div>
          <div className="center-requests-header__controls">
            <div className="center-requests-search">
              <Icon name="search" className="center-requests-search__icon" />
              <input
                type="text"
                className="center-requests-search__input"
                placeholder={activeView === "applications"
                  ? t.toolbar.searchPlaceholder
                  : t.blacklist.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {activeView === "applications" && (
              <button type="button" className="center-requests-filter-btn" aria-label={t.toolbar.filter}>
                <Icon name="filter_list" />
              </button>
            )}
          </div>
        </div>

        <div className="center-requests-view-tabs" aria-label={t.viewTabs.label}>
          {["applications", "blacklist"].map((view) => (
            <button
              key={view}
              type="button"
              className={`center-requests-view-tabs__item ${
                activeView === view ? "center-requests-view-tabs__item--active" : ""
              }`}
              onClick={() => {
                setActiveView(view);
                setSearch("");
              }}
            >
              {t.viewTabs[view]}
            </button>
          ))}
        </div>

        {activeView === "applications" ? (
          <>
            <div className="center-requests-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`center-requests-tabs__item ${
                    activeTab === tab.key ? "center-requests-tabs__item--active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="center-requests-empty">{t.empty}</div>
            ) : (
              <div className="center-requests-grid">
                {filteredRequests.map((req) => {
              const badge = STATUS_BADGE[req.status] || STATUS_BADGE.Pending;
              const isActioned = req.status !== "Pending";
              return (
                <div
                  key={req.id}
                  className={`center-requests-card ${isActioned ? "center-requests-card--actioned" : ""}`}
                >
                  <div className="center-requests-card__top">
                    <div className="center-requests-card__pet">
                      {req.pet.image ? (
                        <img src={req.pet.image} alt={req.pet.name} className="center-requests-card__thumb" />
                      ) : (
                        <div className="center-requests-card__thumb center-requests-card__thumb--placeholder">
                          <Icon name="pets" />
                        </div>
                      )}
                      <div>
                        <h3 className="center-requests-card__name">{req.pet.name}</h3>
                        <p className="center-requests-card__applicant">
                          <Icon name="person" />
                          {req.applicant.name}
                        </p>
                      </div>
                    </div>
                    <span className={`center-requests-status ${badge.className}`}>{badge.label}</span>
                  </div>

                  <div className="center-requests-card__info">
                    <div className="center-requests-card__info-box">
                      <p className="center-requests-card__info-label">{t.card.appliedLabel}</p>
                      <p className="center-requests-card__info-value">{req.appliedDate}</p>
                    </div>
                    <div className="center-requests-card__info-box">
                      <p className="center-requests-card__info-label">{t.card.housingLabel}</p>
                      <p className="center-requests-card__info-value">
                        {req.housing} • {req.experienceLabel}
                      </p>
                    </div>
                  </div>

                  <div className="center-requests-card__actions">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          className="center-requests-card__review-btn"
                          onClick={() => setReviewing(req)}
                        >
                          {t.card.reviewButton}
                        </button>
                        <button
                          type="button"
                          className="center-requests-card__reject-btn"
                          onClick={() => setRejecting(req)}
                        >
                          {t.card.rejectButton}
                        </button>
                      </>
                    ) : (
                      <button type="button" className="center-requests-card__view-btn" disabled>
                        {t.card.viewRecordButton}
                      </button>
                    )}
                  </div>
                </div>
              );
                })}
              </div>
            )}
          </>
        ) : blacklistLoading ? (
          <div className="center-requests-empty">{t.blacklist.loading}</div>
        ) : blacklistError ? (
          <div className="center-requests-empty center-blacklist-error" role="alert">
            <p>{blacklistError}</p>
            <button type="button" onClick={() => fetchBlacklist().catch(() => {})}>{t.blacklist.retry}</button>
          </div>
        ) : filteredBlacklist.length === 0 ? (
          <div className="center-requests-empty">{t.blacklist.empty}</div>
        ) : (
          <div className="center-blacklist-table-wrap">
            <table className="center-blacklist-table">
              <thead>
                <tr>
                  <th>{t.blacklist.columns.adopter}</th>
                  <th>{t.blacklist.columns.reason}</th>
                  <th>{t.blacklist.columns.date}</th>
                  <th>{t.blacklist.columns.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlacklist.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.adopterName || "—"}</td>
                    <td>{entry.reason || "—"}</td>
                    <td>{entry.banDate
                      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(new Date(entry.banDate))
                      : "—"}</td>
                    <td><span className="center-blacklist-status">{entry.isActive ? t.blacklist.active : "—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />

      {reviewing && (
        <AdoptionApplicationReview
          request={reviewing}
          onApprove={handleApproved}
          onReject={openReject}
          onClose={() => setReviewing(null)}
        />
      )}

      {rejecting && (
        <RejectApplication request={rejecting} onConfirm={handleRejected} onClose={() => setRejecting(null)} />
      )}
    </div>
  );
}
