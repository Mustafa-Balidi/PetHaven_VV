import "../../Styling/HealthAssistant.css";

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator__bubble">
        <div className="typing-indicator__dot"></div>
        <div className="typing-indicator__dot"></div>
        <div className="typing-indicator__dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
