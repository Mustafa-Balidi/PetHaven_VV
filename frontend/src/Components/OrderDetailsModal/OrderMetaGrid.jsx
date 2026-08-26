import { useTranslation } from 'react-i18next';
import { formatLocalizedDate } from '../../utils/localization.js';

export default function OrderMetaGrid({ id, date, status }) {
  const { t, i18n } = useTranslation();
  const displayDate = formatLocalizedDate(
    typeof date === 'string' ? date.replace(' at ', ' ') : date,
    i18n.language,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  );

  return (
    <div className="odm-meta-grid">
      <div className="odm-meta-card">
        <div className="odm-meta-label">
          <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
          <span>{t('adopter.orders.orderId')}</span>
        </div>
        <p className="odm-meta-val">{id}</p>
      </div>
      <div className="odm-meta-card">
        <div className="odm-meta-row">
          <div>
            <div className="odm-meta-label">
              <span className="material-symbols-outlined" aria-hidden="true">calendar_today</span>
              <span>{t('adopter.orders.datePlaced')}</span>
            </div>
            <p className="odm-meta-val">{displayDate}</p>
          </div>
          <div className="odm-status-badge">
            <span className="material-symbols-outlined odm-status-icon" aria-hidden="true">check_circle</span>
            <span>{t(`adopter.orders.statuses.${status}`, { defaultValue: status })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
