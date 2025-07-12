import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import GuidedTour from '../components/GuidedTour';

const TourContext = createContext({});

export const TourProvider = ({ children }) => {
  const { user } = useAuth();
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

  const handleCallback = (data) => {
    const { status, index, type } = data;
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      setCompleted(true);
      localStorage.setItem('tour_completed', 'true');
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <TourContext.Provider value={{ startTour, completed }}>
      {children}
      {user && (
        <GuidedTour
          run={run}
          stepIndex={stepIndex}
          role={user.role}
          callback={handleCallback}
        />
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
