import React, { useState, useEffect } from 'react';
import { ConstructionContext } from './constructionContext';

// Helpers para persistir/restaurar objetos en localStorage
const saveToStorage = (key, value) => {
  try {
    if (value && value !== 0) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (_) {}
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return fallback;
};

export const ConstructionProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('user') || "");
  const [stageSelected, setStageSelected] = useState(() => loadFromStorage('stageSelected', 0));
  const [constructionSelected, setConstructionSelected] = useState(() => loadFromStorage('constructionSelected', 0));
  const [defaultStage, setDefaultStage] = useState(0);
  const [permissions, setPermissions] = useState(() => loadFromStorage('permissions', []));
  const [userConstructions, setUserConstructions] = useState(() => loadFromStorage('userConstructions', []));
  const [role, setRole] = useState(() => loadFromStorage('role', null));

  const constructionValue = {
    user,
    defaultStage,
    stageSelected,
    constructionSelected,
    permissions,
    userConstructions,
    role,
    setUser,
    setStageSelected,
    setConstructionSelected,
    setDefaultStage,
    setPermissions,
    setUserConstructions,
    setRole,
  };

  // Persistir en localStorage
  useEffect(() => { if (user) localStorage.setItem('user', user); }, [user]);
  useEffect(() => { saveToStorage('stageSelected', stageSelected); }, [stageSelected]);
  useEffect(() => { saveToStorage('constructionSelected', constructionSelected); }, [constructionSelected]);
  useEffect(() => { saveToStorage('permissions', permissions); }, [permissions]);
  useEffect(() => { saveToStorage('userConstructions', userConstructions); }, [userConstructions]);
  useEffect(() => { saveToStorage('role', role); }, [role]);

  return (
    <ConstructionContext.Provider value={constructionValue}>{children}</ConstructionContext.Provider>
  );
};

export default ConstructionProvider;
