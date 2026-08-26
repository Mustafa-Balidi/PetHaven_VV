import { useMemo, useState } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import PetCard from "./PetCard";

const PAGE_SIZE = 8;

function normalized(value) {
  return String(value ?? "").trim().toLocaleLowerCase();
}

function uniqueValues(pets, field) {
  return [...new Set(pets.map((pet) => pet[field]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

function PetCatalogGrid({ pets, onViewProfile, onAdoptNow }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);

  const options = useMemo(
    () => ({
      species: uniqueValues(pets, "species"),
      genders: uniqueValues(pets, "gender"),
      healthStatuses: uniqueValues(pets, "healthStatus"),
    }),
    [pets]
  );

  const filteredPets = useMemo(() => {
    const term = normalized(searchTerm);
    const result = pets.filter((pet) => {
      const matchesSearch =
        !term ||
        [pet.name, pet.species, pet.breed, pet.gender, pet.description, pet.healthStatus, pet.centerName]
          .some((value) => normalized(value).includes(term));

      return (
        matchesSearch &&
        (!species || pet.species === species) &&
        (!gender || pet.gender === gender) &&
        (!healthStatus || pet.healthStatus === healthStatus)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "name-desc") return normalized(b.name).localeCompare(normalized(a.name));
      if (sortBy === "age-asc") return (a.age ?? Number.POSITIVE_INFINITY) - (b.age ?? Number.POSITIVE_INFINITY);
      if (sortBy === "age-desc") return (b.age ?? Number.NEGATIVE_INFINITY) - (a.age ?? Number.NEGATIVE_INFINITY);
      return normalized(a.name).localeCompare(normalized(b.name));
    });
  }, [pets, searchTerm, species, gender, healthStatus, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredPets.length / PAGE_SIZE));
  const visiblePets = filteredPets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters = Boolean(searchTerm.trim() || species || gender || healthStatus);

  const clearFilters = () => {
    setSearchTerm("");
    setSpecies("");
    setGender("");
    setHealthStatus("");
    setPage(1);
  };

  return (
    <div className="pet-catalog">
      <div className="pet-catalog__toolbar">
        <div>
          <h2 className="pet-catalog__title">{t("adopter.adoptionHub.catalog.title")}</h2>
          <p className="pet-catalog__count" role="status" aria-live="polite">
            {t("adopter.adoptionHub.catalog.results", { count: filteredPets.length })}
          </p>
        </div>

        <div className="pet-catalog__controls">
          <label className="pet-catalog__search">
            <FaSearch size={16} className="pet-catalog__search-icon" />
            <input
              type="search"
              className="pet-catalog__search-input"
              aria-label={t("adopter.adoptionHub.catalog.searchLabel")}
              placeholder={t("adopter.adoptionHub.catalog.search")}
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <button
            type="button"
            className="pet-catalog__filter-btn"
            aria-expanded={showFilters}
            aria-controls="pet-catalog-filters"
            onClick={() => setShowFilters((visible) => !visible)}
          >
            <FaSlidersH size={16} />
            <span>{t("adopter.adoptionHub.catalog.filters")}</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div id="pet-catalog-filters" className="pet-catalog__filters">
          <label>
            <span>{t("adopter.adoptionHub.catalog.species")}</span>
            <select value={species} onChange={(event) => { setSpecies(event.target.value); setPage(1); }}>
              <option value="">{t("adopter.adoptionHub.catalog.allSpecies")}</option>
              {options.species.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span>{t("adopter.adoptionHub.catalog.gender")}</span>
            <select value={gender} onChange={(event) => { setGender(event.target.value); setPage(1); }}>
              <option value="">{t("adopter.adoptionHub.catalog.allGenders")}</option>
              {options.genders.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span>{t("adopter.adoptionHub.catalog.healthStatus")}</span>
            <select value={healthStatus} onChange={(event) => { setHealthStatus(event.target.value); setPage(1); }}>
              <option value="">{t("adopter.adoptionHub.catalog.allHealthStatuses")}</option>
              {options.healthStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span>{t("adopter.adoptionHub.catalog.sortBy")}</span>
            <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }}>
              <option value="name-asc">{t("adopter.adoptionHub.catalog.sortNameAsc")}</option>
              <option value="name-desc">{t("adopter.adoptionHub.catalog.sortNameDesc")}</option>
              <option value="age-asc">{t("adopter.adoptionHub.catalog.sortAgeAsc")}</option>
              <option value="age-desc">{t("adopter.adoptionHub.catalog.sortAgeDesc")}</option>
            </select>
          </label>
        </div>
      )}

      {visiblePets.length > 0 ? (
        <>
          <div className="pet-catalog__grid">
            {visiblePets.map((pet) => (
              <PetCard
                key={pet.petId}
                pet={pet}
                onViewProfile={onViewProfile}
                onAdoptNow={onAdoptNow}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <nav className="pet-catalog__pagination" aria-label={t("adopter.adoptionHub.catalog.paginationLabel")}>
              <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                {t("adopter.adoptionHub.catalog.previous")}
              </button>
              <span>{t("adopter.adoptionHub.catalog.page", { page, pageCount })}</span>
              <button type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>
                {t("adopter.adoptionHub.catalog.next")}
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="pet-catalog__state">
          <FaSearch size={24} />
          <h3>{hasActiveFilters ? t("adopter.adoptionHub.catalog.noMatches") : t("adopter.adoptionHub.catalog.empty")}</h3>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters}>{t("adopter.adoptionHub.catalog.clearFilters")}</button>
          )}
        </div>
      )}
    </div>
  );
}

export default PetCatalogGrid;
