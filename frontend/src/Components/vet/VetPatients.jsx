import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { getRecentPatients } from "../../api/vetDashboardApi.js";
import { formatLocalizedDate } from "../../utils/localization.js";
import { speciesIcon } from "../../utils/petIcons.js";

export default function VetPatients() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(
      () => {
        getRecentPatients({ count: 10, search })
          .then((items) => {
            if (active) setPatients(items);
          })
          .catch((err) => {
            if (active) {
              setPatients([]);
              setError(err.message);
            }
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      },
      search ? 300 : 0
    );

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setLoading(true);
    setError("");
  }

  return (
    <section className="vet-dashboard-card vet-dashboard-patients">
      <div className="vet-dashboard-patients__header">
        <h2 className="vet-dashboard-card__title">{t("vetDashboard.patients.title")}</h2>
        <div className="vet-dashboard-patients__search">
          <Icon name="search" className="vet-dashboard-patients__search-icon" />
          <input
            type="text"
            className="vet-dashboard-patients__search-input"
            aria-label={t("vetDashboard.patients.searchLabel")}
            placeholder={t("vetDashboard.patients.searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <p className="vet-dashboard-empty" role="status">{t("vetDashboard.patients.loading")}</p>
      ) : error ? (
        <div className="vet-dashboard-alert" role="alert">
          <span>{error}</span>
        </div>
      ) : patients.length ? (
        <div className="vet-dashboard-patients__table-wrap">
          <table
            className="vet-dashboard-patients__table"
            aria-label={t("vetDashboard.patients.tableLabel")}
          >
            <thead>
              <tr>
                <th scope="col">{t("vetDashboard.patients.columns.patient")}</th>
                <th scope="col">{t("vetDashboard.patients.columns.breed")}</th>
                <th scope="col">{t("vetDashboard.patients.columns.lastVisit")}</th>
                <th scope="col" className="vet-dashboard-patients__col-action">
                  {t("vetDashboard.patients.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.petId}>
                  <td>
                    <div className="vet-dashboard-patients__identity">
                      <span className="vet-dashboard-patients__avatar">
                        {patient.imageUrl ? (
                          <img src={patient.imageUrl} alt={patient.petName} />
                        ) : (
                          <Icon name={speciesIcon(patient.species)} />
                        )}
                      </span>
                      <div>
                        <div className="vet-dashboard-patients__name">{patient.petName}</div>
                        <div className="vet-dashboard-patients__id">#P-{patient.petId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{patient.breed || patient.species}</td>
                  <td>
                    {patient.lastVisitDate ? (
                      formatLocalizedDate(patient.lastVisitDate, i18n.language, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      // A bare dash is read out as punctuation or skipped.
                      <>
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">{t("a11y.noValue")}</span>
                      </>
                    )}
                  </td>
                  <td className="vet-dashboard-patients__col-action">
                    {/* Every row repeats the same link text. */}
                    <Link
                      to="/vet/patients"
                      className="vet-dashboard-patients__view-btn"
                      aria-label={t("vetDashboard.patients.viewRecordsFor", { name: patient.petName })}
                    >
                      {t("vetDashboard.patients.viewRecords")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="vet-dashboard-empty">{t("vetDashboard.patients.empty")}</p>
      )}
    </section>
  );
}
