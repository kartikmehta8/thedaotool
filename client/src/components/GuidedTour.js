import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';

const GuidedTour = ({ run, stepIndex, role, next, prev, exit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState(null);

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
  const step = steps[stepIndex];

  useEffect(() => {
    if (!run || !step) return;
    if (step.path && step.path !== location.pathname) {
      navigate(step.path);
    }
    const el = document.querySelector(step.target);
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const popoverW = 280;
      const popoverH = 130;

      let popTop = r.bottom + scrollY + 8;
      let placement = 'bottom';
      if (popTop + popoverH > scrollY + viewportH) {
        popTop = r.top + scrollY - popoverH - 8;
        placement = 'top';
      }

      let popLeft = r.left + scrollX + r.width / 2 - popoverW / 2;
      if (popLeft < scrollX + 8) popLeft = scrollX + 8;
      if (popLeft + popoverW > scrollX + viewportW) {
        popLeft = scrollX + viewportW - popoverW - 8;
      }

      setRect({
        top: r.top + scrollY,
        left: r.left + scrollX,
        width: r.width,
        height: r.height,
        popTop,
        popLeft,
        placement,
      });
    };

    update();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [run, stepIndex, step, navigate, location.pathname]);

  if (!run || !step || !rect) return null;

  const highlightStyle = {
    top: rect.top - 4,
    left: rect.left - 4,
    width: rect.width + 8,
    height: rect.height + 8,
  };

  const popoverStyle = {
    top: rect.popTop,
    left: rect.popLeft,
  };

  const isLast = stepIndex === steps.length - 1;

  return createPortal(
    <div className="tour-overlay" onClick={exit}>
      <div className="tour-highlight" style={highlightStyle} />
      <div
        className={`tour-popover ${rect.placement}`}
        style={popoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div>{step.content}</div>
        <Space className="tour-controls" style={{ marginTop: '0.5rem' }}>
          <Button size="small" onClick={exit} aria-label="Exit tour">
            Exit
          </Button>
          <Button
            size="small"
            onClick={prev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
          >
            Previous
          </Button>
          <span
            style={{ flex: 1, textAlign: 'center' }}
          >{`Step ${stepIndex + 1} of ${steps.length}`}</span>
          <Button
            size="small"
            type="primary"
            onClick={isLast ? exit : next}
            aria-label={isLast ? 'Finish tour' : 'Next step'}
          >
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </Space>
      </div>
    </div>,
    document.body
  );
};

export default GuidedTour;
