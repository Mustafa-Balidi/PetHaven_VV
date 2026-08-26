import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../Styling/ShoppingCart.css';

import Navbar from '../Components/TopNavBar';
import CartHeader from '../Components/ShoppingCart/CartHeader';
import CartItemsList from '../Components/ShoppingCart/CartItemsList';
import OrderSummary from '../Components/ShoppingCart/OrderSummary';
import Footer from '../Components/Footer';
import Icon from '../Components/Icon.jsx';
import { getCart, updateCartItemQty, removeCartItem, clearCart } from '../api/cartData';

const TAX_RATE = 0; // الـ Backend الحالي لا يضيف ضريبة على Order.TotalPrice

export default function ShoppingCart() {
  const { t } = useTranslation();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(fetchCart);
  }, [fetchCart]);

  const updateQty = async (cartItemId, delta) => {
    const item = cart.items.find((i) => i.cartItemId === cartItemId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    // تحديث تفاؤلي (optimistic) بالواجهة قبل رد السيرفر
    const prevCart = cart;
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty }
          : i
      ),
    }));

    try {
      await updateCartItemQty(cartItemId, newQty);
      fetchCart(); // نجيب النسخة الرسمية من السيرفر (فيها cartTotal محدث)
    } catch (err) {
      setCart(prevCart); // ارجاع الحالة القديمة لو فشل الطلب
      setError(err.message);
    }
  };

  const removeItem = async (cartItemId) => {
    const prevCart = cart;
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.cartItemId !== cartItemId),
    }));

    try {
      await removeCartItem(cartItemId);
      fetchCart();
    } catch (err) {
      setCart(prevCart);
      setError(err.message);
    }
  };
  const handleClearCart = async () => {
    const prevCart = cart;
    setCart((prev) => ({ ...prev, items: [] }));

    try {
      await clearCart();
      fetchCart();
    } catch (err) {
      setCart(prevCart);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="sc-page">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="sc-main">
          <p>{t('adopter.cart.loading')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="sc-page">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="sc-main">
          <p>{error}</p>
          <button type="button" onClick={fetchCart}>{t('adopter.cart.retry')}</button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="sc-page">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="sc-main">
          <section className="sc-empty-state">
            <div className="sc-empty-state__icon" aria-hidden="true">
              <Icon name="lock" />
            </div>
            <h1 className="sc-empty-state__title">{t('adopter.cart.loginRequired')}</h1>
            <Link to="/" className="sc-empty-state__action">
              {t('adopter.cart.signIn')}
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="sc-page">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="sc-main">
          <CartHeader itemCount={0} />
          <section className="sc-empty-state" aria-live="polite">
            <div className="sc-empty-state__icon" aria-hidden="true">
              <Icon name="shopping_cart_off" />
            </div>
            <h2 className="sc-empty-state__title">{t('adopter.cart.empty')}</h2>
            <p className="sc-empty-state__text">{t('adopter.cart.emptyDescription')}</p>
            <Link to="/adopter/store" className="sc-empty-state__action">
              {t('adopter.cart.browseStore')}
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 0; // عدّلها إذا صار عندك shipping من الـ API
  const tax = subtotal * TAX_RATE;
  const total = cart.cartTotal ?? subtotal + shipping + tax;

  return (
    <div className="sc-page">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="sc-main">
        <CartHeader itemCount={cart.items.length} />
        <div className="sc-grid">
          <CartItemsList
            items={cart.items}
            onUpdateQty={updateQty}
            onRemove={removeItem}
          />
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            isLoggedIn={isLoggedIn}
            onClearCart={handleClearCart}
          />
        </div>

      </main>
      <Footer />
    </div>
  );
}
