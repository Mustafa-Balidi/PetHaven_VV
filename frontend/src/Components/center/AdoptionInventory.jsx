import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import AddPetModal from "./AddPetModal.jsx";
import EditPetModal from "./EditPetModal.jsx";
import DeletePetModal from "./DeletePetModal.jsx";
import PetRecordModal from "./PetRecordModal.jsx";
import CenterImage from "./CenterImage.jsx";

const PAGE_SIZE = 5;

const STATUS_CLASS = {
  Available: "center-inv-adoption-table__status--available",
  Pending: "center-inv-adoption-table__status--pending",
  Adopted: "center-inv-adoption-table__status--adopted",
};

function parseAgeMonths(age) {
  if (typeof age === "number") return age * 12;
  const str = String(age ?? "");
  const match = /(\d+(?:\.\d+)?)\s*(yr|yrs|mo|mos|wk|wks)/i.exec(str);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.startsWith("yr")) return value * 12;
    if (unit.startsWith("mo")) return value;
    return value / 4;
  }
  const n = parseFloat(str);
  return Number.isNaN(n) ? 0 : n * 12;
}

function ageBucket(ageStr) {
  const months = parseAgeMonths(ageStr);
  if (months < 12) return "Baby";
  if (months < 36) return "Young";
  if (months < 84) return "Adult";
  return "Senior";
}

const AdoptionInventory = forwardRef(function AdoptionInventory(
  {
    adoptionInventory,
    recentAdoptions: recentAdoptionsProp,
    loading,
    error,
    onPetAdded,
    onPetSaved,
    onDelete,
    allRecentAdoptions,
    allRecentAdoptionsLoading,
    onOpenAllRecentAdoptions,
  },
  ref
) {
  const { t: translate } = useTranslation();
  const t = translate("center.inventory", { returnObjects: true });
  const ta = t.adoption;
  const tm = translate("center.modals", { returnObjects: true });
  const statusMap = translate("center.status", { returnObjects: true });

  // Active Requests has no matching backend endpoint — stays empty (see audit report).
  const activeRequests = adoptionInventory?.activeRequests ?? [];
  const recentAdoptions = recentAdoptionsProp ?? [];
  const animals = useMemo(
    () => (Array.isArray(adoptionInventory) ? adoptionInventory : []),
    [adoptionInventory]
  );

  const totalAnimals = animals.length;
  const availableCount = animals.filter((a) => a.status === "Available" || a.status === "available").length;
  const adoptedCount = animals.filter((a) => a.status === "Adopted" || a.status === "adopted").length;
  const pendingAdoptions = animals.filter((a) => a.status === "Pending" || a.status === "pending").length;

  const quickStats = {
    totalAnimals,
    availableCount,
    adoptedCount,
    pendingAdoptions,
    lowStockAlerts: 0,
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  const [addingPet, setAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [viewingPet, setViewingPet] = useState(null);
  const [deletingPet, setDeletingPet] = useState(null);

  useImperativeHandle(ref, () => ({
    openAdd: () => setAddingPet(true),
  }));

  const filteredAnimals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return animals.filter((a) => {
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (ageFilter !== "All" && ageBucket(a.age) !== ageFilter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.breed.toLowerCase().includes(q);
    });
  }, [animals, search, statusFilter, ageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / PAGE_SIZE));
  const pagedAnimals = filteredAnimals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filteredAnimals.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredAnimals.length);

  function openModal() {
    setModalOpen(true);
    onOpenAllRecentAdoptions();
  }

  const filteredModalAdoptions = useMemo(() => {
    const q = modalSearch.trim().toLowerCase();
    if (!q) return allRecentAdoptions;
    return allRecentAdoptions.filter(
      (a) => a.petName.toLowerCase().includes(q) || a.adopter.toLowerCase().includes(q)
    );
  }, [allRecentAdoptions, modalSearch]);

  async function handlePetAdded(petData) {
    await onPetAdded(petData);
    setAddingPet(false);
  }

  async function handlePetSaved(id, patch) {
    await onPetSaved(id, patch);
    setEditingPet(null);
  }

  async function handlePetDeleted(id) {
    await onDelete(id);
    setDeletingPet(null);
  }

  if (loading || !adoptionInventory) {
    return <div className="center-inv-loading">{error || t.loading}</div>;
  }

  return (
    <div className="center-inv-adoption-layout">
      <aside className="center-inv-adoption-sidebar">
        <div className="center-inv-adoption-card">
          <h2 className="center-inv-adoption-card__title">{ta.quickStats.title}</h2>
          <div className="center-inv-adoption-stat">
            <div className="center-inv-adoption-stat__label">{ta.quickStats.totalAnimals}</div>
            <div className="center-inv-adoption-stat__value">{quickStats.totalAnimals}</div>
          </div>
          <div className="center-inv-adoption-stat center-inv-adoption-stat--yellow">
            <div className="center-inv-adoption-stat__label">{ta.quickStats.lowStockAlerts}</div>
            <div className="center-inv-adoption-stat__value">
              {quickStats.lowStockAlerts}
              <Icon name="warning" />
            </div>
          </div>
          <div className="center-inv-adoption-stat center-inv-adoption-stat--green">
            <div className="center-inv-adoption-stat__label">{ta.quickStats.pendingAdoptions}</div>
            <div className="center-inv-adoption-stat__value">{quickStats.pendingAdoptions}</div>
          </div>
        </div>

        <div className="center-inv-adoption-card">
          <h3 className="center-inv-adoption-card__title">{ta.activeRequests.title}</h3>
          <ul className="center-inv-adoption-requests">
            {activeRequests.map((req) => (
              <li key={req.id} className="center-inv-adoption-requests__item">
                <div className="center-inv-adoption-requests__icon">
                  <Icon name="description" />
                </div>
                <div>
                  <p className="center-inv-adoption-requests__name">
                    {req.petName} ({req.breed})
                  </p>
                  <p className="center-inv-adoption-requests__stage">{req.stage}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="center-inv-adoption-card">
          <h3 className="center-inv-adoption-card__title">{ta.recentAdoptions.title}</h3>
          <ul className="center-inv-adoption-recent">
            {recentAdoptions.map((item) => (
              <li key={item.id} className="center-inv-adoption-recent__item" onClick={openModal}>
                <div className="center-inv-adoption-recent__avatar">
                  <CenterImage src={item.image} alt={item.petName} fallback={<Icon name="pets" />} />
                </div>
                <div>
                  <p className="center-inv-adoption-recent__name">{item.petName}</p>
                  <p className="center-inv-adoption-recent__date">{ta.recentAdoptions.adoptedOnPrefix} {item.date}</p>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="center-inv-adoption-view-all" onClick={openModal}>
            {ta.recentAdoptions.viewAll}
            <Icon name="open_in_new" />
          </button>
        </div>
      </aside>

      <div className="center-inv-adoption-main">
        <div className="center-inv-adoption-body">
          <div className="center-inv-adoption-toolbar">
            <div className="center-inv-adoption-search">
              <Icon name="search" className="center-inv-adoption-search__icon" />
              <input
                type="text"
                className="center-inv-adoption-search__input"
                placeholder={ta.toolbar.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="center-inv-adoption-toolbar-btns">
              <div className="center-inv-adoption-select-wrap">
                <select
                  className="center-inv-adoption-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">{ta.toolbar.statusAll}</option>
                  <option value="Available">{statusMap.Available}</option>
                  <option value="Pending">{statusMap.Pending}</option>
                  <option value="Adopted">{statusMap.Adopted}</option>
                </select>
                <Icon name="expand_more" className="center-inv-adoption-select__icon" />
              </div>
              <div className="center-inv-adoption-select-wrap">
                <select
                  className="center-inv-adoption-select"
                  value={ageFilter}
                  onChange={(e) => {
                    setAgeFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">{ta.toolbar.ageAll}</option>
                  <option value="Baby">{ta.toolbar.ageBaby}</option>
                  <option value="Young">{ta.toolbar.ageYoung}</option>
                  <option value="Adult">{ta.toolbar.ageAdult}</option>
                  <option value="Senior">{ta.toolbar.ageSenior}</option>
                </select>
                <Icon name="expand_more" className="center-inv-adoption-select__icon" />
              </div>
              <button
                type="button"
                className="center-inv-adoption-toolbar-btn"
                onClick={() => setAddingPet(true)}
              >
                <Icon name="add" />
                {tm.addPet.saveButton}
              </button>
            </div>
          </div>

          <div className="center-inv-adoption-table-wrap">
            <table className="center-inv-adoption-table">
              <thead>
                <tr>
                  <th>{ta.columns.name}</th>
                  <th>{ta.columns.breed}</th>
                  <th>{ta.columns.age}</th>
                  <th>{ta.columns.arrivalDate}</th>
                  <th>{ta.columns.status}</th>
                  <th>{ta.columns.action}</th>
                </tr>
              </thead>
              <tbody>
                {pagedAnimals.map((animal) => (
                  <tr key={animal.petId}>
                    <td>
                      <div className="center-inv-adoption-table__pet-cell">
                        <div className="center-inv-adoption-table__avatar">
                          <CenterImage src={animal.image} alt={animal.name} fallback={<Icon name="pets" />} />
                        </div>
                        <span className="center-inv-adoption-table__name">{animal.name}</span>
                      </div>
                    </td>
                    <td className="center-inv-adoption-table__meta">{animal.breed}</td>
                    <td className="center-inv-adoption-table__meta">{animal.age}</td>
                    <td className="center-inv-adoption-table__meta">{animal.arrivalDate}</td>
                    <td>
                      <span className={`center-inv-adoption-table__status ${STATUS_CLASS[animal.status] || ""}`}>
                        {translate(`center.status.${animal.status}`, { defaultValue: animal.status })}
                      </span>
                    </td>
                    <td>
                      <div className="center-inv-adoption-table__actions">
                        {animal.status === "Adopted" && (
                          <>
                            <button
                              type="button"
                              className="center-inv-adoption-change-status-btn"
                              onClick={() => setViewingPet(animal)}
                            >
                              {ta.viewRecord}
                            </button>
                            <div className="center-inv-adoption-divider" />
                          </>
                        )}
                        <div className="center-inv-adoption-icon-group">
                          <button
                            type="button"
                            aria-label={t.edit}
                            className="center-inv-adoption-icon-btn"
                            onClick={() => setEditingPet(animal)}
                          >
                            <Icon name="edit" />
                          </button>
                          <button
                            type="button"
                            aria-label={t.delete}
                            className="center-inv-adoption-icon-btn center-inv-adoption-icon-btn--danger"
                            onClick={() => setDeletingPet(animal)}
                          >
                            <Icon name="delete" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="center-inv-adoption-pagination">
            <span className="center-inv-adoption-pagination__info">
              {t.pagination.showing} {rangeStart} {t.pagination.to} {rangeEnd} {t.pagination.of}{" "}
              {filteredAnimals.length} {t.pagination.entries}
            </span>
            <div className="center-inv-adoption-pagination__controls">
              <button
                type="button"
                className="center-inv-adoption-pagination__btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Icon name="chevron_left" />
              </button>
              <button
                type="button"
                className="center-inv-adoption-pagination__btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="center-inv-adoption-modal-overlay">
          <button
            type="button"
            aria-label={tm.close}
            className="center-inv-adoption-modal-backdrop"
            onClick={() => setModalOpen(false)}
          />
          <div className="center-inv-adoption-modal">
            <div className="center-inv-adoption-modal__header">
              <h2 className="center-inv-adoption-modal__title">{ta.modal.title}</h2>
              <button
                type="button"
                aria-label={tm.close}
                className="center-inv-adoption-modal__close-btn"
                onClick={() => setModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="center-inv-adoption-modal__body">
              <div className="center-inv-adoption-modal__toolbar">
                <div className="center-inv-adoption-modal__search">
                  <Icon name="search" className="center-inv-adoption-modal__search-icon" />
                  <input
                    type="text"
                    className="center-inv-adoption-modal__search-input"
                    placeholder={ta.modal.searchPlaceholder}
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                  />
                </div>
                <button type="button" className="center-inv-adoption-modal__filter-btn">
                  <Icon name="filter_list" />
                  {ta.modal.filter}
                </button>
              </div>

              <div className="center-inv-adoption-modal__table-wrap">
                <table className="center-inv-adoption-modal__table">
                  <thead>
                    <tr>
                      <th>{ta.modal.columns.pet}</th>
                      <th>{ta.modal.columns.breed}</th>
                      <th>{ta.modal.columns.date}</th>
                      <th>{ta.modal.columns.adopter}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!allRecentAdoptionsLoading &&
                      filteredModalAdoptions.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="center-inv-adoption-modal__pet-cell">
                              <CenterImage
                                src={item.image}
                                alt={item.petName}
                                className="center-inv-adoption-modal__avatar"
                                fallback={(
                                  <span className="center-inv-adoption-modal__avatar center-image-placeholder">
                                    <Icon name="pets" />
                                  </span>
                                )}
                              />
                              <span className="center-inv-adoption-table__name">{item.petName}</span>
                            </div>
                          </td>
                          <td>{item.breed}</td>
                          <td>{item.date}</td>
                          <td>{item.adopter}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="center-inv-adoption-modal__footer">
              <button
                type="button"
                className="center-inv-adoption-modal__close-action-btn"
                onClick={() => setModalOpen(false)}
              >
                {ta.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {addingPet && <AddPetModal onSave={handlePetAdded} onClose={() => setAddingPet(false)} />}

      {editingPet && (
        <EditPetModal pet={editingPet} onSave={handlePetSaved} onClose={() => setEditingPet(null)} />
      )}

      {viewingPet && <PetRecordModal pet={viewingPet} onClose={() => setViewingPet(null)} />}

      {deletingPet && (
        <DeletePetModal
          pet={deletingPet}
          onConfirm={handlePetDeleted}
          onClose={() => setDeletingPet(null)}
        />
      )}
    </div>
  );
});

export default AdoptionInventory;
