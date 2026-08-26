import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Icon from "../../Components/Icon.jsx";
import "../../Styling/VetVerification.css";

export default function VetProfessionalVerification() {
  const { t } = useTranslation();
  useDocumentTitle(t("vetVerification.title"));
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const licenseInputRef = useRef(null);
  const dropzoneRef = useRef(null);

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
      // Sighted users see the message; move the keyboard user to the field.
      licenseInputRef.current?.focus();
      return;
    }
    if (!file) {
      setError(t("vetVerification.errors.fileRequired"));
      dropzoneRef.current?.focus();
      return;
    }
    setError("");
    navigate("/vet/pending-approval");
  }

  return (
    <div className="vet-verification-page">
      <VetHeader />

      <main id="main-content" tabIndex={-1} className="vet-verification-main">
        <form className="vet-verification-card" onSubmit={handleSubmit}>
          <div className="vet-verification-card__accent" />

          <div className="vet-verification-head">
            <div className="vet-verification-head__icon">
              <Icon name="verified" filled />
            </div>
            <h1 className="vet-verification-title">{t("vetVerification.title")}</h1>
            <p className="vet-verification-subtitle">{t("vetVerification.subtitle")}</p>
          </div>

          {/* The real file input is display:none, so this stand-in is the
              only way in. Without a label of its own its name would be the
              whole subtree, hint and file chip included. */}
          <div
            className="vet-verification-upload"
            ref={dropzoneRef}
            role="button"
            tabIndex={0}
            aria-label={t("vetVerification.upload.dropzoneLabel")}
            aria-describedby="vet-verification-upload-hint"
            onClick={handleChooseFile}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              // Space would otherwise scroll the page as well.
              event.preventDefault();
              handleChooseFile();
            }}
          >
            <div className="vet-verification-upload__icon">
              <Icon name="cloud_upload" />
            </div>
            <h3 className="vet-verification-upload__title">{t("vetVerification.upload.title")}</h3>
            <p className="vet-verification-upload__hint" id="vet-verification-upload-hint">
              {t("vetVerification.upload.hint")}
            </p>

            {file && (
              <div className="vet-verification-upload__file" role="status">
                <Icon name="description" />
                {t("vetVerification.upload.selected", { name: file.name })}
                <button
                  type="button"
                  className="vet-verification-upload__file-remove"
                  onClick={handleRemoveFile}
                  // Enter on Remove would otherwise bubble to the stand-in
                  // button and reopen the file picker.
                  onKeyDown={(event) => event.stopPropagation()}
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
                ref={licenseInputRef}
                type="text"
                className="vet-verification-input"
                aria-required="true"
                aria-invalid={error === t("vetVerification.errors.licenseRequired") || undefined}
                aria-describedby={
                  error === t("vetVerification.errors.licenseRequired")
                    ? "vet-verification-error"
                    : undefined
                }
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
            <p className="vet-verification-error" id="vet-verification-error" role="alert">
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
