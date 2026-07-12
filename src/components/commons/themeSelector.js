import { useState, useEffect, useRef } from "react";

const themes = [
  { id: "concreto", name: "Default", color: "#1a2744" },
  { id: "acero", name: "Light", color: "#4a6fa5" },
  { id: "arena", name: "Warm", color: "#c4713b" },
  { id: "plano", name: "Ocean", color: "#2563eb" },
  { id: "bosque", name: "Nature", color: "#2d6a4f" },
];

const ThemeSelector = ({ onClose }) => {
  const [current, setCurrent] = useState(() => {
    return localStorage.getItem("app-theme") || "concreto";
  });
  const ref = useRef(null);

  // Aplicar tema cuando cambie
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", current);
    localStorage.setItem("app-theme", current);
  }, [current]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const selectTheme = (id) => {
    setCurrent(id);
  };

  return (
    <div className="theme-panel" ref={ref}>
      <div className="theme-panel-title">Seleccionar Tema</div>
      {themes.map((t) => (
        <div
          key={t.id}
          className={`theme-option ${current === t.id ? "active" : ""}`}
          onClick={() => selectTheme(t.id)}
        >
          <span className="theme-dot" style={{ backgroundColor: t.color }} />
          <span className="theme-name">{t.name}</span>
          {current === t.id && <i className="fas fa-check theme-check" />}
        </div>
      ))}
      <div className="theme-panel-close" onClick={onClose}>
        Cerrar
      </div>
    </div>
  );
};

export default ThemeSelector;
