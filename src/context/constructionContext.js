/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from "react";


export const ConstructionContext = createContext({
  user: "",
  stageSelected: "",
  constructionSelected: "",
  defaultStage:0,
  setUser: () => {},
  setConstructionSelected: () => {},
  setStageSelected: () => {},
  setDefaultStage: () => {}
});

export default ConstructionContext;
