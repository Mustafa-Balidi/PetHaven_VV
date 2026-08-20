import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import "../../Styling/VetVerification.css";

export default function VetProfessionalVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) setError("");
  }

  function handleRemoveFile(event) {
    event.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSaveForLater() {
    navigate("/vet/dashboard");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!licenseNumber.trim()) {
      setError(t("vetVerification.errors.licenseRequired"));
      return;
    }
    if (!file) {
      setError(t("vetVerification.errors.fileRequired"));
      return;
    }
    setError("");
    navigate("/vet/pending-approval");
  }

  return (
    <div className="vet-verification-page">
      <VetHeader />

      <main className="vet-verification-main">
        <form className="vet-verification-card" onSubmit={handleSubmit}>
          <div className="vet-verification-card__accent" />

          <div className="vet-verification-head">
            <div className="vet-verification-head__icon">
              <Icon name="verified" filled />
            </div>
            <h1 className="vet-verification-title">{t("vetVerification.title")}</h1>
            <p className="vet-verification-subtitle">{t("vetVerification.subtitle")}</p>
          </div>

          <div
            className="vet-verification-upload"
            role="button"
            tabIndex={0}
            onClick={handleChooseFile}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") handleChooseFile();
            }}
          >
            <div className="vet-verification-upload__icon">
              <Icon name="cloud_upload" />
            </div>
            <h3 className="vet-verification-upload__title">{t("vetVerification.upload.title")}</h3>
            <p className="vet-verification-upload__hint">{t("vetVerification.upload.hint")}</p>

            {file && (
              <div className="vet-verification-upload__file">
                <Icon name="description" />
                {t("vetVerification.upload.selected", { name: file.name })}
                <button
                  type="button"
                  className="vet-verification-upload__file-remove"
                  onClick={handleRemoveFile}
                  aria-label={t("vetVerification.upload.remove")}
                >
                  <Icon name="close" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="vet-verification-upload__input"
              onChange={handleFileChange}
            />
          </div>

          <div className="vet-verification-grid">
            <div className="vet-verification-field">
              <label className="vet-verification-label" htmlFor="license-number">
                {t("vetVerification.form.licenseNumber")}
              </label>
              <input
                id="license-number"
                type="text"
                className="vet-verification-input"
                placeholder={t("vetVerification.form.licenseNumberPlaceholder")}
                value={licenseNumber}
                onChange={(event) => setLicenseNumber(event.target.value)}
              />
            </div>

            <div className="vet-verification-field">
              <label className="vet-verification-label" htmlFor="issue-date">
                {t("vetVerification.form.issueDate")}
              </label>
              <input
                id="issue-date"
                type="date"
                className="vet-verification-input"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="vet-verification-error" role="alert">
              {error}
            </p>
          )}

          <div className="vet-verification-actions">
            <button
              type="button"
              className="vet-verification-btn vet-verification-btn--secondary"
              onClick={handleSaveForLater}
            >
              {t("vetVerification.actions.saveForLater")}
            </button>
            <button type="submit" className="vet-verification-btn vet-verification-btn--primary">
              {t("vetVerification.actions.submit")}
              <Icon name="arrow_forward" />
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
