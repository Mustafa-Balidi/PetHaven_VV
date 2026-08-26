/**
 * تابات صفحة Adoption Hub
 * props:
 *  - tabs: [{ id, label }]
 *  - activeTab: string
 *  - onTabChange: function(tabId)
 */
function AdoptionTabs({ tabs, activeTab, onTabChange }) {
  const handleKeyDown = (event, currentIndex) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const direction = document.documentElement.dir === "rtl" ? -1 : 1;
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - direction + tabs.length) % tabs.length;

    onTabChange(tabs[nextIndex].id);
    document.getElementById(`adoption-tab-${tabs[nextIndex].id}`)?.focus();
  };

  return (
    <div className="adoption-tabs" role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`adoption-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`adoption-panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={
            "adoption-tabs__btn" +
            (activeTab === tab.id ? " adoption-tabs__btn--active" : "")
          }
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdoptionTabs;
