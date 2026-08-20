import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function WalletCard({ balance, loading, error, onRetry }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en";
  const formattedBalance = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(balance ?? 0);

  return (
    <section className="wallet-section" aria-labelledby="adopter-wallet-title">
      <div className="wallet-card">
        <div className="wallet-card__content">
          <div className="wallet-card__icon" aria-hidden="true">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>

          <div>
            <h2 id="adopter-wallet-title" className="wallet-card__title">
              {t("adopter.dashboard.wallet.title")}
            </h2>
            <p className="wallet-card__label">
              {t("adopter.dashboard.wallet.balanceLabel")}
            </p>
            <p className="wallet-card__balance" aria-live="polite">
              {loading
                ? t("adopter.dashboard.wallet.loading")
                : error
                  ? t("adopter.dashboard.wallet.unavailable")
                  : formattedBalance}
            </p>
            <p className="wallet-card__description">
              {error
                ? t("adopter.dashboard.wallet.loadError")
                : t("adopter.dashboard.wallet.description")}
            </p>
            {error && (
              <button type="button" className="dashboard-retry-button dashboard-retry-button--light" onClick={onRetry}>
                {t("adopter.dashboard.retry")}
              </button>
            )}
          </div>
        </div>

        <Link to="/adopter/store" className="wallet-card__action">
          {t("adopter.dashboard.wallet.shopNow")}
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </div>
    </section>
  );
}
