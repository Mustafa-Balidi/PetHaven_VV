import { Link } from 'react-router-dom';
import Navbar from '../TopNavBar';
import Footer from '../Footer';
import { useTranslation } from 'react-i18next';

export default function OrderSummary({ subtotal, shipping, tax, total, isLoggedIn, onClearCart }) {
  const { t } = useTranslation();

  if (!isLoggedIn) {
    return (
      <div className="sc-page">
        <Navbar />
        <main className="sc-main">
          <p>{t('adopter.cart.loginRequired')}</p>
          <Link to="/">{t('adopter.cart.signIn')}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="sc-summary">
      <div className="sc-summary__card">
        <h2 className="sc-summary__title">{t('adopter.cart.summary')}</h2>
        <div className="sc-summary__lines">
          <div className="sc-summary__line">
            <span>{t('adopter.cart.subtotal')}</span>
            <span className="sc-summary__val">${subtotal.toFixed(2)}</span>
          </div>
          <div className="sc-summary__line">
            <span>{t('adopter.cart.shipping')}</span>
            <span className="sc-summary__val">${shipping.toFixed(2)}</span>
          </div>
          <div className="sc-summary__line">
            <span>{t('adopter.cart.tax')}</span>
            <span className="sc-summary__val">${tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="sc-summary__total">
          <span className="sc-summary__total-label">{t('adopter.cart.total')}</span>
          <span className="sc-summary__total-val">${total.toFixed(2)}</span>
        </div>
        <Link to="/adopter/checkout" className="sc-checkout-btn">
          {t('adopter.cart.checkout')}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <br />
        <button className="sc-checkout-btn" onClick={onClearCart}>
          {t('adopter.cart.clear')}
        </button>
        <div className="sc-trust">
          <span className="material-symbols-outlined">lock</span>
          <span>{t('adopter.cart.secure')}</span>
        </div>
      </div>
    </div>
  );
}
