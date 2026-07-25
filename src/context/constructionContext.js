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
  isCostControl: false,
  setUser: () => {},
  setConstructionSelected: () => {},
  setStageSelected: () => {},
  setDefaultStage: () => {},
  setPermissions: () => {},
  setUserConstructions: () => {},
  setRole: () => {},
  setCompany: () => {},
  setIsCostControl: () => {},
});

export default ConstructionContext;
