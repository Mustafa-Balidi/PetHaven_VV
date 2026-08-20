import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import CenterImage from "./CenterImage.jsx";

const SPECIES = ["Dog", "Cat", "Bird", "Small Mammal", "Other"];
const SIZES = ["Small (Under 25 lbs)", "Medium (25-60 lbs)", "Large (61-100 lbs)", "Extra Large (Over 100 lbs)"];
const HEALTH_STATUSES = ["Healthy", "Minor Issues", "Requires Treatment", "Critical"];
const AVAILABILITY = ["Available", "Pending", "Adopted"];

export default function EditPetModal({ pet, onSave, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const te = t.editPet;
  const opt = translate("center.petOptions", { returnObjects: true });
  const statusMap = translate("center.status", { returnObjects: true });
  const [name, setName] = useState(pet.name);
  const [species, setSpecies] = useState(pet.species || "Dog");
  const [breed, setBreed] = useState(pet.breed);
  const [gender, setGender] = useState(pet.gender || "Unknown");
  const [size, setSize] = useState(pet.size || SIZES[0]);
  const [color, setColor] = useState(pet.color || "");
  const [healthStatus, setHealthStatus] = useState(pet.healthStatus || "Healthy");
  const [availability, setAvailability] = useState(pet.status);
  const [description, setDescription] = useState(pet.description || "");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(pet.petId, {
        name,
        species,
        breed,
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
          <h2 className="center-modal-title">{te.title}</h2>
          <button type="button" aria-label={t.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{te.media}</h3>
            <div className="center-modal-photo">
              <div className="center-modal-photo__preview center-modal-photo__preview--lg">
                <CenterImage src={previewUrl || pet.image} alt={name} fallback={<Icon name="pets" />} />
              </div>
              <div className="center-modal-photo__meta">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="center-modal-file-input"
                />
                <button type="button" className="center-modal-photo__change-btn" onClick={() => fileInputRef.current.click()}>
                  <Icon name="upload" />
                  {te.changePhoto}
                </button>
                <p className="center-modal-photo__hint">{te.photoHint}</p>
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{te.basicInfo}</h3>
            <div className="center-modal-grid">
              <div className="center-modal-field">
                <label className="center-modal-label">{te.nameLabel}</label>
                <input type="text" className="center-modal-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{te.speciesLabel}</label>
                <div className="center-modal-select-wrap">
                  <select className="center-modal-select" value={species} onChange={(e) => setSpecies(e.target.value)}>
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
                <label className="center-modal-label">{te.breedLabel}</label>
                <input type="text" className="center-modal-input" value={breed} onChange={(e) => setBreed(e.target.value)} />
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{te.ageLabel}</label>
                <input type="text" className="center-modal-input" value={pet.age} readOnly />
              </div>
              <div className="center-modal-field">
                <label className="center-modal-label">{te.genderLabel}</label>
                <div className="center-modal-radio-group">
                  {["Male", "Female", "Unknown"].map((g) => (
                    <label key={g} className="center-modal-radio">
                      <input
                        type="radio"
                        name="edit-gender"
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
                <label className="center-modal-label">{te.sizeLabel}</label>
                <div className="center-modal-select-wrap">
                  <select className="center-modal-select" value={size} onChange={(e) => setSize(e.target.value)}>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {opt.sizes[s]}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="center-modal-select__icon" />
                </div>
              </div>
              <div className="center-modal-field center-modal-field--full">
                <label className="center-modal-label">{te.colorLabel}</label>
                <input type="text" className="center-modal-input" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <div className="center-modal-grid">
            <section className="center-modal-section">
              <h3 className="center-modal-section__title">{te.medical}</h3>
              <div className="center-modal-field">
                <label className="center-modal-label">{te.healthStatusLabel}</label>
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
            </section>

            <section className="center-modal-section">
              <h3 className="center-modal-section__title">{te.adoptionDetails}</h3>
              <div className="center-modal-field">
                <label className="center-modal-label">{te.availabilityLabel}</label>
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
            </section>
          </div>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{te.character}</h3>
            <div className="center-modal-field">
              <label className="center-modal-label">{te.characterLabel}</label>
              <textarea
                className="center-modal-textarea"
                placeholder={te.characterPlaceholder}
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
          <button type="button" className="center-modal-btn-primary" disabled={saving} onClick={handleSave}>
            <Icon name="save" />
            {te.saveButton}
          </button>
        </div>
      </div>
    </div>
  );
}
