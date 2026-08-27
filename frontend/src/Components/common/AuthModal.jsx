import { useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { loginUser, registerUser } from "../../api/authApi.js";
import { getVetVerificationStatus } from "../../api/vetApi.js";
import { getVetDestination } from "../../utils/vetVerification.js";
import useModalA11y from "../../hooks/useModalA11y.js";

const getRoleRedirect = (role) => {
  switch (role) {
    case "AdoptionCenter": return "/center/dashboard";
    case "Admin": return "/admin";
    case "Adopter": return "/adopter/dashboard";
    case "Vet": return "/vet/dashboard";
    default: return "/";
  }
};

async function getAuthenticatedDestination(user) {
  if (!user || typeof user.role !== "string") {
    throw new Error("بيانات المستخدم المستلمة غير مكتملة.");
  }
  if (user.role !== "Vet") return getRoleRedirect(user.role);
  return getVetDestination(await getVetVerificationStatus());
}

/**
 * الأدوار المتاحة للتسجيل العام.
 *
 * دور "Admin" مُزال عمداً: لا يُنشأ حساب مدير عبر التسجيل الذاتي. هذا إخفاء
 * من الواجهة فقط — AuthService.RegisterAsync ما زال يقبل Role="Admin" لمن
 * ينادي الـ API مباشرةً، والإغلاق الكامل يتطلب تغييراً في الـ backend.
 *
 * تسجيل الدخول لحسابات المدراء القائمة غير متأثر: getRoleRedirect أعلاه
 * ما زال يوجّه دور "Admin" إلى /admin.
 *
 * الترتيب هنا مقترن بالفهرس مع authModal.roles في ملفات الترجمة — أي تعديل
 * على أحدهما يلزمه تعديل مطابق على الآخر.
 */
const ROLE_VALUES = [
  { value: "Pet Owner", icon: "🐾" },
  { value: "Adoption Center", icon: "🏠" },
  { value: "Veterinarian", icon: "🩺" },
];

export default function AuthModal({ mode, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const initialTab = useMemo(() => mode === "signup" ? "signup" : "signin", [mode]);
  const [tab, setTab] = useState(initialTab);
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleError, setRoleError] = useState("");

  // ROLE_VALUES is the source of truth for what may be registered. Zipping
  // from it (rather than from the translation list) means a stale locale entry
  // can never resurrect a role the app no longer offers.
  const roleOptions = ROLE_VALUES.map((role, i) => ({
    ...(t("authModal.roles", { returnObjects: true })[i] ?? {}),
    ...role,
  }));

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
  });
  const baseId = useId();
  const signInTabId = baseId + "-tab-signin";
  const signUpTabId = baseId + "-tab-signup";
  const signInPanelId = baseId + "-panel-signin";
  const signUpPanelId = baseId + "-panel-signup";
  const signInTitleId = baseId + "-title-signin";
  const signUpTitleId = baseId + "-title-signup";
  const signInDescriptionId = baseId + "-description-signin";
  const signUpDescriptionId = baseId + "-description-signup";
  const roleLabelId = baseId + "-role-label";
  const roleErrorId = baseId + "-role-error";
  const signInEmailId = baseId + "-signin-email";
  const signInPasswordId = baseId + "-signin-password";
  const fullNameId = baseId + "-signup-full-name";
  const userNameId = baseId + "-signup-username";
  const phoneId = baseId + "-signup-phone";
  const signUpEmailId = baseId + "-signup-email";
  const signUpPasswordId = baseId + "-signup-password";
  const signupFirstInputRef = useRef(null);
  const roleRefs = useRef([]);
  const dialogRef = useModalA11y({ onClose, closeOnEscape: !loading });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(signInForm);
      const destination = await getAuthenticatedDestination(user);
      onClose();
      navigate(destination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");
    setSignupStep(2);
    requestAnimationFrame(() => roleRefs.current[0]?.focus());
  };

  const handleBackStep = () => {
    setError("");
    setRoleError("");
    setSignupStep(1);
    requestAnimationFrame(() => signupFirstInputRef.current?.focus());
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setRoleError("");
    if (!signUpForm.role) {
      setRoleError(t("authModal.selectRoleError"));
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser(signUpForm);
      const destination = await getAuthenticatedDestination(user);
      onClose();
      navigate(destination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setSignupStep(1);
    setError("");
    setRoleError("");
    requestAnimationFrame(() => {
      document.getElementById(nextTab === "signin" ? signInTabId : signUpTabId)?.focus();
    });
  };

  const handleTabKeyDown = (event, currentTab) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = ["signin", "signup"];
    const currentIndex = tabs.indexOf(currentTab);
    const isRtl = document.documentElement.dir === "rtl";
    let nextTab = currentTab;
    if (event.key === "Home") nextTab = "signin";
    if (event.key === "End") nextTab = "signup";
    if (event.key === "ArrowRight") {
      nextTab = tabs[(currentIndex + (isRtl ? -1 : 1) + tabs.length) % tabs.length];
    }
    if (event.key === "ArrowLeft") {
      nextTab = tabs[(currentIndex + (isRtl ? 1 : -1) + tabs.length) % tabs.length];
    }
    handleTabChange(nextTab);
  };

  const handleRoleKeyDown = (event, currentIndex) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const isRtl = document.documentElement.dir === "rtl";
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = roleOptions.length - 1;
    else {
      const movesBackward = event.key === "ArrowUp" ||
        (event.key === "ArrowLeft" && !isRtl) ||
        (event.key === "ArrowRight" && isRtl);
      nextIndex = (currentIndex + (movesBackward ? -1 : 1) + roleOptions.length) % roleOptions.length;
    }
    setSignUpForm((current) => ({ ...current, role: roleOptions[nextIndex].value }));
    setRoleError("");
    roleRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className={`auth-modal ${tab === "signup" ? "auth-modal--signup" : ""}`}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tab === "signin" ? signInTitleId : signUpTitleId}
        aria-describedby={tab === "signin" ? signInDescriptionId : signUpDescriptionId}
        aria-busy={loading}
        tabIndex={-1}
      >
        <button
          type="button"
          aria-label={t("authModal.close")}
          className="modal-close"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>

        <div className="auth-modal__tabs" role="tablist" aria-label={t("authModal.tabsLabel")}>
          <button
            type="button"
            id={signInTabId}
            role="tab"
            aria-selected={tab === "signin"}
            aria-controls={signInPanelId}
            tabIndex={tab === "signin" ? 0 : -1}
            className={`auth-modal__tab ${tab === "signin" ? "auth-modal__tab--active" : ""}`}
            onClick={() => handleTabChange("signin")}
            onKeyDown={(event) => handleTabKeyDown(event, "signin")}
          >
            {t("authModal.signIn")}
          </button>
          <button
            type="button"
            id={signUpTabId}
            role="tab"
            aria-selected={tab === "signup"}
            aria-controls={signUpPanelId}
            tabIndex={tab === "signup" ? 0 : -1}
            className={`auth-modal__tab ${tab === "signup" ? "auth-modal__tab--active" : ""}`}
            onClick={() => handleTabChange("signup")}
            onKeyDown={(event) => handleTabKeyDown(event, "signup")}
          >
            {t("authModal.signUp")}
          </button>
        </div>

        {error && <p className="auth-modal__error" role="alert">{error}</p>}

        {tab === "signin" ? (
          <div id={signInPanelId} role="tabpanel" aria-labelledby={signInTabId}>
            <div className="auth-modal__welcome">
              <h2 id={signInTitleId} className="auth-modal__welcome-title">{t("authModal.welcomeBack")}</h2>
              <p id={signInDescriptionId} className="auth-modal__welcome-subtitle">{t("authModal.signInSubtitle")}</p>
            </div>

            <div className="auth-modal__divider">
              <span>{t("authModal.or")}</span>
            </div>

            <form className="auth-modal__form" onSubmit={handleSignIn} aria-busy={loading}>
              <label className="sr-only" htmlFor={signInEmailId}>
                {t("authModal.emailPlaceholder")}
              </label>
              <input
                id={signInEmailId}
                type="email"
                placeholder={t("authModal.emailPlaceholder")}
                autoComplete="email"
                required
                value={signInForm.email}
                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                className="auth-modal__input"
              />
              <label className="sr-only" htmlFor={signInPasswordId}>
                {t("authModal.passwordPlaceholder")}
              </label>
              <input
                id={signInPasswordId}
                type="password"
                placeholder={t("authModal.passwordPlaceholder")}
                autoComplete="current-password"
                required
                value={signInForm.password}
                onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                className="auth-modal__input"
              />
              <button type="submit" disabled={loading} className="auth-modal__submit">
                {loading ? t("authModal.signingIn") : t("authModal.signIn")}
              </button>
            </form>

            <p className="auth-modal__switch">
              {t("authModal.noAccount")}{" "}
              <button type="button" className="auth-modal__switch-link" onClick={() => handleTabChange("signup")}>
                {t("authModal.signUp")}
              </button>
            </p>
          </div>
        ) : (
          <div id={signUpPanelId} role="tabpanel" aria-labelledby={signUpTabId}>
            <div className="auth-modal__welcome">
              <h2 id={signUpTitleId} className="auth-modal__welcome-title">{t("authModal.joinPetHaven")}</h2>
              <p id={signUpDescriptionId} className="auth-modal__welcome-subtitle" aria-live="polite">
                {signupStep === 1 ? t("authModal.signUpSubtitleStep1") : t("authModal.signUpSubtitleStep2")}
              </p>
            </div>

            <div className="auth-modal__steps" aria-hidden="true">
              <span className={`auth-modal__step-dot ${signupStep === 1 ? "auth-modal__step-dot--active" : ""}`} />
              <span className={`auth-modal__step-dot ${signupStep === 2 ? "auth-modal__step-dot--active" : ""}`} />
            </div>

            {signupStep === 1 ? (
              <>
                <div className="auth-modal__divider">
                  <span>{t("authModal.or")}</span>
                </div>

                <form className="auth-modal__form" onSubmit={handleNextStep}>
                  <label className="sr-only" htmlFor={fullNameId}>
                    {t("authModal.fullNamePlaceholder")}
                  </label>
                  <input
                    ref={signupFirstInputRef}
                    id={fullNameId}
                    type="text"
                    placeholder={t("authModal.fullNamePlaceholder")}
                    autoComplete="name"
                    required
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    className="auth-modal__input"
                  />
                  <label className="sr-only" htmlFor={userNameId}>
                    {t("authModal.usernamePlaceholder")}
                  </label>
                  <input
                    id={userNameId}
                    type="text"
                    placeholder={t("authModal.usernamePlaceholder")}
                    autoComplete="username"
                    required
                    value={signUpForm.userName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, userName: e.target.value })}
                    className="auth-modal__input"
                  />
                  <label className="sr-only" htmlFor={phoneId}>
                    {t("authModal.phonePlaceholder")}
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    placeholder={t("authModal.phonePlaceholder")}
                    autoComplete="tel"
                    required
                    value={signUpForm.phoneNumber}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })}
                    className="auth-modal__input"
                  />
                  <label className="sr-only" htmlFor={signUpEmailId}>
                    {t("authModal.emailPlaceholder")}
                  </label>
                  <input
                    id={signUpEmailId}
                    type="email"
                    placeholder={t("authModal.emailPlaceholder")}
                    autoComplete="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="auth-modal__input"
                  />
                  <label className="sr-only" htmlFor={signUpPasswordId}>
                    {t("authModal.passwordPlaceholder")}
                  </label>
                  <input
                    id={signUpPasswordId}
                    type="password"
                    placeholder={t("authModal.passwordPlaceholder")}
                    autoComplete="new-password"
                    required
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className="auth-modal__input"
                  />

                  <button type="submit" className="auth-modal__submit">
                    {t("authModal.next")}
                  </button>
                </form>
              </>
            ) : (
              <form className="auth-modal__form" onSubmit={handleSignUp}>
                <div className="auth-modal__role-field">
                  <span className="auth-modal__role-label" id={roleLabelId}>
                    {t("authModal.iAmA")}
                  </span>
                  <div
                    className="auth-modal__role-grid"
                    role="radiogroup"
                    aria-labelledby={roleLabelId}
                    aria-describedby={roleError ? roleErrorId : undefined}
                    aria-invalid={Boolean(roleError)}
                  >
                    {roleOptions.map((option, index) => (
                      <button
                        ref={(element) => { roleRefs.current[index] = element; }}
                        type="button"
                        key={option.value}
                        role="radio"
                        aria-checked={signUpForm.role === option.value}
                        tabIndex={
                          signUpForm.role === option.value || (!signUpForm.role && index === 0)
                            ? 0
                            : -1
                        }
                        className={`auth-modal__role-card ${
                          signUpForm.role === option.value ? "auth-modal__role-card--active" : ""
                        }`}
                        onClick={() => {
                          setSignUpForm({ ...signUpForm, role: option.value });
                          setRoleError("");
                        }}
                        onKeyDown={(event) => handleRoleKeyDown(event, index)}
                      >
                        <span className="auth-modal__role-icon" aria-hidden="true">{option.icon}</span>
                        <span className="auth-modal__role-name">{option.label}</span>
                        <span className="auth-modal__role-desc">{option.description}</span>
                      </button>
                    ))}
                  </div>
                  {roleError && (
                    <p className="auth-modal__error" id={roleErrorId} role="alert">
                      {roleError}
                    </p>
                  )}
                </div>

                <div className="auth-modal__step-actions">
                  <button type="button" className="auth-modal__back-btn" onClick={handleBackStep}>
                    {t("authModal.back")}
                  </button>
                  <button type="submit" disabled={loading} className="auth-modal__submit">
                    {loading ? t("authModal.signingUp") : t("authModal.signUp")}
                  </button>
                </div>
              </form>
            )}

            <p className="auth-modal__switch">
              {t("authModal.haveAccount")}{" "}
              <button type="button" className="auth-modal__switch-link" onClick={() => handleTabChange("signin")}>
                {t("authModal.signIn")}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
