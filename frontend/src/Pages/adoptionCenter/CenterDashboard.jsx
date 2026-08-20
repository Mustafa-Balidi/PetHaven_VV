import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import "../../Styling/CenterPages.css";

const TREND_ICON = { up: "trending_up", warning: "warning", neutral: null };

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CenterDashboard() {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const t = translate("center.dashboard", { returnObjects: true });
  const {
    dashboardStats: stats,
    recentActivity: activity,
    latestOrders: orders,
    wallet,
    dashboardLoading,
    dashboardError,
    fetchDashboard,
    profile,
    fetchProfile,
  } = useCenterContext();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const loading = dashboardLoading || !stats;

  function handleExportReport() {
    downloadCsv("dashboard-stats.csv", [
      [t.export.metric, t.export.value, t.export.trend],
      [t.kpi.availablePets, stats.availablePetsCount, null],
      [t.kpi.pendingRequests, stats.pendingRequestsCount, null],
      [t.kpi.successfulAdoptions, stats.successfulAdoptionsThisMonth, null],
      [t.kpi.storeSales, stats.storeSalesToday, null],
    ]);
  }

  function handleAddNewPet() {
    navigate("/center/inventory", { state: { openAddPet: true } });
  }

  if (loading) {
    return (
      <div className="center-dash-page">
        <CenterHeader />
        <div className="center-dash-loading">{dashboardError || t.loading}</div>
      </div>
    );
  }

  return (
    <div className="center-dash-page">
      <CenterHeader />

      <div className="center-dash-body">
        <div className="center-dash-welcome">
          <div>
            <h1 className="center-dash-welcome__title">
              {t.welcome.titlePrefix}
              {profile?.centerName || t.welcome.defaultName}
            </h1>
            <p className="center-dash-welcome__subtitle">{t.welcome.subtitle}</p>
          </div>
          <div className="center-dash-welcome__actions">
            <button type="button" className="center-dash-btn-outline" onClick={handleExportReport}>
              <Icon name="download" />
              {t.actions.exportReport}
            </button>
            <button type="button" className="center-dash-btn-primary" onClick={handleAddNewPet}>
              {t.actions.addNewPet}
            </button>
          </div>
        </div>

        <div className="center-dash-kpi-grid">
          <div className="center-dash-kpi">
            <div className="center-dash-kpi__head">
              <p className="center-dash-kpi__label">{t.kpi.availablePets}</p>
              <div className="center-dash-kpi__icon center-dash-kpi__icon--primary">
                <Icon name="pets" />
              </div>
            </div>
            <h2 className="center-dash-kpi__value">{stats.availablePetsCount}</h2>
            {false && (
              <p className="center-dash-kpi__trend center-dash-kpi__trend--up">
                <Icon name={TREND_ICON.up} />
                {stats.availablePets.trend}
              </p>
            )}
          </div>

          <div className="center-dash-kpi">
            <div className="center-dash-kpi__accent" />
            <div className="center-dash-kpi__head">
              <p className="center-dash-kpi__label">{t.kpi.pendingRequests}</p>
              <div className="center-dash-kpi__icon center-dash-kpi__icon--yellow">
                <Icon name="assignment" />
              </div>
            </div>
            <h2 className="center-dash-kpi__value">{stats.pendingRequestsCount}</h2>
            {false && (
              <p className="center-dash-kpi__trend center-dash-kpi__trend--warning">
                <Icon name={TREND_ICON.warning} />
                {stats.pendingRequests.trend}
              </p>
            )}
          </div>

          <div className="center-dash-kpi">
            <div className="center-dash-kpi__head">
              <p className="center-dash-kpi__label">{t.kpi.successfulAdoptions}</p>
              <div className="center-dash-kpi__icon center-dash-kpi__icon--green">
                <Icon name="favorite" />
              </div>
            </div>
            <h2 className="center-dash-kpi__value">{stats.successfulAdoptionsThisMonth}</h2>
            {false && (
              <p className="center-dash-kpi__trend center-dash-kpi__trend--neutral">
                {stats.successfulAdoptions.trend}
              </p>
            )}
          </div>

          <div className="center-dash-kpi">
            <div className="center-dash-kpi__head">
              <p className="center-dash-kpi__label">{t.kpi.storeSales}</p>
              <div className="center-dash-kpi__icon center-dash-kpi__icon--tertiary">
                <Icon name="storefront" />
              </div>
            </div>
            <h2 className="center-dash-kpi__value">${stats.storeSalesToday.toLocaleString()}</h2>
            {false && (
              <p className="center-dash-kpi__trend center-dash-kpi__trend--up">
                <Icon name={TREND_ICON.up} />
                {stats.storeSalesToday.trend}
              </p>
            )}
          </div>
        </div>

        <div className="center-dash-content-grid">
          <div className="center-dash-content-grid__left">
            <section className="center-dash-card">
              <h3 className="center-dash-activity__title">{t.activity.title}</h3>
              <div className="center-dash-activity__list">
                {activity.map((item) => (
                  <div key={item.id} className="center-dash-activity__row">
                    <img src={item.avatar} alt={item.name} className="center-dash-activity__avatar" />
                    <div className="center-dash-activity__info">
                      <p className="center-dash-activity__name">{item.name}</p>
                      <p className="center-dash-activity__detail">{item.detail}</p>
                    </div>
                    <span
                      className={`center-dash-activity__match ${
                        item.matchPercent >= 90
                          ? "center-dash-activity__match--high"
                          : "center-dash-activity__match--medium"
                      }`}
                    >
                      {item.matchPercent}% {t.activity.match}
                    </span>
                  </div>
                ))}
              </div>
              <button type="button" className="center-dash-view-all">
                {t.activity.viewAll}
              </button>
            </section>

            <section className="center-dash-card">
              <div className="center-dash-wallet__head">
                <Icon name="account_balance_wallet" />
                <h3 className="center-dash-wallet__title">{t.wallet.title}</h3>
              </div>

              <div className="center-dash-wallet__balance">
                <p className="center-dash-wallet__balance-label">{t.wallet.balanceLabel}</p>
                <h2 className="center-dash-wallet__balance-value">
                  ${(wallet?.balance ?? 0).toLocaleString()}
                </h2>
              </div>

              <div className="center-dash-wallet__list">
                {wallet?.transactions?.length ? (
                  wallet.transactions.map((tx) => (
                    <div key={tx.id} className="center-dash-wallet__row">
                      <div>
                        <p className="center-dash-wallet__tx-desc">{tx.description}</p>
                        <p className="center-dash-wallet__tx-date">{tx.date}</p>
                      </div>
                      <p
                        className={`center-dash-wallet__tx-amount ${
                          tx.type === "credit"
                            ? "center-dash-wallet__tx-amount--credit"
                            : "center-dash-wallet__tx-amount--debit"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="center-dash-wallet__empty">{t.wallet.noTransactions}</p>
                )}
              </div>

              <button type="button" className="center-dash-view-all">
                {t.wallet.viewAll}
              </button>
            </section>
          </div>

          <div className="center-dash-content-grid__right">
            <section className="center-dash-card center-dash-card--full">
              <div className="center-dash-orders__head">
                <h3 className="center-dash-orders__title">{t.orders.title}</h3>
                <button type="button" className="center-dash-orders__see-all">
                  {t.orders.seeAll}
                  <Icon name="arrow_forward" />
                </button>
              </div>

              <div className="center-dash-orders__table-wrap">
                <table className="center-dash-orders__table">
                  <thead>
                    <tr>
                      <th>{t.orders.columns.orderId}</th>
                      <th>{t.orders.columns.customer}</th>
                      <th>{t.orders.columns.items}</th>
                      <th>{t.orders.columns.total}</th>
                      <th>{t.orders.columns.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="center-dash-orders__id">#{order.id}</td>
                        <td>{order.customer}</td>
                        <td className="center-dash-orders__items">{order.items}</td>
                        <td className="center-dash-orders__total">${order.total.toFixed(2)}</td>
                        <td>
                          <span
                            className={`center-dash-orders__status ${
                              order.status === "Completed"
                                ? "center-dash-orders__status--completed"
                                : "center-dash-orders__status--processing"
                            }`}
                          >
                            {translate(`center.status.${order.status}`, { defaultValue: order.status })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
