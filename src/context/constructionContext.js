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
  company: null,
  setUser: () => {},
  setConstructionSelected: () => {},
  setStageSelected: () => {},
  setDefaultStage: () => {},
  setPermissions: () => {},
  setUserConstructions: () => {},
  setRole: () => {},
  setCompany: () => {},
});

export default ConstructionContext;
