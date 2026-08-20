import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import MonthlyReportsManagement from "../../Components/center/MonthlyReportsManagement.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import "../../Styling/CenterPages.css";

export default function Reports() {
  const { t: translate } = useTranslation();
  const t = translate("center.vaccinations", { returnObjects: true });
  const {
    monthlyReports,
    vaccinationLoading,
    vaccinationError,
    fetchMonthlyReports,
    blockAdopter,
  } = useCenterContext();

  useEffect(() => {
    fetchMonthlyReports();
  }, [fetchMonthlyReports]);

  return (
    <div className="center-vacc-page-page">
      <CenterHeader />

      <div className="center-vacc-page-body">
        <div className="center-vacc-page-grid-bg" />

        <div className="center-vacc-page-content">
          <div className="center-vacc-page-header">
            <div>
              <h1 className="center-vacc-page-header__title">{t.header.title}</h1>
              <p className="center-vacc-page-header__subtitle">{t.header.subtitle}</p>
            </div>
          </div>

          <MonthlyReportsManagement
            reports={monthlyReports}
            loading={vaccinationLoading}
            error={vaccinationError}
            onBlock={blockAdopter}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
