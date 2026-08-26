/**
 * شريط التابات فوق محتوى البروفايل
 * props:
 *  - tabs: [{ id, label }]
 *  - activeTab: string
 *  - onTabChange: function(tabId)
 */
function ProfileTabs({ tabs, activeTab, onTabChange }) {
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
    document.getElementById(`pet-profile-tab-${tabs[nextIndex].id}`)?.focus();
  };

  return (
    <div className="profile-tabs" role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`pet-profile-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`pet-profile-panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={
            "profile-tabs__btn" +
            (activeTab === tab.id ? " profile-tabs__btn--active" : "")
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

export default ProfileTabs;
