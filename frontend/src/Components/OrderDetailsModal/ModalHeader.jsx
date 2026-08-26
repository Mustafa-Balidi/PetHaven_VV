import { useTranslation } from 'react-i18next';

export default function ModalHeader({ title, titleId = 'odm-title', onClose }) {
  const { t } = useTranslation();

  return (
    <div className="odm-header">
      <h2 className="odm-title" id={titleId}>{title}</h2>
      <button
        type="button"
        className="odm-close"
        aria-label={t('adopter.orders.close')}
        onClick={onClose}
      >
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
  );
}
