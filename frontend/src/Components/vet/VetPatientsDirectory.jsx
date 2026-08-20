import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import VetPatientCard from "./VetPatientCard.jsx";

const SPECIES_OPTIONS = ["Dog", "Cat", "Bird"];
const STATUS_OPTIONS = ["Healthy", "Requires Follow-up", "Upcoming Vaccine"];

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
}

export default function VetPatientsDirectory({
  patients,
  totalCount,
  loading,
  error,
  search,
  onSearchChange,
  species,
  onSpeciesChange,
  status,
  onStatusChange,
  page,
  pageSize,
  onPageChange,
  onViewRecords,
}) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageNumbers = buildPageNumbers(page, totalPages);
  const hasFilters = Boolean(search || species || status);

  return (
    <section className="vet-patients-directory">
      <div className="vet-patients-toolbar">
        <div className="vet-patients-toolbar__chips">
          <button
            type="button"
            className={`vet-patients-chip${species === "" ? " vet-patients-chip--active" : ""}`}
            onClick={() => onSpeciesChange("")}
          >
            {t("vetPatients.toolbar.allSpecies")}
          </button>
          {SPECIES_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`vet-patients-chip${species === option ? " vet-patients-chip--active" : ""}`}
              onClick={() => onSpeciesChange(option)}
            >
              {t(`vetPatients.toolbar.species.${option.toLowerCase()}`)}
            </button>
          ))}
        </div>

        <div className="vet-patients-toolbar__controls">
          <div className="vet-patients-search">
            <Icon name="search" className="vet-patients-search__icon" />
            <input
              type="text"
              className="vet-patients-search__input"
              placeholder={t("vetPatients.toolbar.searchPlaceholder")}
              value={search}
              onChange={onSearchChange}
            />
          </div>

          <div className="vet-patients-select">
            <Icon name="filter_list" className="vet-patients-select__icon" />
            <select
              className="vet-patients-select__input"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="">{t("vetPatients.toolbar.allStatus")}</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t(`vetPatients.status.${statusKey(option)}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="vet-patients-empty">{t("vetPatients.list.loading")}</p>
      ) : error ? (
        <div className="vet-patients-alert" role="alert">
          <span>{error}</span>
        </div>
      ) : patients.length ? (
        <>
          <div className="vet-patients-grid">
            {patients.map((patient) => (
              <VetPatientCard key={patient.petId} patient={patient} onViewRecords={onViewRecords} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="vet-patients-pagination">
              <button
                type="button"
                className="vet-patients-pagination__nav"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                aria-label={t("vetPatients.pagination.previous")}
              >
                <Icon name="chevron_left" />
              </button>
              {pageNumbers.map((number, index) => {
                const previous = pageNumbers[index - 1];
                const showGap = previous != null && number - previous > 1;
                return (
                  <span key={number} style={{ display: "contents" }}>
                    {showGap && <span className="vet-patients-pagination__ellipsis">…</span>}
                    <button
                      type="button"
                      className={`vet-patients-pagination__page${number === page ? " vet-patients-pagination__page--active" : ""}`}
                      onClick={() => onPageChange(number)}
                    >
                      {number}
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                className="vet-patients-pagination__nav"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label={t("vetPatients.pagination.next")}
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="vet-patients-empty">
          {hasFilters ? t("vetPatients.list.noMatches") : t("vetPatients.list.empty")}
        </p>
      )}
    </section>
  );
}

function statusKey(status) {
  if (status === "Healthy") return "healthy";
  if (status === "Requires Follow-up") return "followup";
  if (status === "Upcoming Vaccine") return "vaccine";
  return "default";
}
