/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from "react";


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
