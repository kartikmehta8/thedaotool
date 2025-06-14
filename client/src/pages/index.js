import { lazy } from 'react';

const Login = lazy(() => import('./auth/Login'));
const Signup = lazy(() => import('./auth/Signup'));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
const Dashboard = lazy(() => import('./Dashboard'));
const Landing = lazy(() => import('./Landing'));
const OrganizationDashboard = lazy(
  () => import('./organization/OrganizationDashboard')
);
const ContributorDashboard = lazy(
  () => import('./contributor/ContributorDashboard')
);
const OrganizationProfile = lazy(
  () => import('./organization/OrganizationProfile')
);
const ContributorProfile = lazy(
  () => import('./contributor/ContributorProfile')
);
const OrganizationInsights = lazy(() => import('./organization/Insights'));
const ContributorInsights = lazy(() => import('./contributor/Insights'));
const Wallet = lazy(() => import('./Wallet'));

export {
  Login,
  Signup,
  ForgotPassword,
  Dashboard,
  Landing,
  OrganizationDashboard,
  ContributorDashboard,
  OrganizationProfile,
  ContributorProfile,
  OrganizationInsights,
  ContributorInsights,
  Wallet,
};
