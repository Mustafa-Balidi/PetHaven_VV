import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchMyProfile, updateAdopterProfile } from "../api/profileApi";
import { logoutUser } from "../api/authApi";
import "../Styling/AccountModal.css";

const HOUSING_OPTIONS = ["Apartment", "Department", "House", "Villa"];
const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Expert"];

export default function AccountModal({ onClose, onLogout }) {
    const [mode, setMode] = useState("view"); // "view" | "edit"

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        housingType: "",
        experienceLevel: "",
        freeHoursPerDay: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
        // امنع سكرول الصفحة اللي وراء المودال وقت ما يكون مفتوح
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    async function loadProfile() {
        try {
            setIsLoading(true);
            const data = await fetchMyProfile();
            setProfile(data);
            setForm((prev) => ({
                ...prev,
                fullName: data.fullName || "",
                phoneNumber: data.phoneNumber || "",
                address: data.address || "",
            }));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        try {
            setIsSaving(true);
            setSaveError(null);
            await updateAdopterProfile({
                ...form,
                freeHoursPerDay: Number(form.freeHoursPerDay) || 0,
            });
            setSaveSuccess(true);
            await loadProfile();
            setTimeout(() => {
                setSaveSuccess(false);
                setMode("view");
            }, 1000);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    function handleLogout() {
        logoutUser();
        onLogout?.();
        onClose?.();
    }

    const modalContent = (
        <div className="account-modal-overlay" onClick={onClose}>
            <div className="account-modal" onClick={(e) => e.stopPropagation()}>
                <button className="account-modal-close" onClick={onClose}>
                    ×
                </button>

                {mode === "view" && (
                    <>
                        <h2 className="account-modal-title">Account</h2>

                        {isLoading ? (
                            <p className="account-modal-status">...Loading</p>
                        ) : error ? (
                            <p className="account-modal-status account-modal-error">
                                {error}
                            </p>
                        ) : (
                            <div className="account-info-list">
                                <div className="account-info-row">
                                    <span className="account-info-label">full name</span>
                                    <span className="account-info-value">
                                        {profile.fullName}
                                    </span>
                                </div>
                                <div className="account-info-row">
                                    <span className="account-info-label">User name</span>
                                    <span className="account-info-value">
                                        {profile.username}
                                    </span>
                                </div>
                                <div className="account-info-row">
                                    <span className="account-info-label">Email</span>
                                    <span className="account-info-value">{profile.email}</span>
                                </div>
                                <div className="account-info-row">
                                    <span className="account-info-label">Phone Number</span>
                                    <span className="account-info-value">
                                        {profile.phoneNumber || "—"}
                                    </span>
                                </div>
                                <div className="account-info-row">
                                    <span className="account-info-label">Address</span>
                                    <span className="account-info-value">
                                        {profile.address || "—"}
                                    </span>
                                </div>
                                <div className="account-info-row">
                                    <span className="account-info-label">Role</span>
                                    <span className="account-info-value">{profile.role}</span>
                                </div>
                            </div>
                        )}

                        <div className="account-modal-actions">
                            <button
                                className="account-btn account-btn-primary"
                                onClick={() => setMode("edit")}
                                disabled={isLoading || !!error}
                            >
                                Edite profile
                            </button>
                            <a
                                href="/"
                                className="account-btn account-btn-danger"
                                onClick={handleLogout}
                            >
                                Log out
                            </a>
                        </div>
                    </>
                )}

                {mode === "edit" && (
                    <>
                        <h2 className="account-modal-title">Edite profile</h2>

                        <form className="account-edit-form" onSubmit={handleSave}>
                            <label className="account-field">
                                <span>full name</span>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="account-field">
                                <span>Phone Number</span>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="account-field">
                                <span>Address</span>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="account-field">
                                <span>Housing Type</span>
                                <select
                                    name="housingType"
                                    value={form.housingType}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose...</option>
                                    {HOUSING_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="account-field">
                                <span>Experience Level</span>
                                <select
                                    name="experienceLevel"
                                    value={form.experienceLevel}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose...</option>
                                    {EXPERIENCE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="account-field">
                                <span>Free Hours Per Day</span>
                                <input
                                    type="number"
                                    name="freeHoursPerDay"
                                    min="0"
                                    value={form.freeHoursPerDay}
                                    onChange={handleChange}
                                />
                            </label>

                            {saveError && (
                                <p className="account-modal-status account-modal-error">
                                    {saveError}
                                </p>
                            )}
                            {saveSuccess && (
                                <p className="account-modal-status account-modal-success">
                                    info has been updated!
                                </p>
                            )}

                            <div className="account-modal-actions">
                                <button
                                    type="submit"
                                    className="account-btn account-btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "saving..." : "save"}
                                </button>
                                <button
                                    type="button"
                                    className="account-btn account-btn-secondary"
                                    onClick={() => setMode("view")}
                                    disabled={isSaving}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}