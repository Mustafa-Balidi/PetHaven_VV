import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import VetPatientsSummary from "../../Components/vet/VetPatientsSummary.jsx";
import VetPatientsDirectory from "../../Components/vet/VetPatientsDirectory.jsx";
import VetPatientRecordsModal from "../../Components/vet/VetPatientRecordsModal.jsx";
import {
  getPatientsStats,
  getPatients,
  getPatientDetail,
} from "../../api/vetPatientsApi.js";
import "../../Styling/VetPatients.css";

const PAGE_SIZE = 12;

export default function VetPatients() {
  const { t } = useTranslation();
  useDocumentTitle(t("vetPatients.title"));

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [list, setList] = useState({ items: [], totalCount: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let active = true;

    getPatientsStats()
      .then((data) => {
        if (!active) return;
        setStats(data);
        setStatsError("");
      })
      .catch((err) => {
        if (!active) return;
        setStats(null);
        setStatsError(err.message);
      })
      .finally(() => {
        if (active) setStatsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const timeout = setTimeout(
      () => {
        getPatients({ search, species, status, page, pageSize: PAGE_SIZE })
          .then((result) => {
            if (!active) return;
            setList(result);
            setListError("");
          })
          .catch((err) => {
            if (!active) return;
            setList({ items: [], totalCount: 0 });
            setListError(err.message);
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
  }, [search, species, status, page]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
    setListLoading(true);
  }

  function handleSpeciesChange(next) {
    setSpecies(next);
    setPage(1);
    setListLoading(true);
  }

  function handleStatusChange(next) {
    setStatus(next);
    setPage(1);
    setListLoading(true);
  }

  function handlePageChange(next) {
    setPage(next);
    setListLoading(true);
  }

  function openRecords(patient) {
    setSelectedPetId(patient.petId);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);

    getPatientDetail(patient.petId)
      .then(setDetail)
      .catch((err) => setDetailError(err.message))
      .finally(() => setDetailLoading(false));
  }

  function closeRecords() {
    setSelectedPetId(null);
    setDetail(null);
    setDetailError("");
  }

  return (
    <div className="vet-patients-page">
      <VetHeader />

      <main id="main-content" tabIndex={-1} className="vet-patients-main">
        <header className="vet-patients-heading">
          <h1 className="vet-patients-title">{t("vetPatients.title")}</h1>
          <p className="vet-patients-subtitle">{t("vetPatients.subtitle")}</p>
        </header>

        {statsError ? (
          <div className="vet-patients-alert" role="alert">
            <span>{statsError}</span>
          </div>
        ) : statsLoading ? (
          <p className="vet-patients-empty" role="status">{t("vetPatients.summary.loading")}</p>
        ) : (
          <VetPatientsSummary stats={stats} />
        )}

        <VetPatientsDirectory
          patients={list.items}
          totalCount={list.totalCount}
          loading={listLoading}
          error={listError}
          search={search}
          onSearchChange={handleSearchChange}
          species={species}
          onSpeciesChange={handleSpeciesChange}
          status={status}
          onStatusChange={handleStatusChange}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          onViewRecords={openRecords}
        />
      </main>

      <Footer />

      {selectedPetId != null && (
        <VetPatientRecordsModal
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={closeRecords}
        />
      )}
    </div>
  );
}
