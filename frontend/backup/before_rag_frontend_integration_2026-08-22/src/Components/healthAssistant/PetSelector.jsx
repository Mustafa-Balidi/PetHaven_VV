import "../../Styling/HealthAssistant.css";

const PetSelector = ({ pets = [], activePetId, onSelectPet }) => {
  return (
    <div className="pet-selector">
      {pets.map((pet) => {
        const isActive = pet.id === activePetId;
        return (
          <button
            key={pet.id}
            onClick={() => onSelectPet?.(pet.id)}
            className={`pet-selector__item ${isActive ? "pet-selector__item--active" : ""}`}
          >
            <img alt={pet.name} className="pet-selector__avatar" src={pet.avatar} />
            <div className="pet-selector__info">
              <p className="pet-selector__name">{pet.name}</p>
              <p className="pet-selector__breed">{pet.breed}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PetSelector;
