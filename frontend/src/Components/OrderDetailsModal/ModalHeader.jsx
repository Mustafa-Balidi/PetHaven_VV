import { useTranslation } from 'react-i18next';

export default function ModalHeader({ title, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="odm-header">
      <h2 className="odm-title" id="odm-title">{title}</h2>
      <button className="odm-close" aria-label={t('adopter.orders.close')} onClick={onClose}>
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
