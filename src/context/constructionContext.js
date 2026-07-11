/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from "react";


export const ConstructionContext = createContext({
  user: "",
  stageSelected: "",
  constructionSelected: "",
  defaultStage: 0,
  permissions: [],
  userConstructions: [],
  role: null,
  setUser: () => {},
  setConstructionSelected: () => {},
  setStageSelected: () => {},
  setDefaultStage: () => {},
  setPermissions: () => {},
  setUserConstructions: () => {},
  setRole: () => {},
});

export default ConstructionContext;
