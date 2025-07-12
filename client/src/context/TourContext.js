import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import GuidedTour from '../components/GuidedTour';

const TourContext = createContext({});

export const TourProvider = ({ children }) => {
  const { user } = useAuth() || {};
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('tour_completed');
    if (stored === 'true') setCompleted(true);
  }, []);

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  const exitTour = () => {
    setRun(false);
    setCompleted(true);
    localStorage.setItem('tour_completed', 'true');
  };

  const nextStep = () => setStepIndex((i) => i + 1);
  const prevStep = () => setStepIndex((i) => (i > 0 ? i - 1 : 0));

  return (
    <TourContext.Provider value={{ startTour, completed }}>
      {children}
      {user && (
        <GuidedTour
          run={run}
          stepIndex={stepIndex}
          role={user.role}
          next={nextStep}
          prev={prevStep}
          exit={exitTour}
        />
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
