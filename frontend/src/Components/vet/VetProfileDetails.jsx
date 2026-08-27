import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { resolveBackendAssetUrl } from "../../api/apiClient.js";

export default function VetProfileDetails({ profile }) {
  const { t } = useTranslation();
  const initials = (profile.fullName || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const profileImageUrl = resolveBackendAssetUrl(profile.profileImageUrl);
  const certificateUrl = resolveBackendAssetUrl(profile.certificateUrl);

  return (
    <section className="vet-profile-identity">
      <div className="vet-profile-identity__avatar">
        {profileImageUrl ? (
          <img src={profileImageUrl} alt={t("vetProfile.identity.profileImageAlt", { name: profile.fullName })} />
        ) : (
          <span aria-hidden="true">{initials || <Icon name="person" />}</span>
        )}
      </div>
      <div className="vet-profile-identity__body">
        <div className="vet-profile-identity__name-row">
          <h2 className="vet-profile-identity__name">{profile.fullName || t("vetProfile.identity.unnamed")}</h2>
          <span
            className={`vet-profile-identity__badge${
              profile.isVerified ? " vet-profile-identity__badge--verified" : ""
            }`}
          >
            <Icon name={profile.isVerified ? "verified" : "hourglass_empty"} className="vet-profile-icon-sm" />
            {profile.isVerified ? t("vetProfile.identity.verified") : t("vetProfile.identity.pendingVerification")}
          </span>
        </div>
        <p className="vet-profile-identity__meta vet-profile-identity__meta--muted">
          {profile.email || t("vetProfile.identity.noEmail")}
        </p>
        {certificateUrl ? (
          <a href={certificateUrl} target="_blank" rel="noreferrer" className="vet-profile-identity__meta">
            <Icon name="description" className="vet-profile-icon-sm" /> {t("vetProfile.certificate.view")}
          </a>
        ) : (
          <p className="vet-profile-identity__meta vet-profile-identity__meta--muted">
            {t("vetProfile.certificate.none")}
          </p>
        )}
      </div>
    </section>
  );
}
