import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { loginUser, registerUser } from "../../api/authApi.js";

const getRoleRedirect = (role) => {
  switch (role) {
    case "AdoptionCenter": return "/center/dashboard";
    case "Admin": return "/admin";
    case "Adopter": return "/adopter/dashboard";
    case "Vet": return "/vet/dashboard";
    default: return "/";
  }
};

const ROLE_VALUES = [
  { value: "Pet Owner", icon: "🐾" },
  { value: "Adoption Center", icon: "🏠" },
  { value: "Veterinarian", icon: "🩺" },
  { value: "Admin", icon: "🔑" },
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

  const roleOptions = t("authModal.roles", { returnObjects: true }).map((role, i) => ({
    ...role,
    ...ROLE_VALUES[i],
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
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(signInForm);
      onClose();
      navigate(getRoleRedirect(user.role));
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
  };

  const handleBackStep = () => {
    setError("");
    setRoleError("");
    setSignupStep(1);
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
      onClose();
      navigate(getRoleRedirect(user.role));
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
  };

  const handleGoogleAuth = () => {
    console.log("Google OAuth not yet implemented");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`auth-modal ${tab === "signup" ? "auth-modal--signup" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button aria-label={t("authModal.close")} className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>

        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${tab === "signin" ? "auth-modal__tab--active" : ""}`}
            onClick={() => handleTabChange("signin")}
          >
            {t("authModal.signIn")}
          </button>
          <button
            className={`auth-modal__tab ${tab === "signup" ? "auth-modal__tab--active" : ""}`}
            onClick={() => handleTabChange("signup")}
          >
            {t("authModal.signUp")}
          </button>
        </div>

        {error && <p className="auth-modal__error">{error}</p>}

        {tab === "signin" ? (
          <>
            <div className="auth-modal__welcome">
              <h2 className="auth-modal__welcome-title">{t("authModal.welcomeBack")}</h2>
              <p className="auth-modal__welcome-subtitle">{t("authModal.signInSubtitle")}</p>
            </div>

            <button type="button" className="auth-modal__google-btn" onClick={handleGoogleAuth}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
                />
              </svg>
              {t("authModal.googleSignIn")}
            </button>

            <div className="auth-modal__divider">
              <span>{t("authModal.or")}</span>
            </div>

            <form className="auth-modal__form" onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder={t("authModal.emailPlaceholder")}
                required
                value={signInForm.email}
                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                className="auth-modal__input"
              />
              <input
                type="password"
                placeholder={t("authModal.passwordPlaceholder")}
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
          </>
        ) : (
          <>
            <div className="auth-modal__welcome">
              <h2 className="auth-modal__welcome-title">{t("authModal.joinPetHaven")}</h2>
              <p className="auth-modal__welcome-subtitle">
                {signupStep === 1 ? t("authModal.signUpSubtitleStep1") : t("authModal.signUpSubtitleStep2")}
              </p>
            </div>

            <div className="auth-modal__steps">
              <span className={`auth-modal__step-dot ${signupStep === 1 ? "auth-modal__step-dot--active" : ""}`} />
              <span className={`auth-modal__step-dot ${signupStep === 2 ? "auth-modal__step-dot--active" : ""}`} />
            </div>

            {signupStep === 1 ? (
              <>
                <button type="button" className="auth-modal__google-btn" onClick={handleGoogleAuth}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
                    />
                  </svg>
                  {t("authModal.googleSignUp")}
                </button>

                <div className="auth-modal__divider">
                  <span>{t("authModal.or")}</span>
                </div>

                <form className="auth-modal__form" onSubmit={handleNextStep}>
                  <input
                    type="text"
                    placeholder={t("authModal.fullNamePlaceholder")}
                    required
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    className="auth-modal__input"
                  />
                  <input
                    type="text"
                    placeholder={t("authModal.usernamePlaceholder")}
                    required
                    value={signUpForm.userName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, userName: e.target.value })}
                    className="auth-modal__input"
                  />
                  <input
                    type="tel"
                    placeholder={t("authModal.phonePlaceholder")}
                    required
                    value={signUpForm.phoneNumber}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })}
                    className="auth-modal__input"
                  />
                  <input
                    type="email"
                    placeholder={t("authModal.emailPlaceholder")}
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="auth-modal__input"
                  />
                  <input
                    type="password"
                    placeholder={t("authModal.passwordPlaceholder")}
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
                  <span className="auth-modal__role-label">{t("authModal.iAmA")}</span>
                  <div className="auth-modal__role-grid">
                    {roleOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`auth-modal__role-card ${
                          signUpForm.role === option.value ? "auth-modal__role-card--active" : ""
                        }`}
                        onClick={() => {
                          setSignUpForm({ ...signUpForm, role: option.value });
                          setRoleError("");
                        }}
                      >
                        <span className="auth-modal__role-icon">{option.icon}</span>
                        <span className="auth-modal__role-name">{option.label}</span>
                        <span className="auth-modal__role-desc">{option.description}</span>
                      </button>
                    ))}
                  </div>
                  {roleError && <p className="auth-modal__error">{roleError}</p>}
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
          </>
        )}
      </div>
    </div>
  );
}
