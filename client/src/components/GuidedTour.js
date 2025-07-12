import React, { useEffect } from 'react';
import Joyride from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';

const GuidedTour = ({ run, stepIndex, role, callback }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const orgSteps = [
    {
      target: '[data-tour="create-bounty"]',
      content: 'Create a new bounty here.',
      path: '/dashboard',
    },
    {
      target: '[data-tour="bounty-list"]',
      content: 'View and manage your bounties.',
      path: '/dashboard',
    },
    {
      target: '[data-tour="profile-menu"]',
      content: 'Access your profile settings.',
      path: '/dashboard',
    },
    {
      target: '[data-tour="github-integration"]',
      content: 'Connect your GitHub repo.',
      path: '/profile/organization',
    },
    {
      target: '[data-tour="discord-integration"]',
      content: 'Enable Discord notifications.',
      path: '/profile/organization',
    },
    {
      target: '[data-tour="wallet-send"]',
      content: 'Send payments to contributors.',
      path: '/wallet',
    },
  ];

  const contribSteps = [
    {
      target: '[data-tour="bounty-list"]',
      content: 'Browse bounties to work on.',
      path: '/dashboard',
    },
    {
      target: '[data-tour="profile-menu"]',
      content: 'Update your contributor profile.',
      path: '/dashboard',
    },
    {
      target: '[data-tour="wallet-send"]',
      content: 'View payouts and manage your wallet.',
      path: '/wallet',
    },
  ];

  const steps = role === 'organization' ? orgSteps : contribSteps;

  useEffect(() => {
    if (!run) return;
    const step = steps[stepIndex];
    if (step && step.path && step.path !== location.pathname) {
      navigate(step.path);
    }
  }, [run, stepIndex, steps, navigate, location.pathname]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      callback={callback}
      styles={{ options: { zIndex: 10000 } }}
    />
  );
};

export default GuidedTour;
