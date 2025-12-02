import React, { useState,useEffect } from 'react';
import { ConstructionContext } from './constructionContext';


export const ConstructionProvider = ({children}) => {
 
  const [user, setUser] = useState("");
  const [stageSelected, setStageSelected] = useState(0);
  const [constructionSelected, setConstructionSelected] = useState(0);
  const [defaultStage, setDefaultStage] = useState(0) // review

  // Make the context object:
  const constructionValue = {
    user,
    defaultStage,
    stageSelected,
    constructionSelected,
    setUser,
    setStageSelected,
    setConstructionSelected,
    setDefaultStage
  };

  useEffect(
        () => {
            localStorage.setItem('user',user)
        }, [user]
  )

  return (
    <ConstructionContext.Provider value={constructionValue}>{children}</ConstructionContext.Provider>
  );
};

export default ConstructionProvider;

 
