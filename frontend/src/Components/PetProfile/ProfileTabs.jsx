/**
 * شريط التابات فوق محتوى البروفايل
 * props:
 *  - tabs: [{ id, label }]
 *  - activeTab: string
 *  - onTabChange: function(tabId)
 */
function ProfileTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="profile-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={
            "profile-tabs__btn" +
            (activeTab === tab.id ? " profile-tabs__btn--active" : "")
          }
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
