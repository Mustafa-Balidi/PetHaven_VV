import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import VetWelcomeSection from "../../Components/vet/VetWelcomeSection.jsx";
import VetStatsCards from "../../Components/vet/VetStatsCards.jsx";
import VetClinicActivity from "../../Components/vet/VetClinicActivity.jsx";
import VetAppointmentBreakdown from "../../Components/vet/VetAppointmentBreakdown.jsx";
import VetTopBreeds from "../../Components/vet/VetTopBreeds.jsx";
import VetSchedule from "../../Components/vet/VetSchedule.jsx";
import VetPatients from "../../Components/vet/VetPatients.jsx";
import { getCurrentUser } from "../../api/authApi.js";
import {
  getVetDashboardStats,
  getClinicActivity,
  getAppointmentBreakdown,
  getTopBreeds,
  getTodaySchedule,
} from "../../api/vetDashboardApi.js";
import "../../Styling/VetDashboard.css";

export default function VetDashboard() {
  const { t } = useTranslation();
  const user = getCurrentUser();
  useDocumentTitle(t("vetDashboard.header.nav.dashboard"));

  const [stats, setStats] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [activity, setActivity] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getVetDashboardStats(), getAppointmentBreakdown(), getTopBreeds(5), getTodaySchedule()])
      .then(([statsData, breakdownData, breedsData, scheduleData]) => {
        if (!active) return;
        setStats(statsData);
        setBreakdown(breakdownData);
        setBreeds(breedsData);
        setSchedule(scheduleData);
      })
      .catch((err) => {
        if (active) {
          setStats(null);
          setBreakdown([]);
          setBreeds([]);
          setSchedule([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getClinicActivity(period)
      .then((data) => {
        if (active) setActivity(data);
      })
      .catch((err) => {
        if (active) {
          setActivity([]);
          setActivityError(err.message);
        }
      })
      .finally(() => {
        if (active) setActivityLoading(false);
      });

    return () => {
      active = false;
    };
  }, [period]);

  function changeActivityPeriod(nextPeriod) {
    setActivity([]);
    setActivityLoading(true);
    setActivityError("");
    setPeriod(nextPeriod);
  }

  return (
    <div className="vet-dashboard-page">
      <VetHeader />

      <main id="main-content" tabIndex={-1} className="vet-dashboard-main">
        <VetWelcomeSection fullName={user?.fullName} />

        {loading ? (
          <div className="vet-dashboard-loading" role="status">{t("vetDashboard.loading")}</div>
        ) : error ? (
          <div className="vet-dashboard-alert" role="alert">
            <span>{error}</span>
          </div>
        ) : (
          <>
            <VetStatsCards stats={stats} />

            <div className="vet-dashboard-analytics-grid">
              <VetClinicActivity
                data={activity}
                period={period}
                onPeriodChange={changeActivityPeriod}
                loading={activityLoading}
                error={activityError}
              />
              <div className="vet-dashboard-analytics-side">
                <VetAppointmentBreakdown data={breakdown} />
                <VetTopBreeds data={breeds} />
              </div>
            </div>

            <div className="vet-dashboard-bento-grid">
              <VetSchedule appointments={schedule} />
              <VetPatients />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
