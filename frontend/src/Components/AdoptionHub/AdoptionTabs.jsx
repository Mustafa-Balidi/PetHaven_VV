/**
 * تابات صفحة Adoption Hub
 * props:
 *  - tabs: [{ id, label }]
 *  - activeTab: string
 *  - onTabChange: function(tabId)
 */
function AdoptionTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="adoption-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            "adoption-tabs__btn" +
            (activeTab === tab.id ? " adoption-tabs__btn--active" : "")
          }
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdoptionTabs;
