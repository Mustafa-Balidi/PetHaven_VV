import { FaPaw } from "react-icons/fa";
import "../../Styling/HealthAssistant.css";

const PetSelector = ({ pets = [], activePetId, onSelectPet }) => {
  if (!pets.length) {
    return null;
  }

  return (
    <div className="pet-selector" role="group">
      {pets.map((pet) => {
        const isActive = pet.id === activePetId;

        // The adopted-pets API exposes `image`; older mock pets used `avatar`.
        const petImage = pet.image ?? pet.avatar ?? null;

        const subtitle = pet.breed || pet.species || "";

        return (
          <button
            key={pet.id}
            type="button"
            onClick={() => onSelectPet?.(pet.id)}
            aria-pressed={isActive}
            className={`pet-selector__item ${isActive ? "pet-selector__item--active" : ""}`}
          >
            {petImage ? (
              <img
                alt={pet.name}
                className="pet-selector__avatar"
                src={petImage}
              />
            ) : (
              <span
                className="pet-selector__avatar pet-selector__avatar--fallback"
                aria-hidden="true"
              >
                <FaPaw />
              </span>
            )}

            <div className="pet-selector__info">
              <p className="pet-selector__name">{pet.name}</p>
              {subtitle ? (
                <p className="pet-selector__breed">{subtitle}</p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PetSelector;
