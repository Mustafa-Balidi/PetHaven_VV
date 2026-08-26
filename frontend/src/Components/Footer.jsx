import { useTranslation } from "react-i18next";
import "../Styling/Footer.css";

export default function Footer({ onContactClick }) {
  const { t } = useTranslation();
  const LOGO_GRAY =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqSx0okhbGddnCMO2ewqej-SYUclpEbHOWerf5dnKJJnyKSbOxCut7fY3sxUSfANUFUqfYUOkZ-Wzl_PIMeIBBkPAogtn_gVPygXgHDHwvhHUMyR3GEjNLKJIrqwPf6bTiAKMkiLOwG3-KON_ZK3F3pyBd-vcA4TE6inZa08js1w5y22DLJHVgjgWNXAWwJXwlEifYqVZ3Em_Ajsd7JtDGxtfLovDWgo1VGV_wJ08ZjitcyYHsi0-4NU1jdRVF57SmF58BmK78J7m";
  const links = [
    { label: t("footer.privacyPolicy") },
    { label: t("footer.termsOfService") },
  ];
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <img src={LOGO_GRAY} alt={t("footer.logoAlt")} className="app-footer__logo" />
          <span className="app-footer__copyright">{t("footer.copyright")}</span>
        </div>
        <div className="app-footer__links">
          {links.map((link) => (
            <span key={link.label} className="app-footer__link">
              {link.label}
            </span>
          ))}
          <button type="button" className="app-footer__link" onClick={onContactClick}>
            {t("footer.contactUs")}
          </button>
        </div>
      </div>
    </footer>
  );
}
