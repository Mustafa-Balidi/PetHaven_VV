import { useTranslation } from "react-i18next";

export default function Footer({ onContactClick }) {
  const { t } = useTranslation();
  const LOGO_GRAY =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqSx0okhbGddnCMO2ewqej-SYUclpEbHOWerf5dnKJJnyKSbOxCut7fY3sxUSfANUFUqfYUOkZ-Wzl_PIMeIBBkPAogtn_gVPygXgHDHwvhHUMyR3GEjNLKJIrqwPf6bTiAKMkiLOwG3-KON_ZK3F3pyBd-vcA4TE6inZa08js1w5y22DLJHVgjgWNXAWwJXwlEifYqVZ3Em_Ajsd7JtDGxtfLovDWgo1VGV_wJ08ZjitcyYHsi0-4NU1jdRVF57SmF58BmK78J7m";
  const links = [
    { label: t("footer.privacyPolicy") },
    { label: t("footer.termsOfService") },
  ];
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={LOGO_GRAY} alt={t("footer.logoAlt")} className="footer-logo" />
          <span className="footer-copyright">{t("footer.copyright")}</span>
        </div>
        <div className="footer-links">
          {links.map((link) => (
            <a key={link.label} href="#" className="footer-link">
              {link.label}
            </a>
          ))}
          <button type="button" className="footer-link footer-link--button" onClick={onContactClick}>
            {t("footer.contactUs")}
          </button>
        </div>
      </div>
    </footer>
  );
}
