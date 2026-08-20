import { useState } from "react";
import Icon from "./Icon.jsx";

export default function AccordionItem({ title, description, nutritionFacts = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setOpen((o) => !o)}>
        <span className="accordion-title">{title}</span>
        <Icon name={open ? "remove" : "add"} className="accordion-icon" />
      </button>

      {open && (
        <div className="accordion-content">
          {description && <p className="paragraph-spaced">{description}</p>}

          {nutritionFacts.length > 0 && (
            <ul className="nutrition-list">
              {nutritionFacts.map((fact) => (
                <li key={fact.label}>
                  {fact.label}: {fact.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}