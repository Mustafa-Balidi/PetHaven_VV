import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar";
import "../Styling/Checkout.css";
import { getCart } from "../api/cartData.js";
import { checkoutOrder, processPayment } from "../api/orderApi.js";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState(null);

  useEffect(() => {
    let mounted = true;

    getCart()
      .then((data) => {
        if (mounted) setCart(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const items = cart?.items ?? [];
  const subtotal = Number(cart?.cartTotal ?? 0);
  const shipping = 0;
  const taxes = 0;
  const total = subtotal;

  const handlePayNow = async () => {
    if (paying) return;

    if (!pendingOrderId && items.length === 0) {
      setError(t("adopter.checkout.cartEmpty"));
      return;
    }

    setPaying(true);
    setError("");

    let orderId = pendingOrderId;
    let createdOrder = null;

    try {
      // Payments/checkout requires an existing OrderId, so create the order first.
      if (!orderId) {
        createdOrder = await checkoutOrder();
        orderId = createdOrder.orderId;
        setPendingOrderId(orderId);
      }

      await processPayment({
        orderId,
        paymentMethod: paymentMethod === "stripe" ? "Stripe" : "ShamCash",
        transactionId: null,
      });

      navigate(`/adopter/order-confirmed?orderId=${orderId}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      setError(
        orderId
          ? t("adopter.checkout.paymentFailed", { orderId, message: err.message })
          : err.message
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <TopNavBar />
        <main className="checkout-main">
          <p>{t("adopter.checkout.loading")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <TopNavBar />

      <main className="checkout-main">
        <div className="checkout-header">
          <h1 className="checkout-header__title">
            <button
              type="button"
              className="checkout-header__back"
              aria-label={t("adopter.checkout.goBack")}
              onClick={() => navigate(-1)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            {t("adopter.checkout.title")}
          </h1>
          <p className="checkout-header__subtitle">
            <span className="material-symbols-outlined checkout-header__lock-icon">
              lock
            </span>
            {t("adopter.checkout.encryption")}
          </p>
        </div>

        {error && <p className="checkout-error">{error}</p>}

        <div className="checkout-grid">
          <div className="checkout-grid__left">
            <section className="checkout-card">
              <h2 className="checkout-card__title">
                <span className="material-symbols-outlined checkout-card__title-icon">
                  payment
                </span>
                {t("adopter.checkout.paymentMethod")}
              </h2>

              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "stripe" ? "payment-option--selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="payment-option__input"
                  />
                  <span className="material-symbols-outlined payment-option__icon">
                    credit_card
                  </span>
                  <span className="payment-option__label">Stripe</span>
                  {paymentMethod === "stripe" && (
                    <div className="payment-option__check">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  )}
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "shamcash"
                      ? "payment-option--selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="shamcash"
                    checked={paymentMethod === "shamcash"}
                    onChange={() => setPaymentMethod("shamcash")}
                    className="payment-option__input"
                  />
                  <div className="payment-option__logo-wrap">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJkaom-dWKvnNwwRQPnmsg1OA5Uw-ALznTpZjiIB9rHcnE4Oa3-5cQEM0yTflhSgWAGPatUmINr0RSwrk7P4kyMofRsVICcT52Z0DeK4QcS7tKhn4gVVWiISEIJVzEpad0r1vrlDByT-7lu72DW4B5XdO9WhPgoWc1cKEd9NWJmKM0ZCTgXLmgGOtCXkhsyOmo8NV3DmjnesHf1XTEihG2ehS29ZkI61jiObl1tZS_zIH1xA1uRz-tW9VcFLcROFBeGJWAoKZu-0Wc"
                      alt={t("adopter.checkout.shamCashLogo")}
                      className="payment-option__logo"
                    />
                  </div>
                  <span className="payment-option__label payment-option__label--muted">
                    ShamCash
                  </span>
                </label>
              </div>

              {paymentMethod === "stripe" && (
                <div className="card-form">
                  <div className="card-form__field">
                    <label className="card-form__label" htmlFor="cardNumber">
                      {t("adopter.checkout.cardNumber")}
                    </label>
                    <div className="card-form__input-wrap">
                      <span className="material-symbols-outlined card-form__input-icon-left">
                        credit_card
                      </span>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="card-form__input card-form__input--with-icon"
                      />
                    </div>
                  </div>

                  <div className="card-form__row">
                    <div className="card-form__field">
                      <label className="card-form__label" htmlFor="expiry">
                        {t("adopter.checkout.expiryDate")}
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        placeholder={t("adopter.checkout.expiryPlaceholder")}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="card-form__input"
                      />
                    </div>

                    <div className="card-form__field">
                      <label
                        className="card-form__label card-form__label--row"
                        htmlFor="cvv"
                      >
                        <span>{t("adopter.checkout.cvv")}</span>
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        maxLength={4}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="card-form__input"
                      />
                    </div>
                  </div>

                  <div className="card-form__field">
                    <label className="card-form__label" htmlFor="nameOnCard">
                      {t("adopter.checkout.nameOnCard")}
                    </label>
                    <input
                      id="nameOnCard"
                      type="text"
                      placeholder={t("adopter.checkout.namePlaceholder")}
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      className="card-form__input"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="checkout-grid__right">
            <div className="order-summary">
              <h2 className="order-summary__title">{t("adopter.checkout.summary")}</h2>

              {items.map((item) => (
                <div className="order-summary__item" key={item.cartItemId}>
                  <div className="order-summary__item-icon">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div className="order-summary__item-info">
                    <h3 className="order-summary__item-name">{item.productName}</h3>
                    <p className="order-summary__item-qty">
                      {t("adopter.checkout.quantity", { count: item.quantity })}
                    </p>
                  </div>
                  <div className="order-summary__item-price">
                    ${Number(item.totalPrice).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="order-summary__breakdown">
                <div className="order-summary__row">
                  <span>{t("adopter.checkout.subtotal")}</span>
                  <span className="order-summary__row-value">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="order-summary__row">
                  <span>{t("adopter.checkout.shipping")}</span>
                  <span className="order-summary__row-value">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="order-summary__row">
                  <span>{t("adopter.checkout.taxes")}</span>
                  <span className="order-summary__row-value">
                    ${taxes.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="order-summary__total">
                <span className="order-summary__total-label">{t("adopter.checkout.total")}</span>
                <span className="order-summary__total-value">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="order-summary__pay-btn"
                onClick={handlePayNow}
                disabled={paying || (!pendingOrderId && items.length === 0)}
              >
                <span className="material-symbols-outlined">lock</span>
                {paying
                  ? t("adopter.checkout.processing")
                  : pendingOrderId
                    ? t("adopter.checkout.retryPayment")
                    : t("adopter.checkout.payNow")}
              </button>

              <div className="order-summary__trust">
                <div className="order-summary__trust-row">
                  <span className="material-symbols-outlined order-summary__trust-icon">
                    verified_user
                  </span>
                  <span>{t("adopter.checkout.secure")}</span>
                </div>
                <p className="order-summary__terms">
                  {t("adopter.checkout.terms")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
