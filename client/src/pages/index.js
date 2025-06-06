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
const OrganizationPaymentHistory = lazy(
  () => import('./organization/PaymentHistory')
);
const ContributorPaymentHistory = lazy(
  () => import('./contributor/PaymentHistory')
);

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
  OrganizationPaymentHistory,
  ContributorPaymentHistory,
};
