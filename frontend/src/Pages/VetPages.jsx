import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Components/Icon.jsx";
import Footer from "../Components/Footer.jsx";
import TopNavBar from "../Components/TopNavBar.jsx";
import {
  bookAppointment,
  cancelAppointment,
  getAppointment,
  getMyAppointments,
  getPetsForBooking,
  getVet,
  getVetAvailability,
  rateVet,
  rescheduleAppointment,
  searchVets,
} from "../api/vetApi.js";
import {
  formatLocalizedDate,
  formatLocalizedTime,
  formatPetAge,
  translateDisplayValue,
} from "../utils/localization.js";
import "../Styling/VetPages.css";

const SERVICES = [
  { value: "General Consultation", key: "general" },
  { value: "Annual Check-up & Vaccinations", key: "annual" },
  { value: "Dental Care", key: "dental" },
  { value: "Emergency Review", key: "emergency" },
];

function Avatar({ label, size = "md" }) {
  return <div className={`vet-avatar vet-avatar-${size}`}>{label?.slice(0, 2) || "PH"}</div>;
}

function Rating({ value, count }) {
  const { t } = useTranslation();
  if (value == null) return <span className="rating-chip">{t("adopter.vets.card.notRated")}</span>;

  return (
    <span className="rating-chip">
      <Icon name="star" filled className="icon-sm" /> {value.toFixed(1)} {count ? `(${count})` : ""}
    </span>
  );
}

function getServiceLabel(t, value) {
  const service = SERVICES.find((item) => item.value === value);
  return service
    ? t(`adopter.vets.booking.services.${service.key}`)
    : value;
}

export function VetHubPage() {
  const { t } = useTranslation();
  const [vets, setVets] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | locating | ready | error
  const [locationMessageKey, setLocationMessageKey] = useState("");

  useEffect(() => {
    let active = true;
    searchVets({
      sortBy,
      userLatitude: coords.lat,
      userLongitude: coords.lng,
    })
      .then((items) => {
        if (active) setVets(items);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey, sortBy, coords.lat, coords.lng]);

  function submitSearch(event) {
    event.preventDefault();
    setSearchTerm(query.trim());
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessageKey("locationUnsupported");
      return;
    }

    setLocationStatus("locating");
    setLocationMessageKey("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("ready");
        setLocationMessageKey("locationReady");
      },
      (geoError) => {
        setLocationStatus("error");
        setLocationMessageKey(
          geoError.code === geoError.PERMISSION_DENIED ? "locationDenied" : "locationUnavailable"
        );
      }
    );
  }

  const normalizedSearchTerm = searchTerm.toLocaleLowerCase();
  const visibleVets = normalizedSearchTerm
    ? vets.filter((vet) => {
        const haystack = [vet.fullName, vet.clinicName, vet.address, vet.specialization]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();
        return haystack.includes(normalizedSearchTerm);
      })
    : vets;

  return (
    <VetShell>
      <section className="vet-hero">
        <div>
          <p className="eyebrow">{t("adopter.vets.hub.eyebrow")}</p>
          <h1>{t("adopter.vets.hub.title")}</h1>
          <p>{t("adopter.vets.hub.subtitle")}</p>
        </div>
        <div className="vet-tabs">
          <Link className="active" to="/adopter/vets">{t("adopter.vets.tabs.book")}</Link>
          <Link to="/adopter/vets/visits">{t("adopter.vets.tabs.visits")}</Link>
        </div>
      </section>

      <form className="vet-search-card" onSubmit={submitSearch}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("adopter.vets.hub.searchPlaceholder")} aria-label={t("adopter.vets.hub.searchPlaceholder")} />
        <button type="submit">{t("adopter.vets.hub.search")}</button>
        <button
          type="button"
          className="location-btn"
          onClick={useMyLocation}
          disabled={locationStatus === "locating"}
        >
          <Icon name="my_location" />
          {locationStatus === "locating" ? t("adopter.vets.hub.locating") : t("adopter.vets.hub.useLocation")}
        </button>
      </form>

      {locationMessageKey && (
        <p className={`location-status${locationStatus === "error" ? " location-status--error" : ""}`}>
          {t(`adopter.vets.hub.${locationMessageKey}`)}
        </p>
      )}

      <div className="vet-filter-row">
        <Link className="pill" to="/adopter/vets/visits">{t("adopter.vets.hub.myAppointments")}</Link>
        <label>
          {t("adopter.vets.hub.sortBy")}
          <select value={sortBy} onChange={(e) => {
            setIsLoading(true);
            setError("");
            setSortBy(e.target.value);
          }}>
            <option value="rating">{t("adopter.vets.hub.highestRated")}</option>
            <option value="experience">{t("adopter.vets.hub.experienced")}</option>
          </select>
        </label>
      </div>

      {error && <div className="vet-alert vet-state-action">{error}<button type="button" onClick={() => {
        setIsLoading(true);
        setError("");
        setRetryKey((value) => value + 1);
      }}>{t("adopter.vets.retry")}</button></div>}
      {isLoading ? <div className="vet-empty">{t("adopter.vets.hub.loading")}</div> : (
        visibleVets.length
          ? <div className="vet-card-grid">{visibleVets.map((vet) => <VetCard key={vet.vetId} vet={vet} />)}</div>
          : !error && <div className="vet-empty">{t("adopter.vets.hub.empty")}</div>
      )}

      <section className="vet-value-section">
        <h2>{t("adopter.vets.hub.whyTitle")}</h2>
        <div className="value-grid">
          <ValueItem icon="verified" title={t("adopter.vets.hub.values.verified.title")} text={t("adopter.vets.hub.values.verified.text")} />
          <ValueItem icon="local_hospital" title={t("adopter.vets.hub.values.facilities.title")} text={t("adopter.vets.hub.values.facilities.text")} />
          <ValueItem icon="biotech" title={t("adopter.vets.hub.values.ai.title")} text={t("adopter.vets.hub.values.ai.text")} />
        </div>
      </section>

    </VetShell>
  );
}

function VetCard({ vet }) {
  const { t } = useTranslation();

  return (
    <article className="vet-card">
      <div className={`vet-card-media vet-card-media-${((vet.vetId ?? 1) % 3) + 1}`}>
        <Avatar label={vet.initials} size="lg" />
        <Rating value={vet.rating} count={vet.totalRatings} />
      </div>
      <div className="vet-card-body">
        <div className="vet-card-heading">
          <div>
            <h3>{vet.fullName}</h3>
            <p>{vet.specialization}</p>
          </div>
          {vet.isVerified && <span className="available-badge">{t("adopter.vets.card.verified")}</span>}
        </div>
        <p className="muted clamp">
          {[vet.clinicName, vet.address].filter(Boolean).join(" - ") || t("adopter.vets.card.clinicUnavailable")}
        </p>
        <div className="vet-meta">
          {vet.experienceYears != null && <span><Icon name="workspace_premium" /> {t("adopter.vets.card.experience", { years: vet.experienceYears })}</span>}
          {vet.distance != null && <span><Icon name="route" /> {t("adopter.vets.card.away", { distance: vet.distance.toFixed(1) })}</span>}
        </div>
        <Link className="orange-btn" to={`/adopter/vets/book/${vet.vetId}`}>{t("adopter.vets.card.requestAppointment")}</Link>
      </div>
    </article>
  );
}

function ValueItem({ icon, title, text }) {
  return <article className="value-item"><Icon name={icon} /><h3>{title}</h3><p>{text}</p></article>;
}

export function MyVisitsPage() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(state?.appointmentId
    ? t("adopter.vets.visits.booked", { id: state.appointmentId })
    : "");
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    getMyAppointments()
      .then((items) => {
        if (active) setAppointments(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  function updateAppointment(updated) {
    setAppointments((items) => items.map((item) =>
      item.appointmentId === updated.appointmentId ? updated : item));
  }

  const upcoming = appointments.filter((appointment) =>
    !["Completed", "Cancelled"].includes(appointment.status));
  const history = appointments.filter((appointment) =>
    ["Completed", "Cancelled"].includes(appointment.status));

  return (
    <VetShell>
      <div className="my-visits-page">
        <section className="vet-hero">
          <div>
            <p className="eyebrow">{t("adopter.vets.hub.eyebrow")}</p>
            <h1>{t("adopter.vets.hub.title")}</h1>
            <p>{t("adopter.vets.hub.subtitle")}</p>
          </div>
          <div className="vet-tabs">
            <Link to="/adopter/vets">{t("adopter.vets.tabs.book")}</Link>
            <Link className="active" to="/adopter/vets/visits">{t("adopter.vets.tabs.visits")}</Link>
          </div>
        </section>

        {message && <div className="success-note">{message}</div>}
        {error && <div className="vet-alert vet-state-action">{error}<button type="button" onClick={() => {
          setIsLoading(true);
          setError("");
          setRetryKey((value) => value + 1);
        }}>{t("adopter.vets.retry")}</button></div>}

        {isLoading ? <div className="vet-empty my-visits-state">{t("adopter.vets.visits.loading")}</div> : !error && (
          appointments.length ? (
            <>
              <div className="visits-overview" aria-label={t("adopter.vets.visits.title")}>
                <div className="visits-overview__item visits-overview__item--upcoming">
                  <span className="visits-overview__icon" aria-hidden="true"><Icon name="event_upcoming" /></span>
                  <div><strong>{upcoming.length}</strong><span>{t("adopter.vets.visits.upcoming")}</span></div>
                </div>
                <div className="visits-overview__item visits-overview__item--history">
                  <span className="visits-overview__icon" aria-hidden="true"><Icon name="history" /></span>
                  <div><strong>{history.length}</strong><span>{t("adopter.vets.visits.history")}</span></div>
                </div>
              </div>

              <div className="visits-sections">
                <section className="visits-section">
                  <header className="visits-section__header">
                    <div><span className="visits-section__marker visits-section__marker--upcoming" /><h2>{t("adopter.vets.visits.upcoming")}</h2></div>
                    <span className="visits-section__count">{upcoming.length}</span>
                  </header>
                  <div className="appointment-grid">
                    {upcoming.map((appointment) => (
                      <AdopterAppointmentCard
                        key={appointment.appointmentId}
                        appointment={appointment}
                        onUpdate={updateAppointment}
                        onMessage={setMessage}
                      />
                    ))}
                  </div>
                  {!upcoming.length && <div className="vet-empty visits-section__empty">{t("adopter.vets.visits.noUpcoming")}</div>}
                </section>

                <section className="visits-section visits-section--history">
                  <header className="visits-section__header">
                    <div><span className="visits-section__marker visits-section__marker--history" /><h2>{t("adopter.vets.visits.history")}</h2></div>
                    <span className="visits-section__count">{history.length}</span>
                  </header>
                  <div className="appointment-grid">
                    {history.map((appointment) => (
                      <AdopterAppointmentCard
                        key={appointment.appointmentId}
                        appointment={appointment}
                        onUpdate={updateAppointment}
                        onMessage={setMessage}
                      />
                    ))}
                  </div>
                  {!history.length && <div className="vet-empty visits-section__empty">{t("adopter.vets.visits.noHistory")}</div>}
                </section>
              </div>
            </>
          ) : <div className="vet-empty vet-limitation my-visits-state"><Icon name="event_busy" /><strong>{t("adopter.vets.visits.empty")}</strong><Link className="primary-btn" to="/adopter/vets">{t("adopter.vets.visits.backToVets")}</Link></div>
        )}
      </div>
    </VetShell>
  );
}

function AdopterAppointmentCard({ appointment, onUpdate, onMessage }) {
  const { t, i18n } = useTranslation();
  const [details, setDetails] = useState(null);
  const [mode, setMode] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState(nextDate());
  const [newTime, setNewTime] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const canModify = ["Pending", "Confirmed"].includes(appointment.status);

  async function showDetails() {
    setMode("details");
    setIsWorking(true);
    setError("");
    try {
      setDetails(await getAppointment(appointment.appointmentId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsWorking(false);
    }
  }

  async function cancel() {
    setIsWorking(true);
    setError("");
    try {
      await cancelAppointment(appointment.appointmentId);
      onUpdate({ ...appointment, status: "Cancelled" });
      onMessage(t("adopter.vets.visits.cancelledSuccess"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsWorking(false);
    }
  }

  async function reschedule(event) {
    event.preventDefault();
    setIsWorking(true);
    setError("");
    try {
      const appointmentDate = combineDateAndTime(newDate, newTime);
      await rescheduleAppointment(appointment.appointmentId, appointmentDate);
      const refreshed = await getAppointment(appointment.appointmentId);
      setDetails(refreshed);
      onUpdate(refreshed);
      setMode("");
      onMessage(t("adopter.vets.visits.rescheduledSuccess"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsWorking(false);
    }
  }

  async function submitRating(event) {
    event.preventDefault();
    setIsWorking(true);
    setError("");
    try {
      await rateVet({ vetId: appointment.vetId, rating, reviewText });
      setMode("");
      onMessage(t("adopter.vets.visits.ratingSuccess"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsWorking(false);
    }
  }

  const shown = details ?? appointment;

  return (
    <article className={`appointment-card appointment-card--${appointment.status?.toLowerCase() || "unknown"}`}>
      <div className="appointment-top">
        <div className="appointment-top__identity">
          <Avatar label={appointment.petName} />
          <div>
            <span className="appointment-reference">#{appointment.appointmentId}</span>
            <h3>{appointment.petName || t("adopter.common.pet")}</h3>
            <p>{getServiceLabel(t, appointment.reason)}</p>
          </div>
        </div>
        <span className={`appointment-status appointment-status--${appointment.status?.toLowerCase() || "unknown"}`}>
          {t(`adopter.vets.statuses.${appointment.status}`, { defaultValue: appointment.status })}
        </span>
      </div>
      <div className="appointment-details">
        <div><span className="appointment-detail-icon" aria-hidden="true"><Icon name="stethoscope" /></span><div><small>{t("adopter.vets.visits.veterinarian")}</small><strong>{appointment.vetName}</strong></div></div>
        <div><span className="appointment-detail-icon" aria-hidden="true"><Icon name="calendar_today" /></span><div><small>{t("adopter.vets.visits.dateTime")}</small><strong>{formatAppointmentDate(appointment.appointmentDate, i18n.language)}</strong></div></div>
      </div>
      <div className="appointment-actions appointment-actions--adopter">
        <button className="appointment-action appointment-action--details" type="button" onClick={() => mode === "details" ? setMode("") : showDetails()} disabled={isWorking}><Icon name="visibility" />{t("adopter.vets.visits.details")}</button>
        {canModify && <button className="appointment-action appointment-action--reschedule" type="button" onClick={() => setMode(mode === "reschedule" ? "" : "reschedule")} disabled={isWorking}><Icon name="edit_calendar" />{t("adopter.vets.visits.reschedule")}</button>}
        {canModify && <button className="appointment-action appointment-action--cancel" type="button" onClick={cancel} disabled={isWorking}><Icon name="cancel" />{t("adopter.vets.visits.cancel")}</button>}
        {appointment.status === "Completed" && <button className="appointment-action appointment-action--rate" type="button" onClick={() => setMode(mode === "rating" ? "" : "rating")} disabled={isWorking}><Icon name="star" />{t("adopter.vets.visits.rateVet")}</button>}
      </div>

      {mode === "details" && (
        <div className="appointment-action-panel">
          {isWorking ? <p>{t("adopter.vets.visits.loadingDetails")}</p> : details && (
            <dl>
              <div><dt>{t("adopter.vets.visits.appointmentId")}</dt><dd>#{shown.appointmentId}</dd></div>
              <div><dt>{t("adopter.vets.visits.pet")}</dt><dd>{shown.petName}</dd></div>
              <div><dt>{t("adopter.vets.visits.veterinarian")}</dt><dd>{shown.vetName}</dd></div>
              <div><dt>{t("adopter.vets.visits.reason")}</dt><dd>{shown.reason || "—"}</dd></div>
            </dl>
          )}
        </div>
      )}

      {mode === "reschedule" && (
        <form className="appointment-action-panel appointment-inline-form" onSubmit={reschedule}>
          <label><span>{t("adopter.vets.booking.date")}</span><input type="date" min={nextDate(0)} value={newDate} onChange={(event) => setNewDate(event.target.value)} required /></label>
          <label><span>{t("adopter.vets.booking.time")}</span><input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} required /></label>
          <button className="primary-btn" disabled={isWorking || !newTime}>{isWorking ? t("adopter.vets.visits.rescheduling") : t("adopter.vets.visits.saveSchedule")}</button>
        </form>
      )}

      {mode === "rating" && (
        <form className="appointment-action-panel appointment-rating-form" onSubmit={submitRating}>
          <label><span>{t("adopter.vets.visits.rating")}</span><select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{t("adopter.vets.visits.stars", { count: value })}</option>)}</select></label>
          <label><span>{t("adopter.vets.visits.review")}</span><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} rows="3" /></label>
          <button className="primary-btn" disabled={isWorking}>{isWorking ? t("adopter.vets.visits.submittingRating") : t("adopter.vets.visits.submitRating")}</button>
        </form>
      )}

      {error && <div className="vet-alert">{error}</div>}
    </article>
  );
}

export function BookAppointmentPage() {
  const { t, i18n } = useTranslation();
  const { vetId } = useParams();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [service, setService] = useState(SERVICES[0].value);
  const [date, setDate] = useState(nextDate());
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [activeSection, setActiveSection] = useState("date");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getVet(vetId), getPetsForBooking()])
      .then(([vetData, petItems]) => {
        if (!active) return;
        setVet(vetData);
        setPets(petItems);
        setPetId(String(petItems[0]?.petId ?? ""));
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey, vetId]);

  useEffect(() => {
    if (!vetId || !date) return undefined;

    let active = true;
    getVetAvailability(vetId, date)
      .then((availability) => {
        if (!active) return;
        setAvailableSlots(availability.availableSlots);
        setAvailabilityError("");
      })
      .catch((requestError) => {
        if (!active) return;
        setAvailableSlots([]);
        setAvailabilityError(requestError.message);
      })
      .finally(() => {
        if (active) setAvailabilityLoading(false);
      });

    return () => {
      active = false;
    };
  }, [date, vetId]);

  function handleDateChange(event) {
    setDate(event.target.value);
    setTime("");
    setAvailableSlots([]);
    setAvailabilityError("");
    setAvailabilityLoading(true);
  }

  function continueToConfirm() {
    if (!petId || !vet || !date || !time) return;
    const draft = { vet, pet: pets.find((pet) => String(pet.petId) === String(petId)), service, date, time };
    navigate("/adopter/vets/confirm", { state: { draft } });
  }

  if (error) return <VetShell><div className="vet-alert vet-state-action">{error}<button type="button" onClick={() => {
    setIsLoading(true);
    setError("");
    setRetryKey((value) => value + 1);
  }}>{t("adopter.vets.retry")}</button></div></VetShell>;
  if (isLoading || !vet) return <VetShell><div className="vet-empty">{t("adopter.vets.booking.loading")}</div></VetShell>;

  return (
    <VetShell>
      <Link className="back-link-vet" to="/adopter/vets"><Icon name="arrow_back" /> {t("adopter.vets.booking.back")}</Link>
      <div className="booking-layout">
        <main className="booking-main">
          <VetIdentity vet={vet} />
          <Stepper step={2} />
          <div className="booking-panel">
            <BookingSection title={t("adopter.vets.booking.petService")} actionKey={activeSection === "service" ? "done" : "edit"} onAction={() => setActiveSection(activeSection === "service" ? "date" : "service")} muted>
              <div className="selection-grid">
                <label>
                  <span>{t("adopter.vets.booking.selectedPet")}</span>
                  <div className="selected-control">
                    <Avatar label={pets.find((pet) => String(pet.petId) === String(petId))?.name ?? t("adopter.common.pet")} size="sm" />
                    <select value={petId} onChange={(e) => setPetId(e.target.value)}>
                      {!pets.length && <option value="">{t("adopter.vets.booking.noPets")}</option>}
                      {pets.map((pet) => <option key={pet.petId} value={pet.petId}>{t("adopter.vets.booking.petOption", { name: pet.name, breed: pet.breed })}</option>)}
                    </select>
                  </div>
                </label>
                <label>
                  <span>{t("adopter.vets.booking.selectedService")}</span>
                  <select value={service} onChange={(e) => setService(e.target.value)}>
                    {SERVICES.map((item) => <option key={item.key} value={item.value}>{t(`adopter.vets.booking.services.${item.key}`)}</option>)}
                  </select>
                </label>
              </div>
            </BookingSection>
            <BookingSection title={t("adopter.vets.booking.dateTime")}>
              <div className="date-time-grid">
                <label className="appointment-request-field">
                  <span>{t("adopter.vets.booking.date")}</span>
                  <input type="date" min={nextDate(0)} value={date} onChange={handleDateChange} required />
                </label>
              </div>
              <div className="availability-panel">
                <div className="availability-panel__heading">
                  <div>
                    <Icon name="schedule" />
                    <h3>{t("adopter.vets.booking.availableTimes")}</h3>
                  </div>
                  {time && <span>{formatRequestedTime(date, time, i18n.language)}</span>}
                </div>

                {availabilityLoading ? (
                  <p className="availability-state" aria-live="polite">
                    {t("adopter.vets.booking.availabilityLoading")}
                  </p>
                ) : availabilityError ? (
                  <div className="availability-state availability-state--error" role="alert">
                    <p>{t("adopter.vets.booking.availabilityError")}</p>
                  </div>
                ) : availableSlots.length ? (
                  <div className="availability-slots">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`availability-slot${time === slot ? " availability-slot--selected" : ""}`}
                        aria-pressed={time === slot}
                        onClick={() => setTime(slot)}
                      >
                        {formatRequestedTime(date, slot, i18n.language)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="availability-state">{t("adopter.vets.booking.availabilityEmpty")}</p>
                )}
              </div>
            </BookingSection>
          </div>
        </main>
        <aside className="summary-card">
          <h2>{t("adopter.vets.booking.summary")}</h2>
          <SummaryLine label={t("adopter.vets.booking.veterinarian")} value={vet.fullName} />
          <SummaryLine label={t("adopter.vets.booking.service")} value={getServiceLabel(t, service)} />
          <SummaryLine
            label={t("adopter.vets.booking.date")}
            value={formatLocalizedDate(date, i18n.language, {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          />
          <SummaryLine
            label={t("adopter.vets.booking.time")}
            value={formatRequestedTime(date, time, i18n.language) || t("adopter.vets.notScheduled")}
          />
          <div className="info-note"><Icon name="info" /> {t("adopter.vets.booking.ratingNote")}</div>
          <button className="primary-btn" onClick={continueToConfirm} disabled={!petId || !date || !time}>{t("adopter.vets.booking.confirm")}</button>
          <small><Icon name="lock" /> {t("adopter.vets.booking.protected")}</small>
        </aside>
      </div>
    </VetShell>
  );
}

export function ConfirmAppointmentPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const draft = state?.draft;
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function confirm() {
    setIsSubmitting(true);
    setError("");
    try {
      const appointmentDate = combineDateAndTime(draft.date, draft.time);
      const result = await bookAppointment({ petId: draft.pet.petId, vetId: draft.vet.vetId, appointmentDate, reason: draft.service });
      navigate("/adopter/vets/visits", { state: { appointmentId: result.appointmentId } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!draft) {
    return (
      <VetShell compact>
        <section className="confirm-page">
          <div className="vet-alert">{t("adopter.vets.confirm.missing")}</div>
          <Link className="primary-btn confirm-action" to="/adopter/vets">{t("adopter.vets.confirm.back")}</Link>
        </section>
      </VetShell>
    );
  }

  return (
    <VetShell compact>
      <section className="confirm-page">
        <header className="confirm-header">
          <h1>{t("adopter.vets.confirm.title")}</h1>
          <p>{t("adopter.vets.confirm.subtitle")}</p>
          <ConfirmStepper />
        </header>

        <article className="confirm-card confirm-detail-card">
          <section className="confirm-provider">
            <Avatar label={draft.vet.initials || draft.vet.fullName} />
            <div>
              <h2>{draft.vet.fullName}</h2>
              <p><Icon name="medical_services" /> {draft.vet.specialization || t("adopter.vets.card.specializationUnavailable")}</p>
            </div>
          </section>

          <section className="confirm-core-grid">
            <ConfirmDetail icon="calendar_month" label={t("adopter.vets.confirm.when")} title={formatConfirmDate(draft.date, i18n.language)} text={formatRequestedTime(draft.date, draft.time, i18n.language)} />
            <ConfirmDetail icon="location_on" label={t("adopter.vets.confirm.where")} title={draft.vet.clinicName || t("adopter.vets.card.clinicUnavailable")} text={draft.vet.address || t("adopter.vets.card.addressUnavailable")} />

            <div className="patient-service-block">
              <h3>{t("adopter.vets.confirm.patientService")}</h3>
              <div className="patient-service-card">
                <div>
                  <span className="round-icon amber"><Icon name="sound_detection_dog_barking" filled /></span>
                  <div>
                    <strong>{draft.pet.name}</strong>
                    <p>
                      {t("adopter.vets.confirm.patientMeta", {
                        breed: draft.pet.breed,
                        gender: translateDisplayValue(
                          t,
                          "adopter.common.genders",
                          draft.pet.gender
                        ),
                        age: formatPetAge(t, draft.pet.age),
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="round-icon teal"><Icon name="stethoscope" /></span>
                  <div>
                    <strong>{getServiceLabel(t, draft.service)}</strong>
                    <p>{t("adopter.vets.confirm.requestedService")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        <div className="confirm-policy">
          <Icon name="info" filled />
          <div>
            <strong>{t("adopter.vets.confirm.policyTitle")}</strong>
            <p>{t("adopter.vets.confirm.policyText")}</p>
          </div>
        </div>
        {error && <div className="vet-alert">{error}</div>}
        <div className="confirm-actions">
          <button className="primary-btn confirm-action" onClick={confirm} disabled={isSubmitting}>
            {isSubmitting ? t("adopter.vets.confirm.confirming") : t("adopter.vets.confirm.action")} <Icon name="arrow_forward" />
          </button>
        </div>
      </section>
    </VetShell>
  );
}

function VetShell({ children, compact = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="vet-page">
      <div className="vet-frame">
        <TopNavBar />
        <main className={compact ? "vet-main compact" : "vet-main"}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function VetIdentity({ vet }) {
  const { t } = useTranslation();
  return (
    <article className="vet-identity">
      <Avatar label={vet.initials || vet.fullName} />
      <div>
        <div className="vet-identity-heading">
          <h2>{vet.fullName}</h2>
          {vet.isVerified && <span className="available-badge">{t("adopter.vets.card.verified")}</span>}
        </div>
        <p>{vet.specialization || t("adopter.vets.card.specializationUnavailable")}</p>
        <div className="vet-identity-details">
          <Rating value={vet.rating} count={vet.totalRatings} />
          {vet.experienceYears != null && <span>{t("adopter.vets.card.experience", { years: vet.experienceYears })}</span>}
          {vet.licenseNumber && <span>{t("adopter.vets.card.license", { license: vet.licenseNumber })}</span>}
          <span>{vet.clinicName || t("adopter.vets.card.clinicUnavailable")}</span>
          <span>{vet.address || t("adopter.vets.card.addressUnavailable")}</span>
          {vet.phone && <a href={`tel:${vet.phone}`}>{vet.phone}</a>}
          {vet.email && <a href={`mailto:${vet.email}`}>{vet.email}</a>}
        </div>
      </div>
    </article>
  );
}

function Stepper({ step }) {
  const { t } = useTranslation();
  const steps = ["service", "date", "confirm"];
  return <div className="stepper">{steps.map((key, index) => <div key={key} className={index + 1 <= step ? "done" : ""}><span>{index + 1}</span><small>{t(`adopter.vets.booking.steps.${key}`)}</small></div>)}</div>;
}

function ConfirmStepper() {
  const { t } = useTranslation();

  return (
    <div className="confirm-stepper">
      <div className="complete"><span><Icon name="check" /></span><small>{t("adopter.vets.booking.steps.service")}</small></div>
      <i />
      <div className="complete"><span><Icon name="check" /></span><small>{t("adopter.vets.booking.steps.date")}</small></div>
      <i className="muted-line" />
      <div className="current"><span>3</span><small>{t("adopter.vets.booking.steps.confirm")}</small></div>
    </div>
  );
}

function ConfirmDetail({ icon, label, title, text }) {
  return (
    <div className="confirm-detail">
      <h3>{label}</h3>
      <div>
        <span className="square-icon"><Icon name={icon} filled /></span>
        <div>
          <strong>{title}</strong>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

function BookingSection({ title, actionKey, onAction, children, muted = false }) {
  const { t } = useTranslation();
  return <section className={muted ? "booking-section booking-section-muted" : "booking-section"}><header><h2>{title}</h2>{actionKey && <button onClick={onAction}><Icon name={actionKey === "done" ? "check" : "edit"} /> {t(`adopter.vets.booking.${actionKey}`)}</button>}</header>{children}</section>;
}

function SummaryLine({ label, value }) {
  return <div className="summary-line"><span>{label}</span><strong>{value}</strong></div>;
}

function nextDate(offset = 1) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function combineDateAndTime(dateValue, timeValue) {
  return `${dateValue}T${timeValue}:00`;
}

function formatRequestedTime(dateValue, timeValue, language) {
  if (!dateValue || !timeValue) return "";
  return formatLocalizedTime(new Date(`${dateValue}T${timeValue}:00`), language);
}

function formatAppointmentDate(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${formatLocalizedDate(date, language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${formatLocalizedTime(date, language)}`;
}

function formatConfirmDate(dateValue, language = "en") {
  return new Date(dateValue).toLocaleDateString(language, {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
