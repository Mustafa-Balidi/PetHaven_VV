import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { EVENTS } from "../text/publicTexts.js";

export default function EventsSection({ requireAuth }) {
  const { t } = useTranslation();
  const items = t("events.items", { returnObjects: true });

  function handleEventAction() {
    if (!requireAuth()) return;
  }

  function handleViewAll(e) {
    e.preventDefault();
    if (!requireAuth()) return;
  }

  return (
    <section className="events">
      <div className="events__header">
        <h2 className="events__title">{t("events.title")}</h2>
        <a className="events__view-all events__view-all--desktop" href="#" onClick={handleViewAll}>
          {t("events.viewAll")}
        </a>
      </div>
      <div className="events__grid">
        {EVENTS.map((event, i) => (
          <div
            key={event.title}
            className={`events__card${event.hiddenOnMobile ? " events__card--hidden-mobile" : ""}`}
          >
            <div className={`events__date events__date--${event.accent}`}>
              <span className="events__date-day">{event.day}</span>
              <span className="events__date-month">{event.month}</span>
            </div>
            <div className="events__body">
              <h3 className="events__card-title">{items[i].title}</h3>
              <div className="events__meta">
                <Icon name="schedule" className="events__meta-icon" />
                <span>{items[i].time}</span>
              </div>
              <div className="events__meta">
                <Icon name="location_on" className="events__meta-icon" />
                <span>{items[i].location}</span>
              </div>
              <button onClick={handleEventAction} className="events__cta">
                {items[i].cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
