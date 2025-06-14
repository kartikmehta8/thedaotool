import {
  Signup,
  Login,
  ForgotPassword,
  Dashboard,
  Landing,
  OrganizationProfile,
  ContributorProfile,
  Wallet,
} from '../pages';

export const routes = [
  { path: '/', element: <Landing />, isPrivate: false },
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/signup', element: <Signup />, isPrivate: false },
  { path: '/forgot-password', element: <ForgotPassword />, isPrivate: false },
  { path: '/dashboard', element: <Dashboard />, isPrivate: true },
  {
    path: '/profile/organization',
    element: <OrganizationProfile />,
    isPrivate: true,
  },
  {
    path: '/profile/contributor',
    element: <ContributorProfile />,
    isPrivate: true,
  },
  { path: '/wallet', element: <Wallet />, isPrivate: true },
  { path: '/insights', element: null, isPrivate: true },
];
