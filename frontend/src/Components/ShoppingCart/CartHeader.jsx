import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CartHeader({ itemCount }) {
  const { t } = useTranslation();

  return (
    <div className="sc-header">
      <h1 className="sc-header__title">
        <Link to="/adopter/store" className="sc-back-btn" aria-label={t('adopter.cart.backToStore')}>
         
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        {t('adopter.cart.title')}
      </h1>
      <span className="sc-header__count">{t('adopter.cart.itemCount', { count: itemCount })}</span>
    </div>
  );
}
