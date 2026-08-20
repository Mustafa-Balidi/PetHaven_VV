import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const SPECIES = ["Dog", "Cat", "Bird", "Small Mammal", "Other"];
const SIZES = ["Small (Under 25 lbs)", "Medium (25-60 lbs)", "Large (61-100 lbs)", "Extra Large (Over 100 lbs)"];
const HEALTH_STATUSES = ["Healthy", "Minor Issues", "Requires Treatment", "Critical"];
const AVAILABILITY = ["Available", "Pending", "Adopted"];

export default function AddPetModal({ onSave, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const ta = t.addPet;
  const opt = translate("center.petOptions", { returnObjects: true });
  const statusMap = translate("center.status", { returnObjects: true });
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [ageNumber, setAgeNumber] = useState("");
  const [ageUnit, setAgeUnit] = useState("years");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [healthStatus, setHealthStatus] = useState("Healthy");
  const [availability, setAvailability] = useState("Available");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        name,
        species,
        breed,
        age: parseInt(ageNumber, 10) || null,
        gender,
        size,
        color,
        healthStatus,
        status: availability,
        description,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.close} className="center-modal-backdrop" onClick={onClose} />
      <div className="center-modal-panel center-modal-panel--lg">
        <div className="center-modal-header">
          <h2 className="center-modal-title">{ta.title}</h2>
          <button type="button" aria-label={t.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{ta.media}</h3>
            <div className="center-modal-photo">
              <div className={`center-modal-photo__preview center-modal-photo__preview--lg ${
                previewUrl ? "" : "center-modal-photo__preview--empty"
              }`}>
                {previewUrl ? <img src={previewUrl} alt={name || ta.title} /> : <Icon name="pets" />}
              </div>
              <div className="center-modal-photo__meta">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="center-modal-file-input"
                />
                <button type="button" className="center-modal-photo__change-btn" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="upload" />
                  {ta.uploadPhoto}
                </button>
                <p className="center-modal-photo__hint">{ta.photoHint}</p>
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <div className="center-modal-section__title center-modal-section__title--primary">
              <Icon name="pets" filled />
              {ta.basicInfo}
            </div>
            <div className="center-modal-grid">
              <div className="center-modal-field center-modal-field--full">
                <label className="center-modal-label">{ta.nameLabel}</label>
                <input
                  type="text"
                  className="center-modal-input"
                  placeholder={ta.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.speciesLabel}</label>
                <div className="center-modal-select-wrap">
                  <select
                    className="center-modal-select"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                  >
                    <option value="" disabled>
                      {ta.speciesPlaceholder}
                    </option>
                    {SPECIES.map((s) => (
                      <option key={s} value={s}>
                        {opt.species[s]}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.breedLabel}</label>
                <input
                  type="text"
                  className="center-modal-input"
                  placeholder={ta.breedPlaceholder}
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                />
              </div>
              <div className="center-modal-age-group">
                <div className="center-modal-field">
                  <label className="center-modal-label">{ta.ageLabel}</label>
                  <input
                    type="number"
                    min="0"
                    className="center-modal-input"
                    placeholder="0"
                    value={ageNumber}
                    onChange={(e) => setAgeNumber(e.target.value)}
                  />
                </div>
                <div className="center-modal-select-wrap center-modal-age-unit">
                  <select className="center-modal-select" value={ageUnit} onChange={(e) => setAgeUnit(e.target.value)}>
                    <option value="years">{opt.ageUnits.years}</option>
                    <option value="months">{opt.ageUnits.months}</option>
                    <option value="weeks">{opt.ageUnits.weeks}</option>
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.genderLabel}</label>
                <div className="center-modal-radio-group">
                  {["Male", "Female", "Unknown"].map((g) => (
                    <label key={g} className="center-modal-radio">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                      />
                      <span>{opt.genders[g]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.sizeLabel}</label>
                <div className="center-modal-select-wrap">
                  <select className="center-modal-select" value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value="" disabled>
                      {ta.sizePlaceholder}
                    </option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {opt.sizes[s]}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.colorLabel}</label>
                <input
                  type="text"
                  className="center-modal-input"
                  placeholder={ta.colorPlaceholder}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <div className="center-modal-section__title center-modal-section__title--green">
              <Icon name="medical_services" filled />
              {ta.medicalRecords}
            </div>
            <div className="center-modal-grid">
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.healthStatusLabel}</label>
                <div className="center-modal-select-wrap">
                  <select
                    className="center-modal-select"
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value)}
                  >
                    {HEALTH_STATUSES.map((h) => (
                      <option key={h} value={h}>
                        {opt.healthStatuses[h]}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <div className="center-modal-section__title center-modal-section__title--yellow">
              <Icon name="volunteer_activism" filled />
              {ta.adoptionDetails}
            </div>
            <div className="center-modal-grid">
              <div className="center-modal-field">
                <label className="center-modal-label">{ta.availabilityLabel}</label>
                <div className="center-modal-select-wrap">
                  <select
                    className="center-modal-select"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    {AVAILABILITY.map((a) => (
                      <option key={a} value={a}>
                        {statusMap[a]}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <div className="center-modal-section__title center-modal-section__title--secondary">
              <Icon name="psychology" filled />
              {ta.characterNotes}
            </div>
            <div className="center-modal-field">
              <label className="center-modal-label">{ta.characterLabel}</label>
              <textarea
                className="center-modal-textarea"
                placeholder={ta.characterPlaceholder}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </section>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-secondary" onClick={onClose}>
            {t.cancel}
          </button>
          <button
            type="button"
            className="center-modal-btn-primary"
            disabled={saving || !name || !species || !gender}
            onClick={handleSave}
          >
            <Icon name="add" />
            {ta.saveButton}
          </button>
        </div>
      </div>
    </div>
  );
}
